---
schema_version: "1.1"
project_id: S002
title: Contentful Bulk Edit App
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S003
role_links:
  - id: R002
    relationship: delivery
    status: confirmed
    note: The September 28 recording and the September 29 transcript name this work as done
      while he was a solutions specialist.
employer_links:
  - id: C001
    relationship: delivery
    status: confirmed
    note: Employer association recorded in the project account.
customer_ids:
  - CU001
  - CU002
client_ids: []
year: 2025
year_basis: estimated
year_note: Estimated as 2025 within R002 (February 2025–early 2026, with conflicting end-date
  sources); not an exact project date.
delivery_stage: mixed
annotation:
  status: reviewed
  vocabulary_version: "1.10.0"
  reviewed_by: Scott
  reviewed_at: "2026-09-28"
public_disclosure: restricted
evidence:
  - id: S002-E001
    statement: Designed and built tailored bulk-content-editing prototypes and presented them to two
      prospective customer audiences.
    concept_ids:
      - local:prototyping
      - local:technical-prototype
      - local:interaction-design
      - local:customer-demonstration
      - local:customer-facing-work
      - local:contentful
      - local:deadline-pressure
      - local:solution-specialist
    ownership: contributor
    scope: external_audience
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Designed and built tailored bulk-content-editing prototypes and presented them to two
          prospective customer audiences.
    limitations:
      - Customer identities are not cleared for public use.
      - Exact stack and division of later implementation are unresolved.
    public_disclosure: restricted
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S002-E002
    statement: Added contextual AI chat and integrated Contentful semantic search to explore where
      content changes might be needed.
    concept_ids:
      - local:semantic-search-integration
      - local:interaction-design
      - local:contentful
      - local:solution-specialist
    ownership: contributor
    scope: external_audience
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Added contextual AI chat and integrated Contentful semantic search to explore where
          content changes might be needed.
    limitations:
      - Model/provider and execution safeguards are not recorded; do not infer autonomous publishing.
    public_disclosure: restricted
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S002-E003
    statement: After ecosystem-team handoff, returned to fix bugs and add requested object filtering;
      Scott reports the app reached production.
    concept_ids:
      - local:troubleshooting
      - local:programming
      - local:production-release
      - local:solution-specialist
    ownership: contributor
    scope: multiple_teams
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: After ecosystem-team handoff, returned to fix bugs and add requested object filtering;
          Scott reports the app reached production.
    limitations:
      - Intermediate version was built by the ecosystem team; boundaries of original versus
        rewritten code remain unclear.
      - Production status is self-reported.
      - The September 28 recording shows the store app and says he contributed the shared-reference
        filter directly. That may be this object-filtering work. S002-E005 carries that recording.
    public_disclosure: restricted
    review:
      status: needs_review
      reviewed_by: null
      reviewed_at: null
  - id: S002-E004
    statement: Reports that both sales associated with his prototype presentations closed.
    concept_ids:
      - local:sales-contribution
      - local:solution-specialist
    ownership: contributor
    scope: external_audience
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Reports that both sales associated with his prototype presentations closed.
    limitations:
      - Association does not establish sole sales causation.
      - ARR attribution and popularity rankings remain unverified and are not part of this claim.
    public_disclosure: restricted
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S002-E005
    statement: Shows the App Store Bulk Edit grid, where a direct edit updates more than one
      entry at once, and says he contributed the filter for entries that share a reference.
    concept_ids:
      - local:interaction-design
      - local:front-end-development
      - local:programming
      - local:contentful
      - local:solution-specialist
    ownership: contributor
    scope: multiple_teams
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "../sources/s002-bulk-edit-walkthrough-2026-09-28.md"
        locator: "0:01:30 and 0:01:48"
        supports: A direct edit updates more than one entry at once. Filtering by the same
          reference was difficult to implement, and he says he contributed to it directly.
    limitations:
      - The recording shows the store app. He says it is not far from his first build. The
        earlier account still has the ecosystem team building a version between those.
      - The reference-filter contribution is his statement. The code was not inspected.
      - The apartment-price example is a hypothetical in the recording, not a named customer.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S002-E006
    statement: About a month after the first build, added an AI field on the right that found
      entries to change together, and says that pitch closed a second deal.
    concept_ids:
      - local:interaction-design
      - local:contentful
      - local:customer-demonstration
      - local:solution-specialist
    ownership: contributor
    scope: external_audience
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s002-bulk-edit-walkthrough-2026-09-28.md"
        locator: "0:02:04 and 0:02:19"
        supports: About a month later he added an AI field on the right and used it to find
          entries, including a product rename, before the app was in the store.
    limitations:
      - The recording does not show the AI field. It does not name a model or say semantic search.
      - The closed second deal is his account. It does not establish that he closed every
        solution-specialist sale.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S002-E007
    statement: Helped guide Bulk Edit into the Contentful App Store.
    concept_ids:
      - local:production-release
      - local:coordination
      - local:solution-specialist
    ownership: contributor
    scope: multiple_teams
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "../sources/s002-bulk-edit-walkthrough-2026-09-28.md"
        locator: "0:02:46"
        supports: He says he helped guide Bulk Edit into the app store.
    limitations:
      - Guiding it in is his account. The recording does not name who else published it.
      - He calls it the most popular app in the store. No ranking source is in the file.
      - The October 6 script says one of the more popular apps in the marketplace, if not the
        most popular.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S002-E008
    statement: Built a day-or-two prototype so a condo prospect could find dozens of entries
      that share an attribute, such as square footage, and set one value, such as price,
      across them.
    concept_ids:
      - local:bulk-content-editing
      - local:prototyping
      - local:technical-prototype
      - local:interaction-design
      - local:contentful
      - local:customer-facing-work
      - local:solution-specialist
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s002-bulk-edit-how-i-built-2026-09-29.md"
        locator: "0:00:08 and 0:00:26"
        supports: He says he built the prototype in a day or two, as a solutions specialist,
          for a prospect selling condos who needed Excel-like updates across many entries.
    limitations:
      - This recording does not name the prospect. An earlier account names a customer that
        is not cleared for public use.
      - His "day or two" timing has no build log in the file.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S002-E009
    statement: For the second prospect, embedded the DemAI interface in his own Bulk Edit
      build, not the marketplace app, and wrote a few AI functions that find entries and
      propose edits a person can accept or decline, one entry at a time or across the set.
    concept_ids:
      - local:bulk-content-editing
      - local:ai-workflow-engineering
      - local:ai-edit-approval
      - local:prototyping
      - local:technical-prototype
      - local:interaction-design
      - local:customer-demonstration
      - local:contentful
      - local:solution-specialist
    ownership: sole
    scope: individual
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "../sources/s002-bulk-edit-how-i-built-2026-09-29.md"
        locator: "0:00:42, 0:01:20, 0:01:38, 0:02:18, and 0:03:40"
        supports: He embeds the DemAI interface, creates two or three AI functions, shows
          accept or decline on a Fuel-to-Fire rename, and says references work too.
    limitations:
      - The caption says Demi, DIMI, and Falk edit. The project on file for that interface
        is DemAI. The code was not inspected.
      - The prompt says "track fuel." He does not say semantic search, and he does not name
        a model. An earlier account names a customer that is not cleared for public use.
      - He says this build is not the marketplace app, and that at scale it has to work
        differently. He declines one proposed edit in the demo.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S002-E010
    statement: Helped move Bulk Edit into production and says he shaped the final version that
      exists today.
    concept_ids:
      - local:production-release
      - local:contentful
      - local:solution-specialist
    ownership: contributor
    scope: multiple_teams
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "../sources/s002-bulk-edits-2026-10-06.md"
        locator: "0:00:44"
        supports: He says he created and presented the original demo, helped move the concept
          into production, and shaped the final version that exists today.
    limitations:
      - His account. He does not name who else published it.
      - The walkthrough in the same script is his own build, not the marketplace app.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S002-E011
    statement: Says Bulk Edit became one of the more popular apps in the Contentful marketplace,
      if not the most popular.
    concept_ids:
      - local:marketplace-popularity
      - local:contentful
    ownership: contributor
    scope: external_audience
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "../sources/s002-bulk-edits-2026-10-06.md"
        locator: "0:00:39"
        supports: He says it went on to become one of the more popular Contentful applications
          in the marketplace, if not the most popular.
    limitations:
      - His account. No ranking source, install count, or revenue figure is in the file.
      - This telling hedges the earlier "most popular" line.
      - The rank does not establish that he caused it.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
concept_proposals: []
---
# S002: Contentful Bulk Edit App

Captured: September 20, 2026
Status: Expanded account; images promised; strong outcome claims still account-only pending artifacts
Evidence: Scott's direct account, not yet supported by inspected artifacts

## Resume connection

- Role record: [R002 — Solution Specialist](../roles/R002-contentful-solution-specialist.md). The September 28 recording says he built this as a solution specialist. Earlier notes also called the period SE work.
- Employer: [C001 Contentful](../employers/C001-contentful.md)
- Role: SE / Solution Specialist period (source dates unresolved across Jan 2026 / Feb 2026 / Present).
- Project dates: Not yet provided. Do not infer from role dates.
- Collaborators: Contentful ecosystem team (handoff recipients who built a crude version Scott later cleaned up). Names and titles unknown.
- Customers: [CU001 Tri Pointe Homes](../customers/CU001-tri-pointe-homes.md) (V1); [CU002 Trek](../customers/CU002-trek.md) (V2). Scott reports both related sales closed. **Public disclosure not cleared** — do not use these names in application copy until cleared.
- Walkthrough transcript, kept separate: [S002 walkthrough, September 28, 2026](../sources/s002-bulk-edit-walkthrough-2026-09-28.md). Open it for the spoken detail. Do not treat it as the project account.
- Later transcript, kept separate: [How I built Bulk Edit, September 29, 2026](../sources/s002-bulk-edit-how-i-built-2026-09-29.md). Open it for the DemAI workbench. Do not treat it as the project account.
- October 6 script, kept separate: [Bulk Edits, October 6, 2026](../sources/s002-bulk-edits-2026-10-06.md). Open it for the later telling. Do not treat it as the project account.

## Resume summary

I created Bulk Edit, an AI-powered Contentful app for updating content at scale that became the most popular app in the Contentful marketplace and helped close two prospects. I guided the concept from a customer demo into production and the marketplace, and extended it with AI that turns plain-language requests into proposed edits across content. Every proposed change is visible and easy to accept or reject individually or in bulk, keeping users in control.

## Presentation

Blurb: I created Bulk Edit, an AI-powered Contentful app for updating content at scale that became the most popular app in the Contentful marketplace and helped close two prospects. I guided the concept from a customer demo into production and the marketplace, and extended it with AI that turns plain-language requests into proposed edits across content. Every proposed change is visible and easy to accept or reject individually or in bulk, keeping users in control.

- value: Couple of days
  label: Workable prototype
- value: App Store
  label: Guided the public app

## Account summary

<a id="source-account"></a>

Scott describes a recurring pattern from his SE work: a last-minute request arrives, and within two or three days he builds an almost-functional prototype that he personally presents.

Bulk Editor was one of those prototypes. It addressed long-standing customer desire for managing content from a more holistic perspective—something people had asked for for years, but that Scott says no one had really taken the effort to figure out how it should work. He characterizes the end experience as essentially looking like Excel.

**V1 (Tri Pointe Homes / CU001):** A different way of viewing all content—content types listed on the left, content on the right—with filtering by objects as well as by strings. Scott says he will have images for this. First presentation audience; related sale closed (Scott’s account).

**V2 (Trek / CU002):** Same surface plus an AI chat on the right that knew enough about the current context to support looser filtering and content changes. In Scott’s demo, he said something like a product had changed from name A to name B; with semantic search in Contentful, the system could find areas that would potentially need to change. He describes it as a powerful way to walk across all the content and give a robust vision of how things would change. Second presentation audience; related sale closed (Scott’s account).

**Handoff and production (Scott’s account, September 20, 2026 addition):** He handed the work to the ecosystem team. They produced a crude version; he returned, cleaned it up, fixed many of their bugs, and added object filtering—the capability the customer had asked for. He says both sales he pitched for this closed. He says it went into production, is the highest-performing / most popular Contentful app they have, and is connected to millions in annual recurring revenue. Treat popularity and ARR figures as Scott’s account only until independently supported (dashboard, internal report, or other artifact).

## Useful original wording

> “someone would ask a last minute kind of request and within two or three days, I would put together a specific, almost functional prototype that I could then present”

> “managing content from more holistic perspective”

> “Something that people have asked for for years but no one ever really took the effort to kind of figure out how it works”

> “it essentially looked like Excel at the end of the day”

> “Oh, this product has changed from name A to name B.”

> “because we were using semantic search within Contentful as well, we could find all those areas that would potentially need to change”

> “It was a really powerful, really interesting way to walk across all the content, but also give people a really nice, robust vision of how things would change.”

> “the highest performing contentful app that we have, the most popular one”

> “connected to millions in annual sales, annual recurring revenue”

## Workflow as described

1. Last-minute customer or internal request arrives.
2. Scott builds an almost-functional prototype in roughly two to three days and personally presents it.
3. **V1 UI (Tri Pointe):** content types on the left; content on the right; filter by objects and by strings (spreadsheet-like holistic view).
4. **V2 (Trek):** adds AI chat on the right with context awareness; supports looser filtering and content changes; uses Contentful semantic search to locate related places to update (e.g. rename A → B); presents a vision/preview of change impact.
5. Hand off to ecosystem team → crude production-oriented version.
6. Scott returns: bug fixes, cleanup, adds object filtering requested by customer.
7. Scott reports both pitched sales closed; app reaches production and (per Scott) becomes top-performing Contentful app with material ARR connection.

Stack, APIs, AI model/provider, preview implementation, and how ARR is attributed remain undescribed.

## Ownership and scope

- Scott: initial prototypes, customer presentations/pitches, later cleanup/bugfix, object filtering.
- Ecosystem team: intermediate crude version after handoff.
- Boundary between Scott’s original code and the ecosystem rewrite is unclear.
- Named customers: Tri Pointe Homes (CU001), Trek (CU002); disclosure not cleared for public copy.
- Public Marketplace vs internal app naming not yet stated.

## Follow-up queue

- Project dates are still not provided. The role link is confirmed as solutions specialist from the September 28 and September 29 recordings.
- Official app name / Marketplace listing; where images and a running build live.
- What stack did V1/V2 and the ecosystem version use? What did the AI chat call, and how were updates previewed vs committed?
- How is “highest performing / most popular” and “millions in ARR” measured and attributed to this app? Any citable source?
- Who on the ecosystem team, and what remained Scott’s code vs theirs?
- Clear public disclosure for CU001 / CU002 if names may appear in application materials.

## Candidate uses

Strong portfolio/resume candidate for customer prototyping → production app, AI-assisted content operations, and sales-engineering impact—once images and outcome evidence are attached. Do not put ARR into polished application copy until attribution is clear. The stage summary uses his requested “most popular” line. The October 6 script hedges that to one of the more popular, if not the most popular. Do not name Tri Pointe or Trek in public materials until disclosure is cleared. DemAI stays its own project. The September 29 transcript and the October 6 script embed that interface in a Bulk Edit build that is not the marketplace app.

## Addition — September 20, 2026

Scott expanded V1 vs V2 UI/behavior, semantic-search rename demo, ecosystem handoff and his return for cleanup/object filtering, closed sales, production status, and popularity/ARR claims. Images still pending from Scott.

## Addition — September 20, 2026 (customers)

Scott named the two closed-sale audiences: Tri Pointe Homes (V1) and Trek (V2). Linked to [CU001](../customers/CU001-tri-pointe-homes.md) and [CU002](../customers/CU002-trek.md) with researched org records; disclosure not cleared.

## Addition — September 28, 2026

The [walkthrough](../sources/s002-bulk-edit-walkthrough-2026-09-28.md) is him on the App Store app. He calls the role solution specialist and the request a way to change many entries at once, closer to Excel than Contentful’s default list. A couple of days produced a workable build. He says the store version is not far from that first build. On screen, a direct edit updates two entries together, and he says he contributed the filter for entries that share a reference. About a month later, before the store release, he added an AI field on the right and says that pitch closed a second deal. The recording does not show that field and does not say semantic search. He says he helped guide the app into the store and that it is the most popular app there. That popularity line, and the line that he closed every solution-specialist sale, stay his account. Customer names stay off the recording.

## Addition — September 29, 2026

The [September 29 transcript](../sources/s002-bulk-edit-how-i-built-2026-09-29.md) is a different telling. He says Bulk Edit is the most popular app in the marketplace, that he built the first prototype in a day or two, and that he demonstrated it to two prospects and both deals closed. He calls the role solutions specialist: he came in after the initial demo, alongside solution engineers, to build a more specialized version. The prospect was selling condos. Prices changed often. They needed dozens of entries that share an attribute, such as square footage, updated to one value, such as price, closer to Excel than a content list.

What he shows is the presentation for the second prospect, and he says it is his own Bulk Edit, not the marketplace app. Content types sit on the left. He embedded the interface he built for DemAI, which the caption renders as Demi and DIMI, and put a workbench on the right. He wrote two or three AI functions for that context. A pre-filled prompt finds bike models called Fuel and changes them to Fire. The grid updates as the edits come back. He can accept or decline each one, on one entry or across the set, and he declines a slash the model tied to the fire models. He says a mention in a bio is the kind of hit he might have missed without AI, and that references work too. He does not say semantic search, and he does not name a model. He says at scale this build has to work differently. Popularity and the closed deals stay his account. The prospect is not named here.

## Addition — October 6, 2026

The [October 6 script](../sources/s002-bulk-edits-2026-10-06.md) opens with the origin, then repeats the non-marketplace walkthrough. He says he created Bulk Edit as a solutions specialist for a specific prospect request, built the first version in about a day or two, and that prospect closed. He later expanded the concept for another company and introduced AI. He credits the Contentful app framework for working across a space instead of one entry at a time. Popularity here is "one of the more popular" marketplace apps, "if not the most popular." He says he created and presented the original demo, helped move the concept into production, and shaped the final version that exists today. The walkthrough is still his own build, not the marketplace app. Caption errors stay in the source, including Demi, DIMI, and Falk edit. The second close is not restated in this opening.
