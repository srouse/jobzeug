---
name: Job relevancy score
overview: Add a third posting-only number, job relevancy, next to job post fit and resume fit. It measures how much of the posting can be said in the tag vocabulary, with three concepts as a full line.
todos:
  - id: relevancy-math
    content: Add jobRelevancy pure function and return it from computeFits; bump FIT_VERSION to 1.1.0
    status: completed
  - id: relevancy-tests-docs
    content: Cover the 3-concept cap, empty lines, and candidate-line exclusion in fit tests; document the formula
    status: completed
  - id: relevancy-demo
    content: Attach jobRelevancy on the match response and show it in the demo’s left column
    status: completed
isProject: false
---

# Job relevancy

The resume does not enter this number. It answers whether the posting lives in the tag vocabulary at all. A posting that maps to only 56 points across many lines scores low here even when the resume covers every one of those points.

## Formula

In [`src/lib/matching/fit.ts`](src/lib/matching/fit.ts), a pure `jobRelevancy(conceptCounts: number[])` uses the same 10-point concept unit as the other fits.

- Count only project-scoped lines. Years, degree, and location lines stay out.
- A line’s concept count is its `concept_ids` plus tool concept ids, after the same prepare step `computeFits` already runs. Ownership, scope, and stage do not count.
- A full line is **3** concepts. `min(count, 3) × 10` is that line’s score. Zero concepts add 0. A fourth concept does not add more.
- **Ceiling** is `lineCount × 30`. **Score** is the sum of the capped line scores. Both are integers. Score never exceeds the ceiling.

Example, 10 project lines, ceiling **300**:

- Every line has 3 or more concepts: **300**
- Every line has 2 concepts: **200**
- Two lines have 2 concepts and the rest have none: **40**

`computeFits` returns `jobRelevancy: { score, ceiling }` beside the existing fits. No project-scoped lines, or no snapshot: `null`, same as the other two. Bump `FIT_VERSION` in [`src/lib/matching/versions.ts`](src/lib/matching/versions.ts) from `1.0.0` to `1.1.0`. Leave `SCORING_VERSION` alone.

## Where it shows

[`src/app/api/job-posting/match/route.ts`](src/app/api/job-posting/match/route.ts) already spreads the fit result. Add `jobRelevancy` next to `jobPostFit` and `resumeFit`, including `null` on the route’s own `not_mapped` response.

On [`src/app/debug/match-concepts/route.ts`](src/app/debug/match-concepts/route.ts), add a third block in the left column under the two fit numbers, labeled Relevancy, using the same score, percentage, and “of ceiling” markup. Do not change project or job-line click behavior.

## Tests and docs

Extend [`scripts/matching/fit.test.mjs`](scripts/matching/fit.test.mjs): a line with 4 concepts scores the same as 3; empty lines lower the score but stay in the ceiling; the total never exceeds the ceiling; candidate-only lines do not affect it.

Document the formula in [`src/lib/matching/README.md`](src/lib/matching/README.md) and [`evidence/matching/engine.md`](evidence/matching/engine.md).