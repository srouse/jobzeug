---
name: Evidence Mastra workspace
overview: Mount the repo’s `evidence/` folder as a read-only Mastra Workspace on `jobzeug-agent`, with BM25 auto-index of Markdown so Studio and `/chat` can search and read the same knowledge base you already structured for desktop use.
todos:
  - id: workspace-module
    content: Add read-only evidence Workspace (LocalFilesystem + BM25 + autoIndex **/*.md)
    status: completed
  - id: agent-wire
    content: Attach workspace to jobzeug-agent; update instructions for evidence tools
    status: completed
  - id: init-readme
    content: Singleton init on Mastra boot; README note on evidence workspace
    status: completed
isProject: false
---

# Mount evidence as Mastra workspace

## Goal

Hand Mastra the existing [`evidence/`](evidence/) tree as a **Workspace** — same indexes and folders you already use — **read-only**. Agent can list/read/grep/search Markdown; it cannot write or delete evidence.

## Wiring

### 1. Create workspace module

Add [`src/mastra/workspace.ts`](src/mastra/workspace.ts):

- `LocalFilesystem` with:
  - `basePath`: absolute path to repo `evidence/` via `path.join(process.cwd(), 'evidence')` (Mastra docs: relative paths break between `next` and `mastra dev`)
  - `readOnly: true`
  - `contained: true` (default — no path escape)
- `Workspace` with:
  - `id: 'evidence'`
  - that filesystem
  - `bm25: true`
  - `autoIndexPaths: ['**/*.md']` (indexes README, Goal, projects, roles, etc.; skip HTML job snapshot from search index unless we also want `**/*` — **Markdown only** keeps the index aligned with the knowledge model)
- Export `evidenceWorkspace` and call `await evidenceWorkspace.init()` from Mastra startup (see below)

Optional env override later: `EVIDENCE_PATH` absolute path — not required for v1 if `process.cwd()` + `evidence` is correct at repo root.

### 2. Attach to agent

Update [`src/mastra/agents/jobzeug-agent.ts`](src/mastra/agents/jobzeug-agent.ts):

- Import and set `workspace: evidenceWorkspace`
- Rewrite instructions: evidence **is** available via workspace tools; start from indexes (`README.md`, `projects/INDEX.md`, `roles/INDEX.md`, …); prefer search then read specific files; do not invent facts; respect public-disclosure rules for customers/clients

### 3. Init on Mastra boot

Update [`src/mastra/index.ts`](src/mastra/index.ts):

- After constructing `mastra` (or before export), ensure `evidenceWorkspace.init()` runs so BM25 auto-index builds
- Pattern: top-level `await evidenceWorkspace.init()` in the mastra module if the bundler allows, or init inside a small async bootstrap used by both Next and Studio — prefer **eager `await init()`** in `workspace.ts` behind a singleton promise so HMR/Studio don’t double-index

```ts
let initPromise: Promise<void> | undefined
export function ensureEvidenceWorkspace() {
  if (!initPromise) initPromise = evidenceWorkspace.init()
  return initPromise
}
```

Call `ensureEvidenceWorkspace()` from `index.ts` at module load (fire-and-forget with `.catch` log, or await if top-level await is already used).

### 4. Docs

Short note in [`README.md`](README.md): agent workspace = `evidence/` read-only; restart Next/Studio after big evidence edits so auto-index refreshes (or re-init).

## Locked defaults

- Mount **entire** `evidence/` folder (not a subset)
- **Read-only** filesystem
- **BM25 only** (no vector/embeddings in this pass)
- Auto-index `**/*.md` only
- No sandbox / no shell tools
- No change to password gate or Postgres memory

## Out of scope

- Vector/hybrid search
- Agent writing draft outputs into evidence
- Per-user threads
- Copying evidence into `src/mastra/public/`
