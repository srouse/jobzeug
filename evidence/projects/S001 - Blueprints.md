# S001: Blueprints

Captured: September 18, 2026
Status: Expanded account September 20, 2026; artifacts and Experience Orchestration follow-up still pending
Evidence: Scott's direct account, not yet supported by inspected artifacts

## Resume connection

- Role record: [R001 — Senior Product Architect](../roles/R001-contentful-senior-product-architect.md). Scott places the work on the **CIA** team — **Customer Insights and Adoption** (he also said “Customer Adoption” in the same breath; treat **Customer Insights and Adoption** as the expanded form). Aligns with current-role / latest title context (resume: February 2026–present). Exact project calendar dates still not provided.
- Employer: [C001 Contentful](../employers/C001-contentful.md)
- Collaborators: Coworkers on CIA started the repo/initiative (earlier capture named Rob and JD — still to reconcile with titles). A design-team contributor struggled initially; Scott mentored them for several weeks, then took over implementation under timeline pressure.
- Customers / clients: Intended for prospects and customers as installable best-practice starter; no named CU/CL on this capture.
- Related (future project): **Experience Orchestration** — Contentful major initiative (~year+); Scott says Blueprints became a centerpiece / highly influential there. Capture separately when told; do not invent that narrative here.
- Perspective: [P002 Build deep to influence large initiatives](../perspectives/P002-build-deep-to-influence.md) — operating mode illustrated by this work.

## Account summary

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

## Ownership and scope

- Initiative started by CIA coworkers; content-model/repo ownership vs Scott’s design-system/frontend path still to clarify (Rob/JD from earlier capture).
- Scott: mentoring, then takeover; ~50-component Figma system; Contentful for Figma battle-testing; Design System Squared CLI/skills; React generation/maintenance via skill; token sync; Experience Orchestration influence (claimed).
- Intended users: prospects and customers installing Blueprints. Actual install/adoption metrics not yet given.

## Potential relevance to Figma role

- Figma as source of truth with enforced design-first token/component sync to code.
- Contentful for Figma as evaluation harness against live structured content.
- Skill/CLI pipeline from design context (Markdown) to production components at scale (~50).
- Mentoring then accelerating delivery under timeline pressure.
- Field artifact that shapes a larger platform initiative (Experience Orchestration) — pending that project.

## Follow-up queue

- Reconcile Rob/JD vs “coworkers” and who owns content model vs design system.
- Exact project dates; install/release status; real prospect/customer use.
- Design System Squared: repo location, skill contents, export schema, token formats.
- What battle-testing with Contentful for Figma changed in the designs or models.
- Experience Orchestration: dedicated project (S00x) — how Blueprints plugged in and what “centerpiece” means with evidence.
- Artifacts: Figma library, Markdown exports, CLI, generated components, Blueprints install path.

## Candidate uses

Strong portfolio/resume centerpiece for Figma-to-code, design-system enforcement, and Contentful-for-Figma evaluation — once artifacts are available. Pair with [P002](../perspectives/P002-build-deep-to-influence.md) for the “build deep to steer the larger program” narrative. Keep separate from DemAI.

## Addition — September 20, 2026

Scott expanded CIA (Customer Insights and Adoption) context, mentoring-then-takeover, Figma-centric 50-component system, Contentful for Figma battle-testing, Design System Squared (Figma→Markdown→skill→React, tokens, design-first), and influence on Experience Orchestration. Supersedes earlier “export from Contentful → React” summary.
