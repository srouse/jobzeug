#!/usr/bin/env node
import { createClient } from 'contentful-management';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { coreContentTypes, jobPostingContentTypes } from '../../contentful/schema.mjs';
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

/** Contentful requires omit+publish before a field can be dropped from the model. */
async function omitRemovedFields(client, params, contentTypeId, existing, desiredFieldIds) {
  const toOmit = (existing.fields || []).filter(
    (field) => !desiredFieldIds.has(field.id) && !field.omitted,
  );
  if (toOmit.length === 0) return existing;
  const fields = existing.fields.map((field) =>
    desiredFieldIds.has(field.id) ? field : { ...field, omitted: true },
  );
  const omitted = await client.contentType.update(
    { ...params, contentTypeId },
    { ...existing, fields },
  );
  return client.contentType.publish({ ...params, contentTypeId }, omitted);
}

export async function applySchema({ dryRun = false, matchingOnly = false } = {}) {
  // jobLine/jobTool before jobPosting (parent links to children).
  const types = [...coreContentTypes(), ...jobPostingContentTypes()].filter(type =>
    !matchingOnly || ['jobzeugMatchingVocabulary', 'jobzeugProject'].includes(type.id));
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
    const desiredFieldIds = new Set(desired.fields.map((field) => field.id));
    try {
      let existing = await client.contentType.get({ ...params, contentTypeId });
      if (matchingOnly && contentTypeId === 'jobzeugProject') {
        if (!existing.sys.publishedVersion || existing.sys.version > existing.sys.publishedVersion + 1) {
          throw new Error('Project content type has unpublished changes; publish or discard those separately first.');
        }
        const matchingField = desired.fields.find(field => field.id === 'matchingMetadata');
        body.name = existing.name;
        body.description = existing.description;
        body.displayField = existing.displayField;
        body.fields = [...existing.fields.filter(field => field.id !== 'matchingMetadata'), matchingField];
      } else {
        existing = await omitRemovedFields(client, params, contentTypeId, existing, desiredFieldIds);
      }
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
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) applySchema({ dryRun, matchingOnly: process.argv.includes('--matching-only') }).then(result => {
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
