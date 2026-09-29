---
schema_version: "1.1"
project_id: S006
title: State Farm Figma Design System
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
  vocabulary_version: "1.5.0"
  reviewed_by: Codex
  reviewed_at: "2026-09-26"
public_disclosure: needs_review
evidence:
  - id: S006-E001
    statement: Built Figma tokens and components plus an extension that edited token values and checked
      them into a repository.
    concept_ids:
      - local:design-system-development
      - local:design-system-fundamentals
      - local:design-token-engineering
      - local:design-token-fundamentals
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
      - A September 22, 2026 LinkedIn recommendation from Kody J. Kasper, whom Scott calls the
        project leader, says Scott built the pipeline from Figma variables through a custom Figma
        plugin to JSON and then Style Dictionary. That is Kody's public account, not an inspection
        of the repository.
      - Scott guesses the original code was slowly migrated into today's system. He says he wrote
        the initial version and established the initial style. No diff has been inspected.
      - Connor Dibble's later pages describe a Figma Variables to W3C pipeline as Connor's work and
        do not itemize Scott's initial plugin.
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
# S006: State Farm Figma Design System
Captured: September 20, 2026
Status: Initial account; artifacts pending
Evidence: Scott's direct account, not yet supported by inspected artifacts
Shared role context: [State Farm design system refresh](../roles/R004-state-farm-design-systems.md#state-farm-design-system-context)

## Resume connection

- Role record: [R004](../roles/R004-state-farm-design-systems.md)
- Employer: [C002 State Farm](../employers/C002-state-farm.md)
- Collaborators: Higher-level / senior designers (systematic Figma thinking). **Design system expert from Google** — deep conversations on making the system robust yet usable by developers. Scott confirmed on September 27, 2026 that this is the same teammate who worked with him on the token variations in [S005](S005%20-%20State%20Farm%20tokens.md). DS design team generally. Political colleague from S005 helped with examples for the broader program; that is a different person.
- Sources note Figma **plugin** vs **widget** for token sync — preserve both labels pending clarification.

## Resume summary

I built State Farm’s Figma design system—tokens, components, and a repo-sync plugin—and mentored senior designers toward systematic Figma practice, including deep work with a Google design-system expert.

## Account summary

<a id="source-account"></a>

Scott built the **Figma-side design system** work in depth: **literal tokens**, **components** (he underscored that he **made the components**, not only token plumbing), and a **Figma plugin** that edited token values while checking them into the **repo**.

He worked closely with a **Google design-system expert** on how to keep the system **robust** for real use yet **usable by developers**.

He also worked deeply with **higher-level designers** to help them **think more systematically about design in Figma** — raising practice, not only shipping files.

This craft supplied the concrete Figma-and-code examples that [S005](S005%20-%20State%20Farm%20tokens.md) needed for executive persuasion, and the token model that [S007](S007%20-%20State%20Farm%20Lit%20engineering%20bridge.md) needed both sides to understand. The plugin let the **right person** set values in the **right context** while still contributing to the shared source of truth — developers cared more about the system working than about picking individual values.

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
- Production vs prototype status of library and plugin not yet confirmed. On September 27, 2026 Scott pointed to Connor Dibble’s public [SFDS Developer Platform](https://connordibble.dev/projects/sfds) page and said Connor, a colleague who stayed at State Farm, maintains the plugin Scott created and took the system further. Connor’s [From Snippets to Shadow DOM](https://connordibble.dev/writing/from-snippets-to-shadow-dom) essay says Connor built a TypeScript Figma plugin that syncs Figma Variables into W3C design tokens. The same day Scott offered a September 22, 2026 LinkedIn recommendation from Kody J. Kasper, whom he calls the project leader, as public proof that Scott wrote the initial pipeline. Kody describes Figma variables, a custom Figma plugin, JSON, and Style Dictionary. Scott guesses that code was slowly migrated into what exists now, and says he established the initial style. The legacy jQuery snippet system is recorded on [S007](S007%20-%20State%20Farm%20Lit%20engineering%20bridge.md).

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

## Addition — September 27, 2026: Kody J. Kasper recommendation

<a id="source-kasper-recommendation"></a>

Scott offered a LinkedIn recommendation dated September 22, 2026, from **Kody J. Kasper**, as public proof that Scott wrote the initial pipeline. Scott calls Kody the **project leader**. The LinkedIn relationship line shown with the recommendation says Kody was senior to Scott but did not manage him directly. Kody’s headline on that page identifies him with design systems and enterprise UX at State Farm. No recommendation URL was captured.

Kody’s recommendation, in substance:

> Scott joined us at a pivotal moment: the move from 1x to the new State Farm Design System. As a contractor, he brought deep expertise in design token architecture and Figma plugin development from a prior role, and he put it to work immediately.

> He helped push and ground our web components direction, and he built the pipeline that changed how design and engineering work together at State Farm. It ran from Figma variables through a custom Figma plugin to JSON and then Style Dictionary. For the first time, designers and engineers shared a single source of truth, a common language layer instead of a handoff.

> Scott made a big impact fast. He moved on to a full-time role at Contentful, where he is still today… The foundation he built is still doing its job.

Scott’s account the same day: this was about three years ago, someone else now owns maintaining it, and Scott wrote the initial one. He guesses the code was slowly migrated into what exists today. He says he established the initial style. That migration path has not been inspected.

Kody’s “contractor” wording is his. The role record [R004](../roles/R004-state-farm-design-systems.md) titles the tenure Senior UX Generalist - Design Systems and does not record contractor status. Do not resolve that from this recommendation alone.

Kody’s “1x” is his name for the prior system. Connor Dibble’s essay describes that prior system as jQuery HTML snippets. Scott agrees the old system was those snippets.

Kody attributes the pipeline build to Scott: Figma variables, a custom Figma plugin, JSON, then Style Dictionary. Connor’s later pages attribute a Figma Variables to W3C token pipeline to Connor and do not itemize Scott’s initial plugin. Scott’s resolution is that he wrote the initial version and Connor, who stayed, now maintains it. Style Dictionary is Kody’s term. It was not in Scott’s earlier account. The web-components sentence is a pointer to [S007](S007%20-%20State%20Farm%20Lit%20engineering%20bridge.md), not a claim that Scott led the platform implementation.
