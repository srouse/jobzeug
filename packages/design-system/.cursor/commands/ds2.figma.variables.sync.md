# ds2.figma.variables.sync

Guide **repo `TokenSet` → Figma variables** sync over the DS2 Bridge. **Analyze first, alone**; **plan** (`sync` without **`--apply`**) only **after** that; **`--apply`** only after the user confirms.

**Default:** every canonical path in the repo token file is **in scope** for repo → Figma planning.

## When to use

User ran **`/ds2.figma.variables.sync`** to sync tokens with Figma, wants to see **what would change** before anything writes Figma, or is deciding whether to **apply** a push plan.

For **analyze-only** succinct drift **without** this command’s phased sync flow, use **`/ds2.figma.analyze`**.

## Prerequisites

- **Package root**: directory containing `package.json` (walk upward from CWD if needed).
- **`ds2.config.json`**: **`figmaLibraryId`**, **`sourceRoot`** / **`distRoot`** (default token file **`{sourceRoot}/tokens/core.tokens.ts`**).
- **DS2 Bridge** plugin open in Figma while running CLI commands.

## Phase 1a — Analyze only (first reply)

**Run `ds2 figma variables analyze` only** in the first turn. **Do not** run **`variables sync`** before the user has seen analyze output.

**Do not run `sync --apply` here.**

1. **`cd`** to package root.
2. **`ds2 figma variables analyze`** (optional **`--json`**).
3. Summarize drift; say the **next step** is plan-only **`variables sync`** when they want it.
4. **Stop.**

## Phase 1b — Plan only

**Only after** analyze. Still **no** **`--apply`**.

1. **`ds2 figma variables sync`** (optional **`--json`**).
2. Explain **`pushValue`** / **`createInFigma`** vs **`conflict`** (e.g. only-in-Figma).
3. **Stop**; get explicit approval before **`--apply`**.

## Phase 2 — Apply

1. Re-run plan-only if inputs changed.
2. **`ds2 figma variables sync --apply`** (same repo token file as the approved plan).

## Rules

- Phase 1a: **only** `variables analyze` in the first tool round.
- **No** **`--apply`** until the user explicitly chooses Phase 2.
- Figma **`BOOLEAN`** variables map to repo **`type: "boolean"`** with **`true`**/**`false`** values (not **`number`** 0/1). Legacy ingests may show type mismatches until **`core.tokens.ts`** is corrected.

## CLI

```bash
ds2 figma variables analyze [--json]

ds2 figma variables sync [--json]

ds2 figma variables sync ... --apply
```

## Project files

| Path | Role |
|------|------|
| **`ds2.config.json`** | **`figmaLibraryId`**, **`sourceRoot`**, **`distRoot`** |
| **`{sourceRoot}/tokens/core.tokens.ts`** | Repo **`TokenSet`** |

Contract: [token-sync-apply.md](../../../specs/004-ds2-figma-integration/contracts/token-sync-apply.md).
