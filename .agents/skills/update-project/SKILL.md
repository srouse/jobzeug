---
name: update-project
description: >-
  Update an existing evidence project from a new telling, transcript, or video
  so it can match any posting. Saves the source intact, rewrites the employer
  line, refreshes claims, attaches a video when one is given, and adds missing
  vocabulary as a new approved version. Use when the user invokes update-project,
  or brings a video, transcript, or further account for an existing S00x.
disable-model-invocation: true
---

# Update project

Bring one existing project (`S00x`) to the strongest honest record the new material supports. The project file stays the focused summary. The source file stays what Scott said. The claims and the vocabulary are what make it match a posting.

This is **not** add-project (do not create an S/C/R record). This is **not** compress-to-contentful (do not compress, apply, or push). This is **not** annotate-project alone: that skill only tags a project whose account is already in the file, and it leaves new meanings as proposals.

Invoking this skill is Scott's request to add a missing meaning to the vocabulary when the source supports it. That request covers definitions only. It does not approve the project's claims.

## Immediate context load

Before editing, read (paths from repo root):

1. `evidence/matching/engine.md` — vocabulary versioning and scoring boundaries
2. `evidence/matching/project-header-schema.md` — header and claim contract
3. `evidence/matching/vocabulary.yaml` — approved concept IDs, definitions, and `evidence_rule`s
4. `evidence/projects/INDEX.md` — confirm the target exists
5. The full target project file, including the header and every linked source it names
6. `evidence/projects/S014 - Design tokens Contentful blog.md` and `evidence/projects/S009 - AI binding research.md` — the shape of a walkthrough addition, a presentation, and claims that cite a source file

Then reply with a short ready-state:

- Target `S00x`, `annotation.status`, claim count, pinned `vocabulary_version`
- Whether he gave a video asset id, a transcript, or a spoken account
- One line: what this pass will add

If the id is not on file, stop. Do not create a project.

## Order of work

Do these in one turn. Do not stop after the source file.

### 1. Save the source

Follow **add-project**'s source-record rule.

- A subtitle export, transcript, pasted account, or narration: save it intact under `evidence/sources/`. Keep his words, repeats, false starts, and caption errors. A paraphrase is not the source. Convert the format if needed and do not drop lines. Name it `s00x-<slug>-YYYY-MM-DD.md`.
- Index it in `evidence/sources/INDEX.md`.
- Link it from the project's resume connection. One link is enough.
- If the raw telling was never saved and only a summary remains, say that. Do not invent a transcript.

### 2. Update the focused project

Add a dated `## Addition` that summarizes the new material. Do not paste the source into the body. Do not delete older additions.

Remove a section that frames the project as preparation for one employer role, when this pass is touching that file. Do not replace it with another employer pitch. Figma, Contentful, and other tools stay only where the work used them.

Adjust that project's themes cell in `evidence/projects/INDEX.md` so a posting about the new work can find it. Themes are routing labels grounded in the file, not new claims.

### 3. Rewrite the employer line

`## Resume summary` is what an employer reads above the Details button. Compress only copies it.

Two sentences, first person, under 280 characters. Voice is Scott's Contentful articles (S014, S015, S016): a concrete thing he did, the mechanism in plain words.

- Sentence one: what he did, specific enough that a stranger understands the work.
- Sentence two: the sharp result or limit. When the project has a video, that sentence is the reason to open it. Do not say "click" or "watch."
- Stay inside the file and the new source. No new metrics. No capture voice ("Scott describes", "the learnings are real", "innovation prototype").

### 4. Video

When he gives a Contentful asset id (`^[A-Za-z0-9]+$`), put it on `Video:`. A URL is not an asset id. Never invent an id. Keep an id already on the section if he does not replace it.

Use this shape. Metrics stay inside the section, before the next heading.

```markdown
## Presentation

Blurb: <one paragraph, 280 characters or fewer>

Video: <asset id, or empty>

- value: <16 characters or fewer>
  label: <32 characters or fewer>
- value: <16 characters or fewer>
  label: <32 characters or fewer>
```

The blurb is first person and matches the employer line. Both metric pairs must already be in the file or the new source. An unconfirmed rank stays labeled as his account. A pair you cannot ground stays `REPLACE` on both lines. A blank `Video:` or any `REPLACE` leaves the presentation a stub, so the resume shows no play control.

### 5. Claims

Use **annotate-project**'s claim rules. Read each concept's definition and `evidence_rule` before assigning it.

- Never renumber an existing claim. Leave an approved claim's review status. Add new claims as `proposed`, with null reviewer and date.
- One claim is one coherent action or result. Put the concepts that belong to that action on that claim. Scoring uses the single best claim per job line, so splitting one action across claims weakens the match. Do not copy the same tag onto every claim.
- Cite the intact source (`ref`, `locator`, `supports`). A timestamp or a short quote from that file is the locator.
- Sole ownership, individual scope, and the delivery stage the file already supports, unless the new source says otherwise. `self_report` for his account. `existing_material` only for a published artifact. `inferred` does not score.
- `public_disclosure: needs_review` unless the file already cleared it.
- Limitations stay on the claim: his judgment, no benchmark, unshipped, no names, caption errors, agreements not inspected.
- Do not use `local:product-strategy` or `local:product-direction-influence` without a roadmap he owns or a recorded decision. Do not use `local:public-technical-presentation` for an audience inside the company. Do not use `local:technical-discovery` for anything other than customer discovery. Do not use `local:figma-extension` unless this project is the widget. Initiative and other work-style labels are not concepts and do not score.

### 6. Vocabulary

After the claims, list every meaning the new source supports that no approved concept covers. Read the registry before deciding. A synonym of an existing concept is not a new concept. Writing about a system is not the same concept as building that system when the `evidence_rule` says so.

When the list is empty, say so and leave `vocabulary.yaml` alone.

When it is not empty, add those concepts to `evidence/matching/vocabulary.yaml` and bump `vocabulary_version` to the next minor version (read the current version; do not hardcode it). This skill is the request. Record that on the file's top-level `review` and on each new concept: `reviewed_by: Scott`, today's date, scope that the concept was added at his request. Definitions only. This does not approve claims.

Each new concept needs `id` (`local:<slug>`), `label`, `definition`, `category`, `aliases`, `status: approved`, `broader_ids`, `external_mappings`, `evidence_rule`, and `basis.project_ids` set to this project. Leave `external_mappings` empty. Do not invent an O*NET id from memory.

The repo keeps one registry file. Compress checks every project against that version, so set `annotation.vocabulary_version` to the new version on every project header. Do not rewrite anyone else's claims or review status.

Clear a promoted idea off this project's `concept_proposals`. Attach the new id on the claim the source supports.

### 7. Validate

Run `parseProjectHeader` from `scripts/contentful/matching/load-inputs.mjs` on the project. If the vocabulary changed, run `loadMatchingInputs` so every pinned header still validates. If the presentation is complete, run `presentationFromMarkdown` from `scripts/contentful/compress.mjs` and confirm it returns fields.

Do not compress or push. Tell Scott to run **compress-to-contentful** when he wants the app to show the line, the video, and the new tags.

## Report

- Source file path, and that it was not rewritten into the project
- Employer line, in one sentence
- Claims added or retagged, with concept IDs. Approved claims left alone.
- Vocabulary: none, or the new version and the new ids
- Video asset id, or that the presentation is still a stub and which field blocked it
- Limitations still open

## Hard rules

- Stay inside `evidence/` except the validation commands above
- The project file stays focused. The source file stays what he said
- Do not invent metrics, dates, customer clearance, or a transcript from a summary
- Do not retrofit AI or Figma into older work the source does not support
- Do not surface Aha Notes; never reuse C005 or R008
- New claims stay `proposed`. Do not fabricate his approval of a claim
- Do not run compress, apply, or push from this skill

## Out of scope

- Creating a project, employer, or role (add-project)
- Index-only routing across the whole graph (harden-evidence)
- A tags-only pass when the account is already saved and no vocabulary change is wanted (annotate-project)
- Compress, apply, or push (compress-to-contentful)
- Auto-invoking from ambient chat without this skill
