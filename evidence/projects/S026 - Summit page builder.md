---
schema_version: "1.1"
project_id: S026
title: Summit Page Builder
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S020
role_links:
  - id: R005
    relationship: delivery
    status: confirmed
    note: Scott placed this on the Summit Experience Designer role, during the Contentful migration
      he says he was leading.
employer_links:
  - id: C003
    relationship: delivery
    status: confirmed
    note: Summit Credit Union employment. Marketing is an internal team, not a customer or client.
customer_ids: []
client_ids: []
year: 2022
year_basis: estimated
year_note: Project calendar was not supplied. Estimated as 2022 inside R005 (August 2020–June 2023),
  the same estimate used for the marketing-site rebuild. Does not establish sequence among Summit
  projects.
delivery_stage: production
annotation:
  status: reviewed
  vocabulary_version: "1.10.0"
  reviewed_by: Scott
  reviewed_at: "2026-09-27"
public_disclosure: needs_review
evidence:
  - id: S026-E001
    statement: Built a Contentful App Framework page builder so marketing could see pages, preview
      them, and jump to the elements on a page, before Contentful’s own live preview existed.
    concept_ids:
      - local:contentful
      - local:front-end-development
      - local:interaction-design
      - local:headless-content-management
      - local:production-release
      - local:experience-designer
    ownership: lead
    scope: single_team
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary — what the app did
        supports: He made the page-list, preview, and jump-to-elements interface on the Contentful
          App Framework and says it landed before Contentful live preview.
    limitations:
      - The app has no name in this account, and it is not established as the Rates Central app.
      - No user count, duration, or time-saved figure is given.
      - Screenshots were not inspected.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S026-E002
    statement: While leading the Contentful migration, coordinated marketing, developers, and design,
      and helped a creative director with what they needed to centralize the design system.
    concept_ids:
      - local:coordination
      - local:stakeholder-alignment
      - local:cross-functional-work
      - local:contentful
      - local:experience-designer
    ownership: lead
    scope: multiple_teams
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary — migration coordination
        supports: He says he led the migration and coordinated marketing, developers, and design,
          and helped a creative director centralize the design system without being that director.
    limitations:
      - Migration leadership is also part of S020. This claim is the coordination around this app,
        not a second migration.
      - Marketing access and training time were limited by schedule conflicts.
      - He was not the creative director. That person’s name is not in the account.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
concept_proposals: []
---
# S026: Summit Page Builder

Captured: September 27, 2026
Status: Initial account; no product name given
Evidence: Scott's direct account, not yet supported by inspected artifacts

## Resume connection

- Role record: [R005 — Experience Designer](../roles/R005-summit-experience-designer.md). Scott said to put this on the Summit Credit Union Experience Designer role. Source dates: August 2020–June 2023. Project-specific months were not given.
- Employer: [C003 Summit Credit Union](../employers/C003-summit-credit-union.md)
- Related: [S020 Summit Marketing Website Rebuild](S020%20-%20Summit%20marketing%20website%20rebuild.md). He says he was leading the migration to Contentful and the website was being made at the same time as this app. Do not merge the app into that rebuild record.
- Not the same account as [S021 Rates Central](S021%20-%20Rates%20Central.md). That record has its own custom app and live preview. This capture does not say they are one app.
- Customers / clients: none named. Marketing is an internal Summit team.

## Resume summary

I built a Contentful App Framework page builder so Summit marketing could see every page, preview it, and jump to the elements on that page. This was before Contentful's own live preview product existed.

## Account summary

<a id="source-account"></a>

Summary of Scott’s September 27, 2026 account (not a transcript). He did not give this app a product name. He calls it a Contentful application that was essentially a **page builder**.

He says he was **leading the entire project to migrate to Contentful**, so he had to coordinate with the **marketing** team, **developers**, and **design**. Design was being built at the same time. He describes helping figure out how to get a **creative director** on board. He was **not** the creative director. His part there was helping them put together what they needed in order to **centralize the design system**.

He did not have a lot of access to marketing at first, because of **schedule conflicts**, and he did not have a lot of time to train them inside Contentful. He says it was primarily a **different interface**, with a lot to figure out. They were making the website at the same time. They wanted more flexibility, and they still wanted marketing to put content in and understand what was going on.

**What the app did.** They decided what a **page** was. He says the idea of Contentful is that you create your own organization of things based on what works best for you. He made a specific interface that let people:

- see all the pages that were happening
- preview them
- go quickly to all the elements within a page

He calls that **live preview**, a product within Contentful, and says he built this **before live preview was a thing**. It gave marketing a much softer landing for figuring out how to use Contentful. The app worked within the **Contentful App Framework**.

**How he judges it.** He says it was really, really successful and a really great idea. It did not take him a lot of time because he knew what he was doing in that space. It helped him pin down concepts that were really instrumental later on. It also got him a lot of attention: one of the first things he started talking about with Contentful, and a big reason they took interest in his work there. He calls it a really impactful Contentful app. No count, time saved, or adoption number is in this account.

## Useful original wording

> “leading the entire project to migrate to Contentful… coordinate with the marketing team as well as developers, as well as the design”

> “I was not the creative director, I was helping them put together what they needed in order to centralize the design system”

> “I did not have a lot of access to marketing initially… schedule conflicts… I did not have a lot of time to actually train them within Contentful”

> “a page builder… see all the pages… preview them… go quickly to all the elements that were within that page”

> “essentially live preview… before live preview was a thing… a much softer landing for anyone in marketing”

> “didn't take me a lot of time because I knew what I was doing… pin down some concepts… instrumental later on”

> “one of the first things that I started talking about with Contentful and a big reason why they took interest”

> “Contentful app that worked within what is called the Contentful App Framework”

## Ownership and scope

- Scott: led the Contentful migration this app served; created the page-builder interface on the Contentful App Framework.
- Marketing: the people the interface was for. Access and training time were limited by schedule conflicts.
- Developers: coordinated with; what they owned on this app is not described.
- Design: being built at the same time. He helped with what a creative director would need in order to centralize the design system. He was not the creative director. That person’s name is not in this account.
- Not claimed: a product name, a measured outcome, or that this is the Rates Central app.

## Follow-up queue

- Whether this app had a name, and whether it is the same app as Rates Central.
- Who used it, for how long, and whether it stayed after Contentful shipped live preview.
- Which later concepts it pinned down.
- Whether the creative director here is the design lead on the marketing-site rebuild.
- Screenshots or a walkthrough, if he wants them attached.

## Candidate uses

Interview account of a Contentful App Framework page builder that gave marketing a page list, preview, and a way into the elements on a page during Summit’s migration. Do not claim a metric for “really successful,” and do not merge it with Rates Central unless he says they are the same app.
