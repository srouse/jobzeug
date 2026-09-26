# jz-input — (default)

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

_No variant axes on this component (single default state)._

- **State folder:** `snapshot/states/node_8975_3641`
- **Root layer:** `jz-input` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `background/control/default`

- jz-input — Background · paint 1
- jz-input — Background color · color

### `border/subtle`

- jz-input — Stroke (border) · color
- jz-input — Stroke 1

### `padding/sm`

- jz-input — Padding bottom
- jz-input — Padding left
- jz-input — Padding right
- jz-input — Padding top

### `radius/sm`

- jz-input — Corner radius (bottom-left)
- jz-input — Corner radius (bottom-right)
- jz-input — Corner radius (top-left)
- jz-input — Corner radius (top-right)

### `semantic type/body/default`

- jz-input › value — Typography token

### `text/default`

- jz-input › value — Text color
- jz-input › value — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### jz-input

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `background/control/default` | `#ffffff` |

#### Border

| Stroke | Weight | Color token | Color literal |
| --- | --- | --- | --- |
| 1 | 1 | `border/subtle` | — |

#### Corner radius

| Corner | Token | Literal (resolved) |
| --- | --- | --- |
| Corner radius (top-left) | `radius/sm` | `4` |
| Corner radius (top-right) | `radius/sm` | `4` |
| Corner radius (bottom-left) | `radius/sm` | `4` |
| Corner radius (bottom-right) | `radius/sm` | `4` |

#### Padding

| Side | Token | Literal |
| --- | --- | --- |
| top | `padding/sm` | `8` |
| right | `padding/sm` | `8` |
| bottom | `padding/sm` | `8` |
| left | `padding/sm` | `8` |

#### Gap

| Axis | Token | Literal |
| --- | --- | --- |
| Main axis | — | `40` |
| Counter axis | — | `0` |
| Grid row | — | `0` |
| Grid column | — | `0` |

#### Layout

| Property | Value |
| --- | --- |
| Mode | VERTICAL |
| Primary axis align | MIN |
| Counter axis align | MIN |
| Wrap | NO_WRAP |
| Horizontal sizing | FIXED |
| Vertical sizing | HUG |

### jz-input › value

#### Typography token

- `semantic type/body/default`
- _Rendered on layer:_ Geist · Regular · 14px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default` | `#0a0a0a` |
