# jz-tag

## Axes (matrix)

| Axis | Product |
| --- | --- |
| **Style** | `variant`: `default` \| `primary` \| `outline` |
| **State** | hover / active **only when `href` is set** — static tags stay at Default |
| **title** | `label` (avoids colliding with HTML `title`) |
| **show-icon** | `showIcon` / `show-icon` |
| **icon** | code-only Phosphor string; default `Info` |
| **href** | code-only; when set (non-empty), wraps content in `<a>` and enables interactive chrome. Empty `href` does **not** reflect — avoids `:host([href])` matching `href=""` |

### Style host tokens

Shared chrome: `padding/xs`+`padding/sm`, gap `padding/xs`, `radius/md`, `semantic type/overline`, stroke width `sm`.

| variant | Default | Hover / Active (requires `href`) |
| --- | --- | --- |
| `default` | bg `control/default`, border `border/default`, text `text/default` | hover: bg `neutral/500`, text `inverse`; active: + border `neutral/800` |
| `primary` | bg `control/brand/primary`, border `primary/900`, text `text/primary` | hover: bg `brand/inverse/primary`, text `inverse`; active: `…/active` + border `primary/700` |
| `outline` | bg `surface/default`, border `border/strong`, text `text/muted` | hover/active: bg **control/subtle** (Figma `control/elevated` not emitted); active border `neutral/300` |

### Nested `jz-icon`

Every state: Size **Small**. Product uses **`inheritColor`** so the host’s text `color` drives the glyph. Do not invent host padding for the icon.
