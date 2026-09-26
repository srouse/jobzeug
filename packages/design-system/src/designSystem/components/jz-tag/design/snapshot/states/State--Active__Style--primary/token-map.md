# jz-tag — State=Active, Style=primary

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **State:** `Active`
- **Style:** `primary`

- **State folder:** `snapshot/states/State--Active__Style--primary`
- **Root layer:** `Style=primary, State=Active` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `background/control/brand/inverse/primary/active`

- Style=primary, State=Active — Background · paint 1
- Style=primary, State=Active — Background color · color

### `color/primary/700`

- Style=primary, State=Active — Stroke (border) · color
- Style=primary, State=Active — Stroke 1

### `padding/sm`

- Style=primary, State=Active — Padding left
- Style=primary, State=Active — Padding right

### `padding/xs`

- Style=primary, State=Active — Auto-layout spacing (main axis)
- Style=primary, State=Active — Gap · main axis
- Style=primary, State=Active — Padding bottom
- Style=primary, State=Active — Padding top

### `radius/md`

- Style=primary, State=Active — Corner radius (bottom-left)
- Style=primary, State=Active — Corner radius (bottom-right)
- Style=primary, State=Active — Corner radius (top-left)
- Style=primary, State=Active — Corner radius (top-right)

### `semantic type/overline`

- Style=primary, State=Active › Title — Typography token

### `text/inverse`

- Style=primary, State=Active › Title — Text color
- Style=primary, State=Active › Title — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### Style=primary, State=Active

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `background/control/brand/inverse/primary/active` | `#1d4ed8` |

#### Border

| Stroke | Weight | Color token | Color literal |
| --- | --- | --- | --- |
| 1 | 1 | `color/primary/700` | — |

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

### Style=primary, State=Active › jz-icon

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `jz-icon`

| Property | Type | Value |
| --- | --- | --- |
| Color | VARIANT | Default |
| Size | VARIANT | Small |
| icon | INSTANCE_SWAP | 1587:53302 |

### Style=primary, State=Active › Title

#### Typography token

- `semantic type/overline`
- _Rendered on layer:_ Geist · SemiBold · 11px · line-height 14px · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize WIDTH_AND_HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/inverse` | `#ffffff` |
