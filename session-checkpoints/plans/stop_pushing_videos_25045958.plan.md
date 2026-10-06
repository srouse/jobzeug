---
name: Stop pushing videos
overview: Compress and push will stop writing presentation videos. The asset stays whatever you set in Contentful, and the repo will no longer treat a Video id as the source of truth.
todos:
  - id: compress-ignore-video
    content: Stop reading and writing presentation video ids in compress and the schema
    status: completed
  - id: push-preserve-video
    content: On presentation updates, keep the Contentful video field and never send one from the repo
    status: completed
  - id: skills-forget-video
    content: Update update-project and stub-project-presentation so agents do not manage Video asset ids
    status: completed
isProject: false
---

# Stop managing presentation videos

The last push replaced the video on each presentation with the asset id stored in Markdown. For Blueprints that was `2rAtcKDtRArNx6ZwePxW29` in [`evidence/outputs/projectPresentations/S001-presentation.json`](evidence/outputs/projectPresentations/S001-presentation.json), sent as an Asset link by [`payload()`](scripts/contentful/local.mjs) and written over the whole entry in [`upsertEntry()`](scripts/contentful/push.mjs).

This change does not recover the file you uploaded. After it lands, reattach that asset in Contentful. The next push will leave it there.

## What changes

- [`scripts/contentful/compress.mjs`](scripts/contentful/compress.mjs): a presentation is complete from the blurb and the two metric pairs. `Video:` is ignored. The JSON no longer has a `video` field. A blank `Video:` no longer drops the presentation.
- [`scripts/contentful/lib/schema.mjs`](scripts/contentful/lib/schema.mjs): `video` on `projectPresentation` becomes optional, so apply no longer requires an asset id to publish.
- [`scripts/contentful/push.mjs`](scripts/contentful/push.mjs): when updating a presentation, copy `existing.fields.video` through and never write a video from the repo. A new presentation is created without a video field.
- Skills that currently tell an agent to store and preserve a Contentful asset id: [`.agents/skills/update-project/SKILL.md`](.agents/skills/update-project/SKILL.md) and [`.agents/skills/stub-project-presentation/SKILL.md`](.agents/skills/stub-project-presentation/SKILL.md). They will say the video is edited only in Contentful, and a presentation publishes from blurb plus metrics.

The app already plays whatever asset is on the published entry (`assetFileUrl` in [`src/lib/contentful/delivery.ts`](src/lib/contentful/delivery.ts)). No player change.

Existing `Video:` lines in the project files can stay. They will not be pushed.
