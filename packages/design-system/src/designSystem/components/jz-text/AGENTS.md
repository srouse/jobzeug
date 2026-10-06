# jz-text — agent notes

Token-only typography primitive. There is **no Figma component**, no `design/` folder, no `definition.ts`, and no capture. Do **not** run `comp-make` or add this slug to `components.json` (that file is Figma-generated). This file is the source of truth.

Purpose: an elegant way to **install text in applications** without knowing `--jz-semantic-type-*` variable names. Pick a recipe; optionally tinker with weight and color. Both still resolve to emitted tokens.

Uses **shadow DOM**. Styles are Lit `static styles` on `:host([variant|weight|color]) .text`. Do not put hashed VE classes on the host.

## Recipes (`variant`)

From `semantic.type` in `dist/designSystem/tokens.css`. Kebab names match the CSS variables.

**Scale (large)**

| `variant` | token |
|---|---|
| `display-large` | `--jz-semantic-type-display-large-*` |
| `display` | `--jz-semantic-type-display-*` |
| `title` | `--jz-semantic-type-title-*` |
| `heading` | `--jz-semantic-type-heading-*` |
| `heading2` | `--jz-semantic-type-heading2-*` |
| `heading3` | `--jz-semantic-type-heading3-*` |
| `subtitle` | `--jz-semantic-type-subtitle-*` |

**Stock**

| `variant` | token |
|---|---|
| `body-default` | `--jz-semantic-type-body-default-*` |
| `body-regular` (default) | `--jz-semantic-type-body-regular-*` |
| `body-strong` | `--jz-semantic-type-body-strong-*` |
| `label` | `--jz-semantic-type-label-*` |
| `label-sm` | `--jz-semantic-type-label-sm-*` |
| `caption` | `--jz-semantic-type-caption-*` |
| `overline` | `--jz-semantic-type-overline-*` |

Do not invent letter-spacing, `text-transform`, or sizes that are not in this collection. Overline is the 11/14/600 recipe only — not uppercase unless a token says so.

## Overrides

Token-backed only. Unset weight keeps the recipe’s stock weight.

- **`weight`:** `200` \| `300` \| `400` \| `500` \| `600` \| `700` → `--jz-primitive-font-weight-*`. Variants use longhand type vars so this can override `font-weight` without fighting the `font` shorthand.
- **`color`:** `default` (default) \| `muted` \| `primary` \| `secondary` \| `tertiary` \| `inverse` \| `error` \| `success` \| `warning` → `--jz-semantic-color-text-*`. Resting colors; overridden by **`disabled`**.

`<jz-text variant="body-regular" weight="600">` is equivalent in type to `body-strong`. Keep `body-strong` as the named stock recipe; `weight` is the escape hatch.

## Interactive / disabled

Opt-in control mode (not a Figma axis). Both attributes reflect on the host.

| Attribute | Behavior |
|---|---|
| **`interactive`** | `cursor: pointer`; hover → `--jz-semantic-color-background-control-default-hover`; `role="button"` + keyboard Enter/Space |
| **`disabled`** | Text → `--jz-semantic-color-text-default-disabled`; background → `--jz-semantic-color-background-control-default-disabled`; no hover; clicks suppressed |

React: `onClick` maps to the host `click` event (blocked when `disabled`).

```html
<jz-text interactive label="Filters"></jz-text>
<jz-text interactive disabled label="Unavailable"></jz-text>
```

```tsx
<JzText interactive label="Filters" onClick={() => …} />
<JzText interactive disabled label="Unavailable" />
```

## Link (code-only)

`href` renders a real inline `<a>` (not `interactive`). No underline.

| | |
|---|---|
| Color | `text/primary` when `color` is still `default`. An explicit `color` wins. |
| Hover | `--jz-semantic-color-text-text-primary-hover` |
| Focus | `:focus-visible` ring → `--jz-semantic-color-focus-ring` |
| `level` `0` | The anchor is the text node |
| `level` `1`–`6` | Heading stays; the anchor is inside it |
| `target="_blank"` | `rel="noopener noreferrer"` |
| `disabled` | `href` removed, `aria-disabled`, not tabbable |

```html
<jz-text href="/jobs" label="View role"></jz-text>
```

## Level (document outline)

`level` chooses the semantic tag inside the shadow root (allowlisted via `unsafeStatic`):

| `level` | tag |
|---|---|
| `0` (default) | `span` |
| `1`–`6` | `h1`–`h6` |

Display: `level` `0` is **`inline`** on `:host` and `.text` (sits in a line with icons / siblings). Levels `1`–`6` are **`block`**. Do **not** wrap `<h1><jz-text>…</jz-text></h1>` — use `level` instead.

## Text content

- **`label`** — slot fallback (attribute), same pattern as button.
- **Light-DOM children** — project through `<slot>` for rich text (`<strong>`, links, etc.).

```html
<jz-text level="1" variant="title" color="primary" label="Contentful"></jz-text>
<jz-text level="2" variant="heading">Contentful <strong>Labs</strong></jz-text>
<jz-text variant="body-regular" weight="600" color="muted" label="…"></jz-text>
```

```tsx
<JzText level={1} variant="display" label="Hero" />
<JzText level={2} variant="heading">Contentful <strong>Labs</strong></JzText>
```

## Names

| | |
|---|---|
| Tag | `jz-text` |
| Lit | `JzTextElement` |
| React | `JzText` |
