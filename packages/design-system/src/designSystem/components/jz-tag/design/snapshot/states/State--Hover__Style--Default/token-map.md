# jz-tag — State=Hover, Style=Default

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **State:** `Hover`
- **Style:** `Default`

- **State folder:** `snapshot/states/State--Hover__Style--Default`
- **Root layer:** `Style=Default, State=Hover` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `color/neutral/500`

- Style=Default, State=Hover — Background · paint 1
- Style=Default, State=Hover — Background color · color

### `padding/sm`

- Style=Default, State=Hover — Padding left
- Style=Default, State=Hover — Padding right

### `padding/xs`

- Style=Default, State=Hover — Auto-layout spacing (main axis)
- Style=Default, State=Hover — Gap · main axis
- Style=Default, State=Hover — Padding bottom
- Style=Default, State=Hover — Padding top

### `radius/md`

- Style=Default, State=Hover — Corner radius (bottom-left)
- Style=Default, State=Hover — Corner radius (bottom-right)
- Style=Default, State=Hover — Corner radius (top-left)
- Style=Default, State=Hover — Corner radius (top-right)

### `semantic type/overline`

- Style=Default, State=Hover › Title — Typography token

### `text/inverse`

- Style=Default, State=Hover › Title — Text color
- Style=Default, State=Hover › Title — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### Style=Default, State=Hover

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `color/neutral/500` | `#737373` |

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

### Style=Default, State=Hover › jz-icon

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `jz-icon`

| Property | Type | Value |
| --- | --- | --- |
| Color | VARIANT | Default |
| Size | VARIANT | Small |
| icon | INSTANCE_SWAP | 1587:53302 |

### Style=Default, State=Hover › Title

#### Typography token

- `semantic type/overline`
- _Rendered on layer:_ Geist · SemiBold · 11px · line-height 14px · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize WIDTH_AND_HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/inverse` | `#ffffff` |
