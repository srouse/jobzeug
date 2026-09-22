# blue-button — Interactive=Hover, Size=Small, Style=Primary

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **Interactive:** `Hover`
- **Size:** `Small`
- **Style:** `Primary`

- **State folder:** `snapshot/states/Interactive--Hover__Size--Small__Style--Primary`
- **Root layer:** `Style=Primary, Size=Small, Interactive=Hover` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `background/control/brand/inverse/primary/hover`

- Style=Primary, Size=Small, Interactive=Hover — Background · paint 1
- Style=Primary, Size=Small, Interactive=Hover — Background color · color

### `gap/sm`

- Style=Primary, Size=Small, Interactive=Hover — Auto-layout spacing (main axis)
- Style=Primary, Size=Small, Interactive=Hover — Gap · main axis

### `padding/md`

- Style=Primary, Size=Small, Interactive=Hover — Padding left
- Style=Primary, Size=Small, Interactive=Hover — Padding right

### `padding/sm`

- Style=Primary, Size=Small, Interactive=Hover — Padding bottom
- Style=Primary, Size=Small, Interactive=Hover — Padding top

### `radius/full`

- Style=Primary, Size=Small, Interactive=Hover — Corner radius (bottom-left)
- Style=Primary, Size=Small, Interactive=Hover — Corner radius (bottom-right)
- Style=Primary, Size=Small, Interactive=Hover — Corner radius (top-left)
- Style=Primary, Size=Small, Interactive=Hover — Corner radius (top-right)

### `semantic type/label/sm`

- Style=Primary, Size=Small, Interactive=Hover › Label — Typography token

### `text/inverse/hover`

- Style=Primary, Size=Small, Interactive=Hover › Label — Text color
- Style=Primary, Size=Small, Interactive=Hover › Label — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### Style=Primary, Size=Small, Interactive=Hover

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `background/control/brand/inverse/primary/hover` | `#2563eb` |

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

### Style=Primary, Size=Small, Interactive=Hover › Label

#### Typography token

- `semantic type/label/sm`
- _Rendered on layer:_ Montserrat · SemiBold · 12px · line-height 20px · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize WIDTH_AND_HEIGHT · truncation ENDING · max lines 1 · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/inverse/hover` | `#ffffff` |

### Style=Primary, Size=Small, Interactive=Hover › icon

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `blue-icon`

| Property | Type | Value |
| --- | --- | --- |
| Color | VARIANT | Inverse |
| Size | VARIANT | Small |
| icon | INSTANCE_SWAP | 1587:53302 |
