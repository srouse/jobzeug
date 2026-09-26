# jz-tab — agent notes

Single tab from the `jz-tab` capture. Replaces deleted `jz-tab-item`.

## Axes

| Figma | Code |
| --- | --- |
| **interactive** default / hover / active / `disabeld` | Native `:hover` / `:active` / **`disabled`** — no `interactive` attribute (Figma typo `disabeld` → `disabled`) |
| **selected** false / true | **`selected`** (boolean) — shows `selected-bar` |
| **direction** bottom / top | **`direction`** — bar on bottom or top edge |
| TEXT `label` | **`label`** |

## Code-only

| Prop | Notes |
| --- | --- |
| **`value`** | Selection key for `jz-tab-group` (falls back to index). Not on Figma contract. |

## Snapshot matrix

### Host chrome

Always `background/control/default`. Label: `type/body/regular`.

### Interactive × selected (label / bar)

| | unselected label | selected label | selected bar |
| --- | --- | --- | --- |
| Default | `text/default` | `text/default` | `border/brand/strong` |
| hover / active | `text/default/hover` | `text/default` (stays) | `border/brand/strong` |
| disabled | `text/default/disabled` | `text/default/disabled` | `text/default/disabled` |

### Selected layout

Bar height = `stroke-width/lg` (4). Label padding uses `padding/md` + `padding/lg`; the side toward the bar is `calc(padding/md − stroke-width/lg)` so total height matches unselected.

### Direction

| | Bar | Label padding asymmetry |
| --- | --- | --- |
| `bottom` | below label | shrink bottom |
| `top` | above label | shrink top |

### Capture gap

Product of axes is 16; capture has **12** — missing all `direction=top` + `selected=false`. Unselected has no bar, so direction is a no-op; implement from bottom+unselected + top+selected pairs.

## Usage

```html
<jz-tab label="Overview" value="overview"></jz-tab>
<jz-tab label="Docs" value="docs" selected></jz-tab>
<jz-tab label="API" direction="top" selected></jz-tab>
<jz-tab label="Off" disabled></jz-tab>
```
