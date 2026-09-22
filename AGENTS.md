<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Design system is off-limits

**Never modify `packages/design-system`.** That package is owned and edited elsewhere. Agents in this repo must not change, generate into, or “fix” anything under that tree (including fonts/Montserrat, tokens, Lit, `ds2`, or `dist`).

Consume published exports only (`@jobzeug/design-system`, `tokens.css`, React wrappers). If the design system looks wrong, report it — do not patch it here.
