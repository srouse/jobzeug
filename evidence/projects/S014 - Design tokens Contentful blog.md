---
schema_version: "1.1"
project_id: S014
title: Design tokens explained (article)
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
  vocabulary_version: "1.5.0"
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
      - local:design-system-fundamentals
      - local:design-token-fundamentals
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
  - id: S014-E002
    statement: Used the article to show tokens as the hub of distribution, then a simple semantic
      grid, so a content company could grasp the idea without an elaborate naming scheme.
    concept_ids:
      - local:technical-writing
      - local:technical-article
      - local:design-system-fundamentals
      - local:design-token-fundamentals
    ownership: sole
    scope: external_audience
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "../sources/s014-design-tokens-walkthrough-2026-09-28.md"
        locator: "0:01:20 and 0:02:21"
        supports: He says tokens are mechanically the hub, and that the last grid is what keeps people
          from getting lost in elaborate naming.
    limitations:
      - The grid and the hub are his walkthrough of the published article, not a new system he shipped.
      - The caption name for Contentful's own design system is unclear. His point is that it still does
        not use semantic tokens, and that this is getting it into trouble. That judgment is his.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S014-E003
    statement: The article has ranked in the top 10 of Contentful blog performance for a couple of
      years. After the CEO read it, he made a video and presented it to the company.
    concept_ids:
      - local:technical-article
    ownership: sole
    scope: external_audience
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "../sources/s014-design-tokens-walkthrough-2026-09-28.md"
        locator: "0:00:06 and 0:00:24"
        supports: He says this article is over two years old, ranks in the top 10 on the Contentful
          blog, and that the CEO made a company video about it because it resonated.
    limitations:
      - Top 10 and a first-page search for Design Tokens are his account. No analytics export or search
        result is in the file.
      - The CEO video is not an artifact in this workspace.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S014-E004
    statement: Drafted the article from speech-to-text and used AI to clean it up quickly, early in his
      use of that method, so the ideas stayed his. Professional editors then made one or two small updates.
    concept_ids:
      - local:ai-assisted-editing
      - local:technical-writing
    ownership: sole
    scope: individual
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "../sources/s014-account-2026-09-28.md"
        locator: "I also used AI to edit this"
        supports: He dictated the article, used AI to clean the draft quickly, and says professional
          editors made one or two small updates on a long piece.
    limitations:
      - No prompt, draft, or editor markup is in a source file. One or two updates is his count.
      - Early and first experience are his placement in time, not a dated milestone.
      - Another person helped talk through some ideas. He does not name them or say what they changed.
        He says he carried the piece through.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
  - id: S014-E005
    statement: Drew the article's illustrations himself so the figures carry the explanation.
    concept_ids:
      - local:explanatory-illustration
    ownership: sole
    scope: individual
    delivery_stage: production
    provenance: self_report
    sources:
      - ref: "../sources/s014-account-2026-09-28.md"
        locator: "the illustrations were all done by me"
        supports: He says he made the illustrations, and that the visuals connect with the language.
    limitations:
      - The illustration files are not in this workspace. How good they are is his judgment.
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
concept_proposals: []
---
# S014: Design tokens explained (article)

Captured: September 22, 2026
Status: Initial capture from published article + Scott’s performance account; analytics not independently verified
Evidence: Artifact-supported (public article); Scott’s accounts for ranking/SEO performance; portfolio/resume also cite this piece

## Resume connection

- Role record: [R003 — Senior Software Engineer](../roles/R003-contentful-senior-software-engineer.md) at [C001 Contentful](../employers/C001-contentful.md). **Published May 16, 2024** — squarely inside R003 (Feb 2024–Jan 2025). LinkedIn R003 already claims external writing on design systems; resume bullets cite a top-performing Contentful post.
- Employer: [C001 Contentful](../employers/C001-contentful.md)
- Public artifact: https://www.contentful.com/blog/design-token-system/
- Author index: https://www.contentful.com/blog/author/scott-rouse/
- Customers / clients: None. Thought-leadership / enablement writing, not a named CU/CL engagement.
- Related: State Farm token work [S005](S005%20-%20State%20Farm%20tokens.md) / [S006](S006%20-%20State%20Farm%20Figma%20design%20system.md) is earlier enterprise practice; this article is Contentful-published teaching, not State Farm delivery.
- Walkthrough transcript, kept separate: [S014 walkthrough, September 28, 2026](../sources/s014-design-tokens-walkthrough-2026-09-28.md). Open it for the spoken detail. Do not treat it as the project account.
- September 28 account, kept separate: [S014 account, September 28, 2026](../sources/s014-account-2026-09-28.md). Open it for what he said about AI editing, the illustrations, and the professional edit.

## Resume summary

I wrote [Design Tokens Explained](https://www.contentful.com/blog/design-token-system/) for Contentful to make a complex design systems topic accessible to people across design, engineering, and content. Through clear visuals and a practical example built step by step, I show how tokens turn design decisions into a shared language teams can use. More than two years after publication, it ranked among Contentful’s top 10 blog posts by performance, and our CEO highlighted it in a company-wide video. It reflects a strength I bring to my work: understanding complex systems deeply enough to make them approachable and useful to others.

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

## Presentation

Blurb: I wrote and illustrated Contentful’s public guide on layered tokens, using AI to clean a speech-to-text draft so editors made one or two fixes. The recording is the semantic grid.

Video: 2tn2GLHJ4gYwd3j2szwhl9

- value: Top 10
  label: Contentful blog performance
- value: Semantic grid
  label: Show what is missing too

## Addition — September 28, 2026: walkthrough transcript

Faithful summary of the spoken walkthrough. The full transcript, with timestamps, is [stored separately](../sources/s014-design-tokens-walkthrough-2026-09-28.md).

He has written several design-token articles. This one is over two years old. He says it ranks in the top 10 for performance on the Contentful blog, and that a search for Design Tokens has a very good chance of showing it on the first page. The SEO result surprised him. The CEO read it and made a video that was presented to the company because it resonated. That video is not in this workspace.

The goal was to distill tokens for a company that is about content, not a design-system company. He did not go deep on any one idea. He built the explanation across the article, starting with visuals for how tokens are distributed. His point is that tokens are mechanically the hub, and the rest can follow from that. Primitives are where the basic choices are pinned, including when to use stepping and when not to, and that returns to the distribution story.

What he liked was the move into semantics, and why semantics rather than primitives. He says Contentful’s own design system still does not use semantics and is getting into trouble for it. The caption renders that system’s name unclearly. He thinks AI looks for semantic tokens and does not necessarily want primitives.

The part he finds most interesting is the last grid. People build elaborate naming and grouping and then feel they will never know enough. The grid uses an x and a y axis, including interactive and emphasis, and it shows what is missing as well as what is there. He does not think you need a naming convention that stacks every combination. He thinks boiling it down, rather than digging into the machinery, is what made this article different, and why he is proud of it. He expects it to be his most successful article because it has held up for a couple of years. That ranking and that expectation are his judgment.

## Addition — September 28, 2026: AI editing and illustrations

Faithful summary of his [September 28 account](../sources/s014-account-2026-09-28.md). The source file keeps his words.

He dictated the article and used AI to clean that speech-to-text draft quickly. He calls it an early, first experience of working this way. The point for him was keeping what he was coming up with original and well thought out, and seeing how AI could execute the cleanup. Professional editors then made one or two small updates. He says a long, robust article flew through that last phase. No draft or editor markup is saved here.

He drew the illustrations. He treats that as part of explaining: visuals that connect with the language. The figure files are not in this workspace.

Another person helped him talk through some of the ideas. He does not name them. He says the through-line was his: he had the idea, understood it, and carried it to publication.

[Project index](INDEX.md) · [Role index](../roles/INDEX.md) · [Workspace guide](../README.md)
