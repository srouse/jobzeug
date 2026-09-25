#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { schemas } from '../../contentful/schema.mjs';
import { assertTagIds } from '../../contentful/tags.mjs';
import policy from '../../contentful/evidence-policy.json' with { type: 'json' };
import { parseDateRange } from './dates.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const EMPLOYER_RE = /\bC\d{3,}\b/g;
const ROLE_RE = /\bR\d{3,}\b/g;

const read = relative => fs.readFile(path.join(root, relative), 'utf8');
const listMd = async dir => (await fs.readdir(path.join(root, dir)))
  .filter(name => name.endsWith('.md') && name !== 'INDEX.md' && !name.startsWith('Scale'));

function section(md, heading) {
  const start = md.search(new RegExp(`^## ${heading}\\s*$`, 'm'));
  if (start < 0) return '';
  const after = md.slice(start).split('\n').slice(1).join('\n');
  const end = after.search(/^## /m);
  return (end < 0 ? after : after.slice(0, end)).trim();
}

function meta(md, label) {
  const match = md.match(new RegExp(`^-\\s*${label}:\\s*(.+)$`, 'im'));
  return match?.[1]?.trim() ?? '';
}

function bullets(block) {
  return [...block.matchAll(/^- (.+)$/gm)].map(match => match[1].trim()).filter(Boolean);
}

function uniqueIds(text, regex) {
  return [...new Set((text.match(regex) ?? []).map(id => id))];
}

function compact(fields) {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => {
    if (value === undefined || value === null || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  }));
}

function parseShowOnResume(md, kind, id) {
  const raw = meta(md, 'Show on resume').toLowerCase();
  if (raw === 'yes' || raw === 'true') return true;
  if (raw === 'no' || raw === 'false') return false;
  const fromPolicy = policy.showOnResume?.[`${kind}s`]?.[id];
  if (typeof fromPolicy === 'boolean') return fromPolicy;
  throw new Error(`Missing showOnResume for ${id} (set policy or "- Show on resume: yes/no")`);
}

function parseTags(md, kind, id, employerId) {
  const raw = meta(md, 'Tags');
  if (raw) {
    return assertTagIds(raw.split(/[,/]/).map(part => part.trim()).filter(Boolean));
  }
  const own = policy.tags?.[`${kind}s`]?.[id] ?? [];
  // Roles inherit employer tags; projects stay explicit (personal work shouldn't pick up employer scale tags).
  const inherited = kind === 'role' && employerId ? (policy.tags?.employers?.[employerId] ?? []) : [];
  return assertTagIds([...inherited, ...own]);
}

async function writeOutput(kind, id, fields, tags = []) {
  const dir = path.join(root, 'evidence/outputs', `${kind}s`);
  await fs.mkdir(dir, { recursive: true });
  const parsed = schemas[kind].parse(fields);
  const file = path.join(dir, `${id}.json`);
  const body = tags.length ? { ...parsed, tags } : parsed;
  await fs.writeFile(file, `${JSON.stringify(body, null, 2)}\n`);
  return body;
}

function parseEmployerIndex(md) {
  const byId = new Map();
  const nameToId = new Map();
  for (const match of md.matchAll(/\| \[([^\]]+)\]\((C\d{3,})[^)]*\) \| (C\d{3,}) \|/g)) {
    const [, name, , id] = match;
    byId.set(id, name.trim());
    nameToId.set(name.trim().toLowerCase(), id);
  }
  return { byId, nameToId };
}

function parseScaleDescriptors(md) {
  const map = new Map();
  for (const match of md.matchAll(/\| ([^|]+) \| ([^|]+) \| \[Evidence\]\((C\d{3,})/g)) {
    map.set(match[3], match[2].trim());
  }
  return map;
}

function firstResearchUrl(md) {
  if (/^- Website:\s*$/im.test(md)) return undefined;
  const explicit = meta(md, 'Website');
  if (explicit && /^https?:\/\//i.test(explicit)) return explicit;
  const research = section(md, 'Research sources');
  const urls = [...research.matchAll(/\((https?:\/\/[^)\s]+)\)/g)].map(match => match[1]);
  return urls[0];
}

function resolveEmployer(md, nameToId) {
  const fromPath = [...md.matchAll(/employers\/(C\d{3,})/g)].map(match => match[1])[0];
  if (fromPath) return fromPath;
  const fromAny = uniqueIds(md, EMPLOYER_RE)[0];
  if (fromAny) return fromAny;
  const name = (meta(md, 'Employer / source organization') || meta(md, 'Organization')).trim();
  if (!name) throw new Error('Could not resolve employer');
  const id = nameToId.get(name.toLowerCase());
  if (!id) throw new Error(`Unknown employer name: ${name}`);
  return id;
}

async function compressEmployers(nameIndex, descriptors) {
  const files = (await listMd('evidence/employers')).filter(name => /^C\d{3,}-/.test(name));
  const out = [];
  for (const filename of files) {
    const id = filename.match(/^(C\d{3,})/)[1];
    const md = await read(`evidence/employers/${filename}`);
    const name = nameIndex.byId.get(id) ?? md.match(/^# C\d{3,}:\s*(.+)$/m)?.[1]?.trim();
    if (!name) throw new Error(`Missing employer name for ${id}`);
    const descriptor = descriptors.get(id)
      ?? md.match(/Suggested company descriptor:\s*\*\*(.+?)\*\*/)?.[1]?.trim();
    const websiteUrl = firstResearchUrl(md);
    const tags = parseTags(md, 'employer', id);
    out.push(await writeOutput('employer', id, compact({ evidenceId: id, name, descriptor, websiteUrl }), tags));
  }
  return out;
}

function proseBlock(block) {
  return block
    .split(/\n\s*\n/)
    .map(part => part.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(part => {
      if (!part) return false;
      if (/^none\b/i.test(part)) return false;
      if (/^no detailed description\b/i.test(part)) return false;
      if (/^linkedin source claim\b/i.test(part)) return false;
      return true;
    })
    .join('\n\n');
}

/** Strip common Markdown markers from extracted prose (bold, links, backticks). */
function stripMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Brief resume blurb for Contentful /resume.
 * Prefer ## Resume summary (1–2 sentences written for the resume).
 * Fallback: first usable paragraph of ## Account summary…, skipping capture-meta lines.
 */
function projectAccountSummary(md, maxChars = 420) {
  const resumeBlock = section(md, 'Resume summary');
  if (resumeBlock) {
    const prose = proseBlock(resumeBlock.replace(/^-\s+.+$/gm, '').trim());
    const brief = stripMarkdown(prose.split(/\n\s*\n/)[0] || '');
    if (brief) return brief.slice(0, maxChars).trim() || undefined;
  }

  const start = md.search(/^## Account summary\b.*$/m);
  if (start < 0) return undefined;
  const after = md.slice(start).split('\n').slice(1).join('\n');
  const end = after.search(/^## /m);
  const block = (end < 0 ? after : after.slice(0, end)).trim();
  if (!block) return undefined;

  const metaish = /^(scott describes|scott frames|scott says|correction vs|wants captured|pending|tbd\b|do not confuse|not independently)/i;
  const paragraphs = proseBlock(block)
    .split(/\n\s*\n/)
    .map(stripMarkdown)
    .filter(Boolean)
    .filter(part => !metaish.test(part));
  if (!paragraphs.length) return undefined;

  const labeled = paragraphs.find(part =>
    /^(what he built|what he took on|delivery|capabilities)\b/i.test(part),
  );
  let brief = labeled
    ? labeled.replace(/^(what he built|what he took on|delivery|capabilities)\s*:\s*/i, '')
    : paragraphs[0];

  if (/:\s*$/.test(brief)) {
    const sentences = brief.match(/[^.!?]+[.!?]+/g);
    if (sentences?.length) brief = sentences.join('').trim();
  }
  if (brief.length > maxChars) {
    const cut = brief.slice(0, maxChars);
    const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '), cut.lastIndexOf('—'));
    brief = (lastStop > maxChars * 0.5 ? cut.slice(0, lastStop + 1) : `${cut.trimEnd()}…`).trim();
  }
  return brief || undefined;
}

function linkedInSummary(md) {
  for (const heading of ['LinkedIn description', 'LinkedIn description summary']) {
    const block = section(md, heading);
    if (!block) continue;
    const prose = proseBlock(block.replace(/^-\s+.+$/gm, '').trim());
    if (prose) return prose;
  }
  const match = md.match(/^Description summary:\s*(.+)$/im);
  return match?.[1]?.trim() || undefined;
}

async function compressRoles(nameIndex) {
  const files = (await listMd('evidence/roles')).filter(name => /^R\d{3,}-/.test(name));
  const out = [];
  for (const filename of files) {
    const id = filename.match(/^(R\d{3,})/)[1];
    const md = await read(`evidence/roles/${filename}`);
    const title = meta(md, 'Source title') || md.match(/^# R\d{3,}:\s*[—–-]\s*(.+)$/m)?.[1]?.trim()
      || md.match(/^# R\d{3,}:\s*(.+)$/m)?.[1]?.replace(/^[^—–-]+[—–-]\s*/, '').trim();
    const dateLabel = meta(md, 'Source dates');
    if (!title) throw new Error(`Missing title for ${id}`);
    if (!dateLabel) throw new Error(`Missing dates for ${id}`);
    const { startDate, endDate } = parseDateRange(dateLabel);
    const employer = resolveEmployer(md, nameIndex.nameToId);
    const claims = bullets(section(md, 'Existing resume claims'));
    const location = meta(md, 'Location') || undefined;
    const summary = linkedInSummary(md);
    const showOnResume = parseShowOnResume(md, 'role', id);
    const tags = parseTags(md, 'role', id, employer);
    out.push(await writeOutput('role', id, compact({
      evidenceId: id, employer, title, dateLabel, startDate, endDate, location, summary,
      highlights: claims, showOnResume,
    }), tags));
  }
  return out;
}

async function compressProjects() {
  const files = (await listMd('evidence/projects')).filter(name => /^S\d{3,}/.test(name));
  const out = [];
  for (const filename of files) {
    const id = filename.match(/^(S\d{3,})/)[1];
    const md = await read(`evidence/projects/${filename}`);
    const name = md.match(/^# S\d{3,}:\s*(.+)$/m)?.[1]?.trim();
    if (!name) throw new Error(`Missing project name for ${id}`);
    const connection = section(md, 'Resume connection') || md;
    const employer = uniqueIds(connection, EMPLOYER_RE)[0];
    const roles = uniqueIds(connection, ROLE_RE);
    if (!employer) throw new Error(`Missing employer for ${id}`);
    if (!roles.length) throw new Error(`Missing roles for ${id}`);
    const summary = projectAccountSummary(md);
    const showOnResume = parseShowOnResume(md, 'project', id);
    const tags = parseTags(md, 'project', id, employer);
    out.push(await writeOutput('project', id, compact({
      evidenceId: id, employer, roles, name, summary, showOnResume,
    }), tags));
  }
  return out;
}

export async function compress(workspaceRoot = root) {
  if (workspaceRoot !== root) throw new Error('compress currently runs from repo root only');
  const nameIndex = parseEmployerIndex(await read('evidence/employers/INDEX.md'));
  const descriptors = parseScaleDescriptors(await read('evidence/employers/Scale and credibility.md'));
  const employers = await compressEmployers(nameIndex, descriptors);
  const roles = await compressRoles(nameIndex);
  const projects = await compressProjects();
  return { employers, roles, projects };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  compress().then(({ employers, roles, projects }) => {
    console.log(`Compressed ${employers.length} employers, ${roles.length} roles, ${projects.length} projects → evidence/outputs/`);
  }).catch(error => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
