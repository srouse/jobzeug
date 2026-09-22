# ds2.figma.components.update

Open-ended AI write path for Figma component style updates. This command is intentionally flexible in v1.

## Directive

1. Load style context first:
   - `ds2 figma inventory --json`
   - Use local variable names and local style names from that payload.
2. Build `changes[]` for `ds2 figma components update`:
   - Each row targets one `nodeId`.
   - Each row contains `operations[]`.
3. Apply and inspect per-node result rows:
   - Continue only on rows with `ok: true`.
   - Keep failed/skipped rows for user follow-up.

## Supported v1 operation kinds

- `bindPaintVariable` (`paint`: `fill|stroke`, `index`, `field`, `variableName`)
- `bindEffectVariable` (`index`, `field`, `variableName`)
- `bindTextVariable` (`field`: `fontFamily|fontSize|fontWeight|lineHeight`, `variableName`)
- `setTextStyleByName` (`styleName`)
- `setEffectStyleByName` (`styleName`)

## Notes

- Variable and style lookup is by local name in v1.
- Unknown operation kinds are skipped and reported.
- Prefer one node per row for clearer partial-failure reporting.
