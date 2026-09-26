# Compress matching

This folder owns **compression** of project matching metadata and the controlled vocabulary into Contentful payloads.

```sh
npm run contentful:compress
npm run contentful:apply -- --matching-only --dry-run
npm run contentful:push -- --matching-only --dry-run
npm run contentful:apply -- --matching-only
npm run contentful:push -- --matching-only
```

## What compress does

1. [`load-inputs.mjs`](load-inputs.mjs) reads project Markdown headers + `evidence/matching/vocabulary.yaml`.
2. [`project-schema.mjs`](project-schema.mjs) validates the graph (`projectMatchingSchema`, `matchingVocabularySchema`, `validateMatchingCatalog`).
3. `compress.mjs` writes `matchingMetadata` onto project outputs and the vocabulary registry under `evidence/outputs/`.
4. Apply/push sync those fields to Contentful.

Repo source of truth: Markdown headers + `evidence/matching/vocabulary.yaml`. Edits in Contentful are one-way unless you copy them back into YAML before the next push.

## Files

| File | Role |
|---|---|
| `load-inputs.mjs` | Compress matching step — parse headers, load vocab, validate |
| `project-schema.mjs` | Project + vocabulary Zod and catalog validation |
| `requirement-schema.mjs` | Job-line / job-posting matching Zod for CMA apply (not written by compress) |
| `published-catalog.mjs` | CDA read-back of published projects/vocab |

## App scoring

Deterministic Match API scoring lives in `src/lib/matching/` (TypeScript). Engine rules: [evidence/matching/engine.md](../../../evidence/matching/engine.md).

```sh
node --test scripts/contentful/matching.test.mjs
npx tsx --test scripts/matching/score.test.mjs
```
