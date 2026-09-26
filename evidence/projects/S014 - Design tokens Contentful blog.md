---
schema_version: "1.1"
project_id: S014
title: Design tokens explained (Contentful blog)
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S005
  - S006
  - S022
role_links:
  - id: R003
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
year: 2024
year_basis: sourced
year_note: 2024 publication year recorded for the May 16, 2024 article.
delivery_stage: production
annotation:
  status: reviewed
  vocabulary_version: 1.0.0
  reviewed_by: Codex
  reviewed_at: "2026-09-26"
public_disclosure: needs_review
evidence:
  - id: S014-E001
    statement: Authored the published guide explaining primitive, semantic, and component token layers
      and distribution across design and code tools.
    concept_ids:
      - local:technical-writing
      - local:technical-article
    ownership: sole
    scope: external_audience
    delivery_stage: production
    provenance: existing_material
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Authored the published guide explaining primitive, semantic, and component token layers
          and distribution across design and code tools.
    limitations:
      - Authorship and publication are recorded in the local public-source capture; the live article
        was not rechecked in this migration.
      - Article content does not prove implementation of every described integration.
      - Search ranking and top-performing claims require separate verification.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
concept_proposals: []
---
# S014: Design tokens explained (Contentful blog)

Captured: September 22, 2026
Status: Initial capture from published article + Scott’s performance account; analytics not independently verified
Evidence: Artifact-supported (public article); Scott’s accounts for ranking/SEO performance; portfolio/resume also cite this piece

## Resume connection

- Role record: [R003 — Senior Software Engineer](../roles/R003-contentful-senior-software-engineer.md) at [C001 Contentful](../employers/C001-contentful.md). **Published May 16, 2024** — squarely inside R003 (Feb 2024–Jan 2025). LinkedIn R003 already claims external writing on design systems; resume bullets cite a top-performing Contentful post.
- Employer: [C001 Contentful](../employers/C001-contentful.md)
- Public artifact: https://www.contentful.com/blog/design-token-system/
- Author index: https://www.contentful.com/blog/author/scott-rouse/
- Customers / clients: None. Thought-leadership / enablement writing, not a named CU/CL engagement.
- Related: State Farm token work [S005](S005%20-%20State%20Farm%20tokens%20persuasion.md) / [S006](S006%20-%20State%20Farm%20Figma%20design%20system.md) is earlier enterprise practice; this article is Contentful-published teaching, not State Farm delivery.

## Resume summary

I wrote Contentful’s public guide on layered design tokens—primitive, semantic, and component—using color as the worked example for distribution across Figma, code, and Studio.

## Account summary

<a id="source-account"></a>

**Published guide** (Scott Rouse, Contentful blog, May 16, 2024): walks readers from first principles through building a **layered design-token system**, using **color** as the worked example.

**What the article teaches (artifact-supported):**

- **Definition:** Tokens capture design decisions (color, type, borders, motion, etc.), typically in **JSON**, transformed for many targets (CSS variables, iOS objects, Figma variables, Tailwind/Sass, Style Dictionary / Knapsack, and even Contentful Studio as a consumer endpoint).
- **Three layers:**
  - **Primitive** — curated raw values (e.g. brand primary hex; stepped palettes Primary 500 / lighter–darker; neutrals; feedback/stoplight colors); WCAG-aware construction.
  - **Semantic** — usage-bearing aliases (e.g. `text-default` → gray 200) that embed *how* primitives should be applied, reducing social ambiguity when primitives alone allow inconsistent “acceptable” component colorings.
  - **Component** — per-component attributes (e.g. button corner radius) for theming / multi-brand; warns that this layer adds abstraction cost and may be unnecessary for single-theme systems.
- **Distribution & aliases:** Same naming across exports; semantic tokens as CSS/var aliases and Figma variable references so teams speak a shared design language.
- **Semantic grid:** 2D model balancing multi-state tokens (hover/active) vs terminal ones; explicit *non*-expansion to avoid combinatorial token explosion (“subtle secondary background hover”).
- **Studio mapping:** Shows how a semantic layer can feed **Contentful Studio** token UX for content creators (text/background guidance at the level people naturally think).
- **AI framing:** Argues Figma + Tokens Studio make tokens “source-file capable,” and that **AI amplifies whatever foundation exists**—strong tokens become a competitive necessity; AI will not fix a weak system.

**Scott’s performance account (September 22, 2026):** This piece **has been a top-10 performer for a couple of years** and **generally ranks in the top 10 when you Google “Design Tokens.”** Resume/portfolio variants also claim top-five / top-ten Contentful blog performance — treat as **source claims**; confirm analytics window and Google SERP date before polished use.

## Useful original wording

Scott (performance):

> The Design Tokens 1 in particular has been a top 10 performer for a couple of years now and generally comes up in the top 10 when you search Google for Design Tokens.

Article (concept):

> AI will amplify and extend the foundational structures provided… With a solid base of design tokens… asking AI to scale out your design system will not only work, but will be what you will be competing against soon.

## Ownership and scope

- Authorship of the published Contentful guide (byline Scott Rouse).
- Not a customer delivery project; no CU/CL.
- Performance claims are Scott’s / resume claims pending analytics corroboration.

## Potential relevance to Figma role

- Public, durable teaching on **tokens ↔ Figma variables ↔ code exports** and Studio.
- Positions tokens as the substrate AI will scale—aligns with Figma + design-system + AI narrative without inventing product ownership.

## Follow-up queue

- Confirm Contentful analytics (rank among posts, traffic window) vs Google SERP claim.
- Reconcile resume “top-five” vs Scott’s “top-10 for a couple of years.”
- Any internal milestone (Partnership Tour talk) tied to this same piece?

## Candidate uses

- Resume / portfolio writing credit; design-system depth signal; interview talking point on semantic layers and AI amplification.

## Sources

- https://www.contentful.com/blog/design-token-system/ (scraped September 22, 2026)
- https://www.contentful.com/blog/author/scott-rouse/
- [Resume working copy](../sources/resume-working-copy.txt); [portfolio research](../sources/portfolio-research.md)

[Project index](INDEX.md) · [Role index](../roles/INDEX.md) · [Workspace guide](../README.md)
