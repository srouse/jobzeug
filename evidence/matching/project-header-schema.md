# Project YAML header schema

Status: schema version `1.1`, September 26, 2026, applied to all 21 active project records. Companions: [Project matching engine](engine.md), [controlled vocabulary](vocabulary.yaml), and [migration report](project-header-migration.md). This defines the header data contract. The [Contentful pipeline and delivery loader](../../contentful/matching.md) consume these fields as structured data; ranking/scoring remains unimplemented. Original narratives remain beneath the headers.

## File shape and source of truth

Put one YAML frontmatter block at the very beginning of each project Markdown file, before its existing H1. Use UTF-8, two-space indentation, quoted dates, no duplicate keys, and no YAML executable/custom tags. Preserve filenames, S-prefixed project IDs, original accounts, source links, caveats, and dated additions. Keep narrative evidence in the body; the header contains structured summaries linked to it.

Only real S-prefixed project records receive this schema, not INDEX.md. Do not assign a second project ID; preserve the existing S-prefixed namespace. Do not migrate all projects by copying the illustrative example below. Extract each project's supported facts individually.

## Minimal valid draft

A draft can exist before the vocabulary is ready. This is a template, not a new project record; replace S999 and the title with the existing record's identity.

```yaml
---
schema_version: "1.1"
project_id: S999
title: "Existing project title"
record_kind: project
project_origin: unknown
ranking_eligible: true
exclusion_reason: null
parent_project_id: null
related_project_ids: []
role_links: []
employer_links: []
customer_ids: []
client_ids: []
year: null
year_basis: unknown
year_note: "Not yet established"
delivery_stage: unknown
annotation:
  status: draft
  vocabulary_version: null
  reviewed_by: null
  reviewed_at: null
public_disclosure: needs_review
evidence: []
concept_proposals: []
---
```

## Project field contract

All fields in the minimal template are required; null and empty collections represent unknown or uncaptured data, never affirmative absence of a capability.

| Field | Allowed values and meaning |
|---|---|
| schema_version | String `1.1` for this contract |
| project_id / title | Existing S-prefixed ID and faithful human-readable name |
| record_kind | `project` or `umbrella`; umbrellas default to ranking_eligible false |
| project_origin | `employment`, `personal`, `mixed`, or `unknown` |
| ranking_eligible / exclusion_reason | Boolean; false requires a nonempty reason. Eligibility may be further restricted for a particular application |
| parent_project_id / related_project_ids | Existing S-prefixed IDs or null/empty; no parent cycles or self-links |
| role_links / employer_links | Objects defined below; preserve provisional and calendar-only links |
| customer_ids / client_ids | Existing CU-/CL-prefixed IDs; no invented customers or clients |
| year | One four-digit integer year, or null. A representative year for the project, not an exact start/end date or duration |
| year_basis | `reported` (Scott supplied the year), `sourced` (a project source establishes it), `estimated` (inferred from context or role tenure), or `unknown` (year is null) |
| year_note | Brief source or estimation rationale; identify the linked role and tenure when used, and preserve uncertainty |
| delivery_stage | `concept`, `prototype`, `pilot`, `production`, `mixed`, or `unknown` |
| annotation | Status `draft`, `reviewed`, or `needs_review`; pinned vocabulary version, actual reviewer, and ISO review date required for reviewed |
| public_disclosure | `cleared`, `restricted`, or `needs_review`; default needs_review. Linked entity and claim restrictions still apply even when a project is cleared |
| evidence | Claim records defined below |
| concept_proposals | Objects containing `label`, `category`, `definition`, and `reason`; proposals do not score |

Role/employer link objects have `id`, `relationship`, `status`, and `note`. `relationship` is `delivery` or `calendar_anchor`; `status` is `confirmed` or `provisional`. Resolve IDs through the existing workspace indexes rather than generating new records during migration. A personal project's calendar placement at an employer does not mean that employer commissioned or owns the work. Preserve the existing canonical role association; if sources conflict, mark it provisional and retain the conflicting account instead of guessing.

## Year-only project timing

Use a single representative year. Prefer a year Scott supplies, then a year established by a relevant project source. For work spanning several years, use the year of the main contribution or delivery where known and preserve the broader history in the body. A publication year can represent a writing project; a later maintenance release does not automatically date the original build.

Scott permits estimating the year from the linked role's tenure. Choose a plausible year within that tenure using the available project context and mark it `estimated`; record the role, known tenure, and selection rationale in `year_note`. A rough estimate is sufficient—do not request exact months or start/end dates. If there is no usable role timeframe or project context, leave the year null. A calendar-only role link can help place personal work without turning it into employer work.

Example of an estimate (fictional tenure, not a claim about an existing role):

```yaml
year: 2020
year_basis: estimated
year_note: "Role tenure was 2019–2021; using its midpoint as an approximate project year."
```

Estimated years are valid metadata and do not make otherwise supported evidence claims inferred or ineligible. Display them as approximate when showing chronology. Do not use the year to infer project duration, years of experience, or ongoing status. Capture and review timestamps remain full ISO dates; only project timing is reduced to a year.

Version 1.1 replaces the proposed `dates.start`, `dates.end`, and `dates.note` fields. During migration, preserve any existing date detail in the narrative and select one representative year using the rules above. Do not retain both timing formats in the header.

## Evidence claim contract

Every claim object has the following fields:

| Field | Contract |
|---|---|
| id | Stable project-scoped ID such as `S001-E001`; never renumber existing claims |
| statement | Concise faithful claim about an action or result; do not polish away limitations |
| concept_ids | Approved vocabulary IDs only; may be empty while draft |
| ownership | `sole`, `lead`, `contributor`, `team_unspecified`, or `unknown`. These are descriptive, not an ordered proficiency scale |
| scope | `individual`, `single_team`, `multiple_teams`, `organization`, `external_audience`, or `unknown`; describe nuances in limitations |
| delivery_stage | Same enum as project field; claim-specific stage takes precedence |
| provenance | `self_report`, `existing_material`, `artifact_supported`, or `inferred`; use separate claims when sources support materially different assertions |
| sources | Nonempty list of source objects defined below |
| limitations | List of uncertainties, conflicting sources, attribution boundaries, or measurement caveats |
| public_disclosure | Same enum as project field; restrictions combine, never cancel each other |
| review | Object with status `proposed`, `approved`, or `needs_review`, plus reviewer and date (null before review) |

Each source object has `ref` (a relative Markdown path/anchor or URL), `locator` (section, page, timestamp, or other precise location), and `supports` (what that source actually establishes). Relative paths resolve from the project file. For local narratives prefer stable explicit HTML anchors such as `<a id="evidence-e001"></a>` immediately before the supporting passage. A source can be the preserved project account itself; external verification is not required to record self-reported evidence.

An approved claim needs at least one approved concept, resolvable supporting sources, and an actual reviewer/date. Inferred claims remain contextual leads and never score as direct evidence in v1. Do not assign numeric project-wide proficiency or importance. Evidence-to-requirement match strength is computed in the assessment ledger for each job, not stored permanently on the claim.

## Illustrative populated fragments

These fictional fragments demonstrate syntax only. `local:design-system-development` must exist and be approved in the chosen registry before this claim could be approved. S999 is a placeholder, not permission to create a workspace project.

```yaml
role_links:
  - id: R007
    relationship: calendar_anchor
    status: provisional
    note: "Illustration: personal work during this tenure, not employer delivery"
employer_links:
  - id: C003
    relationship: calendar_anchor
    status: provisional
    note: "Illustration only"
evidence:
  - id: S999-E001
    statement: "Built a component library for use by two product teams."
    concept_ids:
      - local:design-system-development
    ownership: contributor
    scope: multiple_teams
    delivery_stage: prototype
    provenance: self_report
    sources:
      - ref: "#evidence-e001"
        locator: "Account: library development"
        supports: "Authorship contribution, intended audience, and prototype stage"
    limitations:
      - "Intended use by two teams; actual adoption has not been established."
    public_disclosure: needs_review
    review:
      status: proposed
      reviewed_by: null
      reviewed_at: null
```

Here “built for two teams” supports intended scope, not achieved adoption. A requirement to drive production adoption cannot receive full credit from this claim.

## Review and validation rules

- Parse with a safe YAML parser. Validate types, enums, unique IDs, nonempty strings where required, and allowed fields. Flag unknown fields rather than silently discarding them. A future machine-readable schema should implement this contract.
- Check that project, role, employer, customer, client, parent, and related IDs exist and that the header agrees with the body. Preserve and flag conflicts.
- Resolve local source files and anchors. For remote sources preserve precise provenance; lack of network access is not evidence that a claim is false.
- Check concept IDs against the pinned registry. Proposed or nonexistent concepts cannot enter approved claims. Deprecated concepts require explicit migration review.
- Only approved, non-inferred claims contribute to ranking. Draft and needs_review project annotations make the run provisional; incomplete projects remain visible as pending.
- If a project's body or cited source changes in a way that could affect a claim, mark that claim and project annotation needs_review. A future implementation should detect content changes using run snapshots/hashes; timestamps alone are insufficient.
- A reviewed project means its intended annotation pass is complete, including documented gaps. It does not mean every historical claim has independent artifact verification.
- Never derive clearance from a public artifact alone. Preserve linked CU/CL disclosure restrictions and workspace application exclusions.
- Require an integer year between 1000 and 9999 when present; `year_basis: unknown` must accompany null, and a non-null year requires another basis. Record the source or rationale in `year_note`. Estimates from role tenure are allowed as described above; do not present them as confirmed dates.
- Do not fill metrics from organization research or equate prototype functionality with production outcomes.

## Migration procedure for another agent

1. Read the engine specification, workspace README, project index, complete project account, and relevant linked records.
2. Check existing consumers of project files before integrating frontmatter into the application. Do not assume the current parser strips or understands YAML.
3. Use the approved concept definitions in the versioned vocabulary; v1.0.0 is the initial agent-reviewed registry. Verify that a concept's meaning fits each claim and preserve any new suggestions separately. Record the version used in the header, even while annotations remain draft; use null only when no vocabulary has been selected. Registry approval does not approve any claim or establish Scott's review.
4. Add the minimal header to each project; populate supported facts and, when necessary, an explicitly labeled year estimate under the timing rules above. Preserve the entire narrative. Record umbrella exclusions and calendar-only employer associations accurately.
5. Extract claim records, add stable source anchors, and propose concept mappings. Keep uncertainties explicit and request factual input only where it is necessary to resolve an actual ambiguity.
6. Validate references and header/body consistency; produce a migration report listing completed records, unresolved claims, proposed concepts, and any conflicting associations. Do not claim a reviewed migration without actual review.
7. After annotation, update relevant index/routing notes and cross-links under the workspace maintenance contract. Keep generated scores and posting text out of project headers.

The vocabulary registry and initial header migration now exist. Seventeen project annotations are reviewed; five need discussion, as recorded in the migration report. Review is by Codex against existing sources, not independent verification or a claim of Scott's approval. Runtime implementation remains separate work.
