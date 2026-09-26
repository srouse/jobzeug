---
schema_version: "1.1"
project_id: S005
title: State Farm tokens persuasion
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S006
  - S007
  - S014
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
  - id: S005-E001
    statement: Iterated executive presentations and used concrete examples of ambiguous color guidance
      to persuade management to support design tokens.
    concept_ids:
      - local:persuasion
      - local:speaking
      - local:stakeholder-alignment
    ownership: contributor
    scope: organization
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Iterated executive presentations and used concrete examples of ambiguous color guidance to
          persuade management to support design tokens.
    limitations:
      - A colleague helped navigate organizational politics; sole ownership is not asserted.
      - Approval of the direction is not proof of completed rollout.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
concept_proposals: []
---
# S005: State Farm tokens persuasion

Captured: September 20, 2026
Status: Initial account; artifacts pending
Evidence: Scott's direct account, not yet supported by inspected artifacts
Shared role context: [State Farm design system refresh](../roles/R004-state-farm-design-systems.md#state-farm-design-system-context)

## Resume connection

- Role record: [R004](../roles/R004-state-farm-design-systems.md)
- Employer: [C002 State Farm](../employers/C002-state-farm.md)
- Collaborators: Colleague who navigated State Farm politics better than Scott — helped craft examples (name unknown). Senior management as audience.
- Related: Working Figma/code examples that made the decks concrete live primarily in [S006](S006%20-%20State%20Farm%20Figma%20design%20system.md); do not re-own that craft here.

## Resume summary

I built the executive persuasion case—and landing deck—that got State Farm leadership to buy into design tokens as the foundation for the next-generation system.

## Account summary

<a id="source-account"></a>

Scott spent **many months** building a story to convince **senior management** that **design tokens** needed to happen at State Farm — including how the design system should be made and how the program should go.

He repeatedly heard about an email with **hundreds of signatures** arguing tokens should **never** be a thing at State Farm. He **never saw** that email; he heard about it many times.

With the politically fluent colleague, he used **real examples** (design system in Figma and code, token structures — detail in S006) and iterated **many presentation decks** because a simple idea was not landing.

He knows **exactly which slide did it**: their existing way of telling people what colors to use could still produce a **slew of wrong answers**. It was not that people failed to align; there was **not enough guidance** to make the **right on-brand decision**. That framing landed. Management understood the status quo could not get them down the path of staying on brand.

## Useful original wording

> “many months coming up with a story to convince… senior management that actually using tokens was a really important thing”

> “email went out with hundreds of signatures that said that tokens should never be a thing at State Farm… I never actually saw that email”

> “iterate it over many, many presentation decks, trying to figure out how this very simple idea is not landing”

> “I knew exactly what slide did it”

> “it wasn't an issue of everyone being on the same page. It was that there just wasn't enough guidance for people to make the right decision”

## Workflow as described

1. Political headwind (reported mass anti-token email; unverified firsthand).
2. Partner with political navigator; ground decks in real Figma/code/token examples (S006).
3. Iterate executive presentations.
4. Landing slide: existing color guidance → many wrong answers / insufficient decision support.
5. Management accepts need for stronger systematic guidance (tokens path).

## Ownership and scope

- Scott: narrative strategy, deck iteration, identification of the landing argument; examples built with/alongside S006 work.
- Colleague: political navigation and example-crafting help.
- Outcome claimed: persuasion succeeded; tokens path opened (implementation detail in S006/S007).

## Potential relevance to Figma role

Stakeholder trust, scoping a credible path to value, turning field insight (broken guidance) into organizational change — without requiring the audience to already believe in tokens.

## Follow-up queue

- Retrieve or recreate the landing slide/deck if shareable.
- Name of political partner if disclosable.
- What management approved afterward (mandate, funding, team charge)?

## Candidate uses

Interview story for executive persuasion; cover-letter “how I move large orgs”; pair with S006 so the decks were not vaporware.

## Addition — September 20, 2026

Split from S004 umbrella as persuasion-only narrative.
