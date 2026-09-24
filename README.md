# Jobzeug

Next.js app with Mastra agents for the Figma Forward Deployed Engineer application, plus a Lit-based design system package. Career evidence lives in [`evidence/`](evidence/) (Markdown knowledge base). Agents and the UI share one deploy; Mastra Studio is local for building.

## Stack

- **Next.js** (App Router) — UI and API routes (vanilla CSS modules; no Tailwind)
- **Mastra** — agents in `src/mastra/`, called from Next route handlers
- **Vercel Postgres** — Mastra storage via `@mastra/pg` and `DATABASE_URL` (shared by Next, Studio, and production)
- **`@jobzeug/design-system`** — Lit web components (`jz-*`) in [`packages/design-system`](packages/design-system), consumed via React wrappers

npm workspaces soft-monorepo: Next stays at the repo root; the design system is a workspace package. Production remains one Next.js deploy with Mastra embedded (not a separate Mastra server).

## Setup

1. Install dependencies: `npm install` (postinstall builds `@jobzeug/design-system`)
2. Copy env template: `cp .env.example .env`
3. Set **`OPENAI_API_KEY`**
4. Attach **Vercel Postgres** (Marketplace) to your Vercel project, then put the connection string in **`DATABASE_URL`** (prefer the pooled URL if both pooled and direct are offered). Optionally `vercel env pull` for local `.env`.
5. If your provider needs SSL and the URL does not already encode it, set `DATABASE_SSL=true`.
6. Set **`SITE_PASSWORD`** (shared site password) and **`SESSION_SECRET`** (long random string used to sign the session cookie). Both are required — the app fails closed without them. Add the same vars in Vercel (Production + Preview).
7. For evidence → Contentful sync, set **`CONTENTFUL_SPACE_ID`**, **`CONTENTFUL_ENVIRONMENT`** (usually `master`), and **`CONTENTFUL_MANAGEMENT_TOKEN`**.
8. For the resume SPA read path, set **`CONTENTFUL_DELIVERY_TOKEN`** (Content Delivery API key for the same space/environment).

Never commit `.env`.

## Site password

The Next app is gated by a shared password (`/login`). After login, an httpOnly cookie unlocks the whole site including `/api/chat`. Logout: `POST /api/logout`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Next.js at http://localhost:3000 |
| `npm run dev:studio` | Mastra Studio (agent building UI) |
| `npm run dev:all` | Next + Studio together |
| `npm run ds:build` | Build `@jobzeug/design-system` → `packages/design-system/dist` |
| `npm run ds:dev` | Watch-rebuild the design system |
| `npm run build` / `npm start` | Production Next build (includes Mastra in API routes; uses committed DS `dist`) |
| `npm run contentful:compress` | Parse `evidence/` → `evidence/outputs/{employers,roles,projects}/*.json` |
| `npm run contentful:apply` | Create/update Employer / Role / Project content types in Contentful |
| `npm run contentful:push` | Upsert compressed JSON into Contentful (`jz-*` entry IDs) |

## App routes

- `/login` — site password gate
- `/` — Jobzeug shell (placeholder for the dynamic surface)
- `/resume` — SPA resume assembled from Contentful Delivery (employers / roles / projects)
- `/chat` — smoke-test chat against `jobzeug-agent` (Postgres-backed memory)
- `/api/resume` — JSON resume view model from Contentful CDA
- `/api/chat` — streaming chat API (`handleChatStream`)
- `/api/login` / `/api/logout` — session cookie set/clear

## Design system

See [`packages/design-system/README.md`](packages/design-system/README.md). Lit `jz-*` components and `--jz-*` tokens; consume via `@jobzeug/design-system/react`.

Vercel installs with [`scripts/vercel-install.mjs`](scripts/vercel-install.mjs) and uses the committed `packages/design-system/dist` (the local ds2 agent-kit is not available on CI). After design-system changes, run `npm run ds:build` and commit `packages/design-system/dist` before pushing.

## Evidence

[`evidence/`](evidence/) is the canonical source for employers, roles, projects, customers, clients, and perspectives. It is mounted on `jobzeug-agent` as a **read-only** Mastra Workspace (`src/mastra/workspace.ts`) with BM25 search over `**/*.md`. The agent can list/read/grep/search those files; it cannot write them.

Compressed resume-core payloads live under `evidence/outputs/` (Employer / Role / Project). Run `contentful:compress` after evidence edits, then `contentful:apply` / `contentful:push` to sync Contentful. Use `@compress-to-contentful` to run that flow from an agent.

After large evidence edits, restart Next or Studio so the auto-index refreshes.

## Session checkpoint

Use `@session-checkpoint` / `/session-checkpoint` to cache plans, append the session log, and commit/push.
