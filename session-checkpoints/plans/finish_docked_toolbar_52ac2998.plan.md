---
name: Finish docked toolbar
overview: "Finish the interrupted persistent bottom toolbar work: verify the in-flow chrome, vanilla-extract token wiring, and chat offset after your design-system fix; wire `tokens.vars` if the package now exposes it, otherwise keep the mirrored subset."
todos:
  - id: wire-tokens-vars
    content: Point ds-vars at DS tokens.vars export if present; else keep mirrored subset
    status: completed
  - id: verify-build
    content: tsc + Next/VE compile check for toolbar.css.ts
    status: completed
  - id: polish-layout
    content: Confirm docked toolbar row + chat offset after DS rebuild
    status: completed
isProject: false
---

# Finish docked toolbar

## Already in place (from the interrupted pass)

- [`src/app/resume/page.tsx`](src/app/resume/page.tsx): `workspace` + in-flow [`ResumePlayToolbar`](src/components/resume-play-toolbar.tsx) footer; chat dock still overlays
- [`src/components/resume-play-toolbar.css.ts`](src/components/resume-play-toolbar.css.ts): single horizontal tools row, top border, DS semantic/primitive CSS vars via VE
- [`next.config.ts`](next.config.ts): `@vanilla-extract/next-plugin`
- Chat FAB offset in [`resume-chat-dock.module.css`](src/components/resume-chat-dock.module.css) so it sits above the toolbar
- Old floating `resume-play-toolbar.module.css` removed

## Remaining to finish

1. **Tokens import** — Prefer live `tokens.vars` from the design system if your fix added a package export (e.g. `@jobzeug/design-system/tokens.vars`). Today [`package.json`](packages/design-system/package.json) still only exports `./tokens.css`. If export exists after your rebuild: point [`src/lib/ds-vars.ts`](src/lib/ds-vars.ts) at it. If not: leave the mirrored subset (already aligned to `--jz-…` names from `tokens.css`).

2. **Smoke-check** — Confirm `tsc` clean and Next can compile the `.css.ts` toolbar (VE plugin). Fix any import/path issues from the DS rebuild.

3. **Layout polish if needed** — Ensure toolbar stays one vertical band (no floating), tools stay on one row, line above remains; chat modal unchanged and still clears the toolbar.

No design-system source edits from this app workspace.
