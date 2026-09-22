#!/usr/bin/env node
import { createClient } from 'contentful-management';
import { coreContentTypes } from '../../contentful/schema.mjs';
import { contentfulEnv, requireContentfulEnv } from './env.mjs';

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

export async function applySchema({ dryRun = false } = {}) {
  const types = coreContentTypes();
  if (dryRun) {
    const { space, environment } = contentfulEnv({ required: false });
    return { space: space || '(unset)', environment: environment || '(unset)', planned: types.map(type => type.id) };
  }
  const { space, environment, token } = requireContentfulEnv();
  const client = createClient({ accessToken: token });
  const params = { spaceId: space, environmentId: environment };
  const results = [];
  for (const desired of types) {
    const contentTypeId = desired.id;
    const body = {
      name: desired.name,
      description: desired.description,
      displayField: desired.displayField,
      fields: desired.fields,
    };
    try {
      const existing = await client.contentType.get({ ...params, contentTypeId });
      const updated = await client.contentType.update({ ...params, contentTypeId }, { ...existing, ...body });
      await client.contentType.publish({ ...params, contentTypeId }, updated);
      results.push({ id: contentTypeId, action: 'updated' });
    } catch (error) {
      if (!isNotFound(error)) throw error;
      const created = await client.contentType.createWithId({ ...params, contentTypeId }, body);
      await client.contentType.publish({ ...params, contentTypeId }, created);
      results.push({ id: contentTypeId, action: 'created' });
    }
  }
  return { space, environment, results };
}

const dryRun = process.argv.includes('--dry-run');
applySchema({ dryRun }).then(result => {
  if (dryRun) {
    console.log(`Would apply ${result.planned.length} content types to ${result.space}/${result.environment}:`);
    for (const id of result.planned) console.log(`  ${id}`);
    return;
  }
  for (const item of result.results) console.log(`${item.action}: ${item.id}`);
  console.log(`Applied ${result.results.length} content types to ${result.space}/${result.environment}`);
}).catch(error => {
  console.error(error.message || error);
  process.exitCode = 1;
});
