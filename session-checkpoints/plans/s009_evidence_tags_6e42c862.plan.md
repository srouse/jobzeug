---
name: S009 evidence tags
overview: Keep S009 a focused project that can match any posting. Save this new account as its own source, drop the Figma-role frame, add the claims, and publish the new tags in vocabulary 1.2.0 so they can match.
todos:
  - id: save-account
    content: Save this September 28 account intact under evidence/sources and link it from S009. Do not rewrite the walkthrough transcript.
    status: completed
  - id: drop-figma-role
    content: Remove the Potential relevance to Figma role section and any wording that treats S009 as a Figma-application piece.
    status: completed
  - id: retag-existing
    content: Add figma, contentful, and troubleshooting to the existing proposed claims where the transcript supports them.
    status: completed
  - id: new-claims
    content: Add claims for the diagnosis, the solved approach, the Mastra/OpenAI build, internal sharing, and the larger metadata blocker.
    status: completed
  - id: vocabulary
    content: Add the four new concepts to vocabulary.yaml as approved 1.2.0 and pin every project header to that version.
    status: completed
  - id: index
    content: Adjust the S009 index themes so they route to any posting, not a Figma role.
    status: completed
isProject: false
---

# Fill out S009 for any posting

S009 is a focused project record used to judge fit against whatever posting is loaded. It is not a Figma-role brief. Figma and Contentful stay in the record only where the work actually used them.

Two sources, kept intact:

- The walkthrough transcript, [evidence/sources/s009-ai-binding-walkthrough-2026-09-28.md](evidence/sources/s009-ai-binding-walkthrough-2026-09-28.md). Do not rewrite it.
- This September 28 account (solved it, shared it inside the company, could not ship it, Mastra and OpenAI). Save his words as a new file under `evidence/sources/`, index it, and link it from [evidence/projects/S009 - AI binding research.md](evidence/projects/S009 - AI binding research.md). The project summarizes. The source file is what a later pass rereads.

Scoring uses the best single claim on a project for each job line (`bestClaimForLine` in [src/lib/matching/score.ts](src/lib/matching/score.ts)). Tags only help a line when they sit together on that claim. Proposed claims still score.

Leave approved claims E001 and E002 as they are.

## Drop the Figma-role frame

Delete the section **Potential relevance to Figma role** in the project file. Do not replace it with another employer-specific pitch. The claims and the vocabulary are what make the project match a posting. Candidate uses can stay generic: interview and portfolio material about making binding dependable, still labeled unshipped.

## Tags on claims already drafted

- **E003** (natural size, transcript `0:01:23` and `0:02:12`): add `local:figma`, `local:contentful`, `local:troubleshooting`, `local:example-derived-content-fit`.
- **E004** (challenge vs outcome, `0:02:40`): add `local:figma`.
- **E005** (raw JSON, `0:03:49`): add `local:contentful`.

## New claims

All `proposed`, sole ownership, individual scope, prototype, `self_report`, disclosure `needs_review`. Cite the transcript or the new source file. Do not paste either source into the project body.

From the transcript:

- **S009-E006** — Diagnosed the failure. Name-to-title and bio-versus-short-bio stayed unpredictable because the inputs were too thin (`0:00:39` through `0:01:23`). Tags: `local:troubleshooting`, `local:critical-thinking`, `local:ai-system-fundamentals`, `local:ai-output-evaluation`.
- **S009-E009** — Stated the split. A content entry and a component are separate structures whose names do not match, so they have to be mapped (`0:00:15` through `0:00:38`). Tags: `local:content-component-binding`, `local:headless-content-management`, `local:contentful`, `local:figma`, `local:systems-analysis`. Do not tag `local:figma-extension`; the widget is S008.

From this account:

- **S009-E010** — Solved the binding approach himself. The research reached a working approach. Tags: `local:content-component-binding`, `local:troubleshooting`, `local:ai-workflow-engineering`, `local:critical-thinking`. Limitation: "solved" is his judgment. No benchmark, and it is not shipped.
- **S009-E011** — Built it. He programmed the agent with Mastra, OpenAI, and LLMs. Tags: `local:programming`, `local:ai-workflow-engineering`, `local:mastra`, `local:openai`, `local:ai-system-fundamentals`. Limitation: model names beyond OpenAI, and the code, are not in a source file yet.
- **S009-E012** — Shared it inside the company, many times. Other people took the research and ran with it. Tags: `local:speaking`, `local:cross-functional-work`. Limitation: no names, dates, or artifacts of what those people shipped. Do not use `local:public-technical-presentation` (that concept is an audience outside the company). Do not use `local:product-direction-influence` (no recorded product decision).
- **S009-E007** — Could not execute the ship. There was no acceptable place to store the metadata. The widget-only path was too narrow. He turned the research into actionable items for larger conversations about metadata storage, content types, and components. He still intends to bring it into the Contentful for Figma widget after that larger storage problem is solved. Tags: `local:semantic-metadata-design`, `local:binding-repair`, `local:systems-analysis`, `local:content-modeling`, `local:decision-making`. Limitations: good and bad storage places are his judgment; the agreements are not inspected; the widget integration is a plan, not a result. Healing after either side changes stays the expected consequence from the transcript (`0:04:23`), not a logged repair.

**S009-E008** — Unshipped prototype. Tags: `local:prototyping`, `local:technical-prototype`.

## Tags that do not fit

`local:product-strategy` and `local:product-direction-influence` need a roadmap he owns or a recorded decision. He influenced conversations; that is E012. `local:technical-discovery` is customer discovery. `local:interaction-design` is a person acting on an interface. Initiative is not a vocabulary concept, and the matching rules keep personality and work-style labels out of project scores. Problem solving is already `local:troubleshooting` and `local:critical-thinking`. Communication inside the company is `local:speaking`.

## New vocabulary, version 1.2.0

Add these to [evidence/matching/vocabulary.yaml](evidence/matching/vocabulary.yaml) as approved concepts and set `vocabulary_version` to `1.2.0`. Scott asked for this on September 28, 2026. Record that on the file's review note. Definitions only. This does not approve the S009 claims.

The repo keeps one registry file. Compress checks every project against that version, so pin `annotation.vocabulary_version` to `1.2.0` on every project header. Do not rewrite anyone else's claims.

- `local:example-derived-content-fit` (skill). Everyday size taken from real entries and component instances, distinct from a declared maximum or a field name.
- `local:binding-repair` (work activity). Updating content-to-component mappings after one side changes, using stored metadata instead of deriving every binding again.
- `local:content-component-binding` (skill). Mapping structured content fields onto component properties when the names differ.
- `local:openai` (tool). The OpenAI API used to run model calls. Mastra stays `local:mastra`. LLMs as a class stay `local:ai-system-fundamentals`.

Clear these off S009 `concept_proposals` once the IDs exist. Attach them on the claims named above.

## Index

Update the S009 themes cell in [evidence/projects/INDEX.md](evidence/projects/INDEX.md) so it can route a posting that asks for AI agents, programming, metadata, content modeling, or internal technical communication. Mention the unshipped widget plan and the company conversations. Do not describe it as preparation for a Figma role.
