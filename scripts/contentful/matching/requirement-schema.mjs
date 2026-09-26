import { z } from 'zod';
import { matchingEnums } from './project-schema.mjs';

const { category, stage, ownership, claimScope, conceptId, version, unique, text } = matchingEnums;

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
