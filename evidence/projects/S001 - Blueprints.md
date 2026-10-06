---
schema_version: "1.1"
project_id: S001
title: Blueprints AI Design System
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S008
  - S025
role_links:
  - id: R001
    relationship: delivery
    status: confirmed
    note: Preserved canonical association from the project account; role-source date caveats remain in
      the role record.
employer_links:
  - id: C001
    relationship: delivery
    status: confirmed
    note: Employer association recorded in the project account.
customer_ids: []
client_ids: []
year: 2026
year_basis: estimated
year_note: Estimated from R001 (February 2026–present as of September 2026); project-specific year
  was not supplied.
delivery_stage: unknown
annotation:
  status: reviewed
  vocabulary_version: "1.10.0"
  reviewed_by: Codex
  reviewed_at: "2026-09-26"
public_disclosure: needs_review
evidence:
  - id: S001-E001
    statement: Built a Figma-centered system of approximately 50 components and checked them against
      real Contentful content.
    concept_ids:
      - local:design-system-development
      - local:design-system-fundamentals
      - local:component-library
      - local:figma
      - local:contentful
      - local:design-token-engineering
      - local:senior-product-architect
    ownership: contributor
    scope: single_team
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Built a Figma-centered system of approximately 50 components and checked them against real
          Contentful content.
    limitations:
      - Original visual-design ownership is not established; Scott describes assembly and
        implementation.
      - Release status and actual customer adoption are unconfirmed.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S001-E002
    statement: Created the Design System Squared CLI/skills workflow to export Figma context into
      Markdown, generate React components, and synchronize tokens.
    concept_ids:
      - local:command-line-tool
      - local:design-token-pipeline
      - local:ai-workflow-engineering
      - local:react
      - local:senior-product-architect
    ownership: contributor
    scope: unknown
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Created the Design System Squared CLI/skills workflow to export Figma context into
          Markdown, generate React components, and synchronize tokens.
    limitations:
      - Scott explicitly says he did not hand-write the generated React code.
      - Component fidelity is Scott’s assessment, without a recorded formal evaluation.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S001-E003
    statement: Mentored a designer for several weeks, then took over the work when the timeline could
      not accommodate the original pace.
    concept_ids:
      - local:mentoring
      - local:deadline-pressure
      - local:senior-product-architect
    ownership: contributor
    scope: single_team
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Mentored a designer for several weeks, then took over the work when the timeline could not
          accommodate the original pace.
    limitations:
      - No personnel-management authority is asserted.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S001-E004
    statement: Created an AI-first Figma system whose semantic variables let a model choose text,
      background, and color by role, checked components with live Contentful content, synced token
      differences both ways with code, and used a skill to regenerate React and CSS from a screenshot
      and Markdown token map, with Storybook previews and generated Experience Orchestration
      configuration files.
    concept_ids:
      - local:design-system-development
      - local:design-system-fundamentals
      - local:component-library
      - local:design-token-engineering
      - local:design-token-pipeline
      - local:ai-workflow-engineering
      - local:figma
      - local:contentful
      - local:react
      - local:css
      - local:storybook
      - local:experience-orchestration
      - local:senior-product-architect
    ownership: lead
    scope: single_team
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "../sources/s001-ai-first-blueprints-2026-10-06.md"
        locator: "0:00:00–0:02:39"
        supports: He describes the AI-first system, semantic variables, two-way token sync, live
          content in the component, the screenshot and Markdown token map, the React and CSS skill,
          Storybook, and generated Experience Orchestration configuration files.
    limitations:
      - The caption "Contemporary example for Figma widget" is read as Contentful for Figma. "XO" is
        read as Experience Orchestration (ExO).
      - React and CSS are what the skill generates. He says the skill holds that code shape. This is
        not a claim that he hand-wrote the components or a full stylesheet.
      - Two-way token sync, and his line that there is no single source of truth, are his account. No
        repository or diff log was inspected. Layout changes still start in Figma.
      - Storybook stories and the Experience Orchestration configuration files are named in the
        walkthrough. The files and the Storybook URL were not inspected. Generating that configuration
        is not ownership of Experience Orchestration.
      - Every component going through this process is his account. The component count stays on the
        earlier claim.
      - The September 20 account still has coworkers starting the installable repo. This walkthrough
        does not name them. Lead here is the process he describes, not sole ownership of the initiative.
      - Customers and prospects are the audience he states in the walkthrough. Later the same day he
        said people can use it for inspection only. It looks like Contentful.com. He does not treat it
        as something someone would use as their own system.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S001-E005
    statement: Took on Blueprints and mentored an unnamed junior developer while driving the work.
    concept_ids:
      - local:mentoring
      - local:instructing
      - local:senior-product-architect
    ownership: lead
    scope: single_team
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "../sources/s001-ownership-2026-10-06.md"
        locator: October 6, 2026 account
        supports: He took the project on, mentored someone along the way, and calls that teaching.
      - ref: "../sources/s001-design-award-use-2026-10-06.md"
        locator: October 6, 2026 account
        supports: The person he mentored was a junior developer. He asked that the name stay off the
          record.
    limitations:
      - He does not say what he taught, or how long the mentoring lasted.
      - The September 20 account says a design-team person and several weeks of mentoring, then a
        takeover because the timeline would not allow that pace. He has not said whether that person
        is this junior developer.
      - Initiative is his framing. It is not a separate scored concept.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S001-E006
    statement: Pulled the design from Contentful.com and matured it for the content they had. He
      calls that a from-zero design.
    concept_ids:
      - local:visual-interface-design
      - local:design-system-development
      - local:senior-product-architect
    ownership: lead
    scope: single_team
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "../sources/s001-design-award-use-2026-10-06.md"
        locator: October 6, 2026 account
        supports: He pulled the design from Contentful.com, matured it for their content, and calls
          the result a from-zero design.
    limitations:
      - The starting visuals are the public Contentful site. Contentful.com was not inspected for
        which pieces he pulled.
      - From-zero is his description of that maturation. The September 18 account said he assembled
        the system rather than originating the visual design.
      - He does not list which content the matured designs had to fit.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S001-E007
    statement: The Blueprints team, who are content experts, gave him an internal award because they
      had not expected a design system that mature or that deeply integrated with AI.
    concept_ids:
      - local:internal-recognition
      - local:design-system-development
      - local:ai-workflow-engineering
      - local:senior-product-architect
    ownership: lead
    scope: single_team
    delivery_stage: unknown
    provenance: self_report
    sources:
      - ref: "../sources/s001-design-award-use-2026-10-06.md"
        locator: October 6, 2026 account
        supports: The Blueprints team are content experts, they had not expected that mature an
          AI-integrated design system, and they gave him the award.
    limitations:
      - The award name and date are not recorded.
      - Team members are unnamed. He does not say this was a company-wide or public award.
      - People can use the result for inspection. It looks like Contentful.com. He does not treat it
        as something someone would use as their own system. That is not adoption.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
concept_proposals: []
---
# S001: Blueprints AI Design System
Captured: September 18, 2026
Status: Expanded account September 20, 2026; October 6, 2026 walkthrough, ownership, design origin, award, and inspection-only use added; artifacts still not inspected
Evidence: Scott's direct account, not yet supported by inspected artifacts

## Resume connection

- Role record: [R001 — Senior Product Architect](../roles/R001-contentful-senior-product-architect.md). Scott places the work on the **CIA** team — **Customer Insights and Adoption** (he also said “Customer Adoption” in the same breath; treat **Customer Insights and Adoption** as the expanded form). Aligns with current-role / latest title context (resume: February 2026–present). Exact project calendar dates still not provided.
- Employer: [C001 Contentful](../employers/C001-contentful.md)
- Collaborators: Coworkers on CIA started the repo/initiative (earlier capture named Rob and JD — still to reconcile with titles). A design-team contributor struggled initially; Scott mentored them for several weeks, then took over implementation under timeline pressure. On October 6 he said the person he mentored was a junior developer and asked that the name stay off the record. He has not said whether that is the same person as the design-team contributor.
- October 6 design, award, and use account, kept separate: [S001 design, award, and use, October 6, 2026](../sources/s001-design-award-use-2026-10-06.md). Open it for his words. Do not treat it as the project account.
- October 6 ownership account, kept separate: [S001 ownership, October 6, 2026](../sources/s001-ownership-2026-10-06.md). Open it for his words. Do not treat it as the project account.
- Customers / clients: Intended for prospects and customers as installable best-practice starter; no named CU/CL on this capture.
- Related (captured): [S025 Experience Orchestration (ExO)](S025%20-%20Experience%20Orchestration%20%28ExO%29.md). This account’s research and prototyping are on that record. The centerpiece claim below stays here. The October 6 walkthrough adds generated ExO configuration files on this project.
- Walkthrough transcript, kept separate: [S001 walkthrough, October 6, 2026](../sources/s001-ai-first-blueprints-2026-10-06.md). Open it for the spoken detail. Do not treat it as the project account.
- Perspective: [P002 Build deep to influence large initiatives](../perspectives/P002-build-deep-to-influence.md) — operating mode illustrated by this work.

## Resume summary

I created Blueprints, an AI-first design system that earned an internal recognition award and gives Contentful customers an installable reference for best practices in content modeling and design systems. I built a custom workflow that deeply synchronizes Figma and code, combining shared tokens, design exports, and real content to drive AI implementation of every component. Storybook previews and Contentful integrations make the system easy to inspect and use.

## Account summary

<a id="source-account"></a>

Coworkers on Customer Insights and Adoption started **Blueprints**: a repository prospects and customers can install to see **content-model best practices**, plus a **frontend** so people can see how a content model flows into a **design system** and into **web pages**.

A design-team person joined and struggled — Scott says they lacked a deep enough understanding of how design systems work. He **mentored for several weeks** (productive) but the **timeline would not allow** that pace, so he **took over**.

He built a design system of about **50 components** sized to cover the many variations the team wanted. The approach was **entirely Figma-centric**: each component designed in Figma. He used **Contentful for Figma** (his plugin/widget) to **battle-test** each component against real content and every relevant content type.

He then built **Design System Squared**: a simple **CLI and skills** that export Figma information into **Markdown** living in the design-system repository — enough context for a skill to **create and maintain React components**. Scott states he **did not hand-write the React**; all ~50 components were created that way. Design System Squared also **pushes and pulls tokens** and **enforces design-first updates** (design must be updated first for downstream changes). Result: reusable Figma components that **match code** with no meaningful divergence.

He also connected this into **Experience Orchestration** (to be detailed later), using it to show a more elegant component approach; he describes Blueprints as a **centerpiece** and highly influential on that year-plus initiative.

**Correction vs earlier capture (September 18):** An earlier account summarized export from Contentful then agent-generated React. Scott’s September 20 account specifies **Figma → Design System Squared Markdown → skill → React**, with Contentful for Figma used for battle-testing. Prefer the September 20 workflow; keep the older phrasing only as superseded.

**Not DemAI / Design System Agent Kit:** Per [S003](S003%20-%20DemAI.md), DemAI is separate. Do not merge Blueprints with DemAI.

## Useful original wording

> “it's a Figma first approach”

> “I use my Contentful for Figma widget to battle test it and connect it to the content types”

> “I didn't actually design this, I just kind of built it and put it together.” (September 18 — assembly vs original visual design)

> “Customer Insights and Adoption”

> “mentor them for several weeks, which was really productive but ultimately the timeline didn't quite allow us to move that slowly”

> “Design System Squared… exported all of the information from Figma into Markdown”

> “I didn't write any of the React code for it”

> “enforced this process where the design actually had to be updated first”

> “literally no difference between… reusable components within Figma… match directly with what's going on in code”

> “centerpiece for getting the experience orchestration”

## Workflow as described

1. CIA coworkers start installable best-practice content-model repo + need for frontend / design-system bridge.
2. Design-team attempt; Scott mentors; timeline forces Scott to take over.
3. Design ~50 variation-covering components **in Figma**.
4. Battle-test each with **Contentful for Figma** against real content / content types.
5. **Design System Squared** exports Figma → Markdown in the design-system repo.
6. Point a **skill** at that Markdown to generate and maintain React components (no hand-written React).
7. Token push/pull; design-first enforcement so Figma and code stay aligned.
8. Connect into **Experience Orchestration** (details pending).

October 6 walkthrough: token differences move both ways; layout updates still start in Figma. See the addition.

## Ownership and scope

- Initiative started by CIA coworkers; content-model/repo ownership vs Scott’s design-system/frontend path still to clarify (Rob/JD from earlier capture).
- Scott: mentoring, then takeover; October 6 account says he took the project on and mentored an unnamed junior developer along the way. He pulled the design from Contentful.com and matured it for their content, and he calls that a from-zero design. Also the ~50-component Figma system; Contentful for Figma battle-testing; Design System Squared CLI/skills; React generation/maintenance via skill; token sync; Experience Orchestration influence (claimed).
- The Blueprints team are content experts. They gave him the internal award because they had not expected a design system that mature or that deeply integrated with AI. Award name and date are still unrecorded.
- Intended use: people can inspect it. It looks like Contentful.com. He does not treat it as a system someone would adopt as their own.

## Follow-up queue

- Reconcile Rob/JD vs “coworkers” and who owns content model vs design system.
- Whether the unnamed junior developer is the September 20 design-team person, what Scott taught, and whether mentoring continued after the takeover.
- Exact project dates.
- Internal recognition award: the Blueprints team gave it. Name and date are still unrecorded.
- Design System Squared: the October 6 walkthrough names the mechanism (semantic variables, two-way token diff, screenshot plus Markdown token map, React/CSS skill, Storybook export, ExO configuration files). Repo location, export schema, and token formats are still not inspected.
- What battle-testing with Contentful for Figma changed in the designs or models. He says live content surfaces word breaks and other layout issues before export. Specific design or model changes are still not listed.
- Experience Orchestration: research stays on [S025](S025%20-%20Experience%20Orchestration%20%28ExO%29.md). This telling adds automatically generated configuration files. What “centerpiece” means, and how those files are shaped, is still open. Generating the files is not ownership of ExO.
- Artifacts: Figma library, Markdown exports, CLI, generated components, Blueprints install path.

## Candidate uses

Strong portfolio/resume centerpiece for Figma-to-code, design-system enforcement, and Contentful-for-Figma evaluation — once artifacts are available. Pair with [P002](../perspectives/P002-build-deep-to-influence.md) for the “build deep to steer the larger program” narrative. Keep separate from DemAI.

## Presentation

Blurb: I created Blueprints, an AI-first design system that earned an internal recognition award and gives Contentful customers an installable reference for best practices in content modeling and design systems. I built a custom workflow that deeply synchronizes Figma and code, combining shared tokens, design exports, and real content to drive AI implementation of every component. Storybook previews and Contentful integrations make the system easy to inspect and use.

- value: Internal award
  label: Deeper AI than expected
- value: Figma-first
  label: AI tokens move both ways

## Addition — September 20, 2026

Scott expanded CIA (Customer Insights and Adoption) context, mentoring-then-takeover, Figma-centric 50-component system, Contentful for Figma battle-testing, Design System Squared (Figma→Markdown→skill→React, tokens, design-first), and influence on Experience Orchestration. Supersedes earlier “export from Contentful → React” summary.

## Addition — October 6, 2026: AI-first walkthrough

Faithful summary of the spoken walkthrough. The full transcript, with timestamps, is [stored separately](../sources/s001-ai-first-blueprints-2026-10-06.md). The source file keeps his words, including caption errors.

He calls Blueprints an AI-first design system he created for his team. The point is an installable reference for customers and prospects that shows best practices for content modeling and for design systems. He says it was built from the ground up on AI-first principles, and that it is primarily constructed in Figma.

The variables are semantic on purpose. The model is supposed to choose text and backgrounds, not only colors, and to understand how a variable works rather than only what is available. He can ask the code side to look at the Figma variables and pull whatever differs into the tokens, and the other way around. He says there is not a single source of truth so much as an easy way to push differences between Figma and the code. Layout changes still start in Figma: he updates the design, then runs the process. That refines the September 20 line that design had to be updated first for every downstream change. Prefer this telling for tokens. Prefer Figma-first for layout.

He uses the Contentful for Figma widget so a component shows real content in real time. The caption says “Contemporary example for Figma widget”; read that as Contentful for Figma. The point is to catch problems that show up only with real text, including word breaks, before the rest of the pipeline. If the component is right here, exporting it is the remaining step.

Each component carries a screenshot and a Markdown token map that states how the Figma variables map. He says there is enough there that the model cannot miss, and that the skill itself only has to know the kind of code he wants. In this telling that is React and CSS, done a specific way. He points the skill at a component after he updates the design snapshot and asks it to see what changed. He makes those updates incrementally, Figma first, and says every component in the system went through this process.

He also has generated configuration files for Experience Orchestration. The caption says “XO” and “a part of Contentful”; read that as ExO. He has Storybook stories so he can preview the components. When something changes, he updates Figma if it is a layout issue, runs the process, and it exports to the Storybook URL.

This walkthrough does not revisit who started the repository, the mentoring, or the component count. Those stay in the September 20 account. He does not show an install count or a released package.

Scott supplied the resume blurb on October 6, 2026. It states that Blueprints earned an internal recognition award. The award’s name, date, and who gave it are not in the walkthrough or that message.

## Addition — October 6, 2026: ownership, mentoring, and design

Faithful summary of his [October 6 account](../sources/s001-ownership-2026-10-06.md). The source file keeps his words.

He took the project on. He mentored someone along the way, and he drove it home to a place they did not expect. He calls that initiative, technical expertise, and teaching. He says he designed and developed it. The “etc.” is not specified.

This sits beside the September 20 sequence, which is several weeks of mentoring and then a takeover because the timeline would not allow that pace. Prefer this telling for the relationship: mentoring continued while he drove the work. Prefer September 20 for the timeline pressure and the several weeks, until he says otherwise.

“Designed” is new against the September 18 line that he did not design it and assembled it. He has not said whether this means the visual design, the system structure, or the workflow. “They” and the unexpected result are not named. The internal recognition award remains a separate statement in the resume blurb.

## Addition — October 6, 2026: design origin, award, and use

Faithful summary of his [later October 6 account](../sources/s001-design-award-use-2026-10-06.md). The source file keeps his words, including typos. He asked that the person he mentored stay unnamed.

The person he mentored was a junior developer. He does not say whether that is the design-team person from September 20.

He pulled the design from Contentful.com and matured it for the content they had. He calls that a from-zero design. That is the answer to what “designed” means in the earlier October 6 account: the starting visuals are the public site, and the design-system work is his maturation of them for their content. The September 18 line that he assembled it still stands as the earlier telling. Prefer this account for where the visuals came from.

The Blueprints team are content experts. They had not expected a design system that mature, or one that deeply integrated with AI. They are the ones who gave him the award. The award’s name and date are still unrecorded. “They” in the earlier sentence is this team, and the unexpected result is that mature AI-integrated design system.

People can use it for inspection. He says it is not really something someone would use. It looks like Contentful.com. That limits the installable-reference purpose: available to inspect, not a system he expects someone to adopt as their own.
