---
name: annotate-project
description: >-
  Annotate evidence project Markdown with matching YAML headers—atomic claims,
  approved vocabulary concept_ids, provenance, and review state. Use when the
  user invokes annotate-project, asks to tag or annotate a project for matching,
  map claims to the controlled vocabulary, or prepare matchingMetadata before
  compress-to-contentful.
disable-model-invocation: true
---

# Annotate project

Write or refine **matching annotations** on existing project files under `evidence/projects/`. Source of truth is the project Markdown YAML header. Compression later validates and publishes that header as Contentful `matchingMetadata`; this skill does **not** invent tags during compress, run Contentful, or score jobs.

This is **not** add-project (no new S/C/R records). This is **not** compress-to-contentful (no CMS sync). Contentful metadata tags (`startup`, `enterprise`) are a separate system—do not confuse them with matching `concept_ids`.

## Immediate context load

Before editing, read (paths from repo root):

1. `evidence/matching/engine.md` — annotation workflow and scoring boundaries
2. `evidence/matching/project-header-schema.md` — header and claim field contract
3. `evidence/matching/vocabulary.yaml` — approved concept IDs and definitions
4. `evidence/projects/INDEX.md` — resolve the target project(s)
5. The full target project file(s), including existing frontmatter and body

Then reply with a short ready-state:

- Target project ID(s) and current `annotation.status` / claim count
- Pinned `vocabulary_version` (default `1.0.0` when tagging against the current registry)
- Scope prompt: one project vs a batch; draft proposals only vs Scott-reviewed approvals

Do not start tagging until the target is clear.

## Goal

For each target project:

1. Capture atomic claims about Scott’s contribution (not INDEX themes alone)
2. Attach **approved** vocabulary `concept_ids` that the claim’s sources actually support
3. Record ownership, scope, delivery stage, provenance, limitations, and disclosure
4. Cite precise body anchors; keep unsupported ideas in `concept_proposals`
5. Leave review honest: agent proposals stay draft/`proposed` until Scott (or an explicit review pass he requests) approves

## Workflow

1. **Read the whole project** — Body, linked role/employer notes when needed, existing header. Prefer the account and artifacts over polished resume blurbs.
2. **Preserve or create the header** — Schema `1.1`. Never renumber existing claim IDs. Do not delete narrative beneath the frontmatter. Fill project-level fields (year/basis, links, `ranking_eligible`, disclosure) only from evidence already in the file or clearly stated by Scott.
3. **Extract claims** — One claim = one coherent action or result. Split materially different provenance or ownership. Preserve uncertainty in `limitations`. Use provenance `inferred` only for contextual leads; inferred claims never score as direct evidence.
4. **Map concepts** — For each claim, choose the most specific **approved** IDs from the pinned `vocabulary.yaml`. Read each concept’s definition and `evidence_rule` before assigning. Do not invent IDs. Do not treat aliases, parent concepts, or INDEX themes as automatic tags. Empty `concept_ids` is valid while draft.
5. **Propose gaps separately** — Missing meanings go in `concept_proposals` (`label`, `category`, `definition`, `reason`). Do not edit `vocabulary.yaml` in this skill unless Scott explicitly asks for a vocabulary revision (that is separate maintenance and a new version).
6. **Source anchors** — Every claim needs resolvable `sources` (`ref`, `locator`, `supports`). Prefer stable HTML anchors in the body when adding new claims. Existence of an artifact does not prove every outcome.
7. **Review state** — Default after an agent pass: project `annotation.status: draft` (or `needs_review` if reopening prior work); claim `review.status: proposed` with null reviewer/date. Set `approved` / project `reviewed` **only** when Scott explicitly confirms the annotation pass (record `reviewed_by` and ISO `reviewed_at`). Never fabricate Scott’s approval. Registry approval ≠ claim approval.
8. **Validate locally** — Concept IDs exist and are approved in the pinned version; enums match the header schema; IDs and links agree with the body; no job weights or match scores in the header.
9. **Report** — Per project: claims added/updated, concept IDs used, proposals, open limitations, review status. Remind: run **compress-to-contentful** when ready to publish (`matchingMetadata` + vocabulary). Do not run compress unless Scott asks.

### Batch mode

When annotating multiple projects, finish one project’s header coherently before the next. Prefer draft proposals for a full pass; escalate only unresolved factual ambiguities to Scott (2–4 questions max per project).

## Hard rules

- Stay inside `evidence/` (project files + matching docs). Do not push Contentful from this skill.
- Only approved vocabulary IDs in `concept_ids`. No fabricated local IDs.
- Do not invent metrics, dates, AI/Figma retrofit, production outcomes, or customer clearance.
- Do not add job-specific weights or match scores to headers.
- Do not rewrite project narratives into application copy; annotate what the sources support.
- Do not reuse retired S004 as a ranked project; honor `ranking_eligible` / umbrella exclusions.
- Distinguish matching `concept_ids` from Contentful `tags` in evidence-policy / compress.
- Never claim independent verification; “approved” means faithful to sources after review.

## Out of scope

- Creating projects, employers, or roles (add-project)
- Compress, apply, or push to Contentful (compress-to-contentful)
- Growing or versioning the vocabulary unless Scott explicitly requests it
- Implementing or running the job↔project ranker
- Auto-invoking from ambient chat without this skill
