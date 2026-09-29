---
name: Merge Berlin into ExO
overview: Rename Experience Orchestration to Experience Orchestration Research, fold the Berlin account into that project as the part where the research was shared, and remove Berlin from the resume.
todos:
  - id: fold-berlin
    content: Rename S025 to Experience Orchestration Research and add the Berlin account plus proposed S025-E008.
    status: completed
  - id: retire-s010
    content: Remove the S010 project file, fix index and cross-links, and retarget the vocabulary source path.
    status: completed
  - id: publish
    content: Push jz-S025 and jz-S009, then archive jz-S010.
    status: completed
isProject: false
---

# Merge Berlin into Experience Orchestration

Berlin ([evidence/projects/S010 - Berlin prototype exploration.md](evidence/projects/S010%20-%20Berlin%20prototype%20exploration.md)) is a separate ranked project. Its only claim is that Scott presented the S009 binding work to about two dozen people in a hackathon-like setting. Experience Orchestration is [evidence/projects/S025 - Experience Orchestration (ExO).md](evidence/projects/S025%20-%20Experience%20Orchestration%20%28ExO%29.md). The resume title comes from the heading, which is currently `Experience Orchestration (ExO)`.

## S025

- Set the YAML `title` and the `# S025:` heading to **Experience Orchestration Research**. Leave the filename as it is so existing links keep working.
- Leave the current resume summary. The Berlin telling is not finished.
- Copy the Berlin account into a new section on S025, including the hackathon-like setting, the audience of a couple dozen, the start-of-week presentation, and the other person’s end-of-week presentation. Label it as one part of this story: socializing the research and working with people. Keep the earlier sentence that the talk was the S009 binding work, so that fact is not dropped. Note that the rest of the Berlin account will be filled in later.
- Add **S025-E008** as `proposed` (not approved). Concept: `local:speaking`, which is already what S010-E001 uses. Ownership sole, provenance self-report. Limitations: event name and dates still unknown; reception is his recollection; the earlier account ties the talk to S009; he will round the story out later.

## Remove Berlin from the catalog

Follow the S004 retirement pattern so the project disappears from the resume and cannot be ranked:

- Delete [evidence/projects/S010 - Berlin prototype exploration.md](evidence/projects/S010%20-%20Berlin%20prototype%20exploration.md) after its text is on S025.
- Drop the S010 row from [evidence/projects/INDEX.md](evidence/projects/INDEX.md) and add a retired-ID note pointing at the new section. Update the S025 index label to the new title.
- Remove `S010` from S009 `related_project_ids`. A related id must exist or compress fails. Point the S009 and S008 prose links at the Berlin section on S025. Update the R001 and C001 mentions the same way.
- In [evidence/matching/vocabulary.yaml](evidence/matching/vocabulary.yaml), retarget `project_sources.S010` to the new S025 section. Leave the existing concept `basis.project_ids` that cite S010. No vocabulary version bump.

## Publish

- Compress, then update **jz-S025** (new title and matching header) and **jz-S009** (related id removed).
- Unpublish and archive **jz-S010** so delivery no longer returns it. Do not reuse the id.
