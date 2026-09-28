---
name: Project presentation reference
overview: "Move the presentation relationship onto the project: each project optionally references its presentation entry, and the presentation no longer points back. Then republish the live entries so the five existing videos follow that link."
todos:
  - id: schema
    content: Move the link onto the project in schema.mjs and push presentations before projects.
    status: completed
  - id: compress
    content: Write presentation on the project payload and drop project from the presentation payload.
    status: completed
  - id: delivery
    content: Resolve the video from the project presentation link in delivery.
    status: completed
  - id: skills
    content: Update stub-project-presentation and compress-to-contentful so they keep the new direction.
    status: completed
  - id: publish
    content: Compress, apply, and push so the five live videos use the project reference.
    status: completed
isProject: false
---

# Project points at its presentation

The video stays on `jobzeugProjectPresentation` (`jz-S008-presentation`). The link moves. Today the presentation has a required `project` reference and the app joins on that. After this, the project has an optional `presentation` reference, and the app follows that.

```mermaid
flowchart LR
  project["jz-S008 project"] -->|"presentation"| presentation["jz-S008-presentation"]
  presentation -->|"video"| asset["Contentful asset"]
```

## Schema and payloads

In [`scripts/contentful/lib/schema.mjs`](scripts/contentful/lib/schema.mjs):

- Add optional `presentation` on `project`, a single entry link to `projectPresentation` (`S00x-presentation`).
- Remove `project` from `projectPresentation`.
- Put `projectPresentation` before `project` in `coreKinds`, so push creates the presentation before the project links to it.

In [`scripts/contentful/compress.mjs`](scripts/contentful/compress.mjs):

- `presentationFromMarkdown` stops writing `project`.
- When that function returns fields, the project payload includes `presentation: "S00x-presentation"`. Projects with a stub or no section omit the field (`compact` already drops empty values).

[`scripts/contentful/apply.mjs`](scripts/contentful/apply.mjs) already omits fields that leave the model, then publishes without them. Contentful will not omit `project` while it is required, so the omit step also sets `required: false` on fields being dropped.

## App join

In [`src/lib/contentful/delivery.ts`](src/lib/contentful/delivery.ts), index presentations by their own evidence id. A project gets a presentation only when its `presentation` link resolves to one of those entries. The catalog map stays keyed by project id, so [`src/lib/contentful/resume-model.ts`](src/lib/contentful/resume-model.ts) and the Details modal keep the same shape. A presentation that nothing points at does not appear.

## Skills

- [`.agents/skills/stub-project-presentation/SKILL.md`](.agents/skills/stub-project-presentation/SKILL.md): publishing the presentation is not enough. Also set `presentation` on the existing `jz-S00x` project entry. Stop requiring the presentation to point at the project.
- [`.agents/skills/compress-to-contentful/SKILL.md`](.agents/skills/compress-to-contentful/SKILL.md): note that a complete presentation is referenced from the project, and the presentation entry does not reference the project.

## Republish what is already live

Compress, apply, and push to `rtkhko6y3s3u` / `master-2026-09-20`. That drops `project` from the five presentation entries and sets `presentation` on `jz-S001`, `jz-S008`, `jz-S009`, `jz-S014`, and `jz-S031`. The other projects stay without that field. Resume summaries are copied as they are.
