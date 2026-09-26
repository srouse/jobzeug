# jz-project-card — (default)

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

_No variant axes on this component (single default state)._

- **State folder:** `snapshot/states/node_8959_21439`
- **Root layer:** `jz-project-card` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `background/surface/default`

- jz-project-card — Background · paint 1
- jz-project-card — Background color · color

### `border/subtle`

- jz-project-card — Stroke (border) · color
- jz-project-card — Stroke 1
- jz-project-card › Frame 4 › Vector 1 — Stroke (border) · color
- jz-project-card › Frame 4 › Vector 1 — Stroke 1

### `gap/md`

- jz-project-card › Frame 4 — Auto-layout spacing (main axis)
- jz-project-card › Frame 4 — Gap · main axis

### `padding/lg`

- jz-project-card — Padding bottom
- jz-project-card — Padding left
- jz-project-card — Padding right
- jz-project-card — Padding top

### `radius/xl`

- jz-project-card — Corner radius (bottom-left)
- jz-project-card — Corner radius (bottom-right)
- jz-project-card — Corner radius (top-left)
- jz-project-card — Corner radius (top-right)

### `semantic type/body/regular`

- jz-project-card › description — Typography token

### `semantic type/caption`

- jz-project-card › supertitle — Typography token

### `semantic type/heading 3`

- jz-project-card › title — Typography token

### `semantic type/label`

- jz-project-card › Frame 4 › Frame 1 › call to action — Typography token

### `space/1`

- jz-project-card — Auto-layout spacing (main axis)
- jz-project-card — Gap · main axis

### `text/default`

- jz-project-card › Frame 4 › Frame 1 › call to action — Text color
- jz-project-card › Frame 4 › Frame 1 › call to action — Text color · color
- jz-project-card › title — Text color
- jz-project-card › title — Text color · color

### `text/muted`

- jz-project-card › description — Text color
- jz-project-card › description — Text color · color
- jz-project-card › supertitle — Text color
- jz-project-card › supertitle — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### jz-project-card

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `background/surface/default` | `#ffffff` |

#### Border

| Stroke | Weight | Color token | Color literal |
| --- | --- | --- | --- |
| 1 | 1 | `border/subtle` | — |

#### Corner radius

| Corner | Token | Literal (resolved) |
| --- | --- | --- |
| Corner radius (top-left) | `radius/xl` | `16` |
| Corner radius (top-right) | `radius/xl` | `16` |
| Corner radius (bottom-left) | `radius/xl` | `16` |
| Corner radius (bottom-right) | `radius/xl` | `16` |

#### Padding

| Side | Token | Literal |
| --- | --- | --- |
| top | `padding/lg` | `24` |
| right | `padding/lg` | `24` |
| bottom | `padding/lg` | `24` |
| left | `padding/lg` | `24` |

#### Gap

| Axis | Token | Literal |
| --- | --- | --- |
| Main axis | `space/1` | `8` |
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
| Vertical sizing | FIXED |

### jz-project-card › supertitle

#### Typography token

- `semantic type/caption`
- _Rendered on layer:_ Geist · Regular · 12px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/muted` | `#525252` |

### jz-project-card › title

#### Typography token

- `semantic type/heading 3`
- _Rendered on layer:_ Geist · Medium · 16px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default` | `#0a0a0a` |

### jz-project-card › description

#### Typography token

- `semantic type/body/regular`
- _Rendered on layer:_ Geist · Regular · 14px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize NONE · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/muted` | `#525252` |

### jz-project-card › Frame 4

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
| Mode | VERTICAL |
| Primary axis align | MIN |
| Counter axis align | MIN |
| Wrap | NO_WRAP |
| Horizontal sizing | FILL |
| Vertical sizing | HUG |

### jz-project-card › Frame 4 › Vector 1

#### Border

| Stroke | Weight | Color token | Color literal |
| --- | --- | --- | --- |
| 1 | 1 | `border/subtle` | — |

### jz-project-card › Frame 4 › Frame 1

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
| Main axis | — | `8` |
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
| Horizontal sizing | FILL |
| Vertical sizing | HUG |

### jz-project-card › Frame 4 › Frame 1 › call to action

#### Typography token

- `semantic type/label`
- _Rendered on layer:_ Geist · Medium · 14px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize WIDTH_AND_HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default` | `#0a0a0a` |

### jz-project-card › Frame 4 › Frame 1 › ArrowRight

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `ArrowRight`

| Property | Type | Value |
| --- | --- | --- |
| Format | VARIANT | Outline |
| Weight | VARIANT | Thin |
