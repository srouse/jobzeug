# jz-icon-button — interactive=disabled, size=Small

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **interactive:** `disabled`
- **size:** `Small`

- **State folder:** `snapshot/states/interactive--disabled__size--Small`
- **Root layer:** `interactive=disabled, size=Small` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `padding/sm`

- interactive=disabled, size=Small — Padding bottom
- interactive=disabled, size=Small — Padding left
- interactive=disabled, size=Small — Padding right
- interactive=disabled, size=Small — Padding top

### `radius/sm`

- interactive=disabled, size=Small — Corner Radius

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### interactive=disabled, size=Small

#### Corner radius

| Corner | Token | Literal (resolved) |
| --- | --- | --- |
| Corner radius (top-left) | — | `4` |
| Corner radius (top-right) | — | `4` |
| Corner radius (bottom-left) | — | `4` |
| Corner radius (bottom-right) | — | `4` |

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
| Main axis | — | `10` |
| Counter axis | — | `0` |
| Grid row | — | `0` |
| Grid column | — | `0` |

#### Layout

| Property | Value |
| --- | --- |
| Mode | HORIZONTAL |
| Primary axis align | MIN |
| Counter axis align | CENTER |
| Wrap | NO_WRAP |
| Horizontal sizing | HUG |
| Vertical sizing | HUG |

### interactive=disabled, size=Small › jz-icon

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `jz-icon`

| Property | Type | Value |
| --- | --- | --- |
| Color | VARIANT | Default |
| Size | VARIANT | Small |
| icon | INSTANCE_SWAP | 8962:21988 |
