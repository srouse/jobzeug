---
schema_version: "1.1"
project_id: S021
title: Rates Central
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S019
  - S020
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
  - id: S021-E001
    statement: Created Rates Central in Contentful, including rate logic and a custom application with
      real-time editing previews.
    concept_ids:
      - local:content-modeling
      - local:contentful
      - local:interaction-design
      - local:financial-services
    ownership: contributor
    scope: organization
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Created Rates Central in Contentful, including rate logic and a custom application with
          real-time editing previews.
    limitations:
      - Sole authorship, app SDK version, and detailed validation constraints are not established.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S021-E002
    statement: Used the Contentful build workflow to distribute centrally managed rates to the website,
      dealership PDFs, and other endpoints.
    concept_ids:
      - local:headless-content-management
      - local:systems-analysis
    ownership: contributor
    scope: organization
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Used the Contentful build workflow to distribute centrally managed rates to the website,
          dealership PDFs, and other endpoints.
    limitations:
      - This was the usual Contentful build process, not an asserted bespoke publishing pipeline.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S021-E003
    statement: Reports reducing rate-update turnaround from about a week to five or ten minutes.
    concept_ids:
      - local:workflow-time-reduction
    ownership: contributor
    scope: organization
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Reports reducing rate-update turnaround from about a week to five or ten minutes.
    limitations:
      - Self-reported before/after estimate; measurement method and artifacts are not recorded.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
concept_proposals: []
---
# S021: Rates Central

Captured: September 25, 2026
Status: Expanded Scott account September 25, 2026; still-in-use and Contentful attention are Scott’s claims
Evidence: Scott's direct account; aligns with R005 resume “Rates Central… design system and Contentful” claim — resume is a separate source, not verification

## Resume connection

- Role record: [R005 — Experience Designer](../roles/R005-summit-experience-designer.md) at [C003 Summit Credit Union](../employers/C003-summit-credit-union.md) (Aug 2020 – Jun 2023). Same Summit Contentful era as [S020](S020%20-%20Summit%20marketing%20website%20rebuild.md) / [S019](S019%20-%20Summit%20application%20design%20system.md). No project-specific dates in this capture.
- Employer: [C003 Summit Credit Union](../employers/C003-summit-credit-union.md)
- Collaborators: **Mortgage VPs** (and presumably others) **changed the rates** in Contentful. Scott frames creation as his work; **custom Contentful app** he thinks may have been his **first**.
- Customers / clients: None (internal rate source). Downstream consumers included the **website** and a **PDF sent to car dealerships**, plus other endpoints (Scott: “all kinds of various endpoints”).
- Related: [S020](S020%20-%20Summit%20marketing%20website%20rebuild.md) (Contentful platform / website as a consumer); [S019](S019%20-%20Summit%20application%20design%20system.md) (resume ties Rates Central to the design system — coupling still lightly specified). Do not merge.

## Resume summary

I built Rates Central in Contentful—a single rates hub with dynamic logic and a live preview app—so rate changes that used to take about a week could ship in minutes to the website and other endpoints.

## Account summary

<a id="source-account"></a>

**Rates Central** centrally managed **rates across all of Summit’s products**, built **entirely in Contentful**.

**Before/after (Scott’s account):** Rate changes that usually took **around a week** could be done in **five or ten minutes**.

**Capabilities:** Contained **logic for creating rates dynamically**, plus a **custom Contentful app** that let people **view rates change in real time** as they edited — Scott thinks this may have been his **first** such app.

**Distribution:** Everything went through Contentful in the **usual build process**. Editors included **Mortgage VPs** changing rates. Many **endpoints** consumed the data — examples: the **website**, and a **PDF that was sent to car dealerships**.

**Impact:** He says it **pushed Contentful into a whole new space** of functionality; he got **a lot of attention from Contentful** at that point; calls it a **big success**; believes Summit **still uses it now**.

## Useful original wording

> “I created something called Rates Central”

> “built entirely in Contentful, but centrally managed all the rates across all of Summit's products”

> “allowed people to make changes to the rates that usually took somewhere around a week down to, you know, literally five or ten minutes”

> “contained all the logic for creating the rates dynamically and also a custom Contentful app”

> “I think this might have been my first that allowed people to actually view them change real time as well”

> “It really pushed Contentful to a whole new space in terms of its functionality, which was very cool.”

> “I got a lot of attention from Contentful at that point.”

> “it was a big success. I think they still use it now.”

> “it was all done via Contentful in the usual buld process.”

> “Mortgage VPs changed the rates and all kinds of various endpoints used it..like the website and a pdf that was sent to car dealships.”

## Workflow as described

1. Need single place to manage product rates across Summit (prior process ~week turnaround — Scott).
2. Build Rates Central **in Contentful**: central rate management + **dynamic rate-creation logic**.
3. Ship **custom Contentful app** for **real-time preview** of rate changes while editing (possibly Scott’s first such app).
4. Editors (e.g. **Mortgage VPs**) update rates in Contentful; **usual build process** publishes to consumers.
5. Endpoints pull rates — e.g. **website**, **car-dealership PDF**, and other channels.
6. Adoption: much faster rate updates; Contentful vendor notice; claimed ongoing use.

## Ownership and scope

- Scott: created Rates Central (Contentful model/logic + custom app) — team vs sole ownership not specified.
- Day-to-day rate editing: **Mortgage VPs** (named); other editor roles not listed.
- “~1 week → 5–10 minutes,” “still use it,” and “attention from Contentful” are **Scott’s account**; not independently verified here.
- Publish path: **Contentful usual build process** — no separate bespoke pipeline described.
- Resume also says “using the design system and Contentful” — this narration emphasizes Contentful/app + multi-endpoint consumption; DS coupling left open.

## Potential relevance to Figma role

- Custom Contentful app + real-time preview — deep CMS extensibility.
- Domain logic (dynamic rates) inside structured content platform.
- Multi-channel content (web + dealership PDF) from one editorial source.
- Operational leverage (week → minutes) as outcome framing.
- Early Contentful relationship / vendor visibility before later C001 employment.

## Follow-up queue

- ~~Publish pipeline~~ — Contentful usual build process recorded.
- ~~Day-to-day users~~ — Mortgage VPs recorded; other roles open if useful.
- ~~Consumers~~ — website + car-dealership PDF + “various endpoints” recorded; more endpoints optional.
- What the custom app UI did beyond real-time view; App Framework vs older App SDK era.
- Validation/compliance constraints on rate edits.
- Artifacts or screenshots appropriate to share; any Contentful case study / public mention.

## Candidate uses

Strong Summit + Contentful-depth story; complements S020 (adoption) with a specialized multi-channel rates product. Keep week→minutes as Scott’s informal before/after unless measured later.

## Addition — September 25, 2026

Scott: distribution via Contentful **usual build process**; **Mortgage VPs** edited rates; consumers included the **website** and a **PDF for car dealerships**, among other endpoints.
