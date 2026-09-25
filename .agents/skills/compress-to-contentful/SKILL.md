# Compress to Contentful

Deterministically compress the evidence Markdown graph into Employer / Role / Project payloads, then apply and push those types to Contentful. Evidence Markdown remains the source of truth. Do not invent stories, metrics, or project wording beyond extracting an existing resume-facing blurb.

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
   - Projects: id, employer, roles, title, **brief `summary`**, required `showOnResume`, plus `tags`. Optional start/end when evidence has them later.
     - **Prefer** `## Resume summary` — 1–2 sentences written for the resume (first person or direct project description; no capture-meta voice).
     - **Fallback** only if that section is missing: first usable paragraph of `## Account summary…`, skipping meta lines (`Scott describes…`, `Correction vs…`, etc.). Prefer labeled delivery lines (`What he built:`) when present. Cap ~420 chars.
2. **Report** — Counts and a short sample (one employer, one role with summary, one project title + summary). Mention entry IDs will be `jz-C001`, `jz-R001`, `jz-S001`, etc.
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
- Do not rewrite or polish claims in compress; extract what is already in evidence
- Project `summary` must come from `## Resume summary` when present; otherwise a careful extract from `## Account summary…`. Never invent metrics or AI color. Never ship capture-meta blurbs (“Scott describes this as…”) as the resume summary
- Retired IDs C005 / R008 must not appear; Aha Notes stays excluded
- Prefer scripts over ad-hoc CMA calls; do not use Contentful MCP for this flow

## Out of scope

- Building a Next.js resume page or CDA delivery
- Application bundles, provenance, cover letters
- Customers, clients, perspectives
- Creating full project narratives (use add-project); writing `## Resume summary` on existing projects is in scope when fixing resume blurbs
