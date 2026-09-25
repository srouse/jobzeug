# S019: Summit application design system

Captured: September 25, 2026
Status: Expanded Scott account September 25, 2026; exact months and system name still open
Evidence: Scott's direct account; aligns with R005 resume/LinkedIn StencilJS/Lit claims (those are separate sources, not independent verification)

## Resume connection

- Role record: [R005 — Experience Designer](../roles/R005-summit-experience-designer.md) at [C003 Summit Credit Union](../employers/C003-summit-credit-union.md) (Aug 2020 – Jun 2023). Scott confirms this was the **Experience Designer** role — not the earlier Design Innovation tenure. Exact project months within that tenure still open.
- Employer: [C003 Summit Credit Union](../employers/C003-summit-credit-union.md)
- Collaborators: Not named. Org context: Summit, like many credit unions, **third-parties most services**; initiative to **centralize APIs** and build **custom applications**. Prior UI approach used an **off-the-shelf** system that was hard to use.
- Customers / clients: None named. Consuming apps were **internal**; one named example is a **branch teller interface** (disclosure: internal financial tooling — treat carefully in public copy).
- Related: [S011](S011%20-%20Figma%20Design%20System%20widget.md) is a **personal** Figma Community widget date-anchored to Summit — **not** this Summit delivery. Do not merge. **Figma plugins:** Scott says **no specifics** — leave unnamed; do not invent plugin list. Sibling Summit delivery: [S020 Summit marketing website rebuild](S020%20-%20Summit%20marketing%20website%20rebuild.md) (marketing DS #2 + headless site).

## Resume summary

I built Summit’s application design system—web components and tokens on Stencil, later Lit—so teams could ship custom internal apps instead of fighting off-the-shelf UI tooling.

## Account summary

Scott describes this as the **most successful** Summit Credit Union project he wants captured first.

**Situation:** Summit third-parties most member-facing services (typical credit-union pattern). Leadership wanted more control by **centralizing APIs** and shipping **custom applications**. There was **no design system**; teams used something **off the shelf** that was **extremely difficult** to use — people spent most of their time **fighting the UI tooling** instead of shipping.

**What he built:** An application-oriented **design system** using **web components** because many frameworks were in play; **tokens**; and **some Figma plugins** to help the design→system process (plugin names **not specified**). Built first in **Stencil**; **later ported to Lit** because Lit was a **significantly better framework**. Within **two or three months** they had a **full functioning** design system people were using and found **significantly easier**.

**Example consumer:** Apps were **internal**. One example: an **interface for tellers in branches**, built on the design system, taking a more **holistic** approach by **combining multiple APIs** together (enabled by the API-centralization direction).

**Org impact (Scott’s account):** Summit **changed hiring** for front-end developers — could hire people more focused on **business logic**, which he argues matters more in a **financial** setting than obsessing over getting the UI to work. System is **still used** (as of this capture) and he describes a **huge impact** on Summit’s ability to create custom interfaces.

## Useful original wording

> “the one and the most successful one is I actually created a design system first for application use”

> “they actually third party the majority of their services”

> “wanted to take control… by centralizing the APIs and then make custom applications for their customers”

> “they didn't have a design system at the time. They're using something off the shelf and it was extremely difficult to use”

> “spending most of their time… just messing with that and struggling with it”

> “design system using web components because we had a lot of different frameworks out there”

> “implemented the tokens as well as some Figma plugins”

> “within two or three months we had a full functioning design system that people were using significantly easier”

> “changed their entire approach to hiring front end developers”

> “people who could be more focused on business logic which is extremely more important within a financial setting”

> “It is still used to this day and has had a huge impact on Summit's ability to create custom interfaces.”

> “This was the experience designer roles.”

> “I used Stencil for the application design system, but later ported to Lit because it was significantly better framework.”

> “No specifics on plugins”

> “The specific apps were internal, but one example was an interface for tellers in branches.”

> “It was built with design system and could take a more holistic approach and combine multiple apis togther.”

## Workflow as described

1. Credit-union pattern: heavy third-party services; desire for API centralization + custom apps.
2. Pain: no DS; off-the-shelf UI stack hard to use; time lost on UI plumbing.
3. Scott creates application DS on **Experience Designer (R005)** tenure: web components (multi-framework), tokens, unnamed Figma plugins.
4. Initial implementation in **Stencil**; later **port to Lit** (Lit judged significantly better).
5. ~2–3 months to a functioning system teams actually use more easily.
6. Internal apps consume it — e.g. **branch teller UI** composing **multiple APIs** holistically.
7. Hiring shift toward business-logic-strong front-end talent; system continues in use.

## Ownership and scope

- Scott: created the design system (Stencil → Lit web components, tokens, Figma plugins — plugins unnamed) — sole authorship vs team size not specified.
- Adoption, “still used,” hiring-change, and teller-app example are **Scott’s account**; not independently verified here.
- System/library **name** and exact calendar months still open.

## Potential relevance to Figma role

- Design system from zero for multi-framework product apps; Stencil→Lit migration judgment.
- Tokens + Figma plugins as part of delivery (plugins unspecified — do not invent).
- Concrete consumer: branch teller UI composing multiple APIs on the DS.
- Org leverage: reduce UI tax so product people focus on domain/business logic.
- Durable adoption claim (still in use) — needs artifact/corroboration for portfolio strength.

## Follow-up queue

- Approximate start/end months within R005; system/library name if any.
- When Stencil→Lit happened relative to the ~2–3 month launch; migration scope.
- ~~Figma plugin names~~ — Scott: no specifics; drop unless he volunteers later.
- Other internal apps beyond tellers; any adoption metrics or before/after examples.
- Artifacts appropriate to show (components, tokens — disclosure permitting for internal banking UI).

## Candidate uses

Strong Summit centerpiece for design-system + web-components + tokens + multi-API product UI. Keep separate from personal Figma Community widgets (S011–S013). Pair with [S020](S020%20-%20Summit%20marketing%20website%20rebuild.md) and [S021 Rates Central](S021%20-%20Rates%20Central.md). Treat teller UI carefully in public materials (internal financial tooling).

## Addition — September 25, 2026

Scott confirmed **Experience Designer (R005)**; **Stencil** first then **port to Lit**; **no plugin specifics**; consuming apps **internal**, with **branch teller interface** as example of DS-backed holistic multi-API UI.
