---
name: Leave presentations in Contentful
overview: Compress, apply, and push will stop writing the presentation content type. Existing Contentful presentations stay attached because project updates keep the link already on the entry.
todos:
  - id: compress-skip
    content: Stop compress from writing presentation JSON or a presentation link on projects
    status: completed
  - id: push-preserve
    content: Skip presentation entries on push and keep the project’s existing presentation link
    status: completed
  - id: apply-skip
    content: Skip jobzeugProjectPresentation in schema apply
    status: completed
  - id: skills
    content: Update compress, update-project, and stub-project-presentation skills
    status: completed
isProject: false
---

# Leave presentations in Contentful

You edit blurb, metrics, and video on `jobzeugProjectPresentation` in Contentful. Compress, apply, and push will not create or update that type. No new projects, so nothing needs a presentation created from markdown.

The project entry still gets pushed. Its `presentation` link is the only thing that attaches your Contentful entry. A project update that omits that link clears it. Push will copy the link already on the entry and will not send one from the repo, same pattern as the video field in [`scripts/contentful/push.mjs`](scripts/contentful/push.mjs).

## Pipeline

- [`scripts/contentful/compress.mjs`](scripts/contentful/compress.mjs): stop `compressPresentations`. Do not write `evidence/outputs/projectPresentations/`. Delete JSON files already in that folder so a later push cannot pick them up. Stop setting `presentation` on project output from the markdown section.
- [`scripts/contentful/push.mjs`](scripts/contentful/push.mjs): drop `projectPresentation` from the records that get upserted. On a project update, keep `existing.fields.presentation` and do not send a presentation link from the payload.
- [`scripts/contentful/apply.mjs`](scripts/contentful/apply.mjs): skip content type `jobzeugProjectPresentation` so a schema apply does not republish that model.

`presentationFromMarkdown` can stay in the file unused by compress. The app still reads presentations from Contentful.

## Skills

- [`compress-to-contentful`](.agents/skills/compress-to-contentful/SKILL.md): presentations are not compressed, applied, or pushed. The project link already in Contentful is kept.
- [`update-project`](.agents/skills/update-project/SKILL.md): remove the step that writes `## Presentation` and the `presentationFromMarkdown` check. Blurb, metrics, and video are edited in Contentful.
- [`stub-project-presentation`](.agents/skills/stub-project-presentation/SKILL.md): do not write a presentation section, do not write presentation JSON, and do not publish `jz-S00x-presentation`. Point at Contentful instead.
