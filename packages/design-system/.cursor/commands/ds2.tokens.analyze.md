# ds2.tokens.analyze

**Read-first** analysis of the token file using deterministic CLI output. Optionally, after the user agrees, apply fixes using the remediation checklist and the **`/ds2.tokens.update`** workflow.

## When to use

User ran **`/ds2.tokens.analyze`** for coverage, counts, structural **`issues`**, **`standards`** checklist, or diff prep.

## Prerequisites

- Package root; token path from **`ds2.config.json`**.

## Steps (analysis — always)

1. **`cd`** to package root.
2. Run **`ds2 tokens analyze --json`**. Capture stdout JSON.
3. Interpret for the user:
   - **`summary`**: `totalTokens`, `byTier`, `byType`, `byMode` (when **`byType.boolean`** > 0, point UI implementers to **`ds2.tokens.boolean.md`** in this commands directory)
   - **`issues`**: structural validation only (parse + tier/ref rules; **no** `ERR_STD_*` from design standards — analyze uses `ignoreStandardsProfile`)
   - **`coverage`**: e.g. `primitive.color.families`, `semantic.color.tokens`
   - **`standards`**: `checks[]` with `id`, `title`, `passed`, `findings` (`STD_*` codes, `path`, `detail`), optional `note`
4. Read **`ds2.tokens.checklist.md`** in **this same commands directory** (alongside this file — `.cursor/commands/` or `.claude/commands/` at package root). Use it to frame **semantic / naming gaps** the JSON does not capture when you report to the user.
5. **Enforcement reminder**: Hard gates use **`ds2 tokens validate --strict`**, **`"standardsProfile": "ds2"`** on the token file, or **`ds2 tokens emit --strict`** (`ERR_STD_*`).
6. For **regressions**, suggest saving two JSON files and **`ds2 tokens diff --before a.json --after b.json`**.

## Optional: offer to fix

After you present the analysis, if **`issues.length > 0`** or any **`standards.checks`** has **`passed: false`**, you may **offer** once: e.g. “Want me to fix these in the token file?”

**Do not edit the token file** unless the user **explicitly** agrees (yes / fix it / go ahead — not just silence).

When they agree, treat it as a handoff to the same discipline as **`/ds2.tokens.update`**: minimal edits, preserve valid **`TokenSet`** shape, loop **`ds2 tokens validate`** until exit 0 (and **`ds2 tokens validate --strict`** if they use **`standardsProfile: "ds2"`** or care about design-standard errors). **Do not** refactor toward loops, maps, or color-stepping generators — add or fix **explicit literal rows** only. Re-run **`ds2 tokens analyze --json`** when done so the user sees updated **`issues`** / **`standards`**.

## What the model needs to fix issues well

| Need | Why |
|------|-----|
| **Token file path** | **`{sourceRoot}/tokens/core.tokens.ts`** from **`ds2.config.json`**. |
| **Fresh CLI JSON** | Prefer **`analyze --json`** (and **`validate --json`** if fixing **`issues`**) so codes and paths match the engine. |
| **Explicit user consent** | Analyze is read-first; edits only after they opt in. |
| **Tier / ref rules** | Semantic **`ref`** targets must be **`primitive.*`**; component prefers **`semantic.*`**. **Primitive** tier: one unnamed collection, **`collectionRef`** without `name`; legacy files may still use **`collectionRef.name`** on primitives — migrate by merging to one primitive collection and prepending the old name into each row’s **`name`**. See [agent-kit.md](specs/002-ds2-tokens/agent-kit.md) / data model. |
| **Remediation checklist** | Map each failing **`check.id`** / **`finding.code`** to concrete JSON edits (below). |

## Remediation checklist (map CLI → actions)

Use **`standards.checks[].findings`** (`path`, `detail`, `code`) and **`issues`** (`code`, `path`, `detail`) as the source of truth.

### Design standards (`standards.checks`)

| Check `id` | Finding `code` | Fix direction |
|------------|----------------|---------------|
| `color.semantic_ref_only` | `STD_SEMANTIC_COLOR_LITERAL` | For that **`path`**, each listed **`detail.mode`**: replace **`value`** with **`ref`** to an existing **`primitive.color.*`** token of type **`color`** (same intent as the literal). |
| `path.primitive_no_role_segments` | `STD_PRIMITIVE_ROLE_SEGMENT` | Rename **`path`** segments so primitives use **palette / scale** names, not usage words (see **`detail.segment`**). Update **`name`** on the row and any **`ref`** strings pointing at the old path. |
| `color.primitive_scale` | `STD_PRIMITIVE_COLOR_SCALE` | For **`primitive.color.{family}`**: add missing **`detail.missing`** steps and/or remove or rename **`detail.unexpected`** steps so the family matches the expected scale in the engine (50–950). Each step must be an **explicit** row in **`tokens[]`** — do **not** replace the scale with a loop, shared stepping function, or generated array. |
| `wcag.contrast` | (none in v1) | **`note`** only — no auto-fix; call out manual contrast / future **`contrastPairs`**. |

### Structural `issues` (representative)

- **`ERR_*`**: follow the **`message`** and **`path`** / **`detail`**; run **`ds2 tokens validate --json`** to list all.
- **`ERR_TIER`**: change **`ref`** target to respect primitive → semantic → component rules.
- **`ERR_BAD_REF` / `ERR_REF_CYCLE`**: create missing targets or break cycles.
- **`WARN_*`**: fix if the user wants stricter hygiene; otherwise explain.

## Rules

- **Token file style** when fixing: match **`ds2.tokens.update`** — verbose literal rows, no TS shortcuts for bulk token generation.
- **Deterministic facts** come from CLI JSON — do not invent counts or codes.
- Human summary **on top** of the JSON is fine.
- Fixes: **surgical** edits; re-validate after every logical batch.

## CLI

```bash
ds2 tokens analyze --json
ds2 tokens validate [--strict] [--json]
ds2 tokens emit [--strict] [--formats <list>] ...
ds2 tokens diff --before <file> --after <file> [--json]
```

## References

- [contracts/token-cli.md](specs/002-ds2-tokens/contracts/token-cli.md)
- [agent-kit.md](specs/002-ds2-tokens/agent-kit.md) (tiers, refs)
- **`/ds2.tokens.update`** — preferred skill name once the user asks you to edit tokens
