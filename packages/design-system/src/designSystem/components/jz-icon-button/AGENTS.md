# jz-icon-button — agent notes

Tight icon-only control from the `jz-icon-button` capture. Composes **`jz-icon`**.

## Axes

| Figma | Code |
| --- | --- |
| **size** Medium / Small | **`size`**: `small` (default) \| `medium` — nested icon size only |
| **interactive** Default / hover / active / disabled | Native `:hover`, `:active`, **`disabled`** — no `interactive` attribute |
| Nested **jz-icon** | Composed; Color Default; Size from `size`; **`icon`** Phosphor string (default **`Flashlight`**) |
| *(none)* | **`label`** — accessible name (`aria-label`) |

## Snapshot matrix

### Size (host padding unchanged)

| `size` | Host | Nested `jz-icon` Size | Box (padding/sm + icon) |
| --- | --- | --- | --- |
| `small` (default) | padding/sm, radius/sm | **Small** (16px) | ~32×32 |
| `medium` | padding/sm, radius/sm | **Medium** (24px) | ~40×40 |

Host paint does **not** change with size — empty size CSS blocks are intentional; size only configures the nested icon.

### Interactive (same both sizes)

| State | Host background |
| --- | --- |
| Default | transparent |
| hover | `--jz-semantic-color-background-control-default-hover` |
| active | `--jz-semantic-color-background-control-default-active` |
| disabled | transparent (+ icon `disabled`) |

## Usage

```html
<jz-icon-button label="Toggle" icon="Flashlight"></jz-icon-button>
<jz-icon-button size="medium" label="Close" icon="X"></jz-icon-button>
```

```tsx
<JzIconButton label="Toggle" icon="Flashlight" onClick={…} />
<JzIconButton size="medium" label="Close" icon="X" />
```
