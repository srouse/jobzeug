# jz-highlight — agent notes

Selectable highlight control from the `jz-highlight` capture.

## Axes

| Figma | Code |
| --- | --- |
| **breakpoint** Default / mobile | **`breakpoint`**: `default` \| `mobile` — layout only |
| **interactive** | Native `:hover` / `:active` / **`disabled`** — no `interactive` attribute |
| **isSelected** | **`selected`** (boolean) |
| TEXT props | **`title`**, **`highlight`**, **`description`** |

## Snapshot matrix

### Host chrome (all states)

`padding/md`, `radius/md`. Resting unselected fill is transparent.

### Breakpoint

| | Root gap | Body |
| --- | --- | --- |
| `default` | `gap/md` | **7-col grid**, `gap/lg`; highlight **span 4**, description **span 3** |
| `mobile` | `gap/sm` | column stack, `gap/md` (both full width) |

### Interactive × selected (background)

| | unselected | selected |
| --- | --- | --- |
| Default | transparent | `…control-brand-primary` |
| hover | `…control-brand-primary` | `…control-brand-primary-hover` |
| active | `…control-default-active` | `…control-brand-primary-active` |
| disabled | `…control-default-disabled` | `…control-brand-primary-disabled` |

### Text

- title: `type/caption` + `text/muted`
- highlight: `type/heading` + `text/default` (active → `text/default/active`)
- description: `type/body/regular` + `text/muted`
- disabled: all three → `text/default/disabled`

Typography is host CSS (not `jz-text`) so interactive text colors can use button selectors.

## Usage

```html
<jz-highlight title="Status" highlight="42" description="open"></jz-highlight>
<jz-highlight selected highlight="Selected"></jz-highlight>
<jz-highlight breakpoint="mobile" disabled></jz-highlight>
```

```tsx
<JzHighlight
  title="Status"
  highlight="42"
  description="open"
  selected={selected}
  onClick={() => setSelected((s) => !s)}
/>
```
