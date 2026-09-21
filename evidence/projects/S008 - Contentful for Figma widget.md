# S008: Contentful for Figma widget

Captured: September 20, 2026
Status: Initial account; prospect names and adoption metrics pending
Evidence: Scott's direct account; resume also claims this widget — still not independently artifact-verified here. Prefer **widget** (Scott’s correction); earlier materials sometimes say plugin.

## Resume connection

- Spans roles: **v1** under SE / Solution Specialist work ([R002](../roles/R002-contentful-solution-specialist.md), provisional); **production** under latest title / CIA — Customer Insights and Adoption ([R001 — Senior Product Architect](../roles/R001-contentful-senior-product-architect.md)).
- Employer: [C001 Contentful](../employers/C001-contentful.md)
- Project dates: v1 in **two or three days** (SE request). Production operationalization over the **last two or three months** (Scott’s account, relative to capture date September 20, 2026). Exact calendar months TBD.
- Collaborators: Requesting SE(s); **two or three prospects** involved early (names TBD — prospects deferred, do not create CU/CL yet). Later: **PM** via product marketing path; **security** sign-off. Sitting **outside core product**.
- Perspective: Strong [P002](../perspectives/P002-build-deep-to-influence.md) example — walk ahead, then operationalize.
- **Naming collision:** In-widget “blueprint” (wireframe outline showing content status) is **not** [S001 Blueprints](S001%20-%20Blueprints.md) the CIA installable repo/design system.

## Account summary

An SE asked Scott for an example of **connecting Figma to Contentful** for a prospect sale. About **two or three prospects** were in the mix; initial requester name TBD.

He built **v1 in two or three days** and solved a hard visualization problem he had struggled with earlier: **how content connects to a design**. Alongside the binding UI he created a **blueprint** — a wireframe-style outline that shows **content status** — which unlocked the rest of the solution. Do not confuse with S001 Blueprints.

When he moved into **CIA**, he **proposed** it as a project he could take to **production**. Over roughly **two or three months** he **fully operationalized** it: path through **product marketing**, secured a **PM**, completed **security** and related production work, and shipped it **live** and **public**. There has been **little or no marketing**, so usage numbers are still **low**; impact trajectory is still open. He still calls it a **very big deal**.

Technically he demonstrated **data assembly through binding** — connecting content to components — and pushed far ahead of **Experience Orchestration**, which he says must do similar binding but currently looks like **“Lincoln Logs”** next to this widget: weaker UX and less behind-the-scenes capability in more time. His implementation includes joining **multiple entry properties into one**, **date** handling, and related binding details.

## Useful original wording

> “specifically a widget”

> “built the initial v1 of this in two or three days”

> “how do you actually visualize how content connects to a design?”

> “created a whole blueprint that sits next to it… wireframe outline that actually shows the status of the content… Don't confuse this with the other blueprints”

> “when I moved into the CIA, I proposed it as a project… bring to production… operationalized it fully”

> “sitting outside of product… went through product marketing… got a PM… security to sign off… now live”

> “no marketing, so the numbers are still pretty low”

> “data assembly through binding. How do you connect a content to a component?”

> “Experience orchestration has to do the same thing, but it looks like Lincoln Logs compared to what I built”

> “ways of joining multiple entry properties into one and how to do dates”

> “it's public”

## Workflow as described

1. SE request: show Figma↔Contentful for prospect sale(s).
2. Build v1 in 2–3 days; invent content-status “blueprint” outline beside the design; unlock binding visualization.
3. Move to CIA; propose production project.
4. Operationalize outside core product: product marketing, PM, security, ship public Figma Community widget.
5. Live with limited marketing / low usage so far; continue ahead of Experience Orchestration on binding UX and assembly features.

## Ownership and scope

- Scott: v1 invention, production delivery ownership through non-product path, binding/assembly features, content-status blueprint UX.
- SE(s) and early prospects: request / sales context.
- PM + security + product marketing: production gatekeepers.
- Experience Orchestration: separate initiative; comparison is Scott’s assessment, not a measured bake-off unless later evidenced.

## Potential relevance to Figma role

Public Figma widget connecting live structured content to components; binding/data assembly; design-time preview of content status; path from field prototype to secured production outside the main product org; influence on a larger platform effort (Experience Orchestration) by being ahead.

## Follow-up queue

- Initial SE and 2–3 prospect names (prospects → note only until closed/cleared).
- Exact v1 and GA dates; Figma Community URL.
- What “blueprint” content-status UI shows (fields, states).
- Binding model: multi-property joins, dates, other transforms — list capabilities.
- Security / PM / marketing path details; why outside product.
- Usage numbers and any qualitative feedback despite low marketing.
- Dedicated Experience Orchestration project for fair comparison.

## Candidate uses

Top-tier Figma FDE portfolio piece once URL and binding details are documented. Resume already claims it — align wording to **widget**, production outside product, and P002 “ahead then operationalize.” Keep S001 Blueprints and in-widget blueprint visually distinct in any public write-up.

## Addition — September 20, 2026

Initial capture: SE-driven v1, content-status blueprint unlock, CIA production path, public live widget, binding vs Experience Orchestration comparison.

## Addition — September 21, 2026

Scott described a separate AI binding exploration for the widget: [S009 AI content and component binding](S009%20-%20AI%20content%20and%20component%20binding.md). It uses semantic metadata from content entries and component examples to improve mappings and explore repair. Scott reports consistent experimental results, but this capability is **not yet integrated into the shipped widget**: safe metadata storage remains unresolved. See S009 for the full account.

He presented that work during [S010 Berlin prototype exploration](S010%20-%20Berlin%20prototype%20exploration.md); the broader Berlin account is pending. The existing widget terminology is retained from his earlier explicit correction; his latest narration also called it a plugin.
