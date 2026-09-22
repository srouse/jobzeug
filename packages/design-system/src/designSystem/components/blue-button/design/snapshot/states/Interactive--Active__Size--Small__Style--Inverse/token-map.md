# blue-button — Interactive=Active, Size=Small, Style=Inverse

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **Interactive:** `Active`
- **Size:** `Small`
- **Style:** `Inverse`

- **State folder:** `snapshot/states/Interactive--Active__Size--Small__Style--Inverse`
- **Root layer:** `Style=Inverse, Size=Small, Interactive=Active` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `background/control/default/active`

- Style=Inverse, Size=Small, Interactive=Active — Background · paint 1
- Style=Inverse, Size=Small, Interactive=Active — Background color · color

### `gap/sm`

- Style=Inverse, Size=Small, Interactive=Active — Auto-layout spacing (main axis)
- Style=Inverse, Size=Small, Interactive=Active — Gap · main axis

### `padding/md`

- Style=Inverse, Size=Small, Interactive=Active — Padding left
- Style=Inverse, Size=Small, Interactive=Active — Padding right

### `padding/sm`

- Style=Inverse, Size=Small, Interactive=Active — Padding bottom
- Style=Inverse, Size=Small, Interactive=Active — Padding top

### `radius/full`

- Style=Inverse, Size=Small, Interactive=Active — Corner radius (bottom-left)
- Style=Inverse, Size=Small, Interactive=Active — Corner radius (bottom-right)
- Style=Inverse, Size=Small, Interactive=Active — Corner radius (top-left)
- Style=Inverse, Size=Small, Interactive=Active — Corner radius (top-right)

### `semantic type/label/sm`

- Style=Inverse, Size=Small, Interactive=Active › Label — Typography token

### `stroke/width/md`

- Style=Inverse, Size=Small, Interactive=Active — Stroke weight (bottom)
- Style=Inverse, Size=Small, Interactive=Active — Stroke weight (left)
- Style=Inverse, Size=Small, Interactive=Active — Stroke weight (right)
- Style=Inverse, Size=Small, Interactive=Active — Stroke weight (top)

### `text/default/active`

- Style=Inverse, Size=Small, Interactive=Active › Label — Text color
- Style=Inverse, Size=Small, Interactive=Active › Label — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### Style=Inverse, Size=Small, Interactive=Active

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `background/control/default/active` | `#e5e5e5` |

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

### Style=Inverse, Size=Small, Interactive=Active › icon

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `blue-icon`

| Property | Type | Value |
| --- | --- | --- |
| Color | VARIANT | Inverse |
| Size | VARIANT | Small |
| icon | INSTANCE_SWAP | 1587:53302 |

### Style=Inverse, Size=Small, Interactive=Active › Label

#### Typography token

- `semantic type/label/sm`
- _Rendered on layer:_ Montserrat · SemiBold · 12px · line-height 20px · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize WIDTH_AND_HEIGHT · truncation ENDING · max lines 1 · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default/active` | `#404040` |
