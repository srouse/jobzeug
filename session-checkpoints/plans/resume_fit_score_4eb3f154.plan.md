---
name: Resume fit score
overview: "Add two integer scores to the match result. Job post fit is how much of the posting the resume covers, capped by one perfect project. Resume fit is the reverse: how much of the resume the posting lands on, which grows with time spent on this kind of work. Show both at the top right of the match-concepts demo."
todos:
  - id: fit-math
    content: Add src/lib/matching/fit.ts with pure job-post and resume fit math, plus one computeFits entry that reads the catalog and posting. Leave the score.ts ranking loop alone.
    status: completed
  - id: fit-tests-docs
    content: Add FIT_VERSION 1.0.0, fit.test.mjs, and wire it into test:matching. Document both formulas in the matching README and engine.md.
    status: completed
  - id: fit-demo
    content: Attach both scores on the match response and show them side by side at the top of the match-concepts demo. Both null on not_mapped.
    status: completed
isProject: false
---

# Job post fit and resume fit

Project totals stay as they are. The match result gains two resume-level numbers.

- **Job post fit** shoots the resume at the posting: how many pieces of that puzzle get covered.
- **Resume fit** shoots the posting at the resume: how much of this person’s work the posting lands on. More relevant projects raise it, so it tracks time in this kind of work. A dog-walker posting lands near zero on the same resume.

## Job post fit

A box is one concept on a project-scoped job line (10 points) or one set ownership, scope, or stage axis on that line (12 points). Unmapped lines and candidate-scoped lines have no boxes. Pending projects do not check boxes.

**Ceiling** is every box at full value. That is one project hitting all of them.

For each box:

- The strongest project checks it: full points. Ties break on project id, same order as project ranking in [`src/lib/matching/score.ts`](src/lib/matching/score.ts).
- Some other project checks it and the strongest does not: half points (5 or 6). Two or three projects can still check every box, and those boxes count at half, so the total sits under the ceiling. A wider split leaves a smaller strongest project, so more of the posting is at half and the score falls further.
- Nobody checks it: 0.

The sum never exceeds the ceiling. It equals the ceiling only when the strongest project checks every box.

Example, four concept boxes, ceiling 40:

- One project hits all four: **40**
- Two projects, two boxes each: **30** (20 full + 10 half)

## Resume fit

A box is one concept on one scorable claim (10 points), on a ranking-eligible project that is not pending. The same concept on another claim is another box, so repeating the work adds points. Empty concept lists add nothing. Ownership, scope, and stage are not resume boxes.

**Ceiling** is every claim concept on the resume. That is the size of the career puzzle, and it does not depend on the posting.

The posting covers a box when any project-scoped job line lists that concept (including tool concepts). Covered boxes count in full. There is no half credit and no cap at the job ceiling: five projects that each do this work score about five times one such project.

Example, 10 claims with 2 concepts each, ceiling **200**:

- The posting mentions both concepts: **200**
- The posting mentions one of them: **100**
- The posting mentions neither: **0**

Another decade of claims that repeat those concepts raises the score and the ceiling. The same resume against a dog-walker posting stays **0** of **200**.

## Own module

This math does not go inside the project-ranking loop in [`src/lib/matching/score.ts`](src/lib/matching/score.ts). That file keeps scoring claims against lines and summing project totals.

New [`src/lib/matching/fit.ts`](src/lib/matching/fit.ts):

- Pure functions take plain boxes and return integers. No Contentful, no HTTP, no project-ranking side effects.
- `jobPostFit` takes posting boxes and the set of project ids that check each box.
- `resumeFit` takes resume concept boxes and the set of concept ids the posting lists.
- `computeFits({ posting, catalog })` is the only adapter. It builds those boxes by reusing `bestClaimForLine` and the 10/12 constants, then calls the pure functions.
- Add `FIT_VERSION = "1.0.0"` in [`src/lib/matching/versions.ts`](src/lib/matching/versions.ts). Leave `SCORING_VERSION` at `2.1.0`.

The match route calls `computeFits` after the existing scorer and attaches the two objects. The debug route calls the same function. Nothing else imports it.

## Where it appears

- `jobPostFit`: `score`, `ceiling`, `bestProjectPoints`, `sharedPoints`
- `resumeFit`: `score`, `ceiling`
- `not_mapped`, or a posting with no project-scoped lines: both `null`. If there are lines but no scorable claims, `resumeFit` is `{ score: 0, ceiling: 0 }`.

[`src/app/api/job-posting/match/route.ts`](src/app/api/job-posting/match/route.ts) adds both fields next to the scorer result, including `null` on its own `not_mapped` response.

On [`src/app/debug/match-concepts/route.ts`](src/app/debug/match-concepts/route.ts), both numbers sit side by side at the top of the page, in the header, to the right. Each is labeled and shows `score` with `of {ceiling}` under it. The project list and job-line click behavior stay as they are. Do not add this to the job-posting panel.

## Tests and docs

New [`scripts/matching/fit.test.mjs`](scripts/matching/fit.test.mjs), added to `test:matching` in [`package.json`](package.json). Do not fold these cases into the ranking tests.

- Job post fit: one perfect project equals the ceiling; a two-project split is under it; no overlap is 0; the total never exceeds the ceiling.
- Resume fit: repeating a matching concept across claims raises the score; a posting with no shared concepts scores 0 while the ceiling stays the resume size; the score can exceed the job ceiling.

Update both formulas in [`src/lib/matching/README.md`](src/lib/matching/README.md) and [`evidence/matching/engine.md`](evidence/matching/engine.md).
