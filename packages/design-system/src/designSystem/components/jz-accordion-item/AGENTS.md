# jz-accordion-item — agent notes

Accordion row from the `jz-accordion-item` capture. Part of `jz-accordion` (compose later).

## Axes

| Figma | Code |
| --- | --- |
| **interactive** Default / hover / active / disabled | Native `:hover`, `:active`, and **`disabled`** — no `interactive` attribute |
| **Title** | **`title`** (not reflected — avoids HTML tooltip attr) |
| **Description** / **Subtitle** | **`description`** / **`subtitle`** |
| **Show Content** | **`show-content`** — reveals the Expanded panel |
| **Show Subtitle** / **Show slot** | **`show-subtitle`** / **`show-slot`** |
| **Slot** | Default slot (Figma `SLOT`) |
| Nested **jz-icon** | Composed **`jz-icon`** Size Small, Color Default, glyph **`CaretDown`** (INSTANCE_SWAP `1026:15929`) |

## Snapshot matrix (interactive)

Only the title text color changes across states. Base chrome, icon props, and Expanded layout tokens are identical.

| State | Title color token |
| --- | --- |
| Default | `--jz-semantic-color-text-default` |
| hover | `--jz-semantic-color-text-default-hover` |
| active | `--jz-semantic-color-text-default-active` |
| disabled | `--jz-semantic-color-text-default-disabled` |

Icon stays Color Default / Size Small in every state (including disabled) — do not pass `disabled` or `inherit-color` to the icon.

## Expanded content gap

Captures were taken with **Show Content = false**, so Expanded is `visible: false` and its tree only includes **Slot** — no Description / Subtitle text layers or typography tokens. Props are still published from `definition.ts`. Until a re-capture with content open, description/subtitle use **`text/default`** color only (no invented type recipe). Expanded padding/gap and Slot gap come from the token maps.

## Behavior

Header is a `<button>`. Click fires a cancelable bubbling **`toggle`** event (`detail: { open }`). If nothing calls `preventDefault()`, the item applies **`show-content`** itself (standalone use). Inside **`jz-accordion`**, the parent prevents default and drives open state via **`open-item`**.

Optional **`value`** — selection key for the parent accordion (falls back to child index).
