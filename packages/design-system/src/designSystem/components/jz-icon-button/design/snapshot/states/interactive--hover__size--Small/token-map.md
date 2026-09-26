# jz-icon-button — interactive=hover, size=Small

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **interactive:** `hover`
- **size:** `Small`

- **State folder:** `snapshot/states/interactive--hover__size--Small`
- **Root layer:** `interactive=hover, size=Small` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `background/control/default/hover`

- interactive=hover, size=Small — Background · paint 1
- interactive=hover, size=Small — Background color · color

### `padding/sm`

- interactive=hover, size=Small — Padding bottom
- interactive=hover, size=Small — Padding left
- interactive=hover, size=Small — Padding right
- interactive=hover, size=Small — Padding top

### `radius/sm`

- interactive=hover, size=Small — Corner Radius

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### interactive=hover, size=Small

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `background/control/default/hover` | `#e5e5e5` |

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

### interactive=hover, size=Small › jz-icon

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `jz-icon`

| Property | Type | Value |
| --- | --- | --- |
| Color | VARIANT | Default |
| Size | VARIANT | Small |
| icon | INSTANCE_SWAP | 8962:21988 |
