# @jobzeug/design-system

Lit web components (`jz-*`) plus a small `--jz-*` token sheet. Consumed by the Next app via `@lit/react` wrappers.

## Scripts

| | |
|---|---|
| Build | `npm run ds:build` |
| Watch | `npm run ds:dev` |
| DS2 CLI | `npm run ds2 -- …` |

From this package: `npm run build` · `npm run dev` · `npm run ds2 -- …`.

## DS2 CLI (local)

The unpublished DS2 CLI lives in the sibling repo `../d2s-design-system-squared` and is linked via `file:` as `@contentful/design-system-squared-agent-kit`.

```bash
# from Jobzeug root
npm run ds2 -- --help
npm run ds2 -- status
```

If `ds2` fails because `dist` is missing, build the CLI in the sibling repo (e.g. `pnpm build` / filter the agent-kit package), then `npm install` again here. DS2 looks for `ds2.config.json` next to the package you run from — create it with `ds2 init` when you start capture/implement; not required just to invoke the binary.

## Consume

Import from a **Client Component** only. Lit cannot run on the server; the React entry defers loading Lit until after mount so Next SSR does not evaluate lit-html.

```ts
"use client";

import "@jobzeug/design-system/tokens.css";
import { JzButton } from "@jobzeug/design-system/react";
```

```tsx
<JzButton variant="secondary" label="Clear" onClick={...} />
```

Do not import `@jobzeug/design-system/react` from a React Server Component.

## Layout

| Path | Role |
|---|---|
| `src/designSystem/tokens/` | TokenSet source |
| `dist/designSystem/tokens.css` | Emitted `--jz-*` custom properties (`pnpm run build` / `tokens:emit`) |
| `src/designSystem/components/{slug}/` | Lit element + vanilla-extract + design capture |
| `src/react/` | Lazy `@lit/react` wrappers (`lazy-lit.ts`) |
| `dist/` | Built package |
