---
schema_version: "1.1"
project_id: S020
title: Summit marketing website rebuild
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S019
  - S021
role_links:
  - id: R005
    relationship: delivery
    status: confirmed
    note: Preserved canonical association from the project account; role-source date caveats remain in
      the role record.
employer_links:
  - id: C003
    relationship: delivery
    status: confirmed
    note: Employer association recorded in the project account.
customer_ids: []
client_ids: []
year: 2022
year_basis: estimated
year_note: Estimated as 2022 near the midpoint of R005 (August 2020–June 2023); does not establish
  sequence among Summit projects.
delivery_stage: production
annotation:
  status: reviewed
  vocabulary_version: 1.0.0
  reviewed_by: Codex
  reviewed_at: "2026-09-26"
public_disclosure: needs_review
evidence:
  - id: S020-E001
    statement: Led research into CMS alternatives and persuaded the CMO and CIO to choose a headless
      Contentful approach.
    concept_ids:
      - local:technology-selection
      - local:persuasion
      - local:decision-making
      - local:headless-content-management
      - local:stakeholder-alignment
    ownership: lead
    scope: organization
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Led research into CMS alternatives and persuaded the CMO and CIO to choose a headless
          Contentful approach.
    limitations:
      - Competitors were evaluated, not necessarily implemented.
      - Earlier Drupal version is an uncertain recollection.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S020-E002
    statement: Implemented marketing-system components and set up the Figma file as part of a custom
      statically built Contentful website.
    concept_ids:
      - local:front-end-development
      - local:design-system-development
      - local:component-library
      - local:figma
      - local:contentful
      - local:platform-migration
      - local:cross-functional-work
    ownership: contributor
    scope: multiple_teams
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Implemented marketing-system components and set up the Figma file as part of a custom
          statically built Contentful website.
    limitations:
      - A separate design lead designed the visual components; do not assign that authorship to
        Scott.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S020-E003
    statement: Reports reducing more than 100 largely duplicative components to a couple dozen and
      substantially improving website performance.
    concept_ids:
      - local:component-consolidation
      - local:web-performance-improvement
    ownership: contributor
    scope: organization
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Reports reducing more than 100 largely duplicative components to a couple dozen and
          substantially improving website performance.
    limitations:
      - Component counts are approximate self-report; performance has no measured baseline in the
        record.
      - The continued existence of the public site does not independently verify these results.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
concept_proposals: []
---
# S020: Summit marketing website rebuild

Captured: September 25, 2026
Status: Expanded Scott account September 25, 2026; project calendar dates not needed / not provided
Evidence: Scott's direct account; aligns with R005 resume claim (Contentful + brand website static-site rebuild) — resume is a separate source claim, not verification

## Resume connection

- Role record: [R005 — Experience Designer](../roles/R005-summit-experience-designer.md) at [C003 Summit Credit Union](../employers/C003-summit-credit-union.md) (Aug 2020 – Jun 2023). Same tenure as [S019](S019%20-%20Summit%20application%20design%20system.md). **No project-specific dates** — Scott declines date detail for this account.
- Employer: [C003 Summit Credit Union](../employers/C003-summit-credit-union.md)
- Collaborators: **Design lead** designed the marketing components in Figma. Scott as **design technologist** created the (code) components and **set up the Figma file** the design lead worked in. Presented/persuaded **CMO** and **CIO** on the headless/Contentful path.
- Customers / clients: None (Summit’s own public marketing site for **members** and **prospective members**).
- Related: [S019 Summit application design system](S019%20-%20Summit%20application%20design%20system.md) — application DS first; this project is the **second** DS (marketing), with **synergy** between them. Do not merge.
- Public surface (Scott): still live at [summitcreditunion.com](https://www.summitcreditunion.com/) as of this account — site existence does not by itself prove every claim here.

## Resume summary

I drove Summit’s headless rebuild of the marketing site on Contentful—persuading CMO/CIO, standing up a second marketing design system, and cutting a bloated component set down to a composable dozen.

## Account summary

<a id="source-account"></a>

**Situation:** Summit’s **main website** was a critical channel for **existing members** and **prospective new members**. The prior stack had reached **end of life** — Scott believes **Drupal 7**; migrating to **Drupal 8** would have been a **major overhaul of everything**.

**Path choice:** Scott **persuaded** the org to take a **headless** approach instead. This is when he **first learned about Contentful**. Summit (process he says he **drove entirely**) researched competitors including **Sanity**, **Contentstack**, and others, and **chose Contentful**. He **presented** the case to the **CMO** and **CIO** and persuaded them this was the best path.

**Delivery:** Fairly involved. They brought in a **design lead** for a **brand-new marketing design system** — marketing systems tend to be **really different** from application ones. Second Summit DS, again **web components**, with **synergy** with [S019](S019%20-%20Summit%20application%20design%20system.md). Front end: a **custom statically built site** (headless Contentful + static build). Scott’s role on the DS/site: **design technologist** — he **created the components** and **set up the Figma file**; the design lead **designed the actual components** in that file.

**Outcomes (Scott’s account):** Reduced **100+** mostly **duplicative** components to a **couple of dozen**. Performance improved to “**almost nothing**” / a **huge improvement** (informal; not a measured metric in this capture). Addressed a core ops problem: marketing had **stopped training new hires** because best practice was too hard to learn — people were **copying and pasting pages** instead of **composing** them. He calls it a **huge success**; site still visible on summitcreditunion.com.

## Useful original wording

> “redesign or a rebuild of their main website… extremely important part of getting all of their members to interact with Summit. As well as prospective new members.”

> “they had come to the end of life with Drupal 7, I believe. And so migrating to 8 was going to be a major overhaul of everything.”

> “I instead persuaded them to go with a headless approach.”

> “This is when I first learned about Contentful.”

> “They had actually done all the research on all the other competitors, Sanity, and Content Stack, et cetera… ultimately decided on Contentful.”

> “It was a process that was driven entirely by me and then I ultimately just presented it to the chief marketing officer, the chief information officer and persuaded them that this was the best path.”

> “brought in a design, design lead to come in and actually make a brand new design system for just this because marketing design systems tend to be really different than application.”

> “we built our second design system for this with a lot of synergy obviously with the other design system. It was again in web components.”

> “reduced what was 100 plus, mostly duplicative components down to a couple of dozen”

> “get the performance down to almost nothing, like it was a huge improvement”

> “they had actually had stopped training new marketing hires because it was too hard to figure out what the best practice was. They were essentially copying and pasting pages versus composing them.”

> “you can actually see it to this day on SummitCreditUnion. Com.”

> “no dates.”

> “front end stack was custom statically built site.”

> “I was the design technologist and created the components and set up the figma file where the design lead was designing the actual components.”

## Workflow as described

1. Drupal 7 EOL looming; Drupal 8 migration = full overhaul risk.
2. Scott drives evaluation of headless CMS options (Sanity, Contentstack, others); first deep exposure to Contentful; Contentful selected.
3. Present and persuade CMO + CIO.
4. Bring in design lead; Scott (design technologist) sets up Figma file + builds web-component implementation; design lead designs components in that file; marketing DS #2 synergistic with S019.
5. **Custom statically built** front end on headless Contentful; cut component count ~100+ → couple dozen; improve performance; enable page **composition** so marketing can train/hire again.
6. Ship; site remains live (Scott).

## Ownership and scope

- Scott: drove CMS research/decision and CMO/CIO persuasion; as **design technologist**, **created the (code) components** and **set up the Figma file**.
- Design lead: **designed the actual components** in that Figma file.
- Drupal 7/8 recall is **belief** (“I believe”).
- “100+ → couple dozen,” performance “almost nothing,” and training-stoppage are **Scott’s account** / informal measures — not independently verified here.
- Front end: **custom statically built site** + Contentful + web components — no further framework/hosting detail in this capture.

## Potential relevance to Figma role

- Executive persuasion (CMO/CIO) for architectural platform change.
- First Contentful adoption — later career arc at C001.
- Design technologist + design lead pairing: Figma file setup + component implementation vs visual component design.
- Marketing vs application design-system distinction with intentional synergy.
- Component consolidation and composition model fixing copy-paste content ops.
- Public durable artifact (live brand site) once claims are carefully framed.

## Follow-up queue

- ~~Project dates~~ — Scott: **no dates**; drop unless volunteered later.
- ~~Front-end stack~~ — **custom statically built site** recorded.
- ~~Scott vs design lead~~ — design technologist (components + Figma setup) vs design lead (designing components) recorded; design lead **name** still open if ever useful.
- Any measured performance numbers (vs “almost nothing”); component inventory source for ~100+.
- How composition/training changed day-to-day (examples); [S021 Rates Central](S021%20-%20Rates%20Central.md) captured as sibling.

## Candidate uses

Strong Summit + early-Contentful story: persuasion, headless migration, marketing DS, design-technologist/Figma setup, content ops. Pair with [S019](S019%20-%20Summit%20application%20design%20system.md) for two-system narrative. Live site supports “still shipping” framing with careful claim boundaries.

## Addition — September 25, 2026

Scott: **no project dates**; front end was a **custom statically built site**; role was **design technologist** — created components and set up the Figma file; design lead designed the components there.
