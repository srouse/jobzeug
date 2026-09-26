# jz-tab — direction=bottom, interactive=default, selected=false

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **direction:** `bottom`
- **interactive:** `default`
- **selected:** `false`

- **State folder:** `snapshot/states/direction--bottom__interactive--default__selected--false`
- **Root layer:** `interactive=default, selected=false, direction=bottom` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `background/control/default`

- interactive=default, selected=false, direction=bottom — Background · paint 1
- interactive=default, selected=false, direction=bottom — Background color · color

### `padding/lg`

- interactive=default, selected=false, direction=bottom — Padding left
- interactive=default, selected=false, direction=bottom — Padding right

### `padding/md`

- interactive=default, selected=false, direction=bottom — Padding bottom
- interactive=default, selected=false, direction=bottom — Padding top

### `semantic type/body/regular`

- interactive=default, selected=false, direction=bottom › label — Typography token

### `text/default`

- interactive=default, selected=false, direction=bottom › label — Text color
- interactive=default, selected=false, direction=bottom › label — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### interactive=default, selected=false, direction=bottom

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `background/control/default` | `#ffffff` |

#### Padding

| Side | Token | Literal |
| --- | --- | --- |
| top | `padding/md` | `16` |
| right | `padding/lg` | `24` |
| bottom | `padding/md` | `16` |
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

### interactive=default, selected=false, direction=bottom › label

#### Typography token

- `semantic type/body/regular`
- _Rendered on layer:_ Geist · Regular · 14px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize WIDTH_AND_HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default` | `#0a0a0a` |
