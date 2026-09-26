import test from 'node:test';
import assert from 'node:assert/strict';
import { structuredJobPostingSchema } from '../../src/lib/job-posting/schema.ts';

const base = {
  company: 'Acme',
  title: 'Designer',
  lines: [
    { text: 'Ship the design system.', section: 'responsibility', kind: 'duty', theme: 'design-system' },
  ],
  tools: [],
};

test('blank optional posting fields are omitted instead of failing', () => {
  const parsed = structuredJobPostingSchema.parse({
    ...base,
    location: '',
    employmentType: '  ',
    seniority: null,
    yearsExperienceNote: '',
    travelNote: '',
    compensationNote: null,
    yearsExperienceMin: null,
  });
  assert.equal(parsed.location, undefined);
  assert.equal(parsed.employmentType, undefined);
  assert.equal(parsed.seniority, undefined);
  assert.equal(parsed.yearsExperienceNote, undefined);
  assert.equal(parsed.travelNote, undefined);
  assert.equal(parsed.compensationNote, undefined);
  assert.equal(parsed.yearsExperienceMin, undefined);
  assert.equal(parsed.company, 'Acme');
});

test('real optional posting fields are kept', () => {
  const parsed = structuredJobPostingSchema.parse({
    ...base,
    location: ' Remote ',
    employmentType: 'Full-time',
    seniority: 'Senior',
    yearsExperienceMin: 5,
    yearsExperienceNote: '5+ years',
    compensationNote: '$180k–$220k',
  });
  assert.equal(parsed.location, 'Remote');
  assert.equal(parsed.employmentType, 'Full-time');
  assert.equal(parsed.yearsExperienceMin, 5);
  assert.equal(parsed.compensationNote, '$180k–$220k');
});
