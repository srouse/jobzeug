---
name: comp-make skill
overview: Add a project skill at `.agents/skills/comp-make` that one-shots a Lit component from a captured design folder, styles it with vanilla-extract and token CSS variables, turns Figma variant axes into real component behavior, and emits a thin `@lit/react` wrapper for embedding.
todos:
  - id: write-skill
    content: Write .agents/skills/comp-make/SKILL.md with read order, Lit + vanilla-extract layout, token rules, Figma-axis intuition (text as attributes, slots only when Figma declares them, show* as visibility), and the thin @lit/react wrapper.
    status: completed
  - id: registry-note
    content: Add a short Lit + vanilla-extract + React wrapper note to components/AGENTS.md so the skill and the registry standard match.
    status: completed
isProject: false
---

# comp-make skill

Add one project skill. Do not build `blue-button` in this pass.

## Where it lives

[`.agents/skills/comp-make/SKILL.md`](.agents/skills/comp-make/SKILL.md), next to the existing skills (`add-project`, `session-checkpoint`). Explicit invocation only (`disable-model-invocation: true`). Name: `comp-make`.

The skill takes one registry slug (`blue-button`, or whichever folder was just captured). Same instructions for a missing implementation and an existing one.

## What the agent reads

From the design-system package, in this order, and treat `design/` as read-only:

- [`src/designSystem/components/AGENTS.md`](packages/design-system/src/designSystem/components/AGENTS.md)
- [`components.json`](packages/design-system/src/designSystem/components/components.json)
- `{slug}/AGENTS.md` if it already exists
- `{slug}/design/definition.ts`, `{slug}/design/manifest.json`
- each `design/snapshot/states/*/token-map.md` and `preview.png` (examples only when present)

Do not edit `definition.ts`, snapshots, or token maps. Do not run Figma capture or `--apply`.

## What it writes

Implementation sits beside the capture, inside the slug folder:

- `{slug}/{slug}.ts` — Lit element, light DOM so vanilla-extract classes and inherited token variables both apply
- `{slug}/{slug}.css.ts` — `@vanilla-extract/css` styles
- `{slug}/AGENTS.md` — only when the mapping is a special case the code cannot show (odd command, exception to the rules below). A normal button does not get a boilerplate agents file.

Also write a thin React wrapper, and only that. No second implementation of styles or behavior in React.

- [`src/react/{component}.ts`](packages/design-system/src/react) — `createComponent` from `@lit/react` (already a dependency). Tag, element class, and an `events` map for real DOM events such as `click` → `onClick`. React props are the Lit element's public attributes. Children only when `definition.slots` lists an explicit Figma slot. Do not re-declare interaction axes (`interactive`) or nested instance props (`icon-color`, `icon-size`, `icon-icon`) as React props.
- Re-export that wrapper from [`src/react/index.ts`](packages/design-system/src/react/index.ts), which is already the package `./react` entry in [`package.json`](packages/design-system/package.json) and [`vite.config.ts`](packages/design-system/vite.config.ts). Consumers import from `@jobzeug/design-system/react` and pass text as attributes (`<JzButton variant="secondary" label="Clear" onClick={...} />`).

Name the Lit class `JzButtonElement` and the React export `JzButton` so the two do not collide. Same split for later components (`JzAlertElement` / `JzAlert`).

Wire the Lit class into [`src/index.ts`](packages/design-system/src/index.ts). On the first component, if they are missing, add `@vanilla-extract/css`, `@vanilla-extract/vite-plugin`, and the Vite plugin in [`vite.config.ts`](packages/design-system/vite.config.ts). `@lit/react` and the React build entry are already set up; do not add another package export. Record the Lit + vanilla-extract layout and the thin React wrapper in the registry [`AGENTS.md`](packages/design-system/src/designSystem/components/AGENTS.md) so later runs follow the same files.

## How Figma becomes a component

The `blue-` prefix is the Figma library name. `blue-button` becomes a button: Lit class `JzButtonElement`, React export `JzButton`, tag `jz-button` (token prefix in [`core.tokens.ts`](packages/design-system/src/designSystem/tokens/core.tokens.ts) is `jz`).

Use the definition and variant axes as evidence, then publish a normal component API:

- Interaction axes (`Interactive`: Default, Hover, Active, Disabled) become native behavior (`:hover`, `:active`, `disabled`), not an `interactive` attribute.
- Appearance axes (`Style`, `Size`) become real properties.
- Text is an attribute. `label` on `blue-button` is a `label` property, not a slot and not children. Do not invent a slot because a component has text.
- Slots only when `design/definition.ts` has an explicit `slots` entry (a Figma `SLOT`). Map those one-to-one. `blue-button` has none.
- `show*` properties are how Figma turns a layer off. When `showtext` sits next to `label`, `label` is the text and `showtext` means that text can be hidden. Same pairing for `showicon` and the icon content. Prefer that pairing. Exposing the `show*` boolean beside the content attribute is acceptable when the pairing is unclear.
- Nested instance props (`icon-color`, `icon-size`, `icon-icon`) stay inside the child. Compose `blue-icon` only if that slug already has an implementation. Do not invent a child, and do not invent an icon slot to stand in for it.

Styles cite emitted custom properties from [`dist/designSystem/tokens.css`](packages/design-system/dist/designSystem/tokens.css), mapped from token-map names (`background/control/...` → `--jz-semantic-color-background-control-...`). Do not copy hex or pixel literals out of the token map. Unitless dimension tokens are used as `calc(var(--token) * 1px)`. Hover, active, and disabled pick the matching token paths inside those selectors.

Create and update share this pass: if `{slug}.ts` already exists, change it to match the current snapshots instead of adding a second component. Update the React wrapper in the same pass so its events and forwarded props match the Lit public API. Keep a public API that `{slug}/AGENTS.md` already documents.
