---
name: Seed project presentations
overview: Add a published placeholder presentation to each Contentful project that does not already link one. Existing presentations stay untouched, and the video field is left empty.
todos:
  - id: script
    content: Add scripts/contentful/seed-presentations.mjs with dry-run default and --write
    status: completed
  - id: dry-run
    content: Dry-run and confirm the 20 missing projects and placeholder fields
    status: completed
  - id: write
    content: Run --write, then re-list the space and confirm 20 new published links and the original 8 unchanged
    status: completed
isProject: false
---

# Seed missing project presentations

This is a one-off write to the Contentful space already configured in `.env` (`ta60irmk2wlj` / `master`). It does not change the resume app, the presentation editor, evidence markdown, or the compress/push pipeline.

## What is already in the space

`jobzeugProjectPresentation` is published. Each project has an optional `presentation` link to that type. Entry ids follow `jz-{evidenceId}` and `jz-{evidenceId}-presentation`.

Inventory just now: **28 projects, 8 already linked, 20 missing, 0 broken links.** All 20 missing projects are published with no unpublished edits.

Already linked (leave alone): S001, S002, S007, S008, S009, S014, S022, S031.

Missing a presentation:

- S003 AI Driven Demos - DemAI
- S005 State Farm Tokens
- S006 State Farm Figma Design System
- S011 Figma Design System Widget (personal)
- S012 Presentation Deck Widget (personal)
- S013 Contentful Content Type Widget (personal)
- S015 Understanding AI (article)
- S017 JSOnline Ad System Installation
- S018 Journal Interactive Advertiser Studio
- S019 Summit Design System
- S020 Summit Marketing Website Rebuild
- S021 Rates Central
- S023 AmFam R&D ListenAssist Prototypes
- S024 Loan Visualizer (LOUI)
- S025 Experience Orchestration Research
- S026 Summit Page Builder
- S027 AmFam Design System Guidance
- S028 Startup Design Consulting
- S029 Launch of a New Business
- S030 iPad Launch and Baseline Usability

## What each new presentation contains

Same placeholder on every new entry. No video asset.

- `evidenceId`: `{projectId}-presentation` (required)
- `blurb`: `Placeholder blurb.`
- `metricOneValue` / `metricOneLabel`: `—` / `Metric one`
- `metricTwoValue` / `metricTwoLabel`: `—` / `Metric two`

Those strings sit inside the editor limits in [src/lib/contentful/presentation-write.ts](src/lib/contentful/presentation-write.ts) (blurb 600, value 16, label 32), so they can be replaced later in Contentful.

## How it will be written

Add a one-off script next to the other CMA scripts, [scripts/contentful/seed-presentations.mjs](scripts/contentful/seed-presentations.mjs), using the same client and env loader as [scripts/contentful/cleanup-project-fields.mjs](scripts/contentful/cleanup-project-fields.mjs) (`CONTENTFUL_MANAGEMENT_TOKEN`).

For each `jobzeugProject` with no `presentation` link:

1. Skip if the project has unpublished changes, or if `jz-{id}-presentation` already exists.
2. Create and publish `jobzeugProjectPresentation` with id `jz-{evidenceId}-presentation`.
3. Set the project’s `presentation` field to that entry and publish the project.

Create and publish the presentation before linking it, so the project publish does not fail on an unpublished target. Re-read each project immediately before update so a concurrent edit aborts that entry.

Dry-run by default; `--write` performs the creates. After `--write`, list projects again and confirm the 20 new links resolve and the original 8 are unchanged.

Later `contentful:push` will not wipe these. [scripts/contentful/push.mjs](scripts/contentful/push.mjs) skips presentation entries and keeps a presentation link already on the project.