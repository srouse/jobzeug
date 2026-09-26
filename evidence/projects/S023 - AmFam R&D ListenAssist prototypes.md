---
schema_version: "1.1"
project_id: S023
title: AmFam R&D ListenAssist prototypes
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids: []
role_links:
  - id: R006
    relationship: delivery
    status: confirmed
    note: Canonical American Family employment record (Nov 2019–Aug 2020). Contract-to-hire is how
      Scott arrived; do not split this project across LinkedIn subroles R014/R015.
employer_links:
  - id: C004
    relationship: delivery
    status: confirmed
    note: Employer association from Scott’s account.
customer_ids: []
client_ids: []
year: 2020
year_basis: estimated
year_note: Estimated within R006 tenure (Nov 2019–Aug 2020); project-specific calendar not supplied.
delivery_stage: prototype
annotation:
  status: draft
  vocabulary_version: "1.0.0"
  reviewed_by: null
  reviewed_at: null
public_disclosure: needs_review
evidence:
  - id: S023-E001
    statement: Built rapid React front-end prototypes for an AmFam R&D team of PhD computer scientists
      exploring pre-LLM machine-learning efficiencies backed by a custom ML database they maintained.
    concept_ids:
      - local:prototyping
      - local:technical-prototype
      - local:front-end-development
      - local:react
      - local:financial-services
      - local:cross-functional-work
    ownership: contributor
    scope: single_team
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e001"
        locator: Account summary — R&D prototyping lane
        supports: Rapid React front-end prototyping with AmFam R&D PhDs whose custom ML database
          backed the work; Scott did not author the database.
    limitations:
      - Contents and architecture of the PhDs’ custom ML database are unknown to Scott.
      - Production deployment is not claimed; Scott characterizes capability as rudimentary vs modern systems.
      - Do not map this claim to modern LLM/AI workflow concepts; the account is explicitly pre-LLM.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S023-E002
    statement: Built the ListenAssist call-center prototype (React) that listened on the telephone line to
      agent–customer conversation and surfaced automatic answers drawn from the R&D custom ML database.
    concept_ids:
      - local:prototyping
      - local:technical-prototype
      - local:front-end-development
      - local:react
      - local:interaction-design
      - local:financial-services
    ownership: contributor
    scope: single_team
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e002"
        locator: Account summary — ListenAssist behavior
        supports: ListenAssist listened on the telephone line and surfaced conversation-aligned automatic
          answers from the R&D custom ML database; React front-end was Scott’s lane.
    limitations:
      - Exact telephony listen/transcription mechanism is not detailed beyond “listening on the line.”
      - Whether ListenAssist shipped beyond research prototypes is unknown.
      - Integration with the ML database is consumption only; no API or model authorship is claimed.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S023-E003
    statement: Shadowed real call-center employees, then had them try ListenAssist in mimicked situations;
      was surprised they strongly disliked terse answers and needed paragraph-level conceptual context to
      explain to customers.
    concept_ids:
      - local:user-research
      - local:usability-testing
      - local:interaction-design
      - local:critical-thinking
      - local:financial-services
    ownership: contributor
    scope: single_team
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e003"
        locator: Account summary — shadowing and situational tests
        supports: Shadowed call-center employees, ran mimicked-situation trials of ListenAssist, and
          compared terse answers unfavorably to paragraph/conceptual assists agents could explain.
    limitations:
      - Exact participant count and surviving test artifacts are not established.
      - Comparison to contemporaneous Google short-answer patterns is Scott’s framing, not a formal study
        citation.
      - Call-center employees are internal operators, not external customers; do not treat as
        customer-facing sales/discovery work.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
concept_proposals:
  - label: Pre-LLM machine learning productization
    category: skill
    definition: Applying classical or custom machine-learning systems (not large language models) to
      product or operations problems through prototypes or integrations.
    reason: Account centers pre-LLM R&D and a custom ML database; approved AI concepts imply modern
      LLM/agent stacks (ai-workflow-engineering, ai-system-fundamentals) and would mis-tag this work.
  - label: Operator / call-center assist UX
    category: deliverable
    definition: An interface that assists frontline operators during live customer conversations with
      context-aware suggested answers or explanations.
    reason: ListenAssist is a conversation-aligned agent assist; no approved deliverable covers
      operator-assist products beyond generic technical-prototype.
---
# S023: AmFam R&D ListenAssist prototypes

Captured: September 26, 2026  
Updated: September 26, 2026 (annotate-project draft pass — concept maps, anchors, schema review status)  
Status: Expanded initial account; artifacts pending  
Evidence: Scott’s direct account, not yet supported by inspected artifacts

## Resume connection

- Role record: [R006 — Senior UX Designer / Developer](../roles/R006-american-family-ux-designer-developer.md) — canonical American Family employment. Contract-to-hire was how Scott arrived; do not treat LinkedIn’s R014/R015 split as separate jobs for this work.
- Employer: [C004 American Family Insurance](../employers/C004-american-family-insurance.md)
- Collaborators: PhD computer scientists on R&D (owned the custom ML database; names unknown). Scott’s lane was React front-end / UX prototyping and field user research.
- Customers / clients: None named.

## Resume summary

I built ListenAssist—a React prototype that listened to live AmFam call-center calls and pulled pre-LLM ML answers from R&D’s custom database—and learned by shadowing agents that terse answers fail; they need conceptual context to explain.

## Account summary

<a id="source-account"></a>

At **American Family Insurance**, Scott worked with an **R&D** group of **PhD computer scientists** exploring how **machine learning** could create efficiencies **before LLMs existed**. They maintained a **custom machine-learning database** Scott did not author and cannot describe internally. In his judgment it could do **rudimentary** things relative to modern systems, but it was the answer source for the prototypes.

<a id="evidence-e001"></a>

Scott’s contribution was **rapid front-end prototyping**, mostly **React** (a traditional front-end stack for that era’s prototype work).

<a id="evidence-e002"></a>

**ListenAssist** listened on the **telephone line** to the live agent–customer conversation and **surfaced automatic answers** drawn from that **custom ML database**, aligned to where the conversation was going.

<a id="evidence-e003"></a>

For evaluation, Scott **shadowed real call-center employees**, watched how they worked, then had them try his prototype in **mimicked situations**. He was **surprised** by how strongly they **disliked terse answers**—even when short answers were “right,” agents still had to explain why in a complex conversation. A better template was a **paragraph / conceptual background** so they could understand and then explain. He also contrasts that finding with a contemporaneous Google-style short top answer, which failed in their testing for the same reason. He maps the lesson forward to modern AI assist UX.

## Useful original wording

> “prior to LLMs being a thing”

> “React mostly… listening to what was going on on the telephone line”

> “answers drew from… a custom machine learning database that was put together by the PhDs”

> “I have no idea what was in there but it definitely didn't work as well as what we have now”

> “shadowed real call center employees and watched what they did”

> “mimic situations actually using it”

> “surprised by their response to how much they didn't like the terse answers”

> “really good test… surprising and set up well to capture that information”

> “a paragraph, so that they could actually understand it and then explain it”

## Workflow as described

1. Embed with PhD R&D ML team (pre-LLM); answers from their custom ML database.
2. Build ListenAssist in React; listen on the phone line; surface conversation-aligned assists.
3. Shadow real call-center agents; observe work practice.
4. Have agents try the prototype in mimicked situations; capture reactions.
5. Finding: reject terse-answer pattern; prefer conceptual paragraph assists.

## Ownership and scope

- Scott: React / front-end ListenAssist prototype; shadowing and situational user testing; synthesis of the terse-vs-context finding.
- R&D scientists: custom ML database and underlying systems (opaque to Scott).
- Not claimed: production rollout, model/database authorship, or quantified efficiency gains.

## Artifacts and evidence status

- No prototypes, test scripts, recordings, or decks attached yet.
- R006 LinkedIn blurb mentions “exploratory natural-language AI and knowledge-system work” — consistent lead, not independent verification.

## Open questions / follow-up queue

- Any surviving ListenAssist builds, screenshots, or test notes?
- Did any assist pattern ship beyond R&D?
- Approximate number of agents shadowed / sessions run (optional).

## Inferred relevance

Candidate themes (not verified outcomes): pre-LLM ML productization, conversation-aware assist UX, field research with real operators, explanatory context over short answers. Do not retrofit modern LLM tooling into this account.

[Project index](INDEX.md) · [Role R006](../roles/R006-american-family-ux-designer-developer.md) · [Employer C004](../employers/C004-american-family-insurance.md)
