import { validateMatchingCatalog, projectMatchingSchema, matchingVocabularySchema } from './matching-schema.mjs';

/** CDA reads only; shared by the server loader and deterministic integration tests. */
export async function fetchMatchingCatalog(client, { locale = 'en-US' } = {}) {
  async function all(content_type, select) {
    const items = [];
    let total;
    do {
      const page = await client.getEntries({ content_type, select, locale, include: 0, limit: 100, skip: items.length, order: ['sys.id'] });
      if (total !== undefined && total !== page.total) throw new Error('Matching catalog changed during pagination; retry');
      total = page.total;
      if (!page.items.length && items.length < total) throw new Error(`Incomplete ${content_type} page`);
      items.push(...page.items);
    } while (items.length < total);
    return items;
  }
  const [entries, vocabularyEntries] = await Promise.all([
    all('jobzeugProject', ['sys', 'fields.evidenceId', 'fields.matchingMetadata']),
    all('jobzeugMatchingVocabulary', ['sys', 'fields.evidenceId', 'fields.vocabularyVersion', 'fields.registry']),
  ]);
  if (!entries.length) throw new Error('No published matching projects');
  const projects = entries.map(entry => {
    const parsed = projectMatchingSchema.safeParse(entry.fields.matchingMetadata);
    if (!parsed.success) throw new Error(`Invalid or missing matchingMetadata on ${entry.sys.id}`);
    if (parsed.data.project_id !== entry.fields.evidenceId) throw new Error(`Matching project ID mismatch on ${entry.sys.id}`);
    return parsed.data;
  });
  const vocabularies = vocabularyEntries.map(entry => {
    const parsed = matchingVocabularySchema.safeParse(entry.fields.registry);
    if (!parsed.success || parsed.data.vocabulary_version !== entry.fields.vocabularyVersion || entry.fields.evidenceId !== `MV-${entry.fields.vocabularyVersion}`) {
      throw new Error(`Invalid matching vocabulary on ${entry.sys.id}`);
    }
    return parsed.data;
  });
  const catalog = validateMatchingCatalog(projects, vocabularies);
  return {
    ...catalog,
    pendingProjectIds: projects.filter(p => p.annotation.status !== 'reviewed').map(p => p.project_id),
    excludedProjectIds: projects.filter(p => !p.ranking_eligible).map(p => p.project_id),
    revisions: [...entries, ...vocabularyEntries].map(e => ({ entryId: e.sys.id, revision: e.sys.revision, updatedAt: e.sys.updatedAt })),
  };
}
