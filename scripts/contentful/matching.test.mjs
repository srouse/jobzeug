import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { loadMatchingInputs, parseProjectHeader } from './matching.mjs';
import { projectMatchingSchema, validateMatchingCatalog } from '../../contentful/matching-schema.mjs';
import { fetchMatchingCatalog } from '../../contentful/matching-catalog.mjs';
import { schemas, contentTypes } from '../../contentful/schema.mjs';
import { payload } from './local.mjs';
import { loadCoreOutputs, upsertEntry } from './push.mjs';

const root = process.cwd();
const inputs = await loadMatchingInputs(root);
const projects = [...inputs.projects.values()].map(p => p.metadata);
const projectEntry = metadata => ({ sys: { id: `jz-${metadata.project_id}`, revision: 1 }, fields: { evidenceId: metadata.project_id, matchingMetadata: metadata } });
const vocabularyEntry = { sys: { id: 'jz-MV-1.0.0', revision: 1 }, fields: { evidenceId: 'MV-1.0.0', vocabularyVersion: '1.0.0', registry: inputs.registry } };
function mockClient(projectEntries, vocabularyEntries = [vocabularyEntry]) {
  const calls = [];
  return { calls, async getEntries(query) {
    calls.push(query);
    const entries = query.content_type === 'jobzeugProject' ? projectEntries : vocabularyEntries;
    return { items: entries.slice(query.skip, query.skip + query.limit), total: entries.length };
  } };
}

test('every compressed project round-trips its entire validated header through localized CMA fields', async () => {
  const records = await loadCoreOutputs(root);
  const ps = records.filter(r => r.kind === 'project');
  assert.equal(ps.length, projects.length);
  for (const record of ps) {
    assert.deepEqual(record.fields.matchingMetadata, inputs.projects.get(record.key).metadata);
    assert.deepEqual(payload(record, 'en-US').fields.matchingMetadata['en-US'], record.fields.matchingMetadata);
  }
  const vocabulary = records.find(r => r.kind === 'matchingVocabulary');
  assert.deepEqual(vocabulary.fields.registry, inputs.registry);
  const type = contentTypes().find(t => t.id === 'jobzeugProject');
  assert.equal(type.fields.find(f => f.id === 'matchingMetadata').type, 'Object');
  assert.equal(type.fields.find(f => f.id === 'matchingMetadata').required, false);
});

test('years remain integers/null; personal projects and retired umbrella relationships survive loading', async () => {
  const loaded = await fetchMatchingCatalog(mockClient(projects.map(projectEntry)));
  assert.equal(loaded.projects.size, projects.length);
  assert.equal(loaded.projects.get('S011').year, null);
  assert.equal(loaded.projects.get('S011').role_links[0].relationship, 'calendar_anchor');
  assert.equal(loaded.projects.get('S020').year, 2022);
  assert.equal(loaded.projects.get('S020').year_basis, 'estimated');
  assert.deepEqual(loaded.excludedProjectIds, []);
  assert.equal(loaded.projects.has('S004'), false);
  for (const id of ['S005', 'S006', 'S007']) assert.equal(loaded.projects.get(id).parent_project_id, null);
  assert.ok(loaded.pendingProjectIds.includes('S023'));
  assert.equal(loaded.projects.get('S002').public_disclosure, 'restricted');
});

test('loader paginates all projects and never filters on resume visibility or review state', async () => {
  const expanded = [...projects];
  for (let i = 1000; i < 1101; i++) {
    const p = structuredClone(projects[16]);
    p.project_id = `S${i}`; p.parent_project_id = null; p.related_project_ids = [];
    for (const [j, c] of p.evidence.entries()) c.id = `${p.project_id}-E00${j + 1}`;
    expanded.push(p);
  }
  const client = mockClient(expanded.map(projectEntry));
  assert.equal((await fetchMatchingCatalog(client)).projects.size, projects.length + 101);
  assert.deepEqual(client.calls.filter(c => c.content_type === 'jobzeugProject').map(c => c.skip), [0, 100]);
});

test('missing metadata, invalid concepts, identity mismatches, and missing pinned vocabulary fail explicitly', async () => {
  const entries = projects.map(projectEntry);
  const missing = structuredClone(entries); delete missing[0].fields.matchingMetadata;
  await assert.rejects(fetchMatchingCatalog(mockClient(missing)), /missing matchingMetadata/);
  const wrongId = structuredClone(entries); wrongId[0].fields.evidenceId = 'S999';
  await assert.rejects(fetchMatchingCatalog(mockClient(wrongId)), /ID mismatch/);
  const badTag = structuredClone(entries); badTag[0].fields.matchingMetadata.evidence[0].concept_ids.push('local:made-up');
  await assert.rejects(fetchMatchingCatalog(mockClient(badTag)), /Unknown\/unapproved concept/);
  await assert.rejects(fetchMatchingCatalog(mockClient(entries, [])), /Missing approved vocabulary/);
});

test('malformed frontmatter, unsupported schema, unknown fields, and invalid years cannot compress', async () => {
  const filename = (await fs.readdir('evidence/projects')).find(f => f.startsWith('S001 '));
  const md = await fs.readFile(`evidence/projects/${filename}`, 'utf8');
  assert.throws(() => parseProjectHeader(md.replace('schema_version: "1.1"', 'schema_version: "9.9"'), 'S001'));
  assert.throws(() => parseProjectHeader(md.replace('project_id: S001', 'project_id: S001\nproject_id: S001'), 'S001'), /Invalid YAML/);
  assert.throws(() => parseProjectHeader(md.replace('"#source-account"', '"#missing"'), 'S001'), /Missing source anchor/);
  assert.throws(() => projectMatchingSchema.parse({ ...projects[0], year: 2026.5 }));
  assert.throws(() => projectMatchingSchema.parse({ ...projects[0], year: null, year_basis: 'reported' }));
  assert.throws(() => projectMatchingSchema.parse({ ...projects[0], guessedSkill: 'leadership' }));
  const p = structuredClone(projects[0]); p.evidence[0].provenance = 'inferred';
  assert.throws(() => projectMatchingSchema.parse(p));
  const bad = structuredClone(projects); bad[0].parent_project_id = 'S999';
  assert.throws(() => validateMatchingCatalog(bad, [inputs.registry]), /Invalid project hierarchy/);
});

test('metadata-only upsert preserves all existing resume fields, other locales, and tags', async () => {
  const record = (await loadCoreOutputs(root)).find(r => r.key === 'S001');
  const existing = { sys: { version: 5, publishedVersion: 4, contentType: { sys: { id: 'jobzeugProject' } } },
    fields: { name: { 'en-US': 'CMS-edited title' }, summary: { 'en-US': 'Keep this summary', de: 'Keep this locale' }, showOnResume: { 'en-US': false } },
    metadata: { tags: [{ sys: { id: 'custom-existing-tag' } }] } };
  let written;
  const client = { entry: {
    get: async () => structuredClone(existing),
    update: async (_params, value) => { written = value; return value; },
    publish: async () => {},
  } };
  await upsertEntry(client, {}, record, 'en-US', true);
  assert.deepEqual(written.fields, { ...existing.fields, matchingMetadata: { 'en-US': record.fields.matchingMetadata } });
  assert.deepEqual(written.metadata, existing.metadata);
  existing.sys.version = 7; written = undefined;
  await assert.rejects(upsertEntry(client, {}, record, 'en-US', true), /unpublished changes/);
  assert.equal(written, undefined);
});

test('old project payloads can validate for resume compatibility but are not accepted as a matching catalog', () => {
  const legacy = { evidenceId: 'S001', employer: 'C001', roles: ['R001'], name: 'Legacy project' };
  assert.equal(schemas.project.parse(legacy).matchingMetadata, undefined);
});
