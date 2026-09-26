# jz-highlight — breakpoint=mobile, interactive=hover, isSelected=true

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **breakpoint:** `mobile`
- **interactive:** `hover`
- **isSelected:** `true`

- **State folder:** `snapshot/states/breakpoint--mobile__interactive--hover__isSelected--true`
- **Root layer:** `breakpoint=mobile, interactive=hover, isSelected=true` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `background/control/brand/primary/hover`

- breakpoint=mobile, interactive=hover, isSelected=true — Background · paint 1
- breakpoint=mobile, interactive=hover, isSelected=true — Background color · color

### `gap/md`

- breakpoint=mobile, interactive=hover, isSelected=true › Frame 1 — Auto-layout spacing (main axis)
- breakpoint=mobile, interactive=hover, isSelected=true › Frame 1 — Gap · main axis

### `gap/sm`

- breakpoint=mobile, interactive=hover, isSelected=true — Auto-layout spacing (main axis)
- breakpoint=mobile, interactive=hover, isSelected=true — Gap · main axis

### `padding/md`

- breakpoint=mobile, interactive=hover, isSelected=true — Padding bottom
- breakpoint=mobile, interactive=hover, isSelected=true — Padding left
- breakpoint=mobile, interactive=hover, isSelected=true — Padding right
- breakpoint=mobile, interactive=hover, isSelected=true — Padding top

### `radius/md`

- breakpoint=mobile, interactive=hover, isSelected=true — Corner radius (bottom-left)
- breakpoint=mobile, interactive=hover, isSelected=true — Corner radius (bottom-right)
- breakpoint=mobile, interactive=hover, isSelected=true — Corner radius (top-left)
- breakpoint=mobile, interactive=hover, isSelected=true — Corner radius (top-right)

### `semantic type/body/regular`

- breakpoint=mobile, interactive=hover, isSelected=true › Frame 1 › description — Typography token

### `semantic type/caption`

- breakpoint=mobile, interactive=hover, isSelected=true › title — Typography token

### `semantic type/heading`

- breakpoint=mobile, interactive=hover, isSelected=true › Frame 1 › highlight — Typography token

### `text/default`

- breakpoint=mobile, interactive=hover, isSelected=true › Frame 1 › highlight — Text color
- breakpoint=mobile, interactive=hover, isSelected=true › Frame 1 › highlight — Text color · color

### `text/muted`

- breakpoint=mobile, interactive=hover, isSelected=true › Frame 1 › description — Text color
- breakpoint=mobile, interactive=hover, isSelected=true › Frame 1 › description — Text color · color
- breakpoint=mobile, interactive=hover, isSelected=true › title — Text color
- breakpoint=mobile, interactive=hover, isSelected=true › title — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### breakpoint=mobile, interactive=hover, isSelected=true

#### Background

| Paint | Kind | Token | Literal |
| --- | --- | --- | --- |
| 1 | SOLID | `background/control/brand/primary/hover` | `#bfdbfe` |

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

### breakpoint=mobile, interactive=hover, isSelected=true › title

#### Typography token

- `semantic type/caption`
- _Rendered on layer:_ Geist · Regular · 12px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/muted` | `#525252` |

### breakpoint=mobile, interactive=hover, isSelected=true › Frame 1

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

### breakpoint=mobile, interactive=hover, isSelected=true › Frame 1 › highlight

#### Typography token

- `semantic type/heading`
- _Rendered on layer:_ Geist · SemiBold · 20px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default` | `#0a0a0a` |

### breakpoint=mobile, interactive=hover, isSelected=true › Frame 1 › description

#### Typography token

- `semantic type/body/regular`
- _Rendered on layer:_ Geist · Regular · 14px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/muted` | `#525252` |
