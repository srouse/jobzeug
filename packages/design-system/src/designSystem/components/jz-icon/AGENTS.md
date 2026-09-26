# jz-icon — agent notes

Phosphor webfont frontend. Figma capture exists for **Color** and **Size** chrome; glyphs are vendored webfonts, not Figma SVG instances.

## Figma vs product

| Capture | Code |
| --- | --- |
| **Color** Default / Inverse / Primary | **`color`** — `default` \| `inverse` \| `primary` |
| **Size** Large / Medium / Small | **`size`** — `large` \| `medium` \| `small` |
| **`icon`** INSTANCE_SWAP enum | **`icon`** — any Phosphor **`string`** (PascalCase or kebab) |
| nested **`icon-format`** / **`icon-weight`** | **not published** — product uses code-only **`weight`** |
| *(none)* | **`disabled`** — code-only; disabled semantic icon tokens |
| *(none)* | **`weight`** — code-only; **`regular`** or **`fill`** |
| *(none)* | **`spin`** — code-only; continuous rotate on glyph **`::before`** only (host layout unchanged) |
| *(none)* | **`inheritColor`** — code-only; `color: inherit` for composition inside button/tag |

## Code-only

- Glyphs: vendored Phosphor webfonts in **`assets/`** — **`ph`** for regular and **`ph-fill`** for fill.
- CSS is imported with Vite **`?inline`**: injected into `document.head` (`ensureStyle`, for `@font-face`) **and** adopted into the icon’s shadow (`unsafeCSS`) so glyphs still paint when composed inside button/tag shadows (document selectors do not pierce).
- Glyph node is a shadow **`.glyph`** span (not the host). Host keeps size/color chrome.
- **`iconToKebab.ts`** — no allowlist; unknown name → empty glyph class (empty box).
- Size/color chrome is Lit `:host` styles. Do not put the glyph outside the shadow tree.

## Tokens

- Size → `--jz-semantic-space-icon-sm|md|lg` (font-size + box).
- Color → `--jz-semantic-color-icon-default|inverse|primary`.
- Disabled → `--jz-semantic-color-icon-default-disabled` / `inverse-disabled`. Primary+disabled falls back to default-disabled (no primary-disabled token).

## Enforce

- **`weight`** accepts only **`regular`** and **`fill`**; default is **`regular`**.
- **`color`** tints either weight via semantic tokens.
- Nested Figma Format/Weight enums (Outline, Bold, Duotone, …) are **not** product props.

## Names

| | |
|---|---|
| Tag | `jz-icon` |
| Lit | `JzIconElement` |
| React | `JzIcon` |
