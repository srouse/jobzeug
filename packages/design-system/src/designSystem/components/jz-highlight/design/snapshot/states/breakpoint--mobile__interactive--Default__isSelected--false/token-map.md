# jz-highlight — breakpoint=mobile, interactive=Default, isSelected=false

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **breakpoint:** `mobile`
- **interactive:** `Default`
- **isSelected:** `false`

- **State folder:** `snapshot/states/breakpoint--mobile__interactive--Default__isSelected--false`
- **Root layer:** `breakpoint=mobile, interactive=Default, isSelected=false` (`COMPONENT`)

## Token index

All tokens used in this variant (color/spacing variables and typography tokens), with layer path and usage.

### `gap/md`

- breakpoint=mobile, interactive=Default, isSelected=false › Frame 1 — Auto-layout spacing (main axis)
- breakpoint=mobile, interactive=Default, isSelected=false › Frame 1 — Gap · main axis

### `gap/sm`

- breakpoint=mobile, interactive=Default, isSelected=false — Auto-layout spacing (main axis)
- breakpoint=mobile, interactive=Default, isSelected=false — Gap · main axis

### `padding/md`

- breakpoint=mobile, interactive=Default, isSelected=false — Padding bottom
- breakpoint=mobile, interactive=Default, isSelected=false — Padding left
- breakpoint=mobile, interactive=Default, isSelected=false — Padding right
- breakpoint=mobile, interactive=Default, isSelected=false — Padding top

### `radius/md`

- breakpoint=mobile, interactive=Default, isSelected=false — Corner radius (bottom-left)
- breakpoint=mobile, interactive=Default, isSelected=false — Corner radius (bottom-right)
- breakpoint=mobile, interactive=Default, isSelected=false — Corner radius (top-left)
- breakpoint=mobile, interactive=Default, isSelected=false — Corner radius (top-right)

### `semantic type/body/regular`

- breakpoint=mobile, interactive=Default, isSelected=false › Frame 1 › description — Typography token

### `semantic type/caption`

- breakpoint=mobile, interactive=Default, isSelected=false › title — Typography token

### `semantic type/heading`

- breakpoint=mobile, interactive=Default, isSelected=false › Frame 1 › highlight — Typography token

### `text/default`

- breakpoint=mobile, interactive=Default, isSelected=false › Frame 1 › highlight — Text color
- breakpoint=mobile, interactive=Default, isSelected=false › Frame 1 › highlight — Text color · color

### `text/muted`

- breakpoint=mobile, interactive=Default, isSelected=false › Frame 1 › description — Text color
- breakpoint=mobile, interactive=Default, isSelected=false › Frame 1 › description — Text color · color
- breakpoint=mobile, interactive=Default, isSelected=false › title — Text color
- breakpoint=mobile, interactive=Default, isSelected=false › title — Text color · color

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### breakpoint=mobile, interactive=Default, isSelected=false

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

### breakpoint=mobile, interactive=Default, isSelected=false › title

#### Typography token

- `semantic type/caption`
- _Rendered on layer:_ Geist · Regular · 12px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/muted` | `#525252` |

### breakpoint=mobile, interactive=Default, isSelected=false › Frame 1

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

### breakpoint=mobile, interactive=Default, isSelected=false › Frame 1 › highlight

#### Typography token

- `semantic type/heading`
- _Rendered on layer:_ Geist · SemiBold · 20px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/default` | `#0a0a0a` |

### breakpoint=mobile, interactive=Default, isSelected=false › Frame 1 › description

#### Typography token

- `semantic type/body/regular`
- _Rendered on layer:_ Geist · Regular · 14px · line-height AUTO · letter-spacing 0% · case ORIGINAL · decoration NONE · align H LEFT · align V TOP · paragraph spacing 0px · paragraph indent 0px · list spacing 0px · auto-resize HEIGHT · truncation DISABLED · leading trim NONE


#### Text color

| Token | Literal |
| --- | --- |
| `text/muted` | `#525252` |
