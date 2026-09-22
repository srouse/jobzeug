# ds2.component

**Single shared command for building or aligning a design-system component in code.**  
Use this when an AI (or you) need to **understand design parameters first**—read contracts, snapshots, and AGENTS guidance—then **write or adjust application code** so it matches that design. **Do not** use this path to rewrite Figma or to “fix” the machine contract by hand.

---

## What this is for

1. **Read** everything that defines how the component should behave in the product: `design/definition.ts`, `design/manifest.json`, per-variant **`token-map.md`** and **`preview.png`** under **`snapshot/states/`**, optional **`snapshot/examples/`** for canvas instance content samples (**`example.md`** + **`preview.png`**), and optional **`snapshot.json`** only when you need ids or nested-instance metadata.
2. **Read** repo standards and intent from **`components/AGENTS.md`** (registry-wide) and **`components/{slug}/AGENTS.md`** (per-component, at the **root of that slug folder**).
3. **Then** either align existing implementation code to those parameters, or **create** implementation the first time following patterns already present in the repo (same folder layout, imports, tokens, and composition rules as sibling components).

This workflow is **gentle on the contract**: treat **`design/definition.ts`** as **read-only** for structural fields (`name`, `displayName`, `version`, `figma`, prop/slot **names** and **types**, `enum`, `default`, `required`). If the contract is wrong, the fix belongs in **Figma** plus **`ds2 figma components capture`** (or the user runs capture)—not in silent edits to the definition file.

---

## Hard rules for AI / automation agents

| Do | Do not |
|----|--------|
| Read and summarize **`design/definition.ts`**, **`design/manifest.json`**, **`design/snapshot/states/**`** (variant truth), and optional **`design/snapshot/examples/**`** (canvas instance samples) | Change **`figma.nodeId`** or any structural field in **`design/definition.ts`** from this workflow (use **`ds2 figma selection`** / binding flow and **capture** when the user wants the contract updated from Figma) |
| Read **`components/AGENTS.md`** and **`components/{slug}/AGENTS.md`** for repo and slug-specific standards | Invent design parameters that are not in the definition + snapshot artifacts |
| Add or improve **`props[].description`** and **`slots[].description`** only if the user explicitly asked for narrative help on the contract | Rename or “normalize” **`ComponentDefinition.name`** or any prop/slot **`name`** |
| Implement or update **code** (new files or edits) to match the read design + AGENTS | Edit **`snapshot.json`** or **`token-map.md`** as source of truth—they are **outputs** of capture |

---

## Context order (read in this order)

Work from the **package root** (where **`package.json`** and **`ds2.config.json`** live). Component registry path comes from config (default under **`src/designSystem/components/`**).

1. **`components/AGENTS.md`** — how this repo expects components to be built (structure, tokens, a11y, naming, where implementation files live). **Read first** for standards.
2. **`components.json`** — slugs and paths; confirms which folder is canonical for the slug.
3. **`components/{slug}/`** — the component **root** for this slug.
4. **`components/{slug}/AGENTS.md`** — optional; slug-specific intent, when to use the component, edge cases, team notes. **Read with** the design artifacts.
5. **`components/{slug}/design/definition.ts`** — machine contract (props, slots, Figma binding metadata). **Read**; do not reshape without user + Figma + capture.
6. **`components/{slug}/design/manifest.json`** — variant index and snapshot paths.
7. **`components/{slug}/design/snapshot/states/<stateId>/`** — **`preview.png`** (variant master visual truth), **`token-map.md`** (token names and presentation per layer). Use **`snapshot.json`** only when you need raw node ids, nested instance property tables, or debugging.
8. **`components/{slug}/design/snapshot/examples/<exampleId>/`** (when present) — **`example.md`** and **`preview.png`** for a **placed instance** with injected content; canonical tokens/structure remain in the matched **`states/<stateId>/`** folder.

Normative layout reference: **`specs/003-ds2-components/contracts/component-package-layout.md`**.

---

## When snapshots might be stale

If **`design/snapshot/`** or **`design/manifest.json`** might not match Figma, **stop** and tell the user to refresh with **`ds2 figma components capture`** (or their usual **`ds2 figma components process --apply`** flow) **before** you treat token maps and previews as current. This command template does **not** assume you will run capture automatically.

---

## Nested `INSTANCE` in Figma captures

Capture does **not** expose full inner trees for nested instances. In **`snapshot.json`**, nested instances expose **`mainComponentName`**, **`instanceComponentProperties`**, etc.; **`token-map.md`** surfaces a compact table. **`INSTANCE_SWAP`** maps to **`string`** props in **`ComponentDefinition`** (default only — not an enum); use **`slots`** for formal Figma **`SLOT`** placeholders. In code: **compose** an existing library component when **`components/<child-slug>/design/definition.ts`** exists; otherwise use a **small placeholder** and do not fabricate the whole subtree from guesses.

---

## Code: align vs create

**If implementation already exists** (search the repo the way **`components/AGENTS.md`** and sibling components suggest—paths vary by project):

- Map **props / variants / tokens** to match **`design/definition.ts`** and the **token-map** + **preview** evidence.
- Reuse the same token resolution, file naming, and export patterns as neighboring components.

**If there is no code yet**:

- Add the minimal files the repo standard expects (see **`components/AGENTS.md`** and copy structure from a close sibling slug).
- Implement props and composition from the **definition** + **snapshots**; keep the first version small and faithful rather than speculative.

**Boolean tokens in CSS:** When **`token-map.md`** references a **`boolean`** token (or a visibility/layout toggle), consume it per **`ds2.tokens.boolean.md`** in the commands directory — preferred: **`display: var(--token, flex)`** (or the appropriate layout fallback). Do not map to React boolean props unless **`design/definition.ts`** defines one.

After substantive contract or code changes, run **`ds2 components types emit`** from the package root when you use generated prop typings, and **`ds2 components analyze`** when you want registry metrics.

---

## Optional CLI touchpoints (user-run)

- **`ds2 components types emit`** — refresh **`design/definition.props.gen.ts`** from **`design/definition.ts`**.
- **`ds2 components analyze`** — deterministic registry metrics (**`--json`** optional).
- **`ds2 figma components capture`** — refresh definition + snapshots from Figma when design is source of truth.
- **`ds2 figma analyze`** — read-only parity when the user wants a quick Figma vs repo overview.

Do **not** chain **`--apply`** or capture unless the user asked for it.

---

## Related docs in-repo

- **`specs/003-ds2-components/contracts/component-package-layout.md`** — folder and file roles.
- **`specs/004-ds2-figma-integration/contracts/bridge-protocol.md`** — what the plugin and CLI can do over the bridge.
