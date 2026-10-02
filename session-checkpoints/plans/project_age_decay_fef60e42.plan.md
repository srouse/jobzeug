---
name: Project age decay
overview: Add a tunable, non-linear recency weight so projects from the last five years rank at full strength, and work past about a decade falls off fast enough that a strong 20-year-old project does not lead the list.
todos:
  - id: recency-fn
    content: Add recency.ts with the three knobs and unit tests for the curve
    status: completed
  - id: rank-sorts
    content: Apply the weight to topHomeProjects and catalog/example sort order; keep raw points
    status: completed
  - id: graph-years
    content: Store optional projectYears on the match graph and pass them into the home top list
    status: completed
  - id: spec
    content: Note the recency rule in engine.md and bump SCORING_VERSION
    status: completed
isProject: false
---

# Age-weight project ranking

Project year already lives on matching metadata (`year` on each catalog project). Scoring ignores it. Home **Top projects** ranks by raw tags plus lines hit in [`topHomeProjects`](src/lib/matching/home-coverage.ts), and the catalog rank in [`scorePostingAgainstCatalog`](src/lib/matching/score.ts) sorts on raw points. Coverage, strong-example counts, and the required/preferred numbers stay on those raw points. Age only changes rank order.

## Curve

New [`src/lib/matching/recency.ts`](src/lib/matching/recency.ts) with three knobs:

- `RECENCY_FULL_YEARS = 5` — age at or under this stays at weight `1`
- `RECENCY_HALF_LIFE_YEARS = 8` — years after that plateau until the weight is half (age 13)
- `RECENCY_CURVE = 2` — `1` is a steady exponential; `2` stays gentle just past five years, then drops hard after a decade

Age is `asOfYear - year`, using the current UTC year. Weight:

`exp(-ln(2) * ((age - 5) / 8) ^ 2)` once age is past 5.

Starting shape:

- 0–5 years: 1.00
- 7 years: ~0.96
- 10 years: ~0.76
- 13 years: 0.50
- 15 years: ~0.34
- 20 years: ~0.09
- 25 years (2001 work): ~0.01

A recent project with a real hit beats a much older one with a higher raw score. An old project still leads when it is the only evidence. A missing year (S011, S012, S013) keeps weight `1` so unknown dates are not treated as ancient.

Lower `RECENCY_HALF_LIFE_YEARS` or raise `RECENCY_CURVE` to punish older work harder.

## Where it applies

- [`topHomeProjects`](src/lib/matching/home-coverage.ts): sort key becomes `(tags + line count) * weight`. Returned points stay raw, so the row still shows real required/preferred counts.
- [`scorePostingAgainstCatalog`](src/lib/matching/score.ts): project order and the per-line example order use `points * weight`. Stored `score` and contribution points stay raw, so fit math does not shrink.
- Bump `SCORING_VERSION` from `2.4.0` to `2.5.0`.

The home list only has the saved match graph, which has no year. Add an optional `projectYears` map on [`matchGraphSchema`](scripts/contentful/matching/requirement-schema.mjs) and write it from the catalog in [`scoreMatchGraph`](src/lib/job-posting/contentful.ts). [`connection-hub.tsx`](src/components/stage/answer-stage/connection-hub.tsx) passes that map into `topHomeProjects`. Old graphs still parse; they rank at full weight until the posting is rescored. After that, editing the three knobs changes order on refresh without another rescore.

Update the one line in [`evidence/matching/engine.md`](evidence/matching/engine.md) that currently forbids a recency factor, so the spec matches this ranking rule. Coverage stays unweighted.

## Tests

- Curve checkpoints at ages 5, 10, 13, 20, and a null year.
- A higher-scoring old project ranks below a lower-scoring recent one in `topHomeProjects`; displayed points stay raw.
- Existing score tests keep equal years, so their order and point totals stay the same. Add one case where a newer project outranks an older one with more raw points.