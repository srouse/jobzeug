# jz-accordion — agent notes

Layout shell for a vertical stack of **`jz-accordion-item`** children. Capture has no variant axes and no host paint tokens (padding/gap 0). Compose items in the default slot — do not hardcode children.

## Single-open control

| | |
|---|---|
| `open-item` | Key of the open child: a child **`value`**, or index as `"0"`, `"1"`, … Empty string = none open. |
| default slot | One or more `jz-accordion-item` |

The container owns open state. On item **`toggle`**, it `preventDefault()`s and updates **`open-item`**, then syncs each child’s **`show-content`** so at most one is open. Closing the open item clears **`open-item`**.

```html
<jz-accordion open-item="billing">
  <jz-accordion-item value="account" title="Account">…</jz-accordion-item>
  <jz-accordion-item value="billing" title="Billing">…</jz-accordion-item>
  <jz-accordion-item value="team" title="Team">…</jz-accordion-item>
</jz-accordion>
```

Fires **`change`** with `detail: { openItem, index }` when the open key changes (`index` is `-1` when none open).

## Figma vs product

- Capture nested three items (first `Show Content` true). Product API is compositional + `open-item`, same idea as `jz-tab-group` / `selected-tab`.
- Host has no style axes — chrome lives on nested items (top border, title type, etc.).
