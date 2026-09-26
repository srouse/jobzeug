# jz-highlight — breakpoint=Default, interactive=disabled, isSelected=true

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **breakpoint:** `Default`
- **interactive:** `disabled`
- **isSelected:** `true`

- **State folder:** `snapshot/states/breakpoint--Default__interactive--disabled__isSelected--true`
- **Root layer:** `breakpoint=Default, interactive=disabled, isSelected=true` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `background/control/brand/primary/disabled`

- breakpoint=Default, interactive=disabled, isSelected=true — Background · paint 1
- breakpoint=Default, interactive=disabled, isSelected=true — Background color · color

### `gap/lg`

- breakpoint=Default, interactive=disabled, isSelected=true › Frame 1 — Auto-layout spacing (main axis)
- breakpoint=Default, interactive=disabled, isSelected=true › Frame 1 — Gap · main axis

### `gap/md`

- breakpoint=Default, interactive=disabled, isSelected=true — Auto-layout spacing (main axis)
- breakpoint=Default, interactive=disabled, isSelected=true — Gap · main axis

### `padding/md`

- breakpoint=Default, interactive=disabled, isSelected=true — Padding bottom
- breakpoint=Default, interactive=disabled, isSelected=true — Padding left
- breakpoint=Default, interactive=disabled, isSelected=true — Padding right
- breakpoint=Default, interactive=disabled, isSelected=true — Padding top

### `radius/md`

- breakpoint=Default, interactive=disabled, isSelected=true — Corner radius (bottom-left)
- breakpoint=Default, interactive=disabled, isSelected=true — Corner radius (bottom-right)
- breakpoint=Default, interactive=disabled, isSelected=true — Corner radius (top-left)
- breakpoint=Default, interactive=disabled, isSelected=true — Corner radius (top-right)

### `semantic type/body/regular`

- breakpoint=Default, interactive=disabled, isSelected=true › Frame 1 › description — Typography token

### `semantic type/caption`

- breakpoint=Default, interactive=disabled, isSelected=true › title — Typography token

### `semantic type/heading`

- breakpoint=Default, interactive=disabled, isSelected=true › Frame 1 › highlight — Typography token

### `text/default/disabled`

- breakpoint=Default, interactive=disabled, isSelected=true › Frame 1 › description — Text color
- breakpoint=Default, interactive=disabled, isSelected=true › Frame 1 › description — Text color · color
- breakpoint=Default, interactive=disabled, isSelected=true › Frame 1 › highlight — Text color
- breakpoint=Default, interactive=disabled, isSelected=true › Frame 1 › highlight — Text color · color
- breakpoint=Default, interactive=disabled, isSelected=true › title — Text color
- breakpoint=Default, interactive=disabled, isSelected=true › title — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### breakpoint=Default, interactive=disabled, isSelected=true

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `background/control/brand/primary/disabled` | `#e5e5e5` |

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
| top | `padding/md` | `16` |
| right | `padding/md` | `16` |
| bottom | `padding/md` | `16` |
| left | `padding/md` | `16` |

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
| Horizontal sizing | FIXED |
| Vertical sizing | HUG |

### breakpoint=Default, interactive=disabled, isSelected=true › title

#### Typography token

- `semantic type/caption`
- _Rendered on layer:_ Geist · Regular · 12px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default/disabled` | `#a3a3a3` |

### breakpoint=Default, interactive=disabled, isSelected=true › Frame 1

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
| Main axis | `gap/lg` | `24` |
| Counter axis | — | `0` |
| Grid row | — | `24` |
| Grid column | — | `24` |

#### Layout

| Property | Value |
| --- | --- |
| Mode | GRID |
| Primary axis align | MIN |
| Counter axis align | MIN |
| Wrap | NO_WRAP |
| Horizontal sizing | FILL |
| Vertical sizing | HUG |

### breakpoint=Default, interactive=disabled, isSelected=true › Frame 1 › highlight

#### Typography token

- `semantic type/heading`
- _Rendered on layer:_ Geist · SemiBold · 20px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default/disabled` | `#a3a3a3` |

### breakpoint=Default, interactive=disabled, isSelected=true › Frame 1 › description

#### Typography token

- `semantic type/body/regular`
- _Rendered on layer:_ Geist · Regular · 14px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default/disabled` | `#a3a3a3` |
