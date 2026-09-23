---
name: jz-icon Phosphor
overview: "Build `jz-icon` as a Lit + React Phosphor webfont wrapper matching blueprints `blue-icon`: Figma Color/Size tokens for chrome, free-string `icon` name, and code-only `weight`/`disabled`."
todos:
  - id: copy-phosphor
    content: Copy Phosphor CSS + woff2 assets into jz-icon/assets/
    status: completed
  - id: icon-impl
    content: Add iconToKebab.ts, jz-icon.css.ts, jz-icon.ts (Lit host + Phosphor classes)
    status: completed
  - id: icon-exports
    content: Add React JzIcon wrapper and re-export from index entries; sideEffects if needed
    status: completed
  - id: icon-agents
    content: Write jz-icon/AGENTS.md; update blue-button pending note to jz-icon
    status: completed
  - id: icon-build
    content: Build package and confirm fonts/CSS land in dist
    status: completed
isProject: false
---

# jz-icon: Phosphor webfont frontend

Port the behavior of [`blueprints …/blue-icon`](/Users/scottrouse/Workspace/Jobzeug/blueprints-design-system/src/designSystem/components/blue-icon/) into this package’s Lit stack. Figma capture already exists under [`jz-icon/design/`](src/designSystem/components/jz-icon/design/); use it for **Color** and **Size** only. Glyphs come from vendored Phosphor webfonts, not Figma SVG instances.

## Figma → product API

| Capture | Code |
|---|---|
| Color: Default / Inverse / Primary | `color`: `default` \| `inverse` \| `primary` (package lowercase convention, same as button) |
| Size: Large / Medium / Small | `size`: `large` \| `medium` \| `small` |
| `icon` INSTANCE_SWAP | `icon`: free Phosphor **string** (PascalCase or kebab), default `"Info"` |
| nested icon-weight / icon-format | **not published** — product uses code-only `weight` |
| *(none)* | `weight`: `regular` \| `fill` (default `regular`) |
| *(none)* | `disabled`: boolean → disabled semantic icon colors |

Snapshot matrix (from token maps): host box is `semantic.space.icon.{sm,md,lg}` for width/height/font-size. Nested Info instance has no host fill tokens — tint via `--jz-semantic-color-icon-*` (same mapping as blueprints). Primary+disabled falls back to `icon-default-disabled` (no primary-disabled token).

Names: tag `jz-icon`, Lit `JzIconElement`, React `JzIcon`.

```html
<jz-icon icon="Info" color="primary" size="medium"></jz-icon>
<jz-icon icon="magnifying-glass" weight="fill" disabled></jz-icon>
```

## Implementation

### 1. Vendor Phosphor assets

Copy from blueprints `blue-icon/assets/` into [`jz-icon/assets/`](src/designSystem/components/jz-icon/assets/):

- `Phosphor.css` + `Phosphor.woff2`
- `PhosphorFill.css` + `Phosphor-Fill.woff2`

### 2. Helpers + styles

- [`iconToKebab.ts`](src/designSystem/components/jz-icon/iconToKebab.ts) — copy the blueprints helper (PascalCase/kebab → `ph-{name}` suffix).
- [`jz-icon.css.ts`](src/designSystem/components/jz-icon/jz-icon.css.ts) — vanilla-extract mirroring [`BlueIcon.css.ts`](/Users/scottrouse/Workspace/Jobzeug/blueprints-design-system/src/designSystem/components/blue-icon/BlueIcon.css.ts), but with `var(--jz-…)` strings:
  - `root`: inline-flex, centered, flex-shrink 0, line-height 1
  - `colors`: default / inverse / primary + defaultDisabled / inverseDisabled
  - `sizes`: small / medium / large → `--jz-semantic-space-icon-sm|md|lg` on font-size, width, height, min-width, min-height

### 3. Lit element

[`jz-icon.ts`](src/designSystem/components/jz-icon/jz-icon.ts):

- Light DOM (`createRenderRoot()` → `this`).
- Side-effect import Phosphor CSS so fonts/glyph classes load with the module.
- Reflect `color`, `size`, `icon`, `weight`, `disabled`.
- Sync host classes: `root` + color + size + `ph` / `ph ph-fill` + `ph-${kebab}`. Empty/unknown name → no glyph class (empty box), same as blueprints.
- `aria-hidden="true"` by default on the host.
- **Do not** invent a `render()` template that replaces the host; class sync on `connectedCallback`/`updated` (divider/text pattern). Host *is* the glyph span.

### 4. React + exports

- [`src/react/icon.ts`](src/react/icon.ts) — lazy `createLazyLitComponent` (same shape as divider).
- Re-export from [`src/index.ts`](src/index.ts) and [`src/react/index.ts`](src/react/index.ts).
- Ensure Vite emits `.woff2` under `dist/assets/` (existing `assetFileNames`). Confirm Phosphor CSS urls resolve after build; add `sideEffects` entries for the Phosphor CSS imports if needed so tree-shaking does not drop them.

### 5. AGENTS.md

Write [`jz-icon/AGENTS.md`](src/designSystem/components/jz-icon/AGENTS.md) from the blueprints notes (Figma vs code table, vendored fonts, weight limited to regular/fill, color tints either weight). Note nested Figma `icon-format` / `icon-weight` are **not** product props.

Update [`blue-button/AGENTS.md`](src/designSystem/components/blue-button/AGENTS.md) pending line from `blue-icon` → `jz-icon` (still not composing button in this pass).

## Out of scope

- Composing `jz-icon` into `jz-button` (separate follow-up).
- Phosphor Bold/Duotone/Light/Thin (Figma nested enums) — product only ships regular + fill, matching blueprints.
- Editing `design/` or `components.json`.

## Verify

Run `node ./scripts/build.mjs`. Confirm `dist` includes icon JS, React export, Phosphor CSS, and both `.woff2` files.
