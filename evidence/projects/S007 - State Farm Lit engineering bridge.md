---
schema_version: "1.1"
project_id: S007
title: State Farm Lit engineering bridge
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S005
  - S006
role_links:
  - id: R004
    relationship: delivery
    status: confirmed
    note: Preserved canonical association from the project account; role-source date caveats remain in
      the role record.
employer_links:
  - id: C002
    relationship: delivery
    status: confirmed
    note: Employer association recorded in the project account.
customer_ids: []
client_ids: []
year: 2023
year_basis: estimated
year_note: Estimated as 2023, the main calendar year of R004 (July 2023–January/February 2024);
  exact project timing is not established.
delivery_stage: unknown
annotation:
  status: reviewed
  vocabulary_version: 1.0.0
  reviewed_by: Codex
  reviewed_at: "2026-09-26"
public_disclosure: needs_review
evidence:
  - id: S007-E001
    statement: Coached the engineering team through Lit and web-component questions and helped designers
      and developers understand the shared token model.
    concept_ids:
      - local:instructing
      - local:mentoring
      - local:web-component-architecture
      - local:lit
      - local:coordination
      - local:cross-functional-work
      - local:stakeholder-alignment
    ownership: contributor
    scope: multiple_teams
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Coached the engineering team through Lit and web-component questions and helped designers
          and developers understand the shared token model.
    limitations:
      - Hands-on Lit implementation is not established by this coaching account.
      - Contribution to adoption is qualitative; rollout scope is not recorded.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
concept_proposals: []
---
# S007: State Farm Lit engineering bridge

Captured: September 20, 2026
Status: Initial account; artifacts pending
Evidence: Scott's direct account, not yet supported by inspected artifacts
Shared role context: [State Farm design system refresh](../roles/R004-state-farm-design-systems.md#state-farm-design-system-context)

## Resume connection

- Role record: [R004](../roles/R004-state-farm-design-systems.md)
- Employer: [C002 State Farm](../employers/C002-state-farm.md)
- Collaborators: Design-system **development** team (Lit / web components); design-system **design** team as the other side of the bridge. Token/Figma craft detail in [S006](S006%20-%20State%20Farm%20Figma%20design%20system.md); executive buy-in in [S005](S005%20-%20State%20Farm%20tokens%20persuasion.md).

## Resume summary

I enabled State Farm’s engineering team on Lit and web components and acted as the design↔dev bridge so token decisions stayed coherent across both sides.

## Account summary

<a id="source-account"></a>

Scott helped the design-system **development** team understand and **accelerate** learning on **web components**, using **Lit**. He already had **years of Lit experience**, answered questions cleanly and early, and built strong rapport and friendships on that team — getting past the harder Lit parts **quickly**.

State Farm’s hierarchy split **DS design** and **DS development** into separate teams. That created sync problems and **political contention**. Scott was the person who could talk to designers and developers **directly, with experience**; they **couldn’t fake it** and had to treat him as a **peer on both sides**. He acted as a **bridge**, which was a big part of **getting tokens to happen** — both sides needed to understand the system (token model detailed in S006).

He describes the position as extremely validating: momentum on both sides, and a powerful **“backdoor conversation”** across the contested boundary.

## Useful original wording

> “helping the design system development team understand and accelerate their learning about web components… Lit Elements”

> “I already had had years of experience with it… always could answer a question very cleanly”

> “get past all the more difficult parts with lit elements and get that done really quickly and early”

> “two teams… design team for the design system and… focused on the design system in development”

> “fairly contentious”

> “They couldn't fake it with me. They had to tell me the truth… treat me as a peer on both sides”

> “acted as a bridge between these two areas, got tokens to happen”

> “backdoor conversation which was incredibly powerful”

## Workflow as described

1. Join / support DS development team with prior Lit expertise.
2. Unblock hard Lit/web-component learning early and quickly.
3. Build peer trust on eng side; maintain peer trust on design side.
4. Bridge contentious design↔dev DS boundary; align both on tokens (with S006).
5. Sustain informal “backdoor” dialogue that formal hierarchy struggled to provide.

## Ownership and scope

- Scott: Lit enablement/coaching, cross-team bridge, contribution to token adoption via shared understanding.
- What Scott personally implemented in Lit vs coached remains to clarify.
- Dual-team political dynamics are contextual, not a claim about individual blame.

## Potential relevance to Figma role

Earning trust with senior/peer engineers, working inside enterprise org constraints, making design-system implementation real in code — complements Figma craft in S006.

## Follow-up queue

- Lit components Scott authored vs reviewed/coached.
- Concrete “difficult parts” of Lit they hit.
- How the backdoor conversation changed decisions or velocity.
- Artifacts: Lit examples, PRs, training notes.

## Candidate uses

Interview story for eng credibility and cross-functional bridge; resume bullet on web components / enablement. Pair with S006 for full design-to-code picture.

## Addition — September 20, 2026

Split from S004 umbrella as engineering-enablement / bridge narrative.
