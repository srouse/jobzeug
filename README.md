# Jobzeug

Single-package Next.js app with Mastra agents for the Figma Forward Deployed Engineer application. Career evidence lives in [`evidence/`](evidence/) (Markdown knowledge base). Agents and the UI share one deploy; Mastra Studio is local for building.

## Stack

- **Next.js** (App Router) — UI and API routes
- **Mastra** — agents in `src/mastra/`, called from Next route handlers
- **Vercel Postgres** — Mastra storage via `@mastra/pg` and `DATABASE_URL` (shared by Next, Studio, and production)

No monorepo. Production is one Next.js deploy with Mastra embedded (not a separate Mastra server).

## Setup

1. Install dependencies: `npm install`
2. Copy env template: `cp .env.example .env`
3. Set **`OPENAI_API_KEY`**
4. Attach **Vercel Postgres** (Marketplace) to your Vercel project, then put the connection string in **`DATABASE_URL`** (prefer the pooled URL if both pooled and direct are offered). Optionally `vercel env pull` for local `.env`.
5. If your provider needs SSL and the URL does not already encode it, set `DATABASE_SSL=true`.

Never commit `.env`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Next.js at http://localhost:3000 |
| `npm run dev:studio` | Mastra Studio (agent building UI) |
| `npm run dev:all` | Next + Studio together |
| `npm run build` / `npm start` | Production Next build (includes Mastra in API routes) |

## App routes

- `/` — Jobzeug shell (placeholder for the dynamic surface)
- `/chat` — smoke-test chat against `jobzeug-agent` (Postgres-backed memory)
- `/api/chat` — streaming chat API (`handleChatStream`)

## Evidence

[`evidence/`](evidence/) is the canonical source for employers, roles, projects, customers, clients, and perspectives. File-reading tools for the agent are not wired yet; do not invent career facts in the meantime.

## Session checkpoint

Use `@session-checkpoint` / `/session-checkpoint` to cache plans, append the session log, and commit/push.
