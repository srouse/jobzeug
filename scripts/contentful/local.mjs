import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { definitions, schemas, localResumeSchema, localApplicationSchema, provenanceSchema, entryId, typeId } from '../../contentful/schema.mjs';

export const canonical = value => JSON.stringify(sort(value));
function sort(value) {
  if (Array.isArray(value)) return value.map(sort);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])]));
  return value;
}
export const hash = value => createHash('sha256').update(typeof value === 'string' ? value : canonical(value)).digest('hex');
export const readJson = async filename => JSON.parse(await fs.readFile(filename, 'utf8'));
export async function contained(root, relative) {
  if (path.isAbsolute(relative)) throw new Error(`Expected relative path: ${relative}`);
  const base = await fs.realpath(root);
  const resolved = await fs.realpath(path.resolve(root, relative));
  if (!resolved.startsWith(`${base}${path.sep}`)) throw new Error(`Path escapes workspace: ${relative}`);
  return resolved;
}
export async function findApplication(root, id) {
  const base = path.join(root, 'evidence/applications');
  const names = (await fs.readdir(base, { withFileTypes: true })).filter(item => item.isDirectory() && item.name.startsWith(`${id}-`));
  if (names.length !== 1) throw new Error(`Expected one application folder for ${id}`);
  return path.relative(root, path.join(base, names[0].name));
}
export async function loadBundle(root, id) {
  const appDir = await findApplication(root, id);
  const read = async relative => readJson(await contained(root, relative));
  const app = localApplicationSchema.parse(await read(`${appDir}/application.json`));
  if (app.applicationId !== id) throw new Error('Application ID does not match folder');
  const resume = localResumeSchema.parse(await read(`${appDir}/outputs/resume.json`));
  const letter = schemas.coverLetter.parse(await read(`${appDir}/outputs/cover-letter.json`));
  const entries = new Map();
  const add = (kind, key, fields, file) => {
    if (entries.has(key)) throw new Error(`Duplicate entry ${key}`);
    const record = { key, kind, fields: schemas[kind].parse(fields), file };
    entries.set(key, record);
    return record;
  };
  async function shared(kind, key) {
    if (entries.has(key)) {
      if (entries.get(key).kind !== kind) throw new Error(`Reference type mismatch: ${key}`);
      return entries.get(key);
    }
    schemas[kind].shape.evidenceId.parse(key);
    const file = `evidence/outputs/${kind}s/${key}.json`;
    const raw = await read(file);
    const { tags: _tags, ...fields } = raw;
    if (fields.evidenceId !== key) throw new Error(`ID does not match file: ${file}`);
    const record = add(kind, key, fields, file);
    if (fields.employer) await shared('employer', fields.employer);
    if (fields.roles) for (const role of fields.roles) await shared('role', role);
    return record;
  }
  const selectedRoles = resume.experiences.map(exp => exp.role);
  if (new Set(selectedRoles).size !== selectedRoles.length) throw new Error('Resume includes a role twice');
  const policyFile = 'contentful/evidence-policy.json';
  const policy = await read(policyFile);
  for (const [aggregate, components] of Object.entries(policy.roleAggregates)) {
    if (selectedRoles.includes(aggregate) && components.some(role => selectedRoles.includes(role)))
      throw new Error(`Resume double-counts aggregate ${aggregate}`);
  }
  const experiences = [];
  for (const exp of resume.experiences) {
    await shared('role', exp.role);
    for (const project of exp.projects ?? []) {
      const record = await shared('project', project);
      if (!record.fields.roles.includes(exp.role)) throw new Error(`${project} is not associated with ${exp.role}`);
    }
    const key = `${id}-experience-${exp.role}`;
    add('resumeExperience', key, { internalTitle: `${id} — ${exp.role}`, ...exp }, `${appDir}/outputs/resume.json`);
    experiences.push(key);
  }
  for (const record of entries.values()) {
    if (record.kind === 'project') for (const role of record.fields.roles) {
      if (entries.get(role).fields.employer !== record.fields.employer) throw new Error(`Employer mismatch: ${record.key}/${role}`);
    }
  }
  add('resume', `${id}-resume`, { ...resume, experiences }, `${appDir}/outputs/resume.json`);
  add('coverLetter', `${id}-cover-letter`, letter, `${appDir}/outputs/cover-letter.json`);
  const listingFile = path.relative(root, await contained(path.join(root, appDir), app.listingFile));
  const { listingFile: _listing, status: _status, ...fields } = app;
  add('jobApplication', id, { ...fields, listingText: await fs.readFile(path.join(root, listingFile), 'utf8'),
    resume: `${id}-resume`, coverLetter: `${id}-cover-letter` }, `${appDir}/application.json`);
  // Dependency order supports entry creation and publication without unresolved links.
  const ordered = [];
  const seen = new Set();
  function visit(key) {
    if (seen.has(key)) return;
    seen.add(key);
    const record = entries.get(key);
    if (!record) throw new Error(`Missing reference ${key}`);
    for (const [name, spec] of Object.entries(definitions[record.kind].fields)) {
      if (spec.target && record.fields[name]) {
        const values = Array.isArray(record.fields[name]) ? record.fields[name] : [record.fields[name]];
        for (const target of values) {
          if (entries.get(target)?.kind !== spec.target) throw new Error(`Invalid reference ${target}`);
          visit(target);
        }
      }
    }
    ordered.push(record);
  }
  visit(id);
  return { id, appDir, status: app.status, entries: ordered, contextFiles: [
    `${appDir}/application.json`, listingFile, `${appDir}/targeting.md`, 'evidence/README.md', policyFile,
  ] };
}
export function payload(record, locale) {
  return { fields: Object.fromEntries(Object.entries(record.fields).map(([name, value]) => {
    const spec = definitions[record.kind].fields[name];
    const link = key => ({ sys: { type: 'Link', linkType: 'Entry', id: entryId(key) } });
    return [name, { [locale]: spec.target ? (Array.isArray(value) ? value.map(link) : link(value)) : value }];
  })) };
}
export async function checkFreshness(root, bundle) {
  const provenance = provenanceSchema.parse(await readJson(path.join(root, bundle.appDir, 'provenance.json')));
  if (provenance.applicationId !== bundle.id) throw new Error('Provenance application ID mismatch');
  const stale = [];
  for (const entry of bundle.entries) {
    const proof = provenance.entries[entry.key];
    if (!proof) { stale.push({ key: entry.key, reason: 'Missing provenance' }); continue; }
    for (const context of bundle.contextFiles) if (!(context in proof.sources)) stale.push({ key: entry.key, reason: `Missing dependency: ${context}` });
    if (proof.outputHash !== hash(entry.fields)) stale.push({ key: entry.key, reason: 'Output changed since review' });
    for (const field of Object.keys(entry.fields)) {
      if (!proof.claims[field]?.length) stale.push({ key: entry.key, reason: `Missing field provenance: ${field}` });
      for (const source of proof.claims[field] ?? []) if (!(source in proof.sources)) stale.push({ key: entry.key, reason: `Untracked claim source: ${source}` });
    }
    for (const [source, expected] of Object.entries(proof.sources)) {
      try {
        if (hash(await fs.readFile(await contained(root, source), 'utf8')) !== expected) stale.push({ key: entry.key, reason: `Source changed: ${source}` });
      } catch { stale.push({ key: entry.key, reason: `Source missing or outside repo: ${source}` }); }
    }
  }
  const copy = canonical(bundle.entries.map(entry => entry.fields)).toLowerCase();
  for (const excluded of provenance.exclusions) if (copy.includes(excluded.toLowerCase())) throw new Error(`Excluded content in output: ${excluded}`);
  return { stale, blockingIssues: provenance.blockingIssues, provenance };
}
export async function recordReview(root, bundle, note) {
  if (!note?.trim()) throw new Error('Review requires --note describing what was checked');
  const filename = path.join(root, bundle.appDir, 'provenance.json');
  const provenance = provenanceSchema.parse(await readJson(filename));
  for (const entry of bundle.entries) {
    const proof = provenance.entries[entry.key];
    if (!proof) throw new Error(`Add claim provenance for ${entry.key} before review`);
    for (const name of Object.keys(entry.fields)) if (!proof.claims[name]?.length) throw new Error(`Missing claim provenance ${entry.key}.${name}`);
    const sources = new Set([...Object.keys(proof.sources), ...Object.values(proof.claims).flat(), ...bundle.contextFiles]);
    proof.sources = Object.fromEntries(await Promise.all([...sources].map(async source => [source, hash(await fs.readFile(await contained(root, source), 'utf8'))])));
    proof.outputHash = hash(entry.fields);
    proof.reviewedAt = new Date().toISOString();
    proof.reviewNote = note;
  }
  await fs.writeFile(filename, `${JSON.stringify(provenance, null, 2)}\n`);
  return checkFreshness(root, bundle);
}
export async function snapshot(root, bundle, label) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(label ?? '')) throw new Error('Snapshot requires a simple unique --label');
  const result = await checkFreshness(root, bundle);
  if (result.stale.length || result.blockingIssues.length) throw new Error('Resolve stale content and blocking issues before recording a submission');
  const files = new Set([...bundle.contextFiles, ...bundle.entries.map(entry => entry.file), `${bundle.appDir}/provenance.json`,
    ...Object.values(result.provenance.entries).flatMap(entry => Object.keys(entry.sources))]);
  const contents = Object.fromEntries(await Promise.all([...files].map(async file => [file, await fs.readFile(await contained(root, file), 'utf8')])));
  const snapshotData = { version: 1, applicationId: bundle.id, recordedAt: new Date().toISOString(), entries: bundle.entries, files: contents };
  const folder = path.join(root, bundle.appDir, 'submissions');
  await fs.mkdir(folder, { recursive: true });
  const filename = path.join(folder, `${label}.json`);
  await fs.writeFile(filename, `${JSON.stringify({ ...snapshotData, hash: hash(snapshotData) }, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
  return filename;
}

// A self-contained render contract; no runtime inference, sorting or evidence reads.
export function renderData(entries, id) {
  const byKey = new Map(entries.map(entry => [entry.key, entry]));
  const get = key => { const item = byKey.get(key); if (!item) throw new Error(`Missing render entry ${key}`); return item.fields; };
  const application = get(id);
  const resume = get(application.resume);
  return { application, resume: { ...resume, experiences: resume.experiences.map(key => {
    const experience = get(key);
    const role = get(experience.role);
    return { ...experience, role: { ...role, employer: get(role.employer) }, projects: (experience.projects ?? []).map(get) };
  }) }, coverLetter: get(application.coverLetter) };
}
export { entryId, typeId };
