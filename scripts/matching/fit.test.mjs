import test from 'node:test';
import assert from 'node:assert/strict';
import { matchingRequirementSchema } from '../../scripts/contentful/matching/requirement-schema.mjs';
import {
  AXIS_HIT_POINTS,
  CONCEPT_HIT_POINTS,
} from '../../src/lib/matching/score.ts';
import {
  FIT_VERSION,
  computeFits,
  jobPostFit,
  jobRelevancy,
  resumeFit,
} from '../../src/lib/matching/fit.ts';

test('one project that checks every box equals the job ceiling', () => {
  const fit = jobPostFit([
    { points: CONCEPT_HIT_POINTS, projectIds: ['S1'] },
    { points: CONCEPT_HIT_POINTS, projectIds: ['S1'] },
    { points: CONCEPT_HIT_POINTS, projectIds: ['S1'] },
    { points: CONCEPT_HIT_POINTS, projectIds: ['S1'] },
  ]);
  assert.equal(fit.ceiling, 4 * CONCEPT_HIT_POINTS);
  assert.equal(fit.score, fit.ceiling);
  assert.equal(fit.bestProjectPoints, fit.ceiling);
  assert.equal(fit.sharedPoints, 0);
});

test('two projects splitting the boxes score under the job ceiling', () => {
  const fit = jobPostFit([
    { points: CONCEPT_HIT_POINTS, projectIds: ['S1'] },
    { points: CONCEPT_HIT_POINTS, projectIds: ['S1'] },
    { points: CONCEPT_HIT_POINTS, projectIds: ['S2'] },
    { points: CONCEPT_HIT_POINTS, projectIds: ['S2'] },
  ]);
  assert.equal(fit.ceiling, 40);
  assert.equal(fit.bestProjectPoints, 20);
  assert.equal(fit.sharedPoints, 10);
  assert.equal(fit.score, 30);
  assert.ok(fit.score < fit.ceiling);
});

test('job post fit is zero with no overlap and never exceeds the ceiling', () => {
  const empty = jobPostFit([
    { points: CONCEPT_HIT_POINTS, projectIds: [] },
    { points: AXIS_HIT_POINTS, projectIds: [] },
  ]);
  assert.equal(empty.score, 0);
  assert.equal(empty.ceiling, CONCEPT_HIT_POINTS + AXIS_HIT_POINTS);

  const split = jobPostFit([
    { points: CONCEPT_HIT_POINTS, projectIds: ['S1'] },
    { points: AXIS_HIT_POINTS, projectIds: ['S2'] },
  ]);
  assert.equal(split.bestProjectPoints, CONCEPT_HIT_POINTS);
  assert.equal(split.sharedPoints, Math.floor(AXIS_HIT_POINTS / 2));
  assert.equal(split.score, CONCEPT_HIT_POINTS + Math.floor(AXIS_HIT_POINTS / 2));
  assert.ok(split.score < split.ceiling);
});

test('resume fit sums repeated concepts and stays zero when the posting misses them', () => {
  const both = resumeFit(
    ['local:react', 'local:prototyping', 'local:react', 'local:prototyping'],
    new Set(['local:react', 'local:prototyping']),
  );
  assert.equal(both.ceiling, 40);
  assert.equal(both.score, 40);

  const one = resumeFit(
    ['local:react', 'local:prototyping'],
    new Set(['local:react']),
  );
  assert.equal(one.score, CONCEPT_HIT_POINTS);
  assert.equal(one.ceiling, 20);

  const none = resumeFit(
    ['local:react', 'local:prototyping'],
    new Set(['local:dog-walking']),
  );
  assert.equal(none.score, 0);
  assert.equal(none.ceiling, 20);
});

test('repeating a matching concept across claims raises resume fit above the job ceiling', () => {
  const once = resumeFit(['local:react'], new Set(['local:react']));
  const twice = resumeFit(
    ['local:react', 'local:react'],
    new Set(['local:react']),
  );
  assert.equal(twice.score, once.score * 2);
  const jobCeiling = CONCEPT_HIT_POINTS;
  assert.ok(twice.score > jobCeiling);
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

function project(id, evidence) {
  return {
    project_id: id,
    ranking_eligible: true,
    evidence,
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

function catalog(projects) {
  return {
    projects: new Map(projects.map((p) => [p.project_id, p])),
    vocabularies: new Map([
      [
        '1.0.0',
        {
          status: 'approved',
          concepts: [
            { id: 'local:react', label: 'React', aliases: [], status: 'approved' },
            { id: 'local:prototyping', label: 'Prototyping', aliases: [], status: 'approved' },
          ],
        },
      ],
    ]),
    pendingProjectIds: [],
    excludedProjectIds: [],
  };
}

function posting(lines) {
  return {
    matchingSnapshot: { vocabularyVersion: '1.0.0', status: 'ready' },
    lines,
  };
}

test('computeFits returns null without a snapshot or project-scoped lines', () => {
  const bare = computeFits({
    posting: { lines: [] },
    catalog: catalog([]),
  });
  assert.equal(bare.fitVersion, FIT_VERSION);
  assert.equal(bare.jobPostFit, null);
  assert.equal(bare.resumeFit, null);
  assert.equal(bare.jobRelevancy, null);

  const candidateOnly = computeFits({
    posting: posting([
      {
        entryId: 'jz-JP1-line-1',
        matchingRequirement: requirement({
          scope: 'candidate',
          concept_ids: [],
          source_text: '5 years of experience',
          normalized_statement: '5 years of experience',
          mapping_status: 'unmapped',
        }),
      },
    ]),
    catalog: catalog([project('S1', [claim({ id: 'S1-E001', statement: 'React', concept_ids: ['local:react'] })])]),
  });
  assert.equal(candidateOnly.jobPostFit, null);
  assert.equal(candidateOnly.resumeFit, null);
  assert.equal(candidateOnly.jobRelevancy, null);
});

test('computeFits scores one perfect project and stacks resume concepts', () => {
  const projects = [
    project('S1', [
      claim({ id: 'S1-E001', statement: 'React', concept_ids: ['local:react'] }),
      claim({ id: 'S1-E002', statement: 'Proto', concept_ids: ['local:prototyping'] }),
    ]),
  ];
  const fits = computeFits({
    posting: posting([
      { entryId: 'jz-JP1-line-1', matchingRequirement: requirement({ id: 'jz-JP1-line-1', concept_ids: ['local:react'] }) },
      { entryId: 'jz-JP1-line-2', matchingRequirement: requirement({ id: 'jz-JP1-line-2', concept_ids: ['local:prototyping'] }) },
    ]),
    catalog: catalog(projects),
  });
  assert.equal(fits.jobPostFit.score, 2 * CONCEPT_HIT_POINTS);
  assert.equal(fits.jobPostFit.ceiling, 2 * CONCEPT_HIT_POINTS);
  assert.equal(fits.resumeFit.score, 2 * CONCEPT_HIT_POINTS);
  assert.equal(fits.resumeFit.ceiling, 2 * CONCEPT_HIT_POINTS);
});

test('computeFits gives half credit when a second project covers the other box', () => {
  const fits = computeFits({
    posting: posting([
      { entryId: 'jz-JP1-line-1', matchingRequirement: requirement({ id: 'jz-JP1-line-1', concept_ids: ['local:react'] }) },
      { entryId: 'jz-JP1-line-2', matchingRequirement: requirement({ id: 'jz-JP1-line-2', concept_ids: ['local:prototyping'] }) },
    ]),
    catalog: catalog([
      project('S1', [claim({ id: 'S1-E001', statement: 'React', concept_ids: ['local:react'] })]),
      project('S2', [claim({ id: 'S2-E001', statement: 'Proto', concept_ids: ['local:prototyping'] })]),
    ]),
  });
  assert.equal(fits.jobPostFit.ceiling, 20);
  assert.equal(fits.jobPostFit.score, 15);
  assert.equal(fits.resumeFit.score, 20);
  assert.equal(fits.resumeFit.ceiling, 20);
});

test('four concepts on a line score the same as three, and the total stays at the ceiling', () => {
  const three = jobRelevancy([3]);
  const four = jobRelevancy([4]);
  assert.equal(three.score, 30);
  assert.equal(three.ceiling, 30);
  assert.equal(four.score, three.score);
  assert.equal(four.ceiling, three.ceiling);

  const packed = jobRelevancy([4, 5, 3]);
  assert.equal(packed.score, packed.ceiling);
  assert.equal(packed.score, 90);
});

test('empty lines stay in the job relevancy ceiling', () => {
  const fit = jobRelevancy([2, 2, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.equal(fit.ceiling, 300);
  assert.equal(fit.score, 40);
  assert.ok(fit.score < fit.ceiling);
});

test('candidate lines do not change job relevancy', () => {
  const fits = computeFits({
    posting: posting([
      {
        entryId: 'jz-JP1-line-1',
        matchingRequirement: requirement({
          id: 'jz-JP1-line-1',
          concept_ids: ['local:react'],
        }),
      },
      {
        entryId: 'jz-JP1-line-2',
        matchingRequirement: requirement({
          id: 'jz-JP1-line-2',
          scope: 'project',
          concept_ids: [],
          source_text: 'Wire the service panel',
          normalized_statement: 'Wire the service panel',
          mapping_status: 'unmapped',
        }),
      },
      {
        entryId: 'jz-JP1-line-3',
        matchingRequirement: requirement({
          id: 'jz-JP1-line-3',
          scope: 'candidate',
          concept_ids: ['local:prototyping'],
          source_text: '5 years of experience',
          normalized_statement: '5 years of experience',
          mapping_status: 'proposed',
        }),
      },
    ]),
    catalog: catalog([]),
  });
  assert.equal(fits.jobRelevancy.score, CONCEPT_HIT_POINTS);
  assert.equal(fits.jobRelevancy.ceiling, 60);
});
