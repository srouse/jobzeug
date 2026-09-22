# ds2.tokens.update

Add or change token definitions with **surgical** edits while keeping the **`TokenSet`** valid.

## When to use

User ran **`/ds2.tokens.update`** to add or change tokens without a full greenfield create.

## Prerequisites

- Package root; token path from **`ds2.config.json`** **`sourceRoot`** → **`{sourceRoot}/tokens/core.tokens.ts`**. Use **`export const tokenSet`** (or compatible **`export default`**).

## Steps

1. **`cd`** to package root.
2. Read the current **`TokenSet`**. Confirm **`collections`** support any new rows (add a collection or mode first if needed).
3. Apply **minimal** edits:
   - New **collection**: unique `(type, normalized name)`; non-empty **`modes`**. **Primitive**: at most **one** row in `collections[]`, **no** `name`, **exactly one** mode (e.g. `["base"]`). Do **not** add separate primitive collections per hue/category — use **`name[]`** on rows (e.g. `["color","primary","500"]`).
   - New **row**: **`name`** segments `[a-z0-9]+`; **`modes`** keys must match the collection’s **`modes`** (full coverage), **except** for **`type: "typography"`** — see **Typography** below. **Primitive** rows: `collectionRef: { "type": "primitive" }` only (omit `name` on the ref).
   - **`ref`**: target must exist; tiers must match **data-model.md** (semantic → primitive for normal cells; **`typography`** composite fields may **`ref`** granular **semantic** scalars per data-model).
4. Run **`ds2 tokens validate`**. On failure, fix structural **`ERR_*`** codes; repeat until **exit 0**. If the file has **`"standardsProfile": "ds2"`** or the user cares about design rules, also run **`ds2 tokens validate --strict`** and fix **`ERR_STD_*`**. Review **`WARN_*`** with the user when relevant.
5. Read **`ds2.tokens.checklist.md`** in **this same commands directory** (alongside this file — `.cursor/commands/` or `.claude/commands/` at package root). Address semantic / naming coverage before calling the update done unless the user scoped work to purely structural fixes.
6. **Emit (optional)** — If the user wants generated artifacts (CSS, resolved JSON, Swift, etc.) refreshed, run **`ds2 tokens emit`** only **after** validation succeeds. Output goes to **each path** in **`distRoot`** from **`ds2.config.json`** (string or array). Use **`--strict`** when you used strict validation above. Add **`--formats`** if they need a subset; default in CLI is **`all,preview`** (use **`--formats all`** for the six core files without HTML preview).
7. If the user’s request is impossible under the rules (e.g. illegal ref tier), explain and propose a valid design.
8. After a batch of fixes from **`/ds2.tokens.analyze`**, re-run **`ds2 tokens analyze --json`** so **`issues`** / **`standards`** reflect the new state.

## Token file style (explicit data, simple code)

- **Prefer verbose, literal token rows.** The module is the source of truth for design data: each logical step (e.g. every shade in a color scale) should appear as its **own** row built from plain object literals, not as the output of a loop, **`.map()`**, reducer, factory, spread of a generated array, or similar.
- **No TypeScript shortcuts for bulk definitions.** Do **not** centralize “stepping” (e.g. interpolating or stepping hex colors) and iterate to fill **`tokens[]`**. Avoid helpers whose main job is to synthesize many rows — some repetition in the file is **intentional** and preferred over clever abstraction.
- **“Simple” means straightforward structure, not fewer lines.** Favor a readable **`TokenSet`** with minimal indirection (e.g. one exported `const tokenSet: TokenSet = { … }`). A large, explicit file is **expected** when the system is large.

## Typography (`type: "typography"`)

- **Collection:** Put **`typography` rows only** in a collection whose **`modes` has a single entry** (e.g. `["base"]`). Do **not** add **`typography`** to a multi-mode collection (e.g. `light`/`dark` or `default`/`condensed` on the same collection as the composite).
- **Row:** Exactly **one** key in **`modes`** — that key must be the collection’s only mode. **`ERR_TYPOGRAPHY_COLLECTION_MODES`** / **`ERR_TYPOGRAPHY_MULTI_MODE`** if violated.
- **Composite:** `TypographyComposite` per field: **`ref`** or **`value`** (`fontFamily`, `fontSize`, `lineHeight`, `fontWeight`). Prefer **`ref`** into **primitive** baselines (sizes, weights, family ramps) and, when an axis like default vs condensed applies **only to metrics**, into **granular semantic** tokens (`dimension` / `number` / `fontFamily`) that live in a **separate** multi-mode semantic collection.
- **Another text style** (e.g. condensed variant): use a **separate canonical path** (extra **`name[]`** segment such as `["body","condensed"]`), each row still **single-mode** — not a second mode on the same composite row.
- Normative detail: **002** `data-model.md` § typography, **004** `text-style-sync.md` (Figma text styles).

## Boolean (`type: "boolean"`)

- **Collection:** Multi-mode collections are OK (e.g. semantic **`light`** / **`dark`** for mode-specific visibility flags).
- **Row:** Each mode cell is **`{ value: true }`** or **`{ value: false }`**, or **`{ ref }`** to another **`boolean`** token.
- **CSS consumption:** After **`ds2 tokens emit`**, boolean tokens emit **`none`** (false) or **`fallback-to-display-default`** (true). Consume with **`var(--token, <default>)`** — see **`ds2.tokens.boolean.md`** in this commands directory.
- **Figma:** **`BOOLEAN`** variables round-trip as **`boolean`** (not **`number`** 0/1).

## Rules

- **MUST NOT** leave the file invalid if the user asked for a valid outcome.
- Use **`ds2 tokens validate --json`** when parsing errors programmatically helps.
- For **which** design-standard rows to change, use the remediation table in **`/ds2.tokens.analyze`** (maps **`standards.checks`** to edits).
- **Emit** re-validates internally — it fails if the TokenSet is invalid; still run **`validate`** after edits so errors are easy to fix.
- Run **`emit`** only when the user wants generated artifacts updated or that is clearly in scope.

## CLI

```bash
ds2 tokens validate [--strict] [--json]
ds2 tokens emit [--formats <list>] [--strict] [--swift-type-name <name>] [--json]
ds2 tokens analyze --json
```

## References

- [agent-kit.md](specs/002-ds2-tokens/agent-kit.md)
