# jz-tab-group — agent notes

Layout chrome for a row of **`jz-tab`** children (replaces `jz-tab-item`). Capture placeholders are not a product API — compose real tabs.

## API

| | |
|---|---|
| **`direction`** | Figma axis `bottom` \| `top` — mirrored onto slotted `jz-tab` children |
| **`selected-tab`** | Selected key: child `value`, or index as `"0"`, `"1"`, … (product API; not a Figma group axis) |
| default slot | One or more **`jz-tab`** |

```html
<jz-tab-group direction="bottom" selected-tab="docs">
  <jz-tab label="Overview" value="overview"></jz-tab>
  <jz-tab label="Docs" value="docs"></jz-tab>
  <jz-tab label="API" value="api"></jz-tab>
</jz-tab-group>
```

Fires `change` with `detail: { selectedTab, index }` when the user picks a tab.

## Snapshot matrix

| Axis | Host |
| --- | --- |
| **direction** | No host paint/padding change — only propagates to children (bar edge). Layout stays horizontal, tabs pack start (not Figma `SPACE_BETWEEN`). |

Host has **no** fill/radius/padding in the new capture (old surface-subtle chrome removed).

## Code-only layout

Figma slot uses `SPACE_BETWEEN`. Product packs tabs side-by-side (`justify-content: flex-start`) so they sit next to each other.