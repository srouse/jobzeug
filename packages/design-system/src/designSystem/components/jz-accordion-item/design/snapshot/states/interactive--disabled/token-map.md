# jz-accordion-item — interactive=disabled

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **interactive:** `disabled`

- **State folder:** `snapshot/states/interactive--disabled`
- **Root layer:** `interactive=disabled` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `border/subtle`

- interactive=disabled › Base — Stroke (border) · color
- interactive=disabled › Base — Stroke 1

### `gap/md`

- interactive=disabled › Expanded › Slot — Auto-layout spacing (main axis)
- interactive=disabled › Expanded › Slot — Gap · main axis

### `gap/sm`

- interactive=disabled › Expanded — Auto-layout spacing (main axis)
- interactive=disabled › Expanded — Gap · main axis

### `padding/md`

- interactive=disabled › Base — Padding bottom
- interactive=disabled › Base — Padding top
- interactive=disabled › Expanded — Padding bottom

### `padding/xs`

- interactive=disabled › Expanded — Padding top

### `semantic type/subtitle`

- interactive=disabled › Base › Accordion title — Typography token

### `text/default/disabled`

- interactive=disabled › Base › Accordion title — Text color
- interactive=disabled › Base › Accordion title — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### interactive=disabled

#### Padding

| Side | Token | Literal |
| --- | --- | --- |
| top | — | `0` |
| right | — | `0` |
| bottom | — | `0` |
| left | — | `0` |

#### Gap

| Axis | Token | Literal |
| --- | --- | --- |
| Main axis | — | `0` |
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
| Horizontal sizing | FILL |
| Vertical sizing | HUG |

### interactive=disabled › Base

#### Border

| Stroke | Weight | Color token | Color literal |
| --- | --- | --- | --- |
| 1 | T 1 · R 0 · B 0 · L 0 | `border/subtle` | — |

#### Padding

| Side | Token | Literal |
| --- | --- | --- |
| top | `padding/md` | `16` |
| right | — | `0` |
| bottom | `padding/md` | `16` |
| left | — | `0` |

#### Gap

| Axis | Token | Literal |
| --- | --- | --- |
| Main axis | — | `255` |
| Counter axis | — | `0` |
| Grid row | — | `0` |
| Grid column | — | `0` |

#### Layout

| Property | Value |
| --- | --- |
| Mode | HORIZONTAL |
| Primary axis align | SPACE_BETWEEN |
| Counter axis align | CENTER |
| Wrap | NO_WRAP |
| Horizontal sizing | FILL |
| Vertical sizing | HUG |

### interactive=disabled › Base › Accordion title

#### Typography token

- `semantic type/subtitle`
- _Rendered on layer:_ Geist · Medium · 15px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default/disabled` | `#a3a3a3` |

### interactive=disabled › Base › jz-icon

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `jz-icon`

| Property | Type | Value |
| --- | --- | --- |
| Color | VARIANT | Default |
| Size | VARIANT | Small |
| icon | INSTANCE_SWAP | 1026:15929 |

### interactive=disabled › Expanded

#### Padding

| Side | Token | Literal |
| --- | --- | --- |
| top | `padding/xs` | `4` |
| right | — | `0` |
| bottom | `padding/md` | `16` |
| left | — | `0` |

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
| Mode | VERTICAL |
| Primary axis align | MIN |
| Counter axis align | MIN |
| Wrap | NO_WRAP |
| Horizontal sizing | FIXED |
| Vertical sizing | HUG |

### interactive=disabled › Expanded › Slot

#### Padding

| Side | Token | Literal |
| --- | --- | --- |
| top | — | `0` |
| right | — | `0` |
| bottom | — | `0` |
| left | — | `0` |

#### Gap

| Axis | Token | Literal |
| --- | --- | --- |
| Main axis | `gap/md` | `16` |
| Counter axis | — | `0` |
| Grid row | — | `0` |
| Grid column | — | `0` |

#### Layout

| Property | Value |
| --- | --- |
| Mode | HORIZONTAL |
| Primary axis align | MIN |
| Counter axis align | MIN |
| Wrap | NO_WRAP |
| Horizontal sizing | FILL |
| Vertical sizing | HUG |
