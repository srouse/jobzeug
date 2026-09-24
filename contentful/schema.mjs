import { z } from 'zod';

const text = z.string().trim().min(1);
const short = text.max(256);
const url = z.url().refine(value => {
  const parsed = new URL(value);
  return ['https:', 'http:'].includes(parsed.protocol) && !parsed.username && !parsed.password &&
    ![...parsed.searchParams.keys()].some(key => /^(code|token|password|secret|access_?token|api_?key)$/i.test(key));
}, 'Use a public HTTP(S) URL without credentials or access codes');
const unique = schema => z.array(schema).refine(items => new Set(items).size === items.length, 'Duplicate values');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');
const contact = z.strictObject({ email: z.email(), location: short.optional(), phone: short.optional() });
const links = z.array(z.strictObject({ label: short, url }));
const education = z.array(z.strictObject({ institution: short, qualification: short, dateLabel: short.optional() }));
const awards = z.array(z.strictObject({ name: short, dateLabel: short.optional(), description: text.optional() }));
const employerId = z.string().regex(/^C\d{3,}$/);
const roleId = z.string().regex(/^R\d{3,}$/);
const projectId = z.string().regex(/^S\d{3,}$/);
export const applicationId = z.string().regex(/^A\d{3,}$/);
export const postingId = z.string().regex(/^JP[\w-]+$/);
const lineSection = z.enum(['description', 'responsibility', 'required', 'preferred']);
const lineKind = z.enum(['duty', 'years', 'skill', 'domain', 'soft', 'other']);
const toolContext = z.enum(['required', 'preferred', 'responsibility']);
const field = (type, schema, required = false, extra = {}) => ({ type, schema, required, ...extra });
const symbol = (required = false, schema = short) => field('Symbol', schema, required);
const prose = (required = false) => field('Text', text, required);
const date = (required = false) => field('Date', isoDate, required);
const bool = (required = false) => field('Boolean', z.boolean(), required);
const integer = (required = false) => field('Integer', z.number().int(), required);
const symbols = () => field('Array', unique(short), false, { items: { type: 'Symbol' } });
const object = (schema, required = false) => field('Object', schema, required);
const reference = (target, schema, required = false) => field('Link', schema, required, { target });
const references = (target, schema, required = false) => field('Array', required ? unique(schema).min(1) : unique(schema), required, { target });

// One field catalog drives local validation, the CMA model, and payload mapping.
export const definitions = {
  employer: { name: 'Employer', displayField: 'name', fields: {
    evidenceId: symbol(true, employerId), name: symbol(true), descriptor: symbol(), websiteUrl: symbol(false, url),
  } },
  role: { name: 'Role', displayField: 'title', fields: {
    evidenceId: symbol(true, roleId), employer: reference('employer', employerId, true), title: symbol(true),
    dateLabel: symbol(true), startDate: date(true), endDate: date(), location: symbol(), summary: prose(),
    highlights: symbols(), showOnResume: bool(true),
  } },
  project: { name: 'Project', displayField: 'name', fields: {
    evidenceId: symbol(true, projectId), employer: reference('employer', employerId, true),
    roles: references('role', roleId, true), name: symbol(true), summary: prose(),
    startDate: date(), endDate: date(), highlights: symbols(), technologies: symbols(), url: symbol(false, url),
    showOnResume: bool(true),
  } },
  resumeExperience: { name: 'Resume Experience', displayField: 'internalTitle', fields: {
    internalTitle: symbol(true), role: reference('role', roleId, true), summary: prose(),
    bullets: symbols(), projects: references('project', projectId),
  } },
  resume: { name: 'Resume', displayField: 'internalTitle', fields: {
    internalTitle: symbol(true), name: symbol(true), contact: object(contact, true), links: object(links),
    headline: symbol(), summary: prose(), experiences: references('resumeExperience', short, true),
    skills: symbols(), education: object(education), awards: object(awards),
  } },
  coverLetter: { name: 'Cover Letter', displayField: 'internalTitle', fields: {
    internalTitle: symbol(true), sender: object(z.strictObject({ name: short, contact }), true),
    recipient: prose(), dateLabel: symbol(), salutation: symbol(true),
    paragraphs: object(z.array(text).min(1), true), signOff: symbol(true), signature: symbol(true),
  } },
  jobApplication: { name: 'Job Application', displayField: 'position', fields: {
    applicationId: symbol(true, applicationId), company: symbol(true), position: symbol(true),
    listingUrl: symbol(false, url), listingText: prose(true), captureDate: symbol(true, z.iso.date()),
    resume: reference('resume', short), coverLetter: reference('coverLetter', short),
  } },
  jobLine: { name: 'Job Line', displayField: 'theme', fields: {
    text: prose(true), section: symbol(true, lineSection), kind: symbol(true, lineKind), theme: symbol(true),
  } },
  jobTool: { name: 'Job Tool', displayField: 'name', fields: {
    name: symbol(true), context: symbol(true, toolContext),
  } },
  jobPosting: { name: 'Job Posting', displayField: 'title', fields: {
    postingId: symbol(true, postingId), sourceUrl: symbol(true, url), company: symbol(true), title: symbol(true),
    location: symbol(), employmentType: symbol(), seniority: symbol(), summary: prose(),
    yearsExperienceMin: integer(), yearsExperienceNote: symbol(), travelNote: prose(), compensationNote: prose(),
    fullText: prose(true), lines: references('jobLine', short), tools: references('jobTool', short),
  } },
};
export const typeId = kind => `jobzeug${kind[0].toUpperCase()}${kind.slice(1)}`;
export const entryId = key => `jz-${key}`;
/** Employer / Role / Project — the resume core synced from evidence. */
export const coreKinds = ['employer', 'role', 'project'];
/** Session job posting overlay — applied with core; not pushed from evidence/. */
export const jobPostingKinds = ['jobLine', 'jobTool', 'jobPosting'];
export const schemas = Object.fromEntries(Object.entries(definitions).map(([kind, definition]) => [kind,
  z.strictObject(Object.fromEntries(
    Object.entries(definition.fields)
      .map(([name, spec]) => [name, spec.required ? spec.schema : spec.schema.optional()]),
  )),
]));
export const experienceSchema = schemas.resumeExperience.omit({ internalTitle: true });
export const localResumeSchema = schemas.resume.extend({ experiences: z.array(experienceSchema).min(1) });
export const localApplicationSchema = schemas.jobApplication.omit({ listingText: true, resume: true, coverLetter: true }).extend({
  listingFile: text, status: z.enum(['draft', 'ready', 'submitted']),
});
export const provenanceSchema = z.strictObject({
  version: z.literal(1), applicationId,
  exclusions: z.array(text), blockingIssues: z.array(text), notes: z.array(text),
  entries: z.record(text, z.strictObject({
    sources: z.record(text, z.string().regex(/^[a-f0-9]{64}$/)),
    claims: z.record(text, z.array(text).min(1)),
    outputHash: z.string().regex(/^[a-f0-9]{64}$/), reviewedAt: z.iso.datetime(), reviewNote: text,
  })),
});
export function contentTypes() {
  return Object.entries(definitions).map(([kind, definition]) => ({
    id: typeId(kind), name: definition.name, displayField: definition.displayField,
    description: 'Managed from Jobzeug evidence. Edit in the repository; CMS edits are replaced on push.',
    fields: Object.entries(definition.fields).map(([id, spec]) => {
      const result = { id, name: id, type: spec.type, required: spec.required, localized: false, validations: [] };
      if (spec.type === 'Symbol') result.validations = [{ size: { min: 1, max: 256 } }];
      if (spec.target) {
        const link = { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: [typeId(spec.target)] }] };
        if (spec.type === 'Array') {
          result.items = link;
          if (spec.required) result.validations = [{ size: { min: 1 } }];
        } else { result.linkType = 'Entry'; result.validations = link.validations; }
      } else if (spec.items) result.items = { ...spec.items, validations: [{ size: { min: 1, max: 256 } }] };
      return result;
    }),
  }));
}
export function coreContentTypes() {
  return contentTypes().filter(type => coreKinds.some(kind => type.id === typeId(kind)));
}
export function jobPostingContentTypes() {
  return contentTypes().filter(type => jobPostingKinds.some(kind => type.id === typeId(kind)));
}
