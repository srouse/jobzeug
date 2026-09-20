# S003: DemAI

Captured: September 20, 2026
Status: Expanded account; artifacts and measured outcomes still pending
Evidence: Scott's direct account, not yet supported by inspected artifacts. Portfolio materials mention DemAI separately — treat those as source leads, not verified by this account.

## Resume connection

- Role record: [R002 — Solution Specialist](../roles/R002-contentful-solution-specialist.md), provisional association. Scott said **SC/SE** for his entire tenure in that function.
- Employer: [C001 Contentful](../employers/C001-contentful.md)
- Role: SE / Solution Specialist (source title and end date still unresolved across resume variants).
- Project dates: Scott’s account — **early 2025 through early 2026**, spanning essentially his whole time as an SC/SE. Earlier note that the work was “very early” relative to a late-2025 AI-industry shift still stands for *technology maturity*, not project end date.
- Collaborators: Other SEs as intended/actual users; specific co-builders not named.
- Customers / clients: None named for this capture.

## Account summary

Scott built **DemAI**, an application for Contentful solution engineers. The core idea: the best SE presentation looks like the customer’s own site, while still using Contentful with **best-practice content modeling** — not a hastily assembled lookalike with a weak content model.

The pipeline had **at least a dozen steps**, triggered as a **one-button** run so the whole sequence happened in front of the user. Scott’s account of the main beats:

1. Pull content / information from the website (Firecrawl; he notes being early with that tooling).
2. Abstract a design system from the site.
3. Produce a coherent **top-down content model**.
4. Create the content types.
5. Wire references so relationships make sense.
6. Generate hypothetical content from that model.
7. Pull in **real images**.
8. Create **real entries** based on the content model.
9. Assemble **components that looked identical** to the source page — “literally ripped” into the new design system.
10. **Did not fully complete** weaving into full assembled pages (stopping short of complete page composition).

Natural language remained available, but the guided / one-button path mattered: SEs often did not want to assemble a full MCP package in Claude for the next day’s conversation. Technology evolved across the tenure; toward the end he used SaaS-based agents with **Mastra**.

**Adoption (Scott’s account):** The idea was daily SE use. In practice, the **majority** of use was **ad hoc content-model creation**. Scott used it on **every SE project he created**. He still sees it as a highly reproducible way to get a structured content model — in some ways easier than standing up a full Cursor environment. It was a way to **guide people who lack content-modeling expertise** while still letting the AI “flex,” rather than relying on loose chat alone.

**Explicitly separate:** Scott states DemAI has **nothing to do with** the Design System Agent Kit or [S001 Blueprints](S001%20-%20Blueprints.md). Do not merge or treat as the same accomplishment.

**Name:** DemAI — “Demo” and “AI” combined; also linked by Scott to Hebrew *demai* (suspect / cautious / “doubtfully tithed produce”). Etymology is Scott’s account; not independently verified here.

## Useful original wording

> “the best presentation that an SE can give is the one that looks like their customer. But just happens to use Contentful and use it with best practices too”

> “it's not that interesting to just kind of slop a build”

> “at least a dozen steps”

> “came up with a coherent top-down content model”

> “wired them together 'cause there's references, so those needed to make sense”

> “components that looked identical to what was on the page, literally ripped and then put into our new design system”

> “It was one button press, so the whole thing happened in front of you at one time”

> “Majority of what happened is they started using this to create content models or ad hoc”

> “I used out of every single project that I created within the SEs”

> “even now it's probably easier to go down this path… than it is to set up the entire cursor and environment… because it is really reproducible”

> “This has nothing to do with… the design system agent kit or blueprints”

> “figuring out how to guide people but yet still let the AI do its thing and really flex its muscles”

## Workflow as described

One-button orchestration of a multi-step (dozen+) pipeline. Beats Scott named explicitly:

1. Pull website content (Firecrawl).
2. Abstract design system.
3. Derive coherent top-down content model.
4. Create content types.
5. Wire reference relationships.
6. Generate hypothetical content from the model.
7. Ingest real images.
8. Create real entries from the model.
9. Produce page-identical components in the new design system.
10. Full page assembly: **not completed**.

Plus: NL + guided path; post-run massaging expected; Mastra/SaaS agents later in the project’s life.

Exact agent boundaries per step, failure modes, and evaluation criteria remain undescribed.

## Ownership and scope

- Scott reports creating and heavily using the application across his SE projects.
- Intended: daily SE demos. Observed: strong secondary use for structured content-model generation.
- Scope includes crawl → design-system abstraction → model → types → refs → entries/assets → components; not full page composition.
- Separate from Blueprints and Design System Agent Kit per Scott.

## Potential relevance to Figma role

- Guided agent workflows that encode expert content-modeling practice for non-experts.
- End-to-end path from real customer sites to components + structured content.
- Reusable SE enablement with one-button reproducibility.
- Honest scope limit: components yes, full pages not finished.

Relevance only — portfolio speed claims and production status still need separate confirmation.

## Follow-up queue

- Confirm SC vs Solution Specialist title wording; R002 end date still unresolved in sources.
- List or diagram all ~dozen steps; which were agents vs deterministic code?
- How was “best practice” / top-down model quality judged? What failed often?
- Full page assembly: why stopped, and what would finish it?
- Artifacts: repo, recordings, one-button demo, Firecrawl/Mastra configs.
- Portfolio “68% faster” claim: confirm, revise, or reject (still source-only).

## Candidate uses

Strong project for guided agentic content modeling and SE enablement. Safe to keep independent of S001 and any Design System Agent Kit case. Defer speed/ARR-style claims until measured.

## Related source lead (not this account)

[Portfolio research](../sources/portfolio-research.md) describes DemAI and claims including faster demo creation. Those remain existing-material claims pending Scott’s confirmation.

## Addition — September 20, 2026

Scott clarified tenure-spanning dates (early 2025–early 2026), the multi-step one-button pipeline (including design-system abstraction, top-down model, types, references, hypothetical then real entries/images, page-identical components, incomplete full pages), actual adoption pattern (ad hoc models; he used it on every SE project), reproducibility vs Cursor setup, guidance-for-non-experts theme, and explicit non-overlap with Design System Agent Kit and Blueprints.
