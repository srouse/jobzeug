# Compress to Contentful

Deterministically compress the evidence Markdown graph into Employer / Role / Project payloads, then apply and push those types to Contentful. Evidence Markdown remains the source of truth. Do not invent stories, metrics, or project summaries.

## Immediate context

Before running commands, confirm:

1. `.env` has `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT`, and `CONTENTFUL_MANAGEMENT_TOKEN` (required for apply/push; compress works without them).
2. `contentful/schema.mjs` — Employer / Role / Project field catalog
3. `contentful/evidence-policy.json` — `showOnResume` defaults, aggregates, and tag assignments
4. `contentful/tags.mjs` — public Contentful tag catalog
5. `evidence/employers/INDEX.md`, `evidence/roles/INDEX.md`, `evidence/projects/INDEX.md`

## Workflow

1. **Compress** — `npm run contentful:compress`
   - Writes `evidence/outputs/employers/*.json`, `roles/*.json`, `projects/*.json`
   - Employers: id, name, scale descriptor, website URL, plus `tags` (metadata; not a content field)
   - Roles: id, employer, title, `dateLabel` plus ISO `startDate` / optional `endDate` (month precision; Present omits end), LinkedIn prose → `summary`, existing resume-claim bullets → `highlights`, required `showOnResume`, plus `tags`
   - Projects: id, employer, roles, **title only** (no summary/body; optional start/end when evidence has them later), required `showOnResume`, plus `tags`
2. **Report** — Counts and a short sample (one employer, one role with highlights, one project title). Mention entry IDs will be `jz-C001`, `jz-R001`, `jz-S001`, etc.
3. **Apply schema** — `npm run contentful:apply` (creates/updates `jobzeugEmployer`, `jobzeugRole`, `jobzeugProject` only)
4. **Push** — `npm run contentful:push` (ensures public tags, then upsert + publish in dependency order with `metadata.tags`)
5. **Summarize** — How many created/updated per type and the space/environment used

Dry-run first when credentials are missing or the user asks to preview: `npm run contentful:apply -- --dry-run`, `npm run contentful:push -- --dry-run`.

## Visibility and tags

- Defaults live in `contentful/evidence-policy.json`. Per-file overrides in Markdown meta: `- Show on resume: yes|no` and `- Tags: startup, enterprise`.
- Roles inherit employer tags; projects use only their own tags (so personal work is not labeled as the employer’s scale).
- `/resume` filters to `showOnResume: true` (and still collapses LinkedIn detail roles when aggregates are selected).

## Hard rules

- Fail closed on apply/push if Contentful env vars are missing — tell Scott to set them in `.env`
- Do not push resume, cover letter, or job application types
- Do not rewrite or polish claims; compress only extracts what is already in evidence
- Do not fill project summaries or AI color in this skill
- Retired IDs C005 / R008 must not appear; Aha Notes stays excluded
- Prefer scripts over ad-hoc CMA calls; do not use Contentful MCP for this flow

## Out of scope

- Building a Next.js resume page or CDA delivery
- Application bundles, provenance, cover letters
- Customers, clients, perspectives
- Creating or editing evidence Markdown (use add-project for projects)
