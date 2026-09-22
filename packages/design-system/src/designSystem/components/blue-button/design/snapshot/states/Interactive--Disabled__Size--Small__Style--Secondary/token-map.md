# blue-button — Interactive=Disabled, Size=Small, Style=Secondary

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **Interactive:** `Disabled`
- **Size:** `Small`
- **Style:** `Secondary`

- **State folder:** `snapshot/states/Interactive--Disabled__Size--Small__Style--Secondary`
- **Root layer:** `Style=Secondary, Size=Small, Interactive=Disabled` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `background/control/default/disabled`

- Style=Secondary, Size=Small, Interactive=Disabled — Background · paint 1
- Style=Secondary, Size=Small, Interactive=Disabled — Background color · color

### `border/strong`

- Style=Secondary, Size=Small, Interactive=Disabled — Stroke (border) · color
- Style=Secondary, Size=Small, Interactive=Disabled — Stroke 1

### `gap/sm`

- Style=Secondary, Size=Small, Interactive=Disabled — Auto-layout spacing (main axis)
- Style=Secondary, Size=Small, Interactive=Disabled — Gap · main axis

### `padding/md`

- Style=Secondary, Size=Small, Interactive=Disabled — Padding left
- Style=Secondary, Size=Small, Interactive=Disabled — Padding right

### `padding/sm`

- Style=Secondary, Size=Small, Interactive=Disabled — Padding bottom
- Style=Secondary, Size=Small, Interactive=Disabled — Padding top

### `radius/full`

- Style=Secondary, Size=Small, Interactive=Disabled — Corner radius (bottom-left)
- Style=Secondary, Size=Small, Interactive=Disabled — Corner radius (bottom-right)
- Style=Secondary, Size=Small, Interactive=Disabled — Corner radius (top-left)
- Style=Secondary, Size=Small, Interactive=Disabled — Corner radius (top-right)

### `semantic type/label/sm`

- Style=Secondary, Size=Small, Interactive=Disabled › Label — Typography token

### `text/default/disabled`

- Style=Secondary, Size=Small, Interactive=Disabled › Label — Text color
- Style=Secondary, Size=Small, Interactive=Disabled › Label — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### Style=Secondary, Size=Small, Interactive=Disabled

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `background/control/default/disabled` | `#e5e5e5` |

#### Border

| Stroke | Weight | Color token | Color literal |
| --- | --- | --- | --- |
| 1 | 2 | `border/strong` | — |

#### Corner radius

| Corner | Token | Literal (resolved) |
| --- | --- | --- |
| Corner radius (top-left) | `radius/full` | `9999` |
| Corner radius (top-right) | `radius/full` | `9999` |
| Corner radius (bottom-left) | `radius/full` | `9999` |
| Corner radius (bottom-right) | `radius/full` | `9999` |

#### Padding

| Side | Token | Literal |
| --- | --- | --- |
| top | `padding/sm` | `8` |
| right | `padding/md` | `16` |
| bottom | `padding/sm` | `8` |
| left | `padding/md` | `16` |

#### Gap

| Axis | Token | Literal |
| --- | --- | --- |
| Main axis | `gap/sm` | `8` |
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

### Style=Secondary, Size=Small, Interactive=Disabled › Label

#### Typography token

- `semantic type/label/sm`
- _Rendered on layer:_ Montserrat · SemiBold · 12px · line-height 20px · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize WIDTH_AND_HEIGHT · truncation ENDING · max lines 1 · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default/disabled` | `#a3a3a3` |

### Style=Secondary, Size=Small, Interactive=Disabled › icon

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `blue-icon`

| Property | Type | Value |
| --- | --- | --- |
| Color | VARIANT | Default |
| Size | VARIANT | Small |
| icon | INSTANCE_SWAP | 1587:53302 |
