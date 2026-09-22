# blue-button — Interactive=Active, Size=Small, Style=Primary

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **Interactive:** `Active`
- **Size:** `Small`
- **Style:** `Primary`

- **State folder:** `snapshot/states/Interactive--Active__Size--Small__Style--Primary`
- **Root layer:** `Style=Primary, Size=Small, Interactive=Active` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `background/control/brand/inverse/primary/active`

- Style=Primary, Size=Small, Interactive=Active — Background · paint 1
- Style=Primary, Size=Small, Interactive=Active — Background color · color

### `gap/sm`

- Style=Primary, Size=Small, Interactive=Active — Auto-layout spacing (main axis)
- Style=Primary, Size=Small, Interactive=Active — Gap · main axis

### `padding/md`

- Style=Primary, Size=Small, Interactive=Active — Padding left
- Style=Primary, Size=Small, Interactive=Active — Padding right

### `padding/sm`

- Style=Primary, Size=Small, Interactive=Active — Padding bottom
- Style=Primary, Size=Small, Interactive=Active — Padding top

### `radius/full`

- Style=Primary, Size=Small, Interactive=Active — Corner radius (bottom-left)
- Style=Primary, Size=Small, Interactive=Active — Corner radius (bottom-right)
- Style=Primary, Size=Small, Interactive=Active — Corner radius (top-left)
- Style=Primary, Size=Small, Interactive=Active — Corner radius (top-right)

### `semantic type/label/sm`

- Style=Primary, Size=Small, Interactive=Active › Label — Typography token

### `stroke/width/md`

- Style=Primary, Size=Small, Interactive=Active — Stroke weight (bottom)
- Style=Primary, Size=Small, Interactive=Active — Stroke weight (left)
- Style=Primary, Size=Small, Interactive=Active — Stroke weight (right)
- Style=Primary, Size=Small, Interactive=Active — Stroke weight (top)

### `text/inverse/active`

- Style=Primary, Size=Small, Interactive=Active › Label — Text color
- Style=Primary, Size=Small, Interactive=Active › Label — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### Style=Primary, Size=Small, Interactive=Active

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `background/control/brand/inverse/primary/active` | `#1d4ed8` |

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

### Style=Primary, Size=Small, Interactive=Active › Label

#### Typography token

- `semantic type/label/sm`
- _Rendered on layer:_ Montserrat · SemiBold · 12px · line-height 20px · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize WIDTH_AND_HEIGHT · truncation ENDING · max lines 1 · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/inverse/active` | `#ffffff` |

### Style=Primary, Size=Small, Interactive=Active › icon

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `blue-icon`

| Property | Type | Value |
| --- | --- | --- |
| Color | VARIANT | Inverse |
| Size | VARIANT | Small |
| icon | INSTANCE_SWAP | 1587:53302 |
