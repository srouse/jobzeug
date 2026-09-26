#!/usr/bin/env node
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createClient } from 'contentful-management';
import { requireContentfulEnv } from './env.mjs';

const removed = new Set(['startDate', 'endDate', 'highlights', 'technologies', 'url', 'showOnResume']);
const clean = fields => Object.fromEntries(Object.entries(fields).filter(([key]) => !removed.has(key)));
const assertPublished = entry => {
  if (!entry.sys.publishedVersion || entry.sys.version > entry.sys.publishedVersion + 1) {
    throw new Error(`Unpublished changes on ${entry.sys.id}; resolve before cleanup`);
  }
};
async function main() {
  const { space, environment, token } = requireContentfulEnv();
  const client = createClient({ accessToken: token });
  const params = { spaceId: space, environmentId: environment };
  const typeParams = { ...params, contentTypeId: 'jobzeugProject' };
  let type = await client.contentType.get(typeParams);
  assertPublished(type);
  const entries = [];
  let page;
  do {
    page = await client.entry.getMany({ ...params, query: { content_type: 'jobzeugProject', limit: 100, skip: entries.length, order: 'sys.id' } });
    entries.push(...page.items);
  } while (entries.length < page.total);
  entries.forEach(assertPublished);
  const backupDir = await fs.mkdtemp(path.join(os.tmpdir(), 'jobzeug-project-cleanup-'));
  await fs.writeFile(path.join(backupDir, 'before.json'), JSON.stringify({ space, environment, type, entries }, null, 2), { mode: 0o600 });
  console.log(`Backup: ${backupDir}/before.json`);
  console.log(`${process.argv.includes('--dry-run') ? 'Would clean' : 'Cleaning'} ${entries.length} projects in ${space}/${environment}`);
  if (process.argv.includes('--dry-run')) return;
  if (type.fields.some(f => removed.has(f.id))) {
    type = await client.contentType.update(typeParams, { ...type, fields: type.fields.map(f => removed.has(f.id) ? { ...f, required: false, omitted: true } : f) });
    type = await client.contentType.publish(typeParams, type);
  }
  for (const previous of entries) {
    const entryParams = { ...params, entryId: previous.sys.id };
    const current = await client.entry.get(entryParams);
    assertPublished(current);
    if (current.sys.version !== previous.sys.version) throw new Error(`Concurrent edit on ${current.sys.id}; retry cleanup`);
    if (!Object.keys(current.fields).some(key => removed.has(key))) continue;
    const updated = await client.entry.update(entryParams, { ...current, fields: clean(current.fields) });
    await client.entry.publish(entryParams, updated);
  }
  if (type.fields.some(f => removed.has(f.id))) {
    type = await client.contentType.update(typeParams, { ...type, fields: type.fields.filter(f => !removed.has(f.id)) });
    await client.contentType.publish(typeParams, type);
  }
  // Verify all retained content and tags against the preflight snapshot.
  const { isDeepStrictEqual } = await import('node:util');
  for (const previous of entries) {
    const current = await client.entry.get({ ...params, entryId: previous.sys.id });
    assertPublished(current);
    if (!isDeepStrictEqual(current.fields, clean(previous.fields)) || !isDeepStrictEqual(current.metadata, previous.metadata)) {
      throw new Error(`Unexpected retained-content change on ${current.sys.id}`);
    }
  }
  const finalType = await client.contentType.get(typeParams);
  if (finalType.fields.some(f => removed.has(f.id))) throw new Error('Removed fields still in model');
  console.log(`Verified ${entries.length} published projects; retained fields and tags unchanged. Fields: ${finalType.fields.map(f => f.id).join(', ')}`);
}
main().catch(error => { console.error('Project cleanup failed:', error.name, error.name === 'Error' ? error.message : error.status || error.code || 'API error'); process.exitCode = 1; });
