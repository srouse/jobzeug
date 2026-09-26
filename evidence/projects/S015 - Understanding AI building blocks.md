---
schema_version: "1.1"
project_id: S015
title: Understanding AI by its building blocks (Contentful series)
record_kind: project
project_origin: employment
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids:
  - S022
role_links:
  - id: R001
    relationship: delivery
    status: confirmed
    note: Canonical role for both article parts; do not dual-link the title transition.
employer_links:
  - id: C001
    relationship: delivery
    status: confirmed
    note: Employer association recorded in the project account.
customer_ids: []
client_ids: []
year: 2026
year_basis: sourced
year_note: 2026 publication year recorded for both parts (February 26 and March 5).
delivery_stage: mixed
annotation:
  status: needs_review
  vocabulary_version: 1.0.0
  reviewed_by: Codex
  reviewed_at: "2026-09-26"
public_disclosure: needs_review
evidence:
  - id: S015-E001
    statement: Authored a two-part published series explaining model calls, context, structured output,
      tools, MCP, retrieval, and agents.
    concept_ids:
      - local:technical-writing
      - local:technical-article
      - local:ai-system-fundamentals
    ownership: sole
    scope: external_audience
    delivery_stage: production
    provenance: existing_material
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: Authored a two-part published series explaining model calls, context, structured output,
          tools, MCP, retrieval, and agents.
    limitations:
      - Based on the preserved publication capture, not a fresh live check.
      - This is educational authorship, not evidence of implementing every architecture discussed.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
  - id: S015-E002
    statement: The captured Part 1 article includes interactive learning modules showing how changing
      model-call inputs changes behavior.
    concept_ids:
      - local:interactive-learning-material
    ownership: unknown
    scope: external_audience
    delivery_stage: unknown
    provenance: existing_material
    sources:
      - ref: "#source-account"
        locator: Account summary
        supports: The captured Part 1 article includes interactive learning modules showing how changing
          model-call inputs changes behavior.
    limitations:
      - Scott’s personal implementation ownership and stack are unresolved.
      - Several embeds returned deployment errors at the recorded scrape; availability has not been
        rechecked.
    public_disclosure: needs_review
    review:
      status: approved
      reviewed_by: Codex
      reviewed_at: "2026-09-26"
concept_proposals: []
---
# S015: Understanding AI by its building blocks (Contentful series)

Captured: September 22, 2026
Status: Initial capture from published two-part series + Scott’s emphasis on the interactive application; live embeds partially failed during scrape
Evidence: Artifact-supported (public articles); Scott’s account that the interactive app is central to the work; embed host returned Vercel `DEPLOYMENT_NOT_FOUND` during September 22 scrape (content of modules still described in article prose)

## Resume connection

- Role record: **[R001 — Senior Product Architect](../roles/R001-contentful-senior-product-architect.md)** at [C001 Contentful](../employers/C001-contentful.md). Publish dates **February 26, 2026** (Part 1) and **March 5, 2026** (Part 2). Canonical role is Senior Product Architect for both parts (Part 1 falls in the Feb 2026 title transition from Solution Specialist; do not dual-link).
- Employer: [C001 Contentful](../employers/C001-contentful.md)
- Public artifacts:
  - Part 1 (interactive prompt anatomy): https://www.contentful.com/blog/understanding-ai-building-blocks-anatomy-prompt/
  - Part 2 (ecosystem): https://www.contentful.com/blog/understanding-ai-building-blocks-ecosystem/
  - Author index: https://www.contentful.com/blog/author/scott-rouse/
- Scott asked to **roll both parts into one project** even though they are two posts.
- Customers / clients: None. Educational / thought-leadership series.
- Related: Distinct from [S009 AI content and component binding](S009%20-%20AI%20content%20and%20component%20binding.md) (product research) and [S003 DemAI](S003%20-%20DemAI.md) (SE demo platform).

## Resume summary

I authored a two-part Contentful Guides series on AI building blocks, covering prompts through MCP, RAG, and agents, with interactive prompt modules in part one.

## Account summary

<a id="source-account"></a>

Two-part **Contentful Guides** series by Scott Rouse that teaches modern AI systems **from the inside out**, starting at a single model call and then zooming out to the ecosystem built around that primitive.

### Part 1 — An interactive breakdown of a prompt (Feb 26, 2026)

Thesis: Unreliable AI feelings are usually **context problems**, not “need a bigger model.” The **primitive** is one request: text in → something out. Chat UIs *feel* stateful; the model is not.

**Interactive application (emphasized by Scott; described at length in the article):**  
The post is explicitly an **interactive article**. **Each major section embeds a live module the reader can run and modify** to watch how outputs change when the *call* changes—not when the “cleverness” of wording changes in isolation. Modules progress from atomic concepts to a combined lab:

1. **Tokens** — Shows that models see **token fragments** (frequency-shaped), not human words; misunderstandings often come from representation, not “failure to think.”
2. **Building a prompt from nothing** — Start with a broad ask (e.g. help the environment); get generic answers; then add concrete context (location, role, constraints) to see specificity appear because the **total information in the call** changed.
3. **Why prompts don’t persist** — Demonstrates **statelessness**: continuity is re-injected history from the product, not model memory; drop history and the model still answers confidently.
4. **Hidden prompt stack** — System/safety/format/retrieved text merge into one sequence; later instructions can override earlier ones; “prompt quality” is often **systems assembly**.
5. **Structured output** — Constrain to shapes (e.g. JSON) so software can validate/act—structure doesn’t make the model smarter; it makes integration possible.
6. **Tools as constrained actions** — Model emits structured **intent**; execution, permissions, retries stay outside the model.
7. **Putting it all together** — Final combined sandbox: adjust included text, instruction order, output constraints, and tool availability in one place. Article coaches working **in passes** (simple → context → constraint → tool) and **intentionally breaking** the call (reorder, conflict, relax format) so readers internalize: reliability comes from **how you assemble and constrain a single call**.

**Engineering note from capture:** During the September 22, 2026 scrape, several embedded modules returned Vercel **404 / DEPLOYMENT_NOT_FOUND**. Treat as a **hosting/deploy issue at scrape time**, not absence of the interactive design. The article’s pedagogical structure and module purposes remain clear from surrounding prose. Re-verify live embeds before demoing.

Closing argument of Part 1: orchestration, RAG, agents, etc. exist to **compensate for call constraints**—setting up Part 2.

### Part 2 — The AI ecosystem (March 5, 2026)

Zooms out: abstractions exist because a lone call is fragile (no memory, limited context, probabilistic text).

- **MCP:** Bridges model **intent** (structured tool request) and **execution**; packages tool defs + execution loop **outside** the model (permissions, latency, failure handling). “Doesn’t add intelligence… adds operational discipline.”
- **RAG:** Selective recall into the prompt at request time—improves **relevance**, not inherent truthfulness.
- **Agents:** Orchestration of **multiple stateless calls** with app logic between steps—not continuous autonomy; power from sequencing/feedback; fragility from compounding missing context.
- **Systems thinking:** Prompts, tools, MCP, RAG, agents are complementary responses to the same primitive—not competing fads. Progress = better system design around the call, not cleverer wording alone.

## Useful original wording

Scott:

> You can roll that one article about AI or understanding AI into just one project even though there's two parts to it. And please talk at length about the fact that there is an interactive application on it as well that shows how to deal with and what happens to these simple AI prompts at their core.

Article (Part 1):

> Each section includes a live module you can run and modify to see how output changes.

> From the model’s perspective, there is no app, no workflow, and no conversation. There is only the text included in the current call.

## Ownership and scope

- Authorship of both published Guides; interactive modules are part of the Part 1 experience (implementation stack/hosting details not yet captured).
- Not DemAI / not S009 binding research.
- No CU/CL.

## Potential relevance to Figma role

- Rare public artifact that **teaches AI systems thinking by making the prompt call tangible**—strong communication + product-minded engineering signal.
- Bridges tokens/context language from design-systems work into AI enablement for practitioners.

## Follow-up queue

- Confirm interactive-module stack/hosting; fix/redeploy if embeds still 404.
- Did Scott personally build the interactive app end-to-end, or partner with Contentful web/engineering?
- Any internal usage metrics or Partnership Tour crossover?

## Candidate uses

- Portfolio / interactive webpage case; interview deep-dive on AI mental models; resume writing + systems-design proof.

## Sources

- https://www.contentful.com/blog/understanding-ai-building-blocks-anatomy-prompt/ (scraped September 22, 2026)
- https://www.contentful.com/blog/understanding-ai-building-blocks-ecosystem/ (scraped September 22, 2026)
- https://www.contentful.com/blog/author/scott-rouse/
- [Portfolio research](../sources/portfolio-research.md) (earlier note that AI article includes interactive learning application)

[Project index](INDEX.md) · [Role index](../roles/INDEX.md) · [Workspace guide](../README.md)
