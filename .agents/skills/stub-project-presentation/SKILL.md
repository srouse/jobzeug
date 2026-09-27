---
name: stub-project-presentation
description: >-
  Draft a first-pass Presentation section on an existing evidence project from
  the account already in the file. Use when the user invokes stub presentation
  or stub project presentation and points at an existing S00x. Writes a blurb
  and any metrics the file supports, keeps an existing video asset id, and
  publishes only that one presentation entry when the section is complete.
disable-model-invocation: true
---

# Stub project presentation

Draft a starting `## Presentation` section on one existing project file under `evidence/projects/`. Scott will rewrite it. The draft should be tangible: a blurb and metrics he can react to, drawn only from that file.

This is **not** add-project (do not create a project, employer, role, customer, or client). Do **not** run `contentful:compress`, `contentful:apply`, or `contentful:push`. Those rewrite or republish the whole catalog. Do **not** invent a video asset id, upload a video, or generate one.

Publish this one presentation only when the blurb, both metric pairs, and `Video:` are all filled. A blank `Video:` stays a stub, so the resume shows no play control until Scott pastes a Contentful asset id. Keep an asset id that is already on the section. Never add one that is not.

## Immediate context load

Before editing, read (paths from repo root):

1. `evidence/projects/INDEX.md` — confirm the target `S00x` exists
2. The full target project file

Then confirm the target id in one line. If the id is missing, say it is not on file and stop. Do not create a project file.

If `## Presentation` already exists:

- Still a stub (any `REPLACE`, or the blank template): replace that section in place.
- Already Scott's copy (no `REPLACE`): stop and say so. Do not overwrite unless he explicitly says to.

## What to write

Use this shape. Put a new section at the end of the file. When replacing a stub, replace only the Presentation block and leave every later section where it is.

```markdown
## Presentation

Blurb: <one paragraph, 280 characters or fewer>

Video:

- value: <16 characters or fewer>
  label: <32 characters or fewer>
- value: <16 characters or fewer>
  label: <32 characters or fewer>
```

If the existing section has a Contentful asset id on `Video:`, copy it through. Otherwise leave `Video:` empty. An asset id matches `^[A-Za-z0-9]+$`. A URL is not an asset id — do not publish it.

### Blurb

Write the line Scott would put under the video. Use the account, the resume summary, and approved evidence in this file. First person, matching the resume summary when that section exists. One paragraph, 280 characters or fewer.

Stay inside what the file already says. Do not pull in facts from memory, other projects, or the follow-up queue. If the file says a result is unconfirmed, do not state it as done.

### Metrics

The modal shows each value large and each label small. Pick two pairs that are already in the file: a quantity, a short claim, or a phrase Scott used.

- Value: 16 characters or fewer. Label: 32 characters or fewer.
- A pair you cannot ground stays `REPLACE` on both `value` and `label`. Say why in the reply.
- Do not invent a second number to fill the slot. Missing adoption, install, or impact figures stay missing.

### Leave the rest alone

Do not change matching YAML, the resume connection, or any other section.

## Publish this entry only

After the markdown is saved, read it back with `presentationFromMarkdown` from `scripts/contentful/compress.mjs`.

- It returns null while any field is blank or `REPLACE`. Do not publish. Say which field blocked it.
- When it returns fields, write only `evidence/outputs/projectPresentations/<evidenceId>.json` with that object. Do not delete other files in that directory.

Then upsert and publish only `jz-<evidenceId>` (`jobzeugProjectPresentation`) with `upsertEntry` from `scripts/contentful/push.mjs`. Pass one record: `{ key: evidenceId, kind: 'projectPresentation', fields, tags: [] }`. Use `requireContentfulEnv` and a Contentful management client. Do not call `pushCore`, `loadCoreOutputs`, or `ensureTags`.

If `.env` is missing `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT`, or `CONTENTFUL_MANAGEMENT_TOKEN`, stop and say so. Do not claim the entry was published.

The linked project entry `jz-<S00x>` must already exist. This step does not create or update the project.

## Reply

After writing, tell Scott:

- The blurb, in a sentence, and where it came from
- Each metric and the line in the file that supports it
- Which pairs stayed `REPLACE`, and why
- Whether `jz-<S00x>-presentation` was published, and the space/environment, or why it was not
