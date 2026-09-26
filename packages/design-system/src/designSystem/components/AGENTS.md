# DS2 component registry (agents)

**Non-authoritative** for the machine contract — the contract is **`specs/003-ds2-components/contracts/component-package-layout.md`**, **`components.json`**, **`design/manifest.json`**, **`design/definition.ts`**, Zod, and **`ds2` CLI** output.

**Authoritative for “how we build components here”** — keep this file updated with **repo-specific standards** for humans and AI: where implementation files live, framework and import conventions, how tokens map from **`token-map.md`**, composition rules (including nested library components), accessibility expectations, and naming. The **`ds2.component`** shared command tells agents to read this file **before** reading per-slug design artifacts.

1. Open **`components.json`** at this folder root for the list of Figma-captured slugs and paths.
2. Per captured slug: **`{slug}/AGENTS.md`** (optional slug-level intent and edge cases), then **`{slug}/design/manifest.json`** (Figma variant index + paths), then **`{slug}/design/definition.ts`** (machine contract), then **`{slug}/design/snapshot/states/...`** (previews and token maps).

Use **`ds2 components types emit`** to refresh generated prop typings and **`ds2 components analyze`** for registry metrics.

## Dist / tokens emit

Vite builds **preserve `dist/designSystem/`** (selective clean: everything else under `dist/` is wiped). Do **not** set `emptyOutDir: true` and do **not** `rm -rf dist` unless intentionally hard-rebooting (`npm run clean` / `rebuild`). After a full clean, run `npm run build` or `tokens:emit` so `tokens.css` exists again.

## Token-only slugs

Some slugs are **not** Figma components. They have no `design/` folder and are **not** listed in `components.json`. Missing capture is expected — do **not** run `comp-make` or treat it as “capture has not been run.” Read **`{slug}/AGENTS.md`** and implement from tokens.

- **`jz-text`** — typography primitive over `semantic.type` recipes. See **`jz-text/AGENTS.md`**.


## Implementation

**`comp-make`** (`.agents/skills/comp-make/SKILL.md`) builds or updates one slug from its `design/` folder. `design/` stays read-only. Before writing styles, it must complete a **full snapshot matrix**: every `states/` folder, every `preview.png` (via Read), and per-axis diffs of what actually changes — no silent empty variants.

- **`{slug}/{slug}.ts`** — Lit element with **shadow DOM** (Lit default). **Never** override `createRenderRoot()` to return `this`. The DS owns markup and styles inside the shadow root; the page does not restyle internals. Custom properties from **`tokens.css`** still inherit in. Slug `jz-button` → class **`JzButtonElement`**, tag **`jz-button`**.
- **Styles** — Lit `static styles` (`css` tagged template) with `var(--jz-*)` from **`dist/designSystem/tokens.css`**. Use `:host` / `:host([attr])` for host chrome and descendant selectors for shadow children. Document-injected CSS (e.g. Phosphor webfont) only reaches the **host** — put those classes on the host when needed. Dimension tokens already include units (`72px`) — use **`var(--token)`** directly. Only use **`calc(var(--token) * 1px)`** if a value is still unitless. Do not copy hex or pixel literals from **`token-map.md`**. Do **not** add vanilla-extract.
- **`src/react/{name}.ts`**, re-exported from **`src/react/index.ts`** — lazy **`@lit/react`** wrapper via **`createLazyLitComponent`** (`src/react/lazy-lit.ts`). **Never** static-import Lit or the element class in the React file (SSR / Next will crash: `document is not defined`). React export **`JzButton`**. Text is an attribute (`label`). Slots only when **`definition.slots`** lists a Figma slot. Export the Lit class from **`src/index.ts`**.
- **`{slug}/AGENTS.md`** — only when a mapping is a special case. Do not add one for an ordinary component.

Interaction axes (`Interactive`: hover, active, disabled) are native behavior, not an `interactive` attribute. Appearance axes are properties (`style` → `variant`, because `style` collides with the DOM). A `show*` prop next to a text or icon attribute is Figma’s visibility toggle for that attribute.

Lit React wrappers are browser-only: Client Components may static-import `@jobzeug/design-system/react`; Server Components must not (the `react-server` export throws).

## Boolean tokens in CSS

When **`token-map.md`** or emitted **`tokens.vars.ts`** includes a **`boolean`** token, consume it in component CSS per **`ds2.tokens.boolean.md`** (in **`.cursor/commands/`** or **`.claude/commands/`**):

```css
/* Preferred: single declaration with explicit fallback */
.myComponent {
  display: var(--app-semantic-color-is-light-mode, flex);
}
```

Do **not** use **`visibility`**, **`initial`**, or numeric **`0`/`1`**. Read **`tokens.css`** for the emitted variable name.
