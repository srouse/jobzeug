# Compress to Contentful

Deterministically compress the evidence Markdown graph into Employer / Role / Project / Matching Vocabulary payloads, then apply and push those types to Contentful. Evidence Markdown remains the source of truth. Do not invent stories, metrics, or project wording beyond extracting an existing resume-facing blurb.

## Immediate context

Before running commands, confirm:

1. `.env` has `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT`, and `CONTENTFUL_MANAGEMENT_TOKEN` (required for apply/push; compress works without them).
2. `scripts/contentful/lib/schema.mjs` — Employer / Role / Project / Matching Vocabulary field catalog
3. `scripts/contentful/lib/evidence-policy.json` — `showOnResume` defaults, aggregates, and tag assignments
4. `scripts/contentful/lib/tags.mjs` — public Contentful tag catalog
5. `evidence/employers/INDEX.md`, `evidence/roles/INDEX.md`, `evidence/projects/INDEX.md`

## Workflow

1. **Compress** — `npm run contentful:compress`
   - Writes `evidence/outputs/employers/*.json`, `roles/*.json`, `projects/*.json`, `matchingVocabularies/*.json`
   - Employers: id, name, scale descriptor, website URL, plus `tags` (metadata; not a content field)
   - Roles: id, employer, title, `dateLabel` plus ISO `startDate` / optional `endDate` (month precision; Present omits end), LinkedIn prose → `summary`, existing resume-claim bullets → `highlights`, required `showOnResume`, plus `tags`
   - Projects: id, employer, roles, title, **brief `summary`**, plus `tags`. The complete validated YAML header is stored in `matchingMetadata`; preserve its single `year` without synthesizing dates. Strip frontmatter before extracting prose. Do not write a presentation payload or a `presentation` link. Blurb, metrics, and video stay on the Contentful presentation entry.
     - **Copy** `## Resume summary`. That paragraph is the employer line, written by add-project or annotate-project. It sits above the Details button. Do not rewrite it here. Keep markdown links in that paragraph.
     - **Fallback** only if that section is missing: first usable paragraph of `## Account summary…`, skipping meta lines (`Scott describes…`, `Correction vs…`, etc.). Prefer labeled delivery lines (`What he built:`) when present. Cap ~420 chars.
2. **Report** — Counts and a short sample (one employer, one role with summary, one project title + summary). Mention entry IDs will be `jz-C001`, `jz-R001`, `jz-S001`, etc.
3. **Apply schema** — `npm run contentful:apply` (creates/updates core types including `jobzeugMatchingVocabulary`, plus existing job-posting types). Skips `jobzeugProjectPresentation`.
4. **Push** — `npm run contentful:push` (ensures public tags, then upsert + publish in dependency order with `metadata.tags`). Does not upsert presentation entries. A project update keeps the `presentation` link already on that entry.
5. **Summarize** — How many created/updated per type and the space/environment used

Dry-run first when credentials are missing or the user asks to preview: `npm run contentful:apply -- --dry-run`, `npm run contentful:push -- --dry-run`.

## Matching metadata

Read [the compress matching contract](../../../../scripts/contentful/matching/README.md). Compression validates all project headers and the controlled vocabulary before writing outputs. Preserve claims, review/disclosure states, uncertain years, provenance, and vocabulary pins; **do not infer or invent matching tags**. Author or update claim `concept_ids` with **annotate-project** first, then compress/push. Publish the registry as `jz-MV-<version>`.

For matching-only requests, use `contentful:apply -- --matching-only` and `contentful:push -- --matching-only` after compression; both accept `--dry-run`. This preserves other project fields/tags and rejects unpublished entry changes. Reconcile direct Contentful edits back into YAML before the next repo push; no reverse sync exists. The server loader uses validated CDA data without AI.

## Visibility and tags

- Defaults live in `scripts/contentful/lib/evidence-policy.json`. Per-file overrides in Markdown meta: `- Show on resume: yes|no` and `- Tags: startup, enterprise`.
- Roles inherit employer tags; projects use only their own tags (so personal work is not labeled as the employer’s scale).
- Projects have no start/end dates, highlights, technologies, URL, or showOnResume fields. Do not recreate these during compression or sync. The matching header stores year and structured evidence. Do not set or clear the project's presentation link from the repo.
- `/resume` filters roles to `showOnResume: true` (and still collapses LinkedIn detail roles when aggregates are selected).

## Hard rules

- Fail closed on apply/push if Contentful env vars are missing — tell Scott to set them in `.env`
- Do not push resume, cover letter, or job application types
- Do not rewrite or polish claims in compress; extract what is already in evidence
- Do not compress, apply, or push `jobzeugProjectPresentation`. Blurb, metrics, and video are edited in Contentful. Push keeps the presentation link already on the project and never sends presentation fields from the repo.
- Project `summary` is a copy of `## Resume summary` when that section is present. Do not rewrite, polish, or invent that line during compress. If the section is missing, extract carefully from `## Account summary…`. Never invent metrics or AI color. Never ship capture-meta blurbs (“Scott describes this as…”) as the resume summary
- Retired IDs C005 / R008 must not appear; Aha Notes stays excluded
- Prefer scripts over ad-hoc CMA calls; do not use Contentful MCP for this flow

## Out of scope

- Building a Next.js resume page or CDA delivery
- Application bundles, provenance, cover letters
- Customers, clients, perspectives
- Creating full project narratives or writing `## Resume summary` (use add-project; annotate-project refreshes it when the account changes)
- Mapping claims to vocabulary concepts (use annotate-project)
