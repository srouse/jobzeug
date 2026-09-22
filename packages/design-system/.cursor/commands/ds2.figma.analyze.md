# ds2.figma.analyze

**Read-only** parity report across **variables** and **components**.

**Reconciliation:** repo → Figma only (`ds2 figma variables sync` + **`applyVariablePatch`**). **`variables sync`** defaults to **all paths** in scope — no policy file required.

## Goal

1. **Succinct diff** — counts + samples, including variable mismatch details (**value mismatches**, **type mismatches**, **missing mode cells**) and **styles-only parity** (**styles only in Figma** / **styles only local**); **`figmaApplyRefAnalysis`** if push would be blocked.
2. For variable drift, offer **`/ds2.figma.variables.sync`** plan-only; **never** **`--apply`** in the same turn unless the user explicitly approves apply later.

## Prerequisites

Package root, **`ds2.config.json`**, Bridge plugin open.

## Steps

1. **`cd`** to package root.
2. **`ds2 figma analyze`** (`--json` as needed).
3. Summarize both sections:
   - variables parity (**repo TokenSet** vs **Figma-derived TokenSet**),
   - variable mismatch rows (value/type/mode-cell gaps),
   - styles-only parity rows (Figma styles missing in repo, repo style tokens missing in Figma),
   - components parity (**Figma roots** vs **local component folders**).
4. Offer **`variables sync`** (plan-only) when they want a **`TokenSyncPlan`**.

## Handoff

**TokenSyncPlan**: **`/ds2.figma.variables.sync`** — default **`ds2 figma variables sync`** plans push for **all** token paths.

## Project files

| Path | Role |
|------|------|
| **`ds2.config.json`** | **`figmaLibraryId`**, **`sourceRoot`**, **`distRoot`** |
| **`{sourceRoot}/tokens/core.tokens.ts`** | Repo **`TokenSet`** |

## Rules

Facts from CLI output only; **push-first** framing for automated sync.
- Figma **`BOOLEAN`** ↔ repo **`boolean`** (`true`/`false`). Type mismatch rows involving **`number`** vs **`boolean`** may indicate legacy 0/1 ingests — fix in **`core.tokens.ts`** then re-sync.
