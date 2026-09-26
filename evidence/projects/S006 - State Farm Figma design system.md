---
schema_version: "1.1"
project_id: S006
title: State Farm Figma design system
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S005
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
  - id: S006-E001
    statement: Built Figma tokens and components plus an extension that edited token values and checked
      them into a repository.
    concept_ids:
      - local:design-system-development
      - local:design-token-engineering
      - local:component-library
      - local:figma
      - local:figma-extension
      - local:design-token-pipeline
    ownership: contributor
    scope: multiple_teams
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Built Figma tokens and components plus an extension that edited token values and checked
          them into a repository.
    limitations:
      - Plugin versus widget terminology remains unresolved.
      - Production status and collaborator boundaries are not established.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S006-E002
    statement: Helped senior designers work more systematically in Figma and collaborated with a Google
      design-system expert.
    concept_ids:
      - local:mentoring
      - local:instructing
      - local:figma
      - local:cross-functional-work
    ownership: contributor
    scope: multiple_teams
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Helped senior designers work more systematically in Figma and collaborated with a Google
          design-system expert.
    limitations:
      - Specific training outcomes and division of authorship are not recorded.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
concept_proposals: []
---
# S006: State Farm Figma design system

Captured: September 20, 2026
Status: Initial account; artifacts pending
Evidence: Scott's direct account, not yet supported by inspected artifacts
Shared role context: [State Farm design system refresh](../roles/R004-state-farm-design-systems.md#state-farm-design-system-context)

## Resume connection

- Role record: [R004](../roles/R004-state-farm-design-systems.md)
- Employer: [C002 State Farm](../employers/C002-state-farm.md)
- Collaborators: Higher-level / senior designers (systematic Figma thinking). **Design system expert from Google** — deep conversations on making the system robust yet usable by developers. DS design team generally. Political colleague from [S005](S005%20-%20State%20Farm%20tokens%20persuasion.md) helped with examples for the broader program.
- Sources note Figma **plugin** vs **widget** for token sync — preserve both labels pending clarification.

## Resume summary

I built State Farm’s Figma design system—tokens, components, and a repo-sync plugin—and mentored senior designers toward systematic Figma practice, including deep work with a Google design-system expert.

## Account summary

<a id="source-account"></a>

Scott built the **Figma-side design system** work in depth: **literal tokens**, **components** (he underscored that he **made the components**, not only token plumbing), and a **Figma plugin** that edited token values while checking them into the **repo**.

He worked closely with a **Google design-system expert** on how to keep the system **robust** for real use yet **usable by developers**.

He also worked deeply with **higher-level designers** to help them **think more systematically about design in Figma** — raising practice, not only shipping files.

This craft supplied the concrete Figma-and-code examples that [S005](S005%20-%20State%20Farm%20tokens%20persuasion.md) needed for executive persuasion, and the token model that [S007](S007%20-%20State%20Farm%20Lit%20engineering%20bridge.md) needed both sides to understand. The plugin let the **right person** set values in the **right context** while still contributing to the shared source of truth — developers cared more about the system working than about picking individual values.

## Useful original wording

> “making the design system in Figma, the literal tokens”

> “there was also a plugin I created that edited those tokens”

> “worked very closely with a design system expert from Google… how to make this robust, but still very usable by developers”

> “I actually made the components as well”

> “worked deeply with the higher level designers to help them understand how to think more systematically about design in Figma”

> “tinker with the actual values of tokens but check it into the repo”

> “the right person to make the right decision and the right context but still contribute to the main place”

## Workflow as described

1. Define token structures in Figma (and aligned code examples used for persuasion — see S005).
2. Build design-system **components** in Figma.
3. Mentor senior designers toward systematic Figma / DS thinking.
4. Collaborate with Google DS expert on robustness vs developer usability.
5. Ship Figma plugin/widget: edit token values → commit to git.
6. Feed adoption narrative (S005) and eng alignment (S007).

## Ownership and scope

- Scott: Figma tokens, components, plugin/widget, systematic-design mentoring, Google-expert collaboration.
- Google DS expert: advisory / collaborative design of the system’s shape (boundaries of authorship TBD).
- Senior designers: partners being mentored toward systematic practice.
- Production vs prototype status of library and plugin not yet confirmed.

## Potential relevance to Figma role

Direct: Figma components, tokens/variables, plugin to repo, mentoring designers on systematic Figma practice, expert-level DS design judgment for implementability.

## Follow-up queue

- Google expert name / engagement shape if disclosable.
- Token taxonomy (semantic vs primitive); Figma variables usage.
- Plugin vs widget; repo format; what “check into the repo” meant technically.
- Scale of component set; what shipped vs demo.
- Artifacts: Figma library, plugin, token files, before/after designer practice examples.

## Candidate uses

Primary Figma FDE portfolio candidate from the State Farm cluster. Pair with the State Farm role context and optionally S005 for “why it mattered.”

## Addition — September 20, 2026

Split from S004; expanded to include components and mentoring higher-level designers on systematic Figma thinking (Scott’s correction that the Figma leg was undersold).
