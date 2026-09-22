# ds2.tokens.boolean

**Canonical reference** for authoring and consuming **`type: "boolean"`** tokens in DS2.

Read this when you see boolean tokens in **`core.tokens.ts`**, **`token-map.md`**, **`ds2 tokens analyze --json`** (`summary.byType.boolean`), or Figma **`BOOLEAN`** variables.

## Authoring (`core.tokens.ts`)

- Row shape: **`type: "boolean"`**, **`modes`** with **`{ value: true }`** or **`{ value: false }`** per collection mode (or **`{ ref: "…" }`** to another boolean token).
- Multi-mode collections are OK (e.g. semantic color **`light`** / **`dark`**).
- Tier rules match other semantic scalars: semantic **`ref`** → **`primitive.*`** when applicable; boolean **`ref`** → another boolean row.

Example:

```typescript
{
  collectionRef: { type: "semantic", name: "color" },
  name: ["is", "light", "mode"],
  type: "boolean",
  modes: {
    light: { value: true },
    dark: { value: false },
  },
}
```

## CSS emit (after `ds2 tokens emit`)

Repo stores **`true`** / **`false`**. CSS output maps:

| Token value | Emitted CSS value |
|-------------|-------------------|
| `false` | `none` |
| `true` | `fallback-to-display-default` |

```css
:root {
  --app-semantic-color-is-light-mode: fallback-to-display-default;
} /* true in first mode */
[data-mode="dark"] {
  --app-semantic-color-is-light-mode: none;
} /* false */
```

The sentinel **`fallback-to-display-default`** is **not** a valid `<display>` keyword — it makes `var()` fall through to its fallback.

## Consumption in CSS (preferred)

**Pattern A (preferred):** one declaration with an explicit fallback:

```css
.card {
  display: var(--app-semantic-color-is-light-mode, flex);
  /* false -> none -> display: none */
  /* true  -> fallback-to-display-default -> invalid, var() uses flex */
}
```

Use on layout properties where **`none`** vs “keep default” is the intent (`display`, etc.). Pick a fallback that matches the component’s normal layout (`flex`, `block`, `grid`, …).

**Pattern B (also valid):** two declarations:

```css
.card {
  display: flex;
  display: var(--app-semantic-color-is-light-mode);
}
```

## Anti-patterns

- Do **not** map boolean tokens to CSS **`visibility`**, **`initial`**, or numeric **`0`** / **`1`**.
- Do **not** invent new `--` custom property names — use emitted **`tokens.css`** / **`tokens.vars.ts`**.
- Do **not** treat Figma BOOLEAN as repo **`number`** — use **`type: "boolean"`** with **`true`** / **`false`**.

## Figma round-trip

- Ingest: Figma **`BOOLEAN`** → repo **`boolean`** (`true`/`false`).
- Push: repo **`boolean`** → Figma **`BOOLEAN`** variable.
- Sync: **`/ds2.figma.variables.sync`** (see **`ds2.figma.variables.sync.md`**).

## Related commands

- **`/ds2.tokens.create`** / **`/ds2.tokens.update`** — add or edit boolean rows.
- **`/ds2.component`** — apply boolean tokens when implementing component CSS from **`token-map.md`**.
