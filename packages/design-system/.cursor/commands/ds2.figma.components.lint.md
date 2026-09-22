# ds2.figma.components.lint

Bridge **`runComponentLint`** — deterministic component hygiene pass (**005**): library vs local variables, text styles, effect bindings, optional auto-localize (**A-01**) and optional **FR-15** break-to-literal.

## When to use

The user wants a structured inventory of bindings under a component bound in the repo (**`figma.nodeId`** in **`components/{slug}/design/definition.ts`**), or to safely rebind library variables to same-named locals.

## Prerequisites

- **`ds2.config.json`** **`figmaLibraryId`**; Figma library file open; plugin connected.
- **`components/{slug}/design/definition.ts`** with a valid **`figma.nodeId`** (not unbound). **`--slug`** is optional: omit it to select the component set in Figma (selection must match **`figma.nodeId`** in the resolved folder). **`--json`** requires **`--slug`** unless `--all` is used.

## Steps

1. **`cd`** to the package root.
2. Run **`pnpm exec ds2 figma components lint`** with optional **`--slug <slug>`** (human preview; no file mutations) or add **`--json`** (requires **`--slug`**) for [component-lint-report](../../../specs/005-ds2-figma-linting/contracts/component-lint-report.md). Every run walks the **full subtree** under that component/set.
3. To apply deterministic fixes (same-name variable localize, break unresolvable to literal, **FR-16** text-style and **FR-17** effect-style localize-or-detach for library styles): **`--apply`**. Preview **`Changes:`** localize vs detach counts align with **`Tally:`** `external text styles` / `external effect styles` per [component-lint-report.md](../../../specs/005-ds2-figma-linting/contracts/component-lint-report.md).

## Related

- **`specs/005-ds2-figma-linting/quickstart.md`**
- **`ds2.figma.components.node.remediate`** — agent write path (**`componentNodeRemediate`**)
