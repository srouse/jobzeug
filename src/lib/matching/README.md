# App matching

Runtime scoring for a job posting against published project evidence. No AI at score time — concepts were mapped once at ingest; this folder only does deterministic arithmetic.

## How to use it

1. Bind / scrape a job posting so each line has a `matchingRequirement` and the posting has a `matchingSnapshot`.
2. Call **`GET /api/job-posting/match?jobPostingEntryId=<contentfulEntryId>`** (site session required).
3. Read **`projects`** — ranked list of how well each eligible project fits that posting.

Project scores stay **per project**. The best project match is `projects[0]` (highest `score` first; `null` scores sort last). Three separate numbers sit beside that ranking: `jobPostFit` (how much of the posting the resume covers), `resumeFit` (how much of the resume the posting lands on), and `jobRelevancy` (how much of the posting can be said in the tag vocabulary).

Formula (per project, scoring v2): for each project-scoped job line, take the **best claim**’s additive points, then sum across lines.

Per claim↔line: **+10** per exact overlapping concept id; **+12** if the line’s ownership / scope / delivery_stage constraint lists include the claim’s value. Empty lists and placeholder values (`unknown`, `null`, blank) add nothing and do **not** veto. Broader/narrower hierarchy is not credited in v2. Requirement `weight` is metadata only (not multiplied into `score`).

Compress / CMS contracts live under [`scripts/contentful/matching/`](../../../scripts/contentful/matching/README.md). Engine rules: [`evidence/matching/engine.md`](../../../evidence/matching/engine.md).

## Files in this folder

| File | Role |
|---|---|
| `catalog.ts` | Load published projects + vocabulary from Contentful |
| `score.ts` | `scorePostingAgainstCatalog` — per-project relationship points |
| `fit.ts` | `jobPostFit`, `resumeFit`, and `jobRelevancy` — separate from project ranking |
| `prepare.ts` | Score-time fixes for weak maps (not written back to CMS) |
| `sanitize.ts` | Drop unapproved concept IDs at ingest |
| `schema.ts` | Requirement / snapshot Zod + types |
| `versions.ts` | `SCORING_VERSION`, `MAPPER_VERSION`, `FIT_VERSION` |

## Match API response

`GET /api/job-posting/match?jobPostingEntryId=…`

### Top level

| Field | Type | Meaning |
|---|---|---|
| `jobLines` | array | Per job-line detail (which projects hit this line) |
| `entryRevisions` | object | Entries loaded for this run, keyed by Contentful content type id. Each item: `entryId`, `revision`, `updatedAt` |
| `error` | string? | Only on error responses (`401` / `400` / `404` / `500`) |
| `excludedProjectIds` | string[] | Not ranking-eligible (left out of `projects`) |
| `jobPostingEntryId` | string | Contentful job posting entry id |
| `mapped` | boolean | `false` if this posting was never mapped at ingest (legacy) |
| `message` | string? | Human note (legacy ingest, no project-scoped requirements, …) |
| `pendingProjectIds` | string[] | Catalog projects still in review (listed with `score: null`) |
| `postingId` | string | Stable posting id |
| `projects` | array | **Ranked project scores** — this is the main output |
| `scoringVersion` | string | Scorer version (omitted / unused when not mapped) |
| `status` | `"not_mapped"` \| `"ready"` \| `"provisional"` | Run quality: unmapped lines / pending projects → `provisional` |
| `unmappedJobLineEntryIds` | string[] | Job line entry ids (`jobzeugJobLine`) that are project-scoped but still have no vocabulary concepts |
| `vocabularyVersion` | string \| null | Vocab pin used for this run |
| `fitVersion` | string? | Fit-formula version, when the posting is mapped |
| `jobPostFit` | object \| null | How much of this posting the resume covers. `null` when not mapped or there are no project-scoped lines |
| `resumeFit` | object \| null | How much of the resume this posting lands on. `null` in the same cases |
| `jobRelevancy` | object \| null | How much of the posting can be said in the tag vocabulary. The resume is not an input. `null` in the same cases |

### `entryRevisions`

Object keyed by Contentful content type id. Each key is an array of `{ entryId, revision, updatedAt }` for every entry of that type loaded for this Match run:

| Key | Content type | Source |
|---|---|---|
| `jobzeugJobLine` | `jobzeugJobLine` content type | Lines on the posting |
| `jobzeugJobPosting` | `jobzeugJobPosting` content type | The posting itself |
| `jobzeugJobTool` | `jobzeugJobTool` content type | Tools on the posting |
| `jobzeugMatchingVocabulary` | `jobzeugMatchingVocabulary` content type | Vocab registries scored against |
| `jobzeugProject` | `jobzeugProject` content type | Projects scored against |

### `projects[]` — the scores

| Field | Type | Meaning |
|---|---|---|
| `contributions` | array | Job lines that added points (`points > 0` only) |
| `evidenceIds` | string[] | Claim ids that supported those hits |
| `pending` | boolean | If true, do not treat `score` as final |
| `projectId` | string | e.g. `S001` |
| `score` | number \| null | **Total relationship points** vs this posting. `null` if pending or nothing project-scoped to score |

Sorted by `score` descending. **Top of the list = most relationship hits.**

### `projects[].contributions[]`

| Field | Type | Meaning |
|---|---|---|
| `conceptHits` | number | Exact overlapping concept count on the best claim |
| `evidenceIds` | string[] | Best claim id(s) for this line |
| `ownershipHit` | boolean | Line ownership constraint matched the claim |
| `overlapIds` | string[] | Concept ids that overlapped |
| `points` | number | Additive points for this line |
| `rationale` | string | Short deterministic explanation |
| `requirementId` | string | Requirement id on a job line |
| `scopeHit` | boolean | Line scope constraint matched the claim |
| `stageHit` | boolean | Line delivery_stage constraint matched the claim |
| `weight` | number | Line weight (metadata; not multiplied into score) |

### `jobLines[]`

| Field | Type | Meaning |
|---|---|---|
| `lineEntryId` | string | Contentful job line entry id |
| `matchSummaries` | array | Top project hits for this line (capped) |
| `requirementId` | string \| null | Mapped requirement, or `null` if the line has none |
| `skipped` | string? | e.g. `"candidate_scope"` — line not used for project ranking |

### `jobLines[].matchSummaries[]`

| Field | Type | Meaning |
|---|---|---|
| `conceptHits` | number | Exact overlapping concept count |
| `evidenceIds` | string[] | Supporting claims |
| `ownershipHit` | boolean | Ownership axis hit |
| `overlapIds` | string[] | Overlapping concept ids |
| `points` | number | Additive points for this project on this line |
| `projectId` | string | Project that hit this line |
| `rationale` | string | Why |
| `scopeHit` | boolean | Scope axis hit |
| `stageHit` | boolean | Stage axis hit |

### `jobPostFit`

Ceiling is one project that hits every posting box: **10** per concept on a project-scoped line, **12** per ownership, scope, or stage axis that line sets. The strongest project’s boxes count in full. Boxes checked only by other projects count at half. Unchecked boxes count 0. `score` never exceeds `ceiling`.

| Field | Type | Meaning |
|---|---|---|
| `score` | number | Full points from the strongest project, plus half points from the rest |
| `ceiling` | number | Every posting box at full value |
| `bestProjectPoints` | number | Points from the strongest project’s boxes |
| `sharedPoints` | number | Half points from boxes other projects cover |

### `resumeFit`

A box is one concept on one scorable claim (**10**). The same concept on another claim counts again. The ceiling is every claim concept on ranking-eligible projects and does not depend on the posting. A box counts when any project-scoped line lists that concept. There is no half credit and no cap at the job ceiling.

| Field | Type | Meaning |
|---|---|---|
| `score` | number | Claim concepts this posting mentions |
| `ceiling` | number | Claim concepts on the resume |

### `jobRelevancy`

The resume is not an input. Each project-scoped line can hold **3** concepts at **10** points each. A line with fewer concepts scores `count × 10`. A line with more than 3 scores 30. A line with none scores 0 and still counts toward the ceiling. Years, degree, and location lines are left out. `score` never exceeds `ceiling`.

| Field | Type | Meaning |
|---|---|---|
| `score` | number | Capped concept points across project-scoped lines |
| `ceiling` | number | `lineCount × 30` |

## Quick read of a response

```text
projects[0].projectId   → project with the most relationship points
projects[0].score       → that project’s total points (not a 0–100 average)
projects[0].contributions → which job lines / claims earned the points
jobLines                → debug / UI: which projects match each job line
status === "provisional" → treat rankings as draft (gaps or pending evidence)
```
