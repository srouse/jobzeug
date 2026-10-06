#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from 'contentful-management';
import { requireContentfulEnv } from './env.mjs';

const CONTENT_TYPE = 'jobzeugProjectPresentation';
const PROJECT_ID = /^S\d{3,}$/;
const PLACEHOLDER = {
  blurb: 'Placeholder blurb.',
  metricOneValue: '—',
  metricOneLabel: 'Metric one',
  metricTwoValue: '—',
  metricTwoLabel: 'Metric two',
};

function localized(field, locale) {
  if (!field || typeof field !== 'object') return undefined;
  if (locale in field) return field[locale];
  const keys = Object.keys(field);
  return keys.length === 1 ? field[keys[0]] : undefined;
}

function hasUnpublishedChanges(entry) {
  return !entry.sys.publishedVersion || entry.sys.version > entry.sys.publishedVersion + 1;
}

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

async function allEntries(client, params, contentType) {
  const items = [];
  let total = Infinity;
  while (items.length < total) {
    const page = await client.entry.getMany({
      ...params,
      query: { content_type: contentType, limit: 100, skip: items.length, order: 'sys.id' },
    });
    total = page.total;
    items.push(...page.items);
    if (!page.items.length) break;
  }
  return items;
}

function presentationEntryId(evidenceId) {
  return `jz-${evidenceId}-presentation`;
}

export async function planSeeds(client, params, locale) {
  const [projects, presentations] = await Promise.all([
    allEntries(client, params, 'jobzeugProject'),
    allEntries(client, params, CONTENT_TYPE),
  ]);
  const presentationIds = new Set(presentations.map(entry => entry.sys.id));
  const linked = [];
  const skipped = [];
  const missing = [];

  for (const project of projects) {
    const evidenceId = localized(project.fields.evidenceId, locale);
    const link = localized(project.fields.presentation, locale);
    const linkId = link?.sys?.id ?? null;
    if (linkId) {
      linked.push({
        id: project.sys.id,
        evidenceId: evidenceId ?? null,
        linkId,
        linkExists: presentationIds.has(linkId),
      });
      continue;
    }
    if (typeof evidenceId !== 'string' || !PROJECT_ID.test(evidenceId)) {
      skipped.push({ id: project.sys.id, reason: 'invalid evidence id' });
      continue;
    }
    const presentationId = presentationEntryId(evidenceId);
    if (hasUnpublishedChanges(project)) {
      skipped.push({ id: project.sys.id, evidenceId, reason: 'unpublished changes' });
      continue;
    }
    if (presentationIds.has(presentationId)) {
      skipped.push({ id: project.sys.id, evidenceId, reason: 'presentation entry already exists' });
      continue;
    }
    missing.push({
      projectId: project.sys.id,
      projectVersion: project.sys.version,
      evidenceId,
      presentationId,
      name: localized(project.fields.name, locale) ?? '',
    });
  }

  return { projects: projects.length, presentations: presentations.length, linked, skipped, missing };
}

async function seedOne(client, params, locale, item) {
  let existing;
  try {
    existing = await client.entry.get({ ...params, entryId: item.presentationId });
  } catch (error) {
    if (!isNotFound(error)) throw error;
  }
  if (existing) {
    throw new Error(`${item.presentationId} already exists; aborting ${item.projectId}`);
  }

  const created = await client.entry.createWithId(
    { ...params, entryId: item.presentationId, contentTypeId: CONTENT_TYPE },
    {
      fields: {
        evidenceId: { [locale]: `${item.evidenceId}-presentation` },
        blurb: { [locale]: PLACEHOLDER.blurb },
        metricOneValue: { [locale]: PLACEHOLDER.metricOneValue },
        metricOneLabel: { [locale]: PLACEHOLDER.metricOneLabel },
        metricTwoValue: { [locale]: PLACEHOLDER.metricTwoValue },
        metricTwoLabel: { [locale]: PLACEHOLDER.metricTwoLabel },
      },
    },
  );
  const publishedPresentation = await client.entry.publish(
    { ...params, entryId: item.presentationId },
    created,
  );
  if (!publishedPresentation.sys.publishedVersion) {
    throw new Error(`${item.presentationId} did not publish`);
  }

  const current = await client.entry.get({ ...params, entryId: item.projectId });
  if (current.sys.version !== item.projectVersion) {
    throw new Error(`Concurrent edit on ${current.sys.id}; aborting`);
  }
  if (hasUnpublishedChanges(current)) {
    throw new Error(`Unpublished changes on ${current.sys.id}; aborting`);
  }
  const link = localized(current.fields.presentation, locale);
  if (link?.sys?.id) {
    throw new Error(`Presentation link appeared on ${current.sys.id}; aborting`);
  }

  const updated = await client.entry.update(
    { ...params, entryId: current.sys.id },
    {
      ...current,
      fields: {
        ...current.fields,
        presentation: {
          [locale]: { sys: { type: 'Link', linkType: 'Entry', id: item.presentationId } },
        },
      },
    },
  );
  const publishedProject = await client.entry.publish(
    { ...params, entryId: current.sys.id },
    updated,
  );
  if (!publishedProject.sys.publishedVersion || hasUnpublishedChanges(publishedProject)) {
    throw new Error(`${current.sys.id} did not publish`);
  }
  return publishedProject.sys.id;
}

async function main() {
  const write = process.argv.includes('--write');
  const { space, environment, token, locale } = requireContentfulEnv();
  const client = createClient({ accessToken: token }, { type: 'plain' });
  const params = { spaceId: space, environmentId: environment };
  const plan = await planSeeds(client, params, locale);

  console.log(`${write ? 'Writing' : 'Would write'} ${plan.missing.length} presentations in ${space}/${environment} (${locale})`);
  console.log(`placeholder blurb: ${PLACEHOLDER.blurb}`);
  console.log(`placeholder metric one: ${PLACEHOLDER.metricOneValue} / ${PLACEHOLDER.metricOneLabel}`);
  console.log(`placeholder metric two: ${PLACEHOLDER.metricTwoValue} / ${PLACEHOLDER.metricTwoLabel}`);
  console.log(`projects ${plan.projects}, existing presentations ${plan.presentations}, already linked ${plan.linked.length}`);
  for (const item of plan.linked) {
    console.log(`keep: ${item.id} -> ${item.linkId}${item.linkExists ? '' : ' (missing entry)'}`);
  }
  for (const item of plan.skipped) {
    console.log(`skip: ${item.id} (${item.reason})`);
  }
  for (const item of plan.missing) {
    console.log(`${write ? 'create' : 'would create'}: ${item.presentationId} -> ${item.projectId} (${item.evidenceId} ${item.name})`);
  }
  if (!write) return;

  for (const item of plan.missing) {
    const projectId = await seedOne(client, params, locale, item);
    console.log(`linked: ${projectId} -> ${item.presentationId}`);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch(error => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
