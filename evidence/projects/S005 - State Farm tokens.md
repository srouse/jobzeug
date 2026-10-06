---
schema_version: "1.1"
project_id: S005
title: State Farm Tokens
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
delivery_stage: mixed
annotation:
  status: reviewed
  vocabulary_version: "1.10.0"
  reviewed_by: Scott
  reviewed_at: "2026-09-27"
public_disclosure: needs_review
evidence:
  - id: S005-E001
    statement: Iterated executive presentations and used concrete examples of ambiguous color guidance
      to persuade management to support design tokens.
    concept_ids:
      - local:persuasion
      - local:speaking
      - local:stakeholder-alignment
      - local:ux-generalist-design-systems
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
  - id: S005-E002
    statement: With a Google teammate, created the initial primitive and semantic token template for
      State Farm's next-generation design system, through many variations aimed at designer needs and
      later maintenance.
    concept_ids:
      - local:design-token-engineering
      - local:design-token-fundamentals
      - local:design-system-development
      - local:design-system-fundamentals
      - local:ux-generalist-design-systems
    ownership: contributor
    scope: organization
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "#evidence-e002"
        locator: Addition September 27, 2026 — token template
        supports: He created the initial token template with a teammate from Google, including the
          first primitive and semantic layers.
    limitations:
      - The Google teammate co-authored the variations. He is the design-system expert named on S006.
        His name is unknown.
      - He believes the tokens are probably mostly modeled the same way now and that it was a good
        solution. A public page shows a State Farm design system called SFDS still exists. It does
        not show that the primitive and semantic layers match this template, so product adoption is
        not tagged.
      - The Figma plugin and component craft stay on S006. This claim is the token model, not a
        token pipeline.
      - Many variations is uncounted.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
  - id: S005-E003
    statement: Built an inverse-mode experiment in code, where a light-mode input on a dark background
      kept a light surface and turned its label white, then stepped it back after presenting it
      because the effort outweighed the value for the implementation team.
    concept_ids:
      - local:design-token-engineering
      - local:prototyping
      - local:technical-prototype
      - local:front-end-development
      - local:interaction-design
      - local:decision-making
      - local:speaking
      - local:ux-generalist-design-systems
    ownership: contributor
    scope: single_team
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e003"
        locator: Addition September 27, 2026 — inverse mode
        supports: The inverse-mode behavior, the code solution, the presentation, and the decision
          to step it back.
    limitations:
      - Inverse mode did not ship. It stays on this project as the overreach they dropped.
      - Language and framework were not named.
      - The implementation team's reaction is his account of the presentation, not a recorded vote.
      - The Material comparison is his judgment about Google's design system. He does not claim he
        worked on Material.
      - Value versus effort is qualitative.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Scott
      reviewed_at: "2026-09-27"
concept_proposals: []
---
# S005: State Farm Tokens
Captured: September 20, 2026
Status: Expanded September 27, 2026. Two parts: persuading State Farm to use tokens, and creating the initial token template. Inverse mode was explored and stepped back.
Evidence: Scott's direct account, not yet supported by inspected artifacts
Shared role context: [State Farm design system refresh](../roles/R004-state-farm-design-systems.md#state-farm-design-system-context)

## Resume connection

- Role record: [R004](../roles/R004-state-farm-design-systems.md)
- Employer: [C002 State Farm](../employers/C002-state-farm.md)
- Collaborators: Colleague who navigated State Farm politics better than Scott — helped craft examples (name unknown). Senior management as audience.
- Related: Working Figma/code examples that made the decks concrete live primarily in [S006](S006%20-%20State%20Farm%20Figma%20design%20system.md); do not re-own that craft here.

## Resume summary

I persuaded State Farm to use design tokens and, with a Google teammate, created the primitive and semantic template I believe they mostly still use. Inverse mode was part of this work, then stepped back because it was more than the team would maintain.

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

- Scott: narrative strategy, deck iteration, identification of the landing argument; examples built with/alongside S006 work. With a Google teammate, the initial primitive and semantic token layers, including variations and the inverse-mode experiment that was stepped back.
- Colleague: political navigation and example-crafting help. That person is not identified as the Google teammate.
- Google teammate: same person as the design-system expert from Google on [S006](S006%20-%20State%20Farm%20Figma%20design%20system.md). Scott confirmed that on September 27, 2026. Name still unknown.
- Outcome claimed: persuasion succeeded; tokens path opened (implementation detail in S006/S007). He believes the tokens are probably mostly modeled the same way now, and that it was a good solution. Inverse mode stays part of this project. It was built, presented, and stepped back. It did not ship.

## Potential relevance to Figma role

Stakeholder trust, scoping a credible path to value, turning field insight (broken guidance) into organizational change — without requiring the audience to already believe in tokens.

## Follow-up queue

- Retrieve or recreate the landing slide/deck if shareable.
- Name of the political partner, and name of the Google teammate, if disclosable. Connor Dibble is a
  later colleague on the public page below, not identified as either of those people.
- The primitive and semantic template has not been compared with the current SFDS token model.

## Candidate uses

Interview story for executive persuasion, for the primitive and semantic template, and for inverse mode as the experiment they stepped back. Pair with S006 so the decks were not vaporware. His belief that today's tokens are mostly modeled the same way is his account, not an inspection. Inverse mode did not ship.

## Addition — September 20, 2026

Split from S004 umbrella as persuasion-only narrative. The September 27 account adds the token template and inverse mode as proposed claims E002 and E003.

## Addition — September 27, 2026: token template and inverse mode

<a id="source-account-2026-09-27"></a>

Summary of Scott’s September 27, 2026 account (not a transcript). He asked to keep this on the existing tokens project and title it **State Farm tokens**.

<a id="evidence-e002"></a>

He says a big part of the project was creating the **initial template** for how tokens were going to be used within State Farm for their **next generation design system**. His judgment is that he probably **seeded what's finally there now**, and that it **probably isn't too different**. That is his guess, not a comparison against the current system.

He names **two big parts**: persuading State Farm to actually use tokens, and actually coming up with them.

He worked with **someone on his team who is from Google**. They came up with **many, many different variations** of tokens in order to mature them as much as possible. They came up with the **first primitive and semantic layers** so they could support a lot of the sophisticated things the designers wanted, and so the system would be **easy to maintain going forward**. They also made a number of **overreaches** just to see what was possible. On September 27, 2026 he confirmed this teammate is the **design-system expert from Google** already named on [S006](S006%20-%20State%20Farm%20Figma%20design%20system.md). The political colleague in the earlier persuasion account is a different person.

<a id="evidence-e003"></a>

**Inverse mode.** One story he calls really interesting. Inverse mode was a way of rendering, for example, an **input field** on a **dark background**. He distinguishes it from **dark mode**, where everything goes dark. Even in **light mode**, the surface of that input needed to **stay light**, and the **label needed to turn white** so it could be seen on the dark background. They went through a lot of experimentation, came together with a **solution in the code**, and presented it. They realized it was a step or two beyond what most of the **implementation team** would want to mess with. It was pretty complicated and difficult to maintain across all of the different components. They **stepped it back** because the value was not quite as high as the effort. He says if you look closely at **Material**, Google’s design system, it goes all the way down that path, and that it is probably the most complicated thing you can do, primarily because they are trying to **white-label** it and make it usable for everybody.

**Lesson he states:** make a design system that works for the team, and it has a better chance of being adopted and implemented correctly.

Later the same day he said he believes the tokens are **probably mostly modeled in the same way** now, and that it was a **good solution**. Inverse mode is part of this project, as the story of an overreach they stepped back. It is not a separate project.

### Useful original wording

> “I did create the initial template for how tokens were going to be used… I probably seeded what's finally there now. It probably isn't too different.”

> “One was persuading State Farm to actually use these tokens. The other one is to actually come up with them.”

> “someone who's on my team as well, who is from Google… many, many different variations… the first primitive and semantic layers”

> “inverse mode… different than like dark mode… the surface of that input field to stay light, but you also need the label to turn white”

> “a step or two beyond what most of the implementation team would really want to mess with… we ultimately stepped that back”

> “Material… goes all the way down that path… trying to white label this”

> “make a design system that works for the team and it has a better chance of being adopted and being implemented correctly”

## Addition — September 27, 2026: public page that the system is still there

<a id="source-sfds-dibble"></a>

Scott pointed to a public project page by Connor Dibble, [SFDS Developer Platform](https://connordibble.dev/projects/sfds), consulted September 27, 2026. Scott says Connor is someone he worked with at State Farm, that Connor was still there and took the work further, and that Connor maintains the plugin and related things Scott did. Scott offers the page as validation that the system is still there. He does not say Connor is the Google teammate or the political colleague.

What the page itself supports: a closed-source State Farm project named SFDS, described as a developer platform for UI architecture, engineering standards, and migration context, with design tokens and web components among its topics. It says SFDS is the official migration target for statefarm.com. Those are Connor’s statements about the platform as of that page, not a measured audit.

What the page does not support: that Scott authored the primitive and semantic template, that today’s tokens match that template, or that inverse mode shipped. Counts on the page, including 1000+ engineers and designers, 100+ teams, and 70+ primitives, are Connor’s claims about the current platform. They are not Scott’s outcomes.

Connor’s page also says he built the Figma Variables to W3C design-token pipeline and owned publishing and distribution. Scott’s account says Connor maintains the plugin Scott created. The page does not itemize which pieces were Scott’s. The plugin itself remains on [S006](S006%20-%20State%20Farm%20Figma%20design%20system.md). A later essay by the same author, [From Snippets to Shadow DOM](https://connordibble.dev/writing/from-snippets-to-shadow-dom), is the detailed recounting of the old jQuery snippet system and the move to Shadow DOM. Scott calls that change a radical reinvention. The essay is recorded on [S007](S007%20-%20State%20Farm%20Lit%20engineering%20bridge.md). A September 22, 2026 LinkedIn recommendation from Kody J. Kasper, whom Scott calls the project leader, says Scott built the initial pipeline from Figma variables through a custom plugin to JSON and Style Dictionary. That recommendation is quoted on S006.
