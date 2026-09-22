---
name: comp-make
description: >-
  Builds or updates one design-system component from its captured design
  folder: a Lit element, vanilla-extract styles bound to token CSS variables,
  and a thin @lit/react wrapper. Use when the user invokes comp-make, or asks
  to build or update a component from a registry slug such as blue-button.
disable-model-invocation: true
---

# comp-make

One registry slug in, one component out. Create and update use this same pass. Do not interview. Do not edit `design/`. Do not run Figma capture or `--apply`.

Package root is this package (directory with `package.json` and `ds2.config.json`). Registry root: `src/designSystem/components/`.

## Read first

1. `src/designSystem/components/AGENTS.md` — how components are built here.
2. `src/designSystem/components/components.json` — confirm the slug and paths.
3. `{slug}/AGENTS.md` when it exists — keep a public API this file already documents.
4. `{slug}/design/definition.ts` — props, explicit `slots`, defaults. Read-only.
5. `{slug}/design/manifest.json` — `variantAxes` and state index.
6. `dist/designSystem/tokens.css` — emitted `--jz-*` names. `src/designSystem/tokens/core.tokens.ts` only to confirm `prefix`.

If `design/snapshot/` or `manifest.json` is missing, stop and say capture has not been run. Do not invent the design.

**Do not write CSS or component code until the Snapshot matrix below is finished.**

## Snapshot matrix

Finish this pass completely. Sampling a few Primary states is a failure.

### 1. Enumerate

From `design/manifest.json` `variantAxes`, the expected state set is the **product of every axis value**. Cross-check `states[]` (or every folder under `design/snapshot/states/`).

- Missing folders → stop; capture is incomplete.
- Extra folders → include them; do not ignore surprises.
- Do **not** sample a subset.

### 2. Open every state

For **each** state folder:

1. Read `token-map.md` (token index + By layer tables + nested instance property tables).
2. **Open `preview.png` with the Read tool** (vision). Filenames alone do not count.

Note what you actually see: layers present or missing, fill vs border, relative size, icon vs text, disabled look, anything the token map does not say.

Open `snapshot/examples/` only when that folder exists (content samples; structure/tokens still come from `states/`).

### 3. Change matrix by axis

For each Figma axis (`Style`, `Size`, `Interactive`, …), compare pairs that differ **only** on that axis. Record what changes:

| Bucket | Look for |
|---|---|
| Host root | background, border, radius, padding, gap, typography, opacity, layout |
| Nested instances | property tables in the token map (size, color, swap ids) |
| Visibility | absent layers / `show*` pairing |
| Interaction only | hover / active / disabled token paths → native CSS, not an attribute |

“Nothing on the host” is valid **only** when the matrix shows the axis affects only a nested child, or only interaction selectors.

Keep the matrix in working notes for this turn (do not invent a new committed artifact unless `{slug}/AGENTS.md` needs an exception note).

### 4. Map findings to code

- Appearance axes that change **host** tokens → real vanilla-extract variants with those token vars. **Empty `styleVariants` / `{}` objects are a failure** unless step 3 proved the axis does not affect the host **and** that is written in `{slug}/AGENTS.md`.
- Axes that only change a **nested** instance → compose that child when it has an implementation; otherwise document the gap in `{slug}/AGENTS.md`. Do not invent host padding/type just because an axis exists.
- Interaction axes → `:hover`, `:active`, `disabled` with the matching token paths from the matrix.
- Never invent host styles that no snapshot shows.

### 5. Verify before finishing

- [ ] Every manifest state was opened (token-map + preview).
- [ ] Every axis has a matrix row (host / nested / interaction / documented none).
- [ ] Every public appearance prop has CSS, composition, or an AGENTS note.
- [ ] No empty style variant objects without that note.

## Write

Beside the capture, inside the slug folder:

- `{slug}/{slug}.ts` — Lit element. Light DOM: `createRenderRoot()` returns `this`, so vanilla-extract classes and inherited token variables both apply.
- `{slug}/{slug}.css.ts` — `@vanilla-extract/css`, driven by the matrix.
- `{slug}/AGENTS.md` — special cases the code cannot show (nested-only axes while the child is missing, odd commands). Not boilerplate for a normal component.

Thin React wrapper only. Do not reimplement styles or behavior in React.

- `src/react/{name}.ts` — **lazy** `@lit/react` wrapper via `createLazyLitComponent` from `src/react/lazy-lit.ts`. `{name}` is the unprefixed component (`button.ts` for `blue-button`). **Never** static-import the Lit element or `@lit/react` at the top of this file (Lit touches `document` at module load and breaks Next / Node SSR).
- Re-export it from `src/react/index.ts` (keep `"use client"` on that entry). That file is already the package `./react` entry. Do not add another export in `package.json`.

Export the Lit class from `src/index.ts` (browser Lit entry — not for React SSR).

On the first component, if they are missing, add `@vanilla-extract/css` and `@vanilla-extract/vite-plugin`, and register the Vite plugin in `vite.config.ts`. `@lit/react`, `lazy-lit.ts`, and the React build entry already exist.

## Names

The leading `blue-` on a slug is the Figma library name. Drop it.

| | `blue-button` |
|---|---|
| Lit class | `JzButtonElement` |
| React export | `JzButton` |
| Tag | `jz-button` |

`jz` is the token prefix. Later components follow the same split (`JzAlertElement` / `JzAlert` / `jz-alert`).

## Map Figma to an API

Use `definition.ts`, `manifest.json` `variantAxes`, and the **snapshot matrix** as evidence. Publish a normal component API.

- **Interaction** (`Interactive`: Default, Hover, Active, Disabled) → native behavior: `:hover`, `:active`, `disabled`. Do not add an `interactive` attribute.
- **Appearance** (`Style`, `Size`, …) → real properties. Map Figma `style` to `variant` (`style` collides with the DOM). Map `Size` to `size`. Host styling comes from the matrix, not from guessing.
- **Text is an attribute.** `label` is a `label` property. Do not invent a slot because the component has text.
- **Slots only when `definition.slots` lists one** (a Figma `SLOT`). Map one-to-one.
- **`show*` is how Figma hides a layer.** When `showtext` sits next to `label`, `label` is the text and `showtext` means that text can be hidden. Same for `showicon` and icon content. Prefer that pairing; exposing `show*` beside the content attribute is fine when unclear.
- **Nested instance props** (`nestedFrom`) stay on the child. Compose only when that slug is implemented. Do not invent a child or a stand-in slot.

## Tokens and vanilla-extract

Every paint, radius, space, and text style in the token maps becomes a custom property from `dist/designSystem/tokens.css`. Resolve the token-map name to an emitted `--jz-*` variable. Do not copy hex or pixel literals from the token map. Do not invent a variable that is not in the CSS file.

Token-map `background/control/brand/inverse/primary` is `--jz-semantic-color-background-control-brand-inverse-primary`. `radius/full` is `--jz-primitive-radius-full`. `semantic type/label` is the `--jz-semantic-type-label-*` typography variables. Confirm each name in the file.

Dimension tokens emit with units (`72px`, `9999px`) — use `var(--token)` directly. Only use `calc(var(--token) * 1px)` if an emitted value is still unitless.

Hover, active, and disabled pick the matching token paths inside those selectors (`…-hover`, `…-active`, `…-disabled`), not a second set of attributes.

Boolean **tokens** (token type boolean, not Figma `show*`) use one declaration with an explicit fallback: `display: var(--jz-semantic-color-is-light-mode, flex)`. Do not use `visibility`, `initial`, or `0`/`1`.

## React wrapper

Lit is **browser-only**. A static import of a Lit element (or `@lit/react` + the element class) evaluates lit-html on the server and crashes with `document is not defined` — including inside Next.js Client Components.

Always wrap with `createLazyLitComponent` so Lit loads only after mount:

```ts
"use client";

import React from "react";
import { createLazyLitComponent } from "./lazy-lit.js";

export const JzButton = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzButtonElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/blue-button/blue-button.js"),
  ]);
  return createComponent({
    tagName: "jz-button",
    elementClass: JzButtonElement,
    react: React,
    events: {
      onClick: "click",
    },
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzButton");
```

Do **not** write a top-level `createComponent({ elementClass: JzButtonElement, ... })` that imports the Lit class statically.

React props are the Lit public attributes. Add `events` only for real DOM events. Children only when `definition.slots` has an entry. Do not re-declare `interactive` or nested instance props.

```tsx
"use client";

import { JzButton } from "@jobzeug/design-system/react";

<JzButton variant="secondary" label="Clear" onClick={...} />
```

Do not import `@jobzeug/design-system/react` from a React Server Component (`react-server` export throws). Do not teach `next/dynamic` as the primary fix — the package owns the deferral.

## Create or update

If `{slug}/{slug}.ts` already exists, change it to match the current snapshots (after a fresh matrix). Do not add a second component. Update `src/react/{name}.ts` in the same pass so events and forwarded props match the Lit public API.

## Worked example: `blue-button` (API sketch only)

This is naming and API shape — **not** a substitute for the snapshot matrix. Whatever Style, Size, and Interactive actually change in the capture must land in CSS, composition, or `{slug}/AGENTS.md`.

Definition props include `interactive`, `style`, `size`, `label`, `showtext`, `showicon`, and nested `icon-*`. No `slots`.

- Tag `jz-button`, class `JzButtonElement`, React `JzButton`.
- `variant` from `style`; `size` from `Size`; `label` attribute; `disabled` for Disabled interactive.
- No `interactive` attribute. No invented children. Nested `icon-*` only via composed `blue-icon` when that slug exists.
- Resolve every axis through the matrix before shipping styles. Empty size (or any) variants without a matrix-backed AGENTS note are a failure.
- Tokens come from the maps (e.g. primary resting fill `--jz-semantic-color-background-control-brand-inverse-primary`). Do not copy hex or pixel literals into the CSS module.
