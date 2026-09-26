import { z } from 'zod';

const text = z.string().min(1);
const id = prefix => z.string().regex(new RegExp(`^${prefix}\\d{3,}$`));
export const conceptIdSchema = z.string().regex(/^local:[a-z0-9-]+$/);
const conceptId = conceptIdSchema;
const version = z.string().regex(/^\d+\.\d+\.\d+$/);
const unique = schema => z.array(schema).refine(a => new Set(a).size === a.length, 'Duplicate values');
const category = z.enum(['skill', 'knowledge', 'work_activity', 'work_context', 'tool', 'domain', 'deliverable', 'outcome']);
const stage = z.enum(['concept', 'prototype', 'pilot', 'production', 'mixed', 'unknown']);
const disclosure = z.enum(['cleared', 'restricted', 'needs_review']);
const ownership = z.enum(['sole', 'lead', 'contributor', 'team_unspecified', 'unknown']);
const claimScope = z.enum(['individual', 'single_team', 'multiple_teams', 'organization', 'external_audience', 'unknown']);
const review = status => z.strictObject({
  status, reviewed_by: text.nullable(), reviewed_at: z.iso.date().nullable(),
}).refine(r => !['approved', 'reviewed'].includes(r.status) || Boolean(r.reviewed_by && r.reviewed_at), 'Reviewed records require reviewer and date');
const association = prefix => z.strictObject({
  id: id(prefix), relationship: z.enum(['delivery', 'calendar_anchor']),
  status: z.enum(['confirmed', 'provisional']), note: text,
});
const evidence = z.strictObject({
  id: z.string().regex(/^S\d{3,}-E\d{3,}$/), statement: text, concept_ids: unique(conceptId),
  ownership, scope: claimScope,
  delivery_stage: stage, provenance: z.enum(['self_report', 'existing_material', 'artifact_supported', 'inferred']),
  sources: z.array(z.strictObject({ ref: text, locator: text, supports: text })).min(1),
  limitations: z.array(text), public_disclosure: disclosure,
  review: review(z.enum(['proposed', 'approved', 'needs_review'])),
}).refine(c => c.review.status !== 'approved' || (c.concept_ids.length > 0 && c.provenance !== 'inferred'), 'Approved claims need concepts and non-inferred evidence');

export const projectMatchingSchema = z.strictObject({
  schema_version: z.literal('1.1'), project_id: id('S'), title: text,
  record_kind: z.enum(['project', 'umbrella']), project_origin: z.enum(['employment', 'personal', 'mixed', 'unknown']),
  ranking_eligible: z.boolean(), exclusion_reason: text.nullable(), parent_project_id: id('S').nullable(),
  related_project_ids: unique(id('S')), role_links: z.array(association('R')), employer_links: z.array(association('C')),
  customer_ids: unique(id('CU')), client_ids: unique(id('CL')),
  year: z.number().int().min(1000).max(9999).nullable(), year_basis: z.enum(['reported', 'sourced', 'estimated', 'unknown']), year_note: text,
  delivery_stage: stage,
  annotation: review(z.enum(['draft', 'reviewed', 'needs_review'])).safeExtend({ vocabulary_version: version.nullable() }),
  public_disclosure: disclosure, evidence: z.array(evidence),
  concept_proposals: z.array(z.strictObject({ label: text, category, definition: text, reason: text })),
}).superRefine((p, ctx) => {
  const issue = message => ctx.addIssue({ code: 'custom', message });
  if ((p.year === null) !== (p.year_basis === 'unknown')) issue('Year and year_basis disagree');
  if (!p.ranking_eligible && !p.exclusion_reason) issue('Excluded projects require a reason');
  if (p.annotation.status === 'reviewed' && !p.annotation.vocabulary_version) issue('Reviewed projects require a vocabulary version');
  if (p.parent_project_id === p.project_id || p.related_project_ids.includes(p.project_id)) issue('Project cannot reference itself');
  if (new Set(p.evidence.map(c => c.id)).size !== p.evidence.length) issue('Duplicate claim IDs');
  for (const c of p.evidence) if (!c.id.startsWith(`${p.project_id}-E`)) issue('Claim belongs to another project');
  for (const links of [p.role_links, p.employer_links]) {
    if (new Set(links.map(l => l.id)).size !== links.length) issue('Duplicate associations');
    if (p.project_origin === 'personal' && links.some(l => l.relationship !== 'calendar_anchor')) issue('Personal projects cannot have employer delivery associations');
  }
});

const vocabularyReview = z.strictObject({ reviewed_by: text, reviewed_at: z.iso.date(), scope: text });
export const matchingVocabularySchema = z.strictObject({
  schema_version: z.literal('1.0'), vocabulary_version: version, title: text,
  status: z.enum(['proposed', 'approved', 'deprecated']), created_at: z.iso.date(), review: vocabularyReview, purpose: text,
  categories: z.record(category, text),
  external_source: z.strictObject({
    system: text, release: text, file: text, url: z.url(), sha256: z.string().regex(/^[a-f0-9]{64}$/),
    retrieved_at: z.iso.date(), license_url: z.url(), license_details_url: z.url(), attribution: text, modifications: text,
  }),
  rules: z.array(text), project_sources: z.record(id('S'), text),
  requirement_sources: z.array(z.strictObject({ id: text, title: text, url: z.url(), accessed_at: z.iso.date(), coverage_note: text })),
  coverage_checks: z.array(z.strictObject({ source: text, requirement_summary: text, concept_ids: unique(conceptId), constraint: text })),
  known_unmapped_examples: z.array(z.strictObject({ source: text, requirement: text, reason: text })),
  limitations: z.array(text),
  concepts: z.array(z.strictObject({
    id: conceptId, label: text, definition: text, category, aliases: unique(text), status: z.enum(['proposed', 'approved', 'deprecated']),
    broader_ids: unique(conceptId),
    external_mappings: z.array(z.strictObject({ system: text, release: text, source_file: text, source_id: text, source_label: text,
      source_url: z.url(), relation: z.enum(['exact', 'broader', 'narrower', 'related']) })),
    evidence_rule: text, basis: z.strictObject({ project_ids: unique(id('S')), requirement_source_ids: unique(text) }), review: vocabularyReview,
  })).min(1),
}).superRefine((v, ctx) => {
  const issue = message => ctx.addIssue({ code: 'custom', message });
  const concepts = new Map(v.concepts.map(c => [c.id, c]));
  if (concepts.size !== v.concepts.length) issue('Duplicate concept IDs');
  const terms = new Map();
  for (const c of v.concepts) for (const term of [c.label, ...c.aliases]) {
    const key = term.toLowerCase();
    if (terms.has(key) && terms.get(key) !== c.id) issue(`Ambiguous alias: ${term}`);
    terms.set(key, c.id);
  }
  const walk = (key, seen) => {
    if (!concepts.has(key) || seen.has(key)) { issue(`Invalid concept hierarchy at ${key}`); return; }
    for (const parent of concepts.get(key).broader_ids) walk(parent, new Set([...seen, key]));
  };
  for (const c of v.concepts) walk(c.id, new Set());
});

/** Job-line requirement material produced at ingest for deterministic scoring. */
export const matchingRequirementConstraintsSchema = z.strictObject({
  ownership: z.array(ownership).default([]),
  scope: z.array(claimScope).default([]),
  delivery_stage: z.array(stage).default([]),
  tool_concept_ids: unique(conceptId).default([]),
  note: text.nullable().default(null),
});

export const matchingRequirementSchema = z.strictObject({
  id: text,
  source_text: text,
  source_location: text,
  normalized_statement: text,
  scope: z.enum(['project', 'candidate']),
  priority: z.enum(['core', 'supporting', 'preferred']),
  priority_basis: z.strictObject({
    kind: z.enum(['explicit', 'inferred']),
    rationale: text,
  }),
  weight: z.number().positive(),
  concept_ids: unique(conceptId),
  constraints: matchingRequirementConstraintsSchema,
  mapping_status: z.enum(['proposed', 'approved', 'unmapped']),
});

export const matchingSnapshotSchema = z.strictObject({
  vocabularyVersion: version,
  mapperVersion: version,
  sourceHash: z.string().regex(/^[a-f0-9]{64}$/),
  status: z.enum(['provisional', 'ready']),
  concept_proposals: z.array(z.strictObject({ label: text, category, definition: text, reason: text })).default([]),
});

/** Validate references without inferring, filtering, scoring, or silently dropping pending projects. */
export function validateMatchingCatalog(projects, vocabularies) {
  const versions = new Map();
  for (const raw of vocabularies) {
    const v = matchingVocabularySchema.parse(raw);
    if (versions.has(v.vocabulary_version)) throw new Error(`Duplicate vocabulary ${v.vocabulary_version}`);
    versions.set(v.vocabulary_version, v);
  }
  const catalog = new Map();
  for (const raw of projects) {
    const p = projectMatchingSchema.parse(raw);
    if (catalog.has(p.project_id)) throw new Error(`Duplicate project ${p.project_id}`);
    const v = versions.get(p.annotation.vocabulary_version);
    if (!v || v.status !== 'approved') throw new Error(`Missing approved vocabulary for ${p.project_id}`);
    const concepts = new Map(v.concepts.map(c => [c.id, c]));
    for (const c of p.evidence) for (const key of c.concept_ids) {
      if (concepts.get(key)?.status !== 'approved') throw new Error(`Unknown/unapproved concept ${key} in ${c.id}`);
    }
    catalog.set(p.project_id, p);
  }
  for (const p of catalog.values()) {
    for (const key of p.related_project_ids) if (!catalog.has(key)) throw new Error(`Missing related project ${key}`);
    const seen = new Set([p.project_id]);
    let parent = p.parent_project_id;
    while (parent) {
      if (seen.has(parent) || !catalog.has(parent)) throw new Error(`Invalid project hierarchy at ${parent}`);
      seen.add(parent); parent = catalog.get(parent).parent_project_id;
    }
  }
  return { projects: catalog, vocabularies: versions };
}

/** Drop concept IDs not approved in the pinned vocabulary; mark empty as unmapped. */
export function sanitizeMatchingRequirement(requirement, vocabulary) {
  const concepts = new Map(vocabulary.concepts.map(c => [c.id, c]));
  const keep = ids => ids.filter(key => concepts.get(key)?.status === 'approved');
  const concept_ids = keep(requirement.concept_ids);
  const tool_concept_ids = keep(requirement.constraints?.tool_concept_ids ?? []);
  const mapping_status = concept_ids.length === 0 && tool_concept_ids.length === 0
    ? 'unmapped'
    : requirement.mapping_status === 'unmapped' && concept_ids.length
      ? 'proposed'
      : requirement.mapping_status;
  return matchingRequirementSchema.parse({
    ...requirement,
    concept_ids,
    mapping_status,
    constraints: {
      ownership: requirement.constraints?.ownership ?? [],
      scope: requirement.constraints?.scope ?? [],
      delivery_stage: requirement.constraints?.delivery_stage ?? [],
      tool_concept_ids,
      note: requirement.constraints?.note ?? null,
    },
  });
}
