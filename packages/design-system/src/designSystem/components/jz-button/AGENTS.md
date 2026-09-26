# jz-button

## Style axis

Figma **Style** is Primary | Inverse | Dark (**Secondary removed** from the capture). Map to `variant`: `primary` | `inverse` | `dark`. Unknown values (including legacy `secondary`) coerce to `primary`.

## Size axis (matrix)

Host padding, gap, and radius are the same for Default and Small (`padding/sm`+`padding/md`, `gap/sm`, `radius/sm`).

What Size changes:

1. **Typography** — Default → `semantic type/label`; Small → `semantic type/label/sm`.
2. **Nested icon size** — Default → Medium; Small → Small.

No host border difference by size.

## Style + Interactive (host)

| variant | Default | Hover | Active | Disabled |
| --- | --- | --- | --- | --- |
| `primary` | bg `brand/inverse/primary`, text `inverse` | `…/hover` | `…/active` | `…/disabled` |
| `inverse` | bg `control/default`, text `default` | `…/hover` | `…/active` | `…/disabled` |
| `dark` | bg `control/inverse/default`, text `inverse` | `…/hover` | `…/active` | `…/disabled` |

Interactive → native `:hover` / `:active` / `disabled`. No `interactive` attribute.

**Borders:** No state paints a `border/*` color. Active (all styles) and Dark+Disabled+Default still list `stroke/width/md` in the token map without a border color — previews are borderless; do not paint a stroke.

## Nested `jz-icon`

Composed when `showIcon` is true.

| Button size | Icon size |
| --- | --- |
| Default | `medium` |
| Small | `small` |

Figma nested Color: **Inverse** for Primary / Dark; **Default** for Inverse. Product uses **`inheritColor`**. Glyph name is the free-string **`icon`** prop (default `Info`).

## Loading (code-only — not in Figma)

No Figma axis. Product-only:

- Boolean attribute / prop **`loading`** (`true` / `false`; reflects).
- When `loading` is true, compose a trailing **`jz-icon`** after the label: Phosphor **`Spinner`**, same size as the leading icon, **`inheritColor`**, and **`spin`** (continuous rotate from `jz-icon`).
- Leading `showIcon` / `icon` are unchanged. Loading does not replace them.
- Sets `aria-busy` on the native `<button>` when loading.
