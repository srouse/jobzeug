---
schema_version: "1.1"
project_id: S002
title: Contentful Bulk Edit App
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids: []
role_links:
  - id: R002
    relationship: delivery
    status: confirmed
    note: The September 28, 2026 recording names this work as done while he was a solution specialist.
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
  vocabulary_version: "1.5.0"
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
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
concept_proposals:
  - label: Bulk content editing
    category: work_activity
    definition: Changing many structured content entries together from one surface.
    reason: The account and the September 28 recording are about editing many Contentful entries
      at once. Interaction design covers the grid. No approved concept covers the bulk operation.
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

## Resume summary

This is Bulk Edit, the most popular app in the Contentful Marketplace. I originally built it as a Solution Specialist to win a specific prospect, and it ultimately helped close two deals. I then helped bring it into production and launch it in the marketplace.

## Presentation

Blurb: This is Bulk Edit, the most popular app in the Contentful Marketplace. I originally built it as a Solution Specialist to win a specific prospect, and it ultimately helped close two deals. I then helped bring it into production and launch it in the marketplace.

Video: 2mgK8Si7GF8ma5u59RzTxX

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

- Confirm exact role title (SE vs Solution Specialist) and project dates; keep R002 provisional until confirmed.
- Official app name / Marketplace listing; where images and a running build live.
- What stack did V1/V2 and the ecosystem version use? What did the AI chat call, and how were updates previewed vs committed?
- How is “highest performing / most popular” and “millions in ARR” measured and attributed to this app? Any citable source?
- Who on the ecosystem team, and what remained Scott’s code vs theirs?
- Clear public disclosure for CU001 / CU002 if names may appear in application materials.

## Candidate uses

Strong portfolio/resume candidate for customer prototyping → production app, AI-assisted content operations, and sales-engineering impact—once images and outcome evidence are attached. Do not put ARR or “most popular app” into polished application copy until attribution is clear. Do not name Tri Pointe or Trek in public materials until disclosure is cleared. Do not merge with DemAI, Blueprints, or other Contentful AI demos without clarification.

## Addition — September 20, 2026

Scott expanded V1 vs V2 UI/behavior, semantic-search rename demo, ecosystem handoff and his return for cleanup/object filtering, closed sales, production status, and popularity/ARR claims. Images still pending from Scott.

## Addition — September 20, 2026 (customers)

Scott named the two closed-sale audiences: Tri Pointe Homes (V1) and Trek (V2). Linked to [CU001](../customers/CU001-tri-pointe-homes.md) and [CU002](../customers/CU002-trek.md) with researched org records; disclosure not cleared.

## Addition — September 28, 2026

The [walkthrough](../sources/s002-bulk-edit-walkthrough-2026-09-28.md) is him on the App Store app. He calls the role solution specialist and the request a way to change many entries at once, closer to Excel than Contentful’s default list. A couple of days produced a workable build. He says the store version is not far from that first build. On screen, a direct edit updates two entries together, and he says he contributed the filter for entries that share a reference. About a month later, before the store release, he added an AI field on the right and says that pitch closed a second deal. The recording does not show that field and does not say semantic search. He says he helped guide the app into the store and that it is the most popular app there. That popularity line, and the line that he closed every solution-specialist sale, stay his account. Customer names stay off the recording.
