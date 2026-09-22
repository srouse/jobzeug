# ds2.tokens.create

Create or substantially extend the DS2 **`TokenSet`** (typed design tokens in **`core.tokens.ts`**).

## When to use

User ran **`/ds2.tokens.create`** for a new or largely new token suite — greenfield files, new collections/modes, or large structured additions.

## Prerequisites

- **Package root**: directory containing `package.json` (walk upward from CWD if needed).
- **`ds2.config.json`** next to **`package.json`** with **`sourceRoot`** (and **`distRoot`** for emit). Token file path is **`{sourceRoot}/tokens/core.tokens.ts`**. Run **`ds2 init`** if missing.
- **`@contentful/design-system-squared-agent-kit`** + **TypeScript** in the project so `import type { TokenSet } from "@contentful/design-system-squared-agent-kit"` typechecks.

## Steps

1. **`cd`** to package root for all CLI calls.
2. If the default token file **does not exist**, run **`ds2 tokens init`**. If the user explicitly wants to replace an existing file, use **`ds2 tokens init --force`** only with confirmation.
3. Paths come only from **`ds2.config.json`** — edit **`sourceRoot`** there to change the token file location. The token module must use **`export const tokenSet: TokenSet = …`** (or **`export default`** as a plain object).
4. Open **`core.tokens.ts`** under **`{sourceRoot}/tokens/`**. Implement the user’s goals:
   - **`collections`**: non-empty unique **`modes`** per collection. **Primitive**: exactly **one** collection `{ type: "primitive", modes: ["base"] }` — **no** `name`. **Semantic**: named collection + **`name`** (`[a-z0-9]+`). **Component**: omit collection `name`.
   - **`tokens`**: each row has **`collectionRef`**, **`name`** (path segments), **`type`** (`color`, `dimension`, `effect`, `fontFamily`, `number`, `typography`, **`boolean`**), and **`modes`** covering exactly that collection’s modes.
   - **`ref`** cells must target an existing **canonical path**; respect **tier rules** (semantic → `primitive.*`; component → prefer `semantic.*`).
   - **Token file style**: spell out tokens with **literal rows** and plain objects. Do **not** use loops, maps, factories, or shared “stepping” logic (e.g. generating a full palette from one base + indices) to shrink the file. **Simple** means easy-to-follow data, not DRY code — repetition is fine; a long **`core.tokens.ts`** is normal for a rich system.
5. Run **`ds2 tokens validate`**. If it fails, read **`errors`** (`code`, `path`, `detail.mode`), fix the module, re-run until **exit code 0**.
6. Read **`ds2.tokens.checklist.md`** in **this same commands directory** (alongside this file — `.cursor/commands/` or `.claude/commands/` at package root). Apply tier / semantic coverage guidance before treating the task as complete. For **`type: "boolean"`** (visibility / layout toggles), read **`ds2.tokens.boolean.md`** in the same directory.
7. Summarize changes and the final file path for the user.

## Rules

- **Explicit over abstracted:** same as **Token file style** in **`ds2.tokens.update`** — no programmatic bulk generation of **`tokens[]`**; keep each definition visible in the source.
- **Do not** claim the file is valid until **`ds2 tokens validate`** succeeds.
- Ground shapes in **`specs/002-ds2-tokens/data-model.md`** (or the repo copy).

## CLI

```bash
ds2 tokens init [--force]
ds2 tokens validate [--json]
```

## References

- [agent-kit.md](specs/002-ds2-tokens/agent-kit.md) (checklists + contract pointers)
