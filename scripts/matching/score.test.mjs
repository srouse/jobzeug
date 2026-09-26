import test from 'node:test';
import assert from 'node:assert/strict';
import {
  matchingRequirementSchema,
  matchingSnapshotSchema,
  sanitizeMatchingRequirement,
  matchingVocabularySchema,
} from '../../contentful/matching-schema.mjs';
import { scorePostingAgainstCatalog, SCORING_VERSION } from '../../contentful/matching-score.mjs';

const vocabulary = matchingVocabularySchema.parse({
  schema_version: '1.0',
  vocabulary_version: '1.0.0',
  title: 'Test vocabulary',
  status: 'approved',
  created_at: '2026-09-26',
  review: { reviewed_by: 'test', reviewed_at: '2026-09-26', scope: 'test' },
  purpose: 'unit tests',
  categories: {
    skill: 's', knowledge: 'k', work_activity: 'wa', work_context: 'wc',
    tool: 't', domain: 'd', deliverable: 'del', outcome: 'o',
  },
  external_source: {
    system: 'O*NET', release: '31.0', file: 'x.json',
    url: 'https://example.com/x.json',
    sha256: '58f597d04b4bf1f457a4b50eaed67ddd120740df602acd404578acd78129e32e',
    retrieved_at: '2026-09-26',
    license_url: 'https://creativecommons.org/licenses/by/4.0/',
    license_details_url: 'https://example.com/license',
    attribution: 'test', modifications: 'test',
  },
  rules: ['test'],
  project_sources: {},
  requirement_sources: [],
  coverage_checks: [],
  known_unmapped_examples: [],
  limitations: [],
  concepts: [
    {
      id: 'local:programming', label: 'Programming', definition: 'Write code',
      category: 'skill', aliases: [], status: 'approved', broader_ids: [],
      external_mappings: [], evidence_rule: 'impl', basis: { project_ids: [], requirement_source_ids: [] },
      review: { reviewed_by: 'test', reviewed_at: '2026-09-26', scope: 'def' },
    },
    {
      id: 'local:front-end-development', label: 'Front-end', definition: 'UI impl',
      category: 'skill', aliases: [], status: 'approved', broader_ids: ['local:programming'],
      external_mappings: [], evidence_rule: 'impl', basis: { project_ids: [], requirement_source_ids: [] },
      review: { reviewed_by: 'test', reviewed_at: '2026-09-26', scope: 'def' },
    },
    {
      id: 'local:react', label: 'React', definition: 'React lib',
      category: 'tool', aliases: ['React.js'], status: 'approved', broader_ids: [],
      external_mappings: [], evidence_rule: 'use', basis: { project_ids: [], requirement_source_ids: [] },
      review: { reviewed_by: 'test', reviewed_at: '2026-09-26', scope: 'def' },
    },
    {
      id: 'local:prototyping', label: 'Prototyping', definition: 'Build prototypes',
      category: 'skill', aliases: [], status: 'approved', broader_ids: [],
      external_mappings: [], evidence_rule: 'build', basis: { project_ids: [], requirement_source_ids: [] },
      review: { reviewed_by: 'test', reviewed_at: '2026-09-26', scope: 'def' },
    },
  ],
});

function claim(partial) {
  return {
    ownership: 'contributor',
    scope: 'single_team',
    delivery_stage: 'prototype',
    provenance: 'self_report',
    sources: [{ ref: '#a', locator: 'Account', supports: 'x' }],
    limitations: [],
    public_disclosure: 'needs_review',
    review: { status: 'approved', reviewed_by: 'test', reviewed_at: '2026-09-26' },
    ...partial,
  };
}

function project(id, evidence, extras = {}) {
  return {
    schema_version: '1.1',
    project_id: id,
    title: id,
    record_kind: 'project',
    project_origin: 'employment',
    ranking_eligible: true,
    exclusion_reason: null,
    parent_project_id: null,
    related_project_ids: [],
    role_links: [],
    employer_links: [],
    customer_ids: [],
    client_ids: [],
    year: 2020,
    year_basis: 'estimated',
    year_note: 'test',
    delivery_stage: 'prototype',
    annotation: {
      status: 'reviewed',
      vocabulary_version: '1.0.0',
      reviewed_by: 'test',
      reviewed_at: '2026-09-26',
    },
    public_disclosure: 'needs_review',
    evidence,
    concept_proposals: [],
    ...extras,
  };
}

function requirement(partial) {
  return matchingRequirementSchema.parse({
    id: 'jz-JP1-line-1',
    source_text: 'Build React prototypes',
    source_location: 'required / react',
    normalized_statement: 'Build React prototypes',
    scope: 'project',
    priority: 'core',
    priority_basis: { kind: 'explicit', rationale: 'required section' },
    weight: 3,
    concept_ids: ['local:react'],
    constraints: {
      ownership: [],
      scope: [],
      delivery_stage: [],
      tool_concept_ids: [],
      note: null,
    },
    mapping_status: 'proposed',
    ...partial,
  });
}

function catalog(projects, pending = [], excluded = []) {
  return {
    projects: new Map(projects.map(p => [p.project_id, p])),
    vocabularies: new Map([['1.0.0', vocabulary]]),
    pendingProjectIds: pending,
    excludedProjectIds: excluded,
    revisions: [],
  };
}

test('legacy posting without snapshot returns not_mapped', () => {
  const result = scorePostingAgainstCatalog({
    posting: { lines: [], matchingSnapshot: undefined },
    catalog: catalog([]),
  });
  assert.equal(result.mapped, false);
  assert.equal(result.status, 'not_mapped');
  assert.equal(result.projects.length, 0);
});

test('weights 3/3/1 with matches 1/1/0 yield 85.7', () => {
  const p = project('S100', [
    claim({ id: 'S100-E001', statement: 'React', concept_ids: ['local:react'] }),
    claim({ id: 'S100-E002', statement: 'Proto', concept_ids: ['local:prototyping'] }),
  ]);
  const posting = {
    matchingSnapshot: {
      vocabularyVersion: '1.0.0',
      mapperVersion: '1.0.0',
      sourceHash: 'a'.repeat(64),
      status: 'ready',
      concept_proposals: [],
    },
    lines: [
      { entryId: 'jz-JP1-line-1', matchingRequirement: requirement({ id: 'jz-JP1-line-1', concept_ids: ['local:react'], weight: 3, priority: 'core' }) },
      { entryId: 'jz-JP1-line-2', matchingRequirement: requirement({ id: 'jz-JP1-line-2', concept_ids: ['local:prototyping'], weight: 3, priority: 'core' }) },
      { entryId: 'jz-JP1-line-3', matchingRequirement: requirement({ id: 'jz-JP1-line-3', concept_ids: ['local:front-end-development'], weight: 1, priority: 'preferred', mapping_status: 'proposed' }) },
    ],
  };
  const result = scorePostingAgainstCatalog({ posting, catalog: catalog([p]) });
  assert.equal(result.scoringVersion, SCORING_VERSION);
  assert.equal(result.projects.length, 1);
  assert.ok(Math.abs(result.projects[0].score - (100 * (3 + 3 + 0) / 7)) < 1e-9);
});

test('broader parent concept yields 0.5', () => {
  const p = project('S101', [
    claim({ id: 'S101-E001', statement: 'Programming', concept_ids: ['local:programming'] }),
  ]);
  const posting = {
    matchingSnapshot: matchingSnapshotSchema.parse({
      vocabularyVersion: '1.0.0',
      mapperVersion: '1.0.0',
      sourceHash: 'b'.repeat(64),
      status: 'ready',
      concept_proposals: [],
    }),
    lines: [
      {
        entryId: 'l1',
        matchingRequirement: requirement({
          id: 'l1',
          concept_ids: ['local:front-end-development'],
          weight: 2,
        }),
      },
    ],
  };
  const result = scorePostingAgainstCatalog({ posting, catalog: catalog([p]) });
  assert.equal(result.projects[0].score, 50);
  assert.equal(result.byLine[0].matchSummaries[0].match, 0.5);
});

test('unmapped requirement stays in denominator as zero', () => {
  const p = project('S102', [
    claim({ id: 'S102-E001', statement: 'React', concept_ids: ['local:react'] }),
  ]);
  const posting = {
    matchingSnapshot: matchingSnapshotSchema.parse({
      vocabularyVersion: '1.0.0',
      mapperVersion: '1.0.0',
      sourceHash: 'c'.repeat(64),
      status: 'ready',
    }),
    lines: [
      { entryId: 'a', matchingRequirement: requirement({ id: 'a', concept_ids: ['local:react'], weight: 3 }) },
      {
        entryId: 'b',
        matchingRequirement: requirement({
          id: 'b',
          concept_ids: [],
          mapping_status: 'unmapped',
          weight: 3,
        }),
      },
    ],
  };
  const result = scorePostingAgainstCatalog({ posting, catalog: catalog([p]) });
  assert.deepEqual(result.unmappedRequirementIds, ['b']);
  assert.ok(Math.abs(result.projects[0].score - 50) < 1e-9);
});

test('empty project-scoped requirements yield null scores', () => {
  const p = project('S103', [
    claim({ id: 'S103-E001', statement: 'React', concept_ids: ['local:react'] }),
  ]);
  const posting = {
    matchingSnapshot: matchingSnapshotSchema.parse({
      vocabularyVersion: '1.0.0',
      mapperVersion: '1.0.0',
      sourceHash: 'd'.repeat(64),
      status: 'ready',
    }),
    lines: [
      {
        entryId: 'c',
        matchingRequirement: requirement({
          id: 'c',
          scope: 'candidate',
          concept_ids: [],
          mapping_status: 'unmapped',
        }),
      },
    ],
  };
  const result = scorePostingAgainstCatalog({ posting, catalog: catalog([p]) });
  assert.equal(result.projects[0].score, null);
  assert.match(result.message ?? '', /No project-scoped/);
});

test('excluded umbrella is omitted from ranked projects', () => {
  const child = project('S105', [
    claim({ id: 'S105-E001', statement: 'React', concept_ids: ['local:react'] }),
  ]);
  const umbrella = project('S104', [], {
    ranking_eligible: false,
    exclusion_reason: 'umbrella',
    record_kind: 'umbrella',
  });
  const posting = {
    matchingSnapshot: matchingSnapshotSchema.parse({
      vocabularyVersion: '1.0.0',
      mapperVersion: '1.0.0',
      sourceHash: 'e'.repeat(64),
      status: 'ready',
    }),
    lines: [
      { entryId: 'x', matchingRequirement: requirement({ id: 'x', concept_ids: ['local:react'] }) },
    ],
  };
  const result = scorePostingAgainstCatalog({
    posting,
    catalog: catalog([child, umbrella], [], ['S104']),
  });
  assert.deepEqual(result.projects.map(p => p.projectId), ['S105']);
  assert.deepEqual(result.excludedProjectIds, ['S104']);
});

test('pending project scores null but remains listed', () => {
  const pending = project('S106', [
    claim({
      id: 'S106-E001',
      statement: 'React',
      concept_ids: ['local:react'],
      review: { status: 'proposed', reviewed_by: null, reviewed_at: null },
    }),
  ], {
    annotation: {
      status: 'draft',
      vocabulary_version: '1.0.0',
      reviewed_by: null,
      reviewed_at: null,
    },
  });
  const posting = {
    matchingSnapshot: matchingSnapshotSchema.parse({
      vocabularyVersion: '1.0.0',
      mapperVersion: '1.0.0',
      sourceHash: 'f'.repeat(64),
      status: 'ready',
    }),
    lines: [
      { entryId: 'y', matchingRequirement: requirement({ id: 'y', concept_ids: ['local:react'] }) },
    ],
  };
  const result = scorePostingAgainstCatalog({
    posting,
    catalog: catalog([pending], ['S106']),
  });
  assert.equal(result.projects[0].score, null);
  assert.equal(result.projects[0].pending, true);
  assert.equal(result.status, 'provisional');
});

test('sanitizeMatchingRequirement drops unknown concept ids', () => {
  const cleaned = sanitizeMatchingRequirement({
    id: 'line-1',
    source_text: 'x',
    source_location: 'required',
    normalized_statement: 'x',
    scope: 'project',
    priority: 'core',
    priority_basis: { kind: 'inferred', rationale: 'test' },
    weight: 3,
    concept_ids: ['local:react', 'local:made-up'],
    constraints: { ownership: [], scope: [], delivery_stage: [], tool_concept_ids: [], note: null },
    mapping_status: 'proposed',
  }, vocabulary);
  assert.deepEqual(cleaned.concept_ids, ['local:react']);
});
