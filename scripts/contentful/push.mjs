#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from 'contentful-management';
import { coreKinds, entryId, schemas, typeId } from '../../contentful/schema.mjs';
import { assertTagIds, tagCatalog } from '../../contentful/tags.mjs';
import { payload } from './local.mjs';
import { contentfulEnv, requireContentfulEnv } from './env.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function isNotFound(error) {
  if (error?.name === 'NotFound') return true;
  if (error?.status === 404) return true;
  try {
    const body = typeof error?.message === 'string' ? JSON.parse(error.message) : null;
    return body?.status === 404;
  } catch {
    return false;
  }
}

function tagLinks(tagIds) {
  return assertTagIds(tagIds).map(id => ({ sys: { type: 'Link', linkType: 'Tag', id } }));
}

function splitOutput(raw) {
  const { tags = [], ...fields } = raw;
  return { fields, tags: Array.isArray(tags) ? tags : [] };
}

export async function loadCoreOutputs(workspaceRoot = root) {
  const records = [];
  for (const kind of coreKinds) {
    const dir = path.join(workspaceRoot, 'evidence/outputs', `${kind}s`);
    let names;
    try {
      names = (await fs.readdir(dir)).filter(name => name.endsWith('.json')).sort();
    } catch (error) {
      if (error.code === 'ENOENT') throw new Error(`Missing ${dir}. Run contentful:compress first.`);
      throw error;
    }
    for (const name of names) {
      const { fields: rawFields, tags } = splitOutput(JSON.parse(await fs.readFile(path.join(dir, name), 'utf8')));
      const fields = schemas[kind].parse(rawFields);
      if (fields.evidenceId !== name.replace(/\.json$/, '')) {
        throw new Error(`ID mismatch in ${kind}s/${name}`);
      }
      records.push({ key: fields.evidenceId, kind, fields, tags });
    }
  }
  return records;
}

async function ensureTags(client, params) {
  const results = [];
  for (const [tagId, { name }] of Object.entries(tagCatalog)) {
    try {
      const existing = await client.tag.get({ ...params, tagId });
      if (existing.name !== name) {
        await client.tag.update({ ...params, tagId }, { ...existing, name });
        results.push({ id: tagId, action: 'updated' });
      } else {
        results.push({ id: tagId, action: 'unchanged' });
      }
    } catch (error) {
      if (!isNotFound(error)) throw error;
      await client.tag.createWithId(
        { ...params, tagId },
        { name, sys: { visibility: 'public' } },
      );
      results.push({ id: tagId, action: 'created' });
    }
  }
  return results;
}

async function upsertEntry(client, params, record, locale) {
  const id = entryId(record.key);
  const body = payload(record, locale);
  const metadata = { tags: tagLinks(record.tags ?? []) };
  const entryParams = { ...params, entryId: id };
  try {
    const existing = await client.entry.get(entryParams);
    const updated = await client.entry.update(entryParams, {
      ...existing,
      fields: body.fields,
      metadata: { ...existing.metadata, ...metadata },
    });
    await client.entry.publish(entryParams, updated);
    return { id, action: 'updated', type: typeId(record.kind) };
  } catch (error) {
    if (!isNotFound(error)) throw error;
    const created = await client.entry.createWithId(
      { ...params, entryId: id, contentTypeId: typeId(record.kind) },
      { ...body, metadata },
    );
    await client.entry.publish(entryParams, created);
    return { id, action: 'created', type: typeId(record.kind) };
  }
}

export async function pushCore({ dryRun = false, workspaceRoot = root } = {}) {
  const records = await loadCoreOutputs(workspaceRoot);
  if (dryRun) {
    const { space, environment, locale } = contentfulEnv({ required: false });
    return {
      space: space || '(unset)', environment: environment || '(unset)', locale,
      tags: Object.keys(tagCatalog).map(id => ({ id, action: 'planned' })),
      results: records.map(record => ({
        id: entryId(record.key), action: 'planned', type: typeId(record.kind), key: record.key,
        tags: record.tags,
      })),
    };
  }
  const { space, environment, token, locale } = requireContentfulEnv();
  const client = createClient({ accessToken: token });
  const params = { spaceId: space, environmentId: environment };
  const tags = await ensureTags(client, params);
  const results = [];
  for (const record of records) {
    results.push({ ...await upsertEntry(client, params, record, locale), key: record.key });
  }
  return { space, environment, locale, tags, results };
}

const dryRun = process.argv.includes('--dry-run');
pushCore({ dryRun }).then(result => {
  const counts = Object.fromEntries(coreKinds.map(kind => [
    kind, result.results.filter(item => item.type === typeId(kind)).length,
  ]));
  if (result.tags) {
    for (const tag of result.tags) console.log(`tag ${tag.action}: ${tag.id}`);
  }
  for (const item of result.results) {
    console.log(`${item.action}: ${item.id} (${item.type})`);
  }
  console.log(`${dryRun ? 'Would push' : 'Pushed'} ${result.results.length} entries to ${result.space}/${result.environment} — employers ${counts.employer}, roles ${counts.role}, projects ${counts.project}`);
}).catch(error => {
  console.error(error.message || error);
  process.exitCode = 1;
});
