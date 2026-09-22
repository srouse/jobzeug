---
name: Montserrat Entry CSS
overview: Add an authored design-system CSS entry that loads Montserrat from Google Fonts and imports Specs-generated cssvars, then point the existing `@jobzeug/design-system/tokens.css` export at that entry so the resume keeps one import.
todos:
  - id: entry-css
    content: Add styles/entry.css with Google Montserrat + @import Specs cssvars
    status: completed
  - id: package-export
    content: Point tokens.css export at entry; adjust copy-tokens + files; brief README note
    status: completed
isProject: false
---

# Montserrat via additive DS entry CSS

## Why

Specs cssvars already reference `"Montserrat"` ([`assets/cssvars/cssvars.css`](packages/design-system/assets/cssvars/cssvars.css); Bluebutton `host.css` uses `font-family: Montserrat`). The font is never loaded, so the button falls back to sans-serif. Specs output must stay untouched; add an authored wrapper.

## Approach

1. **Authored entry** (committed): [`packages/design-system/styles/entry.css`](packages/design-system/styles/entry.css)

```css
/* Authored — do not put Specs tokens here; import generated cssvars below. */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap");
@import "../assets/cssvars/cssvars.css";
```

Weights match Specs type styles (400 / 600 / 700).

2. **Package export**: change [`package.json`](packages/design-system/package.json) so `"./tokens.css"` resolves to `./styles/entry.css` (same public import path the app already uses). Add `styles` to `files`.

3. **Build**: update [`scripts/copy-tokens.mjs`](packages/design-system/scripts/copy-tokens.mjs) to stop overwriting a root `tokens.css` with raw cssvars. Either remove that publish step or have it only assert `assets/cssvars/cssvars.css` exists (entry imports it live). Keep VE emit reading cssvars directly (already does).

4. **App**: no change required — [`src/app/layout.tsx`](src/app/layout.tsx) already imports `@jobzeug/design-system/tokens.css`.

5. **Docs**: one line in [`packages/design-system/README.md`](packages/design-system/README.md) that `tokens.css` = entry (fonts + Specs cssvars).

## Out of scope

- Replacing Geist for the whole app body
- Self-hosting Montserrat files
- Editing Specs-generated cssvars/host.css
