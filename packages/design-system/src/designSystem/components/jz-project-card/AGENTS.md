# jz-project-card — agent notes

Project card from the `jz-project-card` capture (single default state). TEXT props map 1:1; nested ArrowRight → `jz-icon`.

## Code-only layout (not in Figma)

Figma captures a fixed artboard height. In product grids the card must **stretch with its cell** and keep the CTA footer at the bottom.

| Rule | Where | Why |
| --- | --- | --- |
| `height: 100%` | `:host` | Fill the parent grid/flex cell so cards in a row share height |
| `margin-top: auto` | `.footer` | Pin divider + call-to-action to the bottom when the host is taller than content |

Do **not** drop these on a re-`comp-make` unless Figma gains an explicit stretch/footer-pin variant that replaces them. No height/expand props — parent layout owns sizing.

## Code-only type (not in Figma)

| Rule | Where |
| --- | --- |
| `text-transform: uppercase` | `.supertitle` |

Supertitle prop values stay mixed case; display is all caps.

## Public API

| Prop | Attribute | Notes |
| --- | --- | --- |
| `supertitle` | `supertitle` | caption + muted |
| `title` | *(not reflected)* | heading3 + default — avoid HTML tooltip `title` |
| `description` | `description` | body/regular + muted |
| `callToAction` | `call-to-action` | label + default; ArrowRight icon composed |

No slots. No interactive axis.
