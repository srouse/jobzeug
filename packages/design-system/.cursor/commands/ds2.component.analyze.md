# ds2.component.analyze

**Read-only assessment** of a design-system component: where **implementation code** (if any) sits **relative to** the **design contract**, **captured snapshots**, and **`AGENTS.md`** guidance. **Do not** edit source files, **`design/definition.ts`**, snapshots, or Figma from this workflow. **Do not** pass **`--apply`** to any command here.

For **implementation** or **alignment** work after the assessment, use **`ds2.component`**.

---

## What you produce

A concise **report** (markdown or bullets) that covers:

1. **Design side** — What **`design/definition.ts`**, **`design/manifest.json`**, and **`design/snapshot/states/**`** (especially **`preview.png`** and **`token-map.md`**) say the component must support (props, variants, tokens, nested instances).
2. **Standards side** — What **`components/AGENTS.md`** and **`components/{slug}/AGENTS.md`** (if present) expect for file layout, tokens, composition, and quality.
3. **Code side** — Which files implement this slug (paths from AGENTS + repo search); how props/variants/tokens/composition **match or diverge** from the design artifacts and AGENTS.
4. **Tooling signals** — Outcome of **`ds2 components types emit`** / **`ds2 components analyze`** (and optional commands below), quoted or summarized; treat failures as **findings**, not as a cue to auto-fix.

---

## Hard rules for AI / automation agents

| Do | Do not |
|----|--------|
| Read design + AGENTS + implementation; summarize gaps and strengths | Change any file or run capture / bind / remediate |
| Run **`pnpm exec ds2 components types emit`** / **`pnpm exec ds2 components analyze`** (and optional read-only commands below) and fold results into the report | Run **`ds2 figma components lint --apply`** or any command that mutates Figma or disk artifacts |
| Say explicitly when the bridge is missing, **`figma.nodeId`** is unbound, or implementation files are absent | Patch **`design/definition.ts`** except when the user has a **separate** explicit request outside this command |

---

## Prerequisites

- **Package root** (where **`package.json`** and **`ds2.config.json`** live).
- Components root from **`ds2.config.json`** (typically **`src/designSystem/components/`**).
- For **`ds2 figma components lint`**: Figma library aligned with **`figmaLibraryId`**, plugin connected, and a bound **`figma.nodeId`** for the slug (or valid selection). If that is not available, **skip** Figma lint and note **“not run — bridge or binding missing.”**

---

## Steps

1. **`cd`** to the package root.
2. **Read context** (no edits): **`components/AGENTS.md`**, **`components.json`**, **`components/{slug}/AGENTS.md`** (if any), **`components/{slug}/design/definition.ts`**, **`design/manifest.json`**, per-state **`preview.png`** / **`token-map.md`** (and **`snapshot.json`** only if nested-instance detail helps the write-up).
3. **Locate implementation** using AGENTS conventions and repo search under **`components/{slug}/`** (and any paths AGENTS names for UI code).
4. Run **`pnpm exec ds2 components types emit`** (and optionally **`pnpm exec ds2 components analyze`**) — typings refresh and registry metrics. Include **exit status** and **messages** in the assessment.
5. **Optional — Figma subtree hygiene (still read-only):** **`pnpm exec ds2 figma components lint`** with **`--slug <slug>`** (human output) or **`--slug <slug> --json`** for a structured report. **Never** add **`--apply`** in this command template.
6. **Optional — registry-wide stats:** **`pnpm exec ds2 components analyze`** or **`pnpm exec ds2 components analyze --json`** when the user wants cross-slug metrics (histograms, naming hints); not required for a single-slug gap analysis.
7. **Synthesize** — Short verdict: e.g. aligned / partial / missing implementation / contract vs snapshot stale / AGENTS silent on paths. Point to **`ds2.component`** if they want follow-up implementation.

---

## Related

- **`ds2.component`** — read design context, then implement or align code.
- **`specs/003-ds2-components/contracts/component-package-layout.md`** — folder roles.
- **`ds2.figma.components.lint`** — full notes on **`ds2 figma components lint`** (including **`--apply`**, which **this** template forbids).
- **`ds2.figma.components.analyze`** — definition vs Figma **component properties** over the bridge (separate from this local + code posture assessment).
