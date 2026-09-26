# jz-tab — direction=top, interactive=active, selected=true

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **direction:** `top`
- **interactive:** `active`
- **selected:** `true`

- **State folder:** `snapshot/states/direction--top__interactive--active__selected--true`
- **Root layer:** `interactive=active, selected=true, direction=top` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `background/control/default`

- interactive=active, selected=true, direction=top — Background · paint 1
- interactive=active, selected=true, direction=top — Background color · color

### `border/brand/strong`

- interactive=active, selected=true, direction=top › selected-bar — Background · paint 1
- interactive=active, selected=true, direction=top › selected-bar — Background color · color

### `padding/lg`

- interactive=active, selected=true, direction=top › label-bx — Padding left
- interactive=active, selected=true, direction=top › label-bx — Padding right

### `padding/md`

- interactive=active, selected=true, direction=top › label-bx — Padding top

### `semantic type/body/regular`

- interactive=active, selected=true, direction=top › label-bx › label — Typography token

### `text/default`

- interactive=active, selected=true, direction=top › label-bx › label — Text color
- interactive=active, selected=true, direction=top › label-bx › label — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### interactive=active, selected=true, direction=top

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `background/control/default` | `#ffffff` |

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
| Primary axis align | CENTER |
| Counter axis align | CENTER |
| Wrap | NO_WRAP |
| Horizontal sizing | HUG |
| Vertical sizing | HUG |

### interactive=active, selected=true, direction=top › label-bx

#### Padding

| Side | Token | Literal |
| --- | --- | --- |
| top | `padding/md` | `16` |
| right | `padding/lg` | `24` |
| bottom | — | `12` |
| left | `padding/lg` | `24` |

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
| Primary axis align | CENTER |
| Counter axis align | CENTER |
| Wrap | NO_WRAP |
| Horizontal sizing | HUG |
| Vertical sizing | HUG |

### interactive=active, selected=true, direction=top › label-bx › label

#### Typography token

- `semantic type/body/regular`
- _Rendered on layer:_ Geist · Regular · 14px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize WIDTH_AND_HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default` | `#0a0a0a` |

### interactive=active, selected=true, direction=top › selected-bar

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `border/brand/strong` | `#2563eb` |
