# Jobzeug — the living application

Created September 23, 2026. Status: canonical description of **this product** — the password-gated web app a reviewer or interviewer is interacting with right now. Not a career project record (those are **S00x**). Use this file when someone asks how Jobzeug works, what they are looking at, what the chat agent is, how highlights/citations work, or what the stack is.

## One-sentence pitch

**Jobzeug** is a private, evidence-backed application surface for Scott Rouse’s candidacy: a Contentful-driven interactive resume, a session-bound job posting (“need”), and a Mastra agent that argues fit from the Markdown career record — citing stable IDs so the UI can highlight matching resume rows and posting lines.

## Who it is for

| Audience | What they use it for |
|---|---|
| Scott | Keep a durable career knowledge base, sync it into a living resume, bind a target posting, rehearse and refine the fit narrative with the agent. |
| Reviewers / interviewers | Inspect experience against a specific role without relying on a static PDF alone; ask the agent how Scott’s record maps to the posting; see the same IDs light up on the resume and the listing. |

It is **not** a public marketing site. Access is gated by a shared site password.

## What problem it solves

Hiring conversations usually split three things that should stay aligned:

1. **Facts** — what Scott actually did (dates, ownership, outcomes, uncertainty).
2. **Presentation** — resume layout and narrative for a human reader.
3. **Fit argument** — how those facts answer *this* employer’s *this* posting.

Jobzeug keeps (1) as a versioned Markdown workspace (`evidence/`), projects (2) as a Contentful-backed resume SPA, and runs (3) as a chat agent that may only ground Scott-claims in evidence and may only treat the bound posting as **need**, never as proof of experience.

## Product surfaces

| Route | What it is |
|---|---|
| `/login` | Shared password gate. Sets an httpOnly signed session cookie for the whole site (including APIs). |
| `/` | Shell / landing into the product. |
| `/resume` | Primary SPA: resume document + job posting panel + resume chat dock + highlight system. |
| `/chat` | Smoke / alternate chat surface against the same agent, separate memory thread. |
| `/api/resume` | JSON view model from Contentful Delivery (employers / roles / projects). |
| `/api/chat` | Streaming chat (`handleChatStream`) with session-scoped Mastra memory. |
| `/api/job-posting` | Scrape → structure → Contentful tree → bind cookie for the session. |
| `/api/login`, `/api/logout` | Session cookie set / clear. |

### Resume page composition

On `/resume`, several panels share one highlight context:

- **Resume document** — employers, roles, and projects rendered from Contentful, each row tagged with a stable evidence ID (`C00x` / `R00x` / `S00x`) via `data-evidence-id`.
- **Job posting panel** — the bound listing broken into lines with stable entry IDs (`jz-JP…-line-N`).
- **Resume chat dock** — conversation with `jobzeug-agent` (`surface=resume`). Assistant turns can activate an **evidence cluster** (cited IDs + timing).
- **Play toolbar** — bind/unbind a posting URL and open chat.

Clicking a prior assistant message re-selects that turn’s citation cluster so highlights jump back to what that answer claimed.

## Evidence vs need (non-negotiable product rule)

| Kind | Where it lives | What it is | What it is not |
|---|---|---|---|
| **Evidence** | `evidence/` Markdown (+ Contentful projections of employers/roles/projects) | Scott’s career record: orgs, tenures, projects, customers, clients, perspectives, sources | Not inventable; not equal to job-posting text |
| **Need** | Session-bound posting (cookie + chat system context) | What the employer is hiring for: responsibilities, required/preferred lines, tools | **Never** evidence that Scott did those things |

Full job listings are **not** stored under `evidence/`. Condensed historical notes may exist under `sources/job-posting-notes.md` only. Live listings are bound for the session in the app.

### Evidence entity IDs

| ID | Kind | Folder |
|---|---|---|
| **C00x** | Employer | `employers/` |
| **R00x** | Role | `roles/` |
| **S00x** | Project | `projects/` |
| **CU00x** | Customer | `customers/` |
| **CL00x** | Client | `clients/` |
| **P00x** | Perspective | `perspectives/` |

Goal.md skill IDs **S1–S6** are a separate namespace from project IDs **S00x**. Prefer indexes (`README.md`, `Goal.md`, role/employer/project indexes) then search then read.

Public disclosure: customer and client names default to **not cleared** for polished public copy unless a record says otherwise.

## End-to-end flows

### A. Evidence → Contentful → resume

1. Career facts are authored and maintained as Markdown under `evidence/`.
2. `contentful:compress` parses evidence into JSON under `evidence/outputs/`.
3. `contentful:apply` / `contentful:push` sync Employer / Role / Project content types and `jz-*` entries.
4. The resume SPA reads via Contentful Delivery (`/api/resume`) and renders the living document.

Evidence remains the source of truth; Contentful is the delivery projection for the UI.

### B. Bind a job posting (need)

1. User submits a posting URL from the resume UI.
2. The server scrapes the page (Firecrawl), runs a **stateless** structurer agent (`job-posting-structurer`), and writes a Contentful tree with stable line IDs.
3. A signed cookie binds that posting to the session.
4. Chat requests inject a formatted need block as **system** context (slim line list, not a dump of the whole page as Scott’s history).

### C. Chat → cite → highlight

1. The dock sends **only the newest user message** to `/api/chat` (Mastra memory holds thread history server-side).
2. Optional client hand-off includes the bound posting payload so the server can format need without another CMA round-trip when possible.
3. `jobzeug-agent` may use read-only workspace tools (list / read / grep / BM25 search over `evidence/**/*.md`) and **must** call `citeEvidence` with accurate `employers` / `roles` / `projects` / `jobLines` IDs.
4. The UI extracts citation tool parts into an **EvidenceCluster**, sets highlighted IDs, and styles matching resume rows and posting lines (blue text — no icon rollup).
5. The agent’s user-visible answer is a short third-person paragraph about Scott, framed to the need when a posting is bound.

Memory threads are scoped per session and surface (`chat` vs `resume`) so resume rehearsal and smoke chat do not collide.

## The agent (`jobzeug-agent`)

| Concern | Behavior |
|---|---|
| Voice | Hiring-side advocate for Scott; third person (“he”, “Scott”); never first person as the candidate |
| Grounding | Scott-claims only from `evidence/`; posting text only names the need |
| Tools | Built-in workspace tools (read-only) + `citeEvidence` (validate and return ID lists for the UI) |
| Memory | Postgres-backed Mastra memory (titles + observational memory); resource/thread derived from the signed session |
| Model | Configured OpenAI chat model for the agent; lighter model for observational memory |

A second agent, **`job-posting-structurer`**, only extracts structured listing fields. It has no evidence workspace and no conversational memory.

When asked about Scott’s career, the agent should read evidence records. When asked about **this application**, it should read **this file** (and optionally the repo `README.md` for operator setup details that are not product narrative).

## Technology stack

| Layer | Choice | Role in Jobzeug |
|---|---|---|
| App framework | **Next.js** (App Router), React 19 | UI + API routes in one deploy |
| Agents | **Mastra** embedded in Next (`src/mastra/`) | `jobzeug-agent`, structurer, workspace, Studio locally |
| Chat UI protocol | **AI SDK** (`ai`, `@ai-sdk/react`) + `@mastra/ai-sdk` | `useChat` / `handleChatStream` streaming |
| Career CMS | **Contentful** (CDA resume, CMA sync + job trees) | Delivery for resume; management for push/bind |
| Agent memory DB | **Vercel Postgres** via `@mastra/pg` | Thread/message persistence |
| Design system | **`@jobzeug/design-system`** (Lit `jz-*`, semantic tokens) | Buttons, text, icons, tokens — consumed, not authored in the app tree |
| Auth | Shared `SITE_PASSWORD` + HMAC-signed httpOnly session cookie | Fail closed without secrets |
| Evidence search | Mastra Workspace + BM25 over Markdown | Agent retrieval without writing the corpus |

Architecture note: production is **one Next.js deploy** with Mastra inside API routes — not a separate always-on Mastra server. Mastra Studio is for local agent building.

### Design-system consumption hierarchy (app UI)

1. Prefer published `Jz*` React components.
2. Else semantic tokens (`--jz-semantic-*`).
3. Primitive tokens only when nothing else fits.

## What this is *not*

- Not a replacement for the Markdown evidence corpus (do not treat the chat transcript as source of truth).
- Not a place to archive full job postings under `evidence/`.
- Not Scott speaking in first person — the chat persona is an advocate *about* him.
- Not unsupervised invention of employers, metrics, dates, or customer names.
- Not a free-for-all public site (password gate).

## How to talk about it in chat

Good framing when a visitor asks “what is this?” / “how does this work?”:

- Name **Jobzeug** as the product.
- Separate **evidence** (Scott’s record) from **need** (bound posting) from **agent** (fit argument + citations).
- Explain that highlights are driven by `citeEvidence` IDs shared with the resume and job panel — not by guessing from free text alone.
- For stack questions, summarize the table above; for career questions, go back to employers / roles / projects.

Do not claim features that are not shipped. Prefer this file over improvising architecture.

## Related workspace entry points

- [Workspace guide](README.md) — how to navigate the evidence corpus
- [Goal and skill framework](Goal.md) — Figma FDE candidacy framing (F1–F10, S1–S6)
- [Sources index](sources/INDEX.md) — provenance snapshots
- Repo root `README.md` — operator setup, env vars, scripts (outside this folder; mention only at a high level unless the user is asking for run instructions)

## Maintenance

When product behavior changes in a way that would mislead a visitor (new surface, different citation model, posting no longer session-bound, etc.), update **this file in the same change**. Keep career project narratives in `projects/`; keep this document about the application itself.
