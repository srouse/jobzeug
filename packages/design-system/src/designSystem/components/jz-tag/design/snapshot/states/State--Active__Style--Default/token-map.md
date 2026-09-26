# jz-tag — State=Active, Style=Default

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **State:** `Active`
- **Style:** `Default`

- **State folder:** `snapshot/states/State--Active__Style--Default`
- **Root layer:** `Style=Default, State=Active` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `color/neutral/500`

- Style=Default, State=Active — Background · paint 1
- Style=Default, State=Active — Background color · color

### `color/neutral/800`

- Style=Default, State=Active — Stroke (border) · color
- Style=Default, State=Active — Stroke 1

### `padding/sm`

- Style=Default, State=Active — Padding left
- Style=Default, State=Active — Padding right

### `padding/xs`

- Style=Default, State=Active — Auto-layout spacing (main axis)
- Style=Default, State=Active — Gap · main axis
- Style=Default, State=Active — Padding bottom
- Style=Default, State=Active — Padding top

### `radius/md`

- Style=Default, State=Active — Corner radius (bottom-left)
- Style=Default, State=Active — Corner radius (bottom-right)
- Style=Default, State=Active — Corner radius (top-left)
- Style=Default, State=Active — Corner radius (top-right)

### `semantic type/overline`

- Style=Default, State=Active › Title — Typography token

### `text/inverse`

- Style=Default, State=Active › Title — Text color
- Style=Default, State=Active › Title — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### Style=Default, State=Active

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `color/neutral/500` | `#737373` |

#### Border

| Stroke | Weight | Color token | Color literal |
| --- | --- | --- | --- |
| 1 | 1 | `color/neutral/800` | — |

#### Corner radius

| Corner | Token | Literal (resolved) |
| --- | --- | --- |
| Corner radius (top-left) | `radius/md` | `8` |
| Corner radius (top-right) | `radius/md` | `8` |
| Corner radius (bottom-left) | `radius/md` | `8` |
| Corner radius (bottom-right) | `radius/md` | `8` |

#### Padding

| Side | Token | Literal |
| --- | --- | --- |
| top | `padding/xs` | `4` |
| right | `padding/sm` | `8` |
| bottom | `padding/xs` | `4` |
| left | `padding/sm` | `8` |

#### Gap

| Axis | Token | Literal |
| --- | --- | --- |
| Main axis | `padding/xs` | `4` |
| Counter axis | — | `0` |
| Grid row | — | `0` |
| Grid column | — | `0` |

#### Layout

| Property | Value |
| --- | --- |
| Mode | HORIZONTAL |
| Primary axis align | CENTER |
| Counter axis align | CENTER |
| Wrap | NO_WRAP |
| Horizontal sizing | HUG |
| Vertical sizing | HUG |

### Style=Default, State=Active › jz-icon

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `jz-icon`

| Property | Type | Value |
| --- | --- | --- |
| Color | VARIANT | Default |
| Size | VARIANT | Small |
| icon | INSTANCE_SWAP | 1587:53302 |

### Style=Default, State=Active › Title

#### Typography token

- `semantic type/overline`
- _Rendered on layer:_ Geist · SemiBold · 11px · line-height 14px · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize WIDTH_AND_HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/inverse` | `#ffffff` |
