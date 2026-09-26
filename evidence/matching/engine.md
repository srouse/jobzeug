# Project matching engine specification

Status: proposed v1 ranking contract, September 26, 2026. This document specifies future runtime behavior. The vocabulary and initial project headers now exist; see the [migration report](project-header-migration.md) for annotation review and unresolved questions. The [Contentful storage pipeline and delivery loader](../../contentful/matching.md) are implemented; this specification still describes future scoring behavior.

Read this first, then [Project header schema](project-header-schema.md), the [controlled vocabulary](vocabulary.yaml), and the [workspace evidence contract](../README.md). The specifications separate ranking policy from the durable project data format; the vocabulary supplies the shared concept IDs. Follow the workspace's disclosure, provenance, and entity rules.

## Objective and boundaries

Given a job posting and a collection of project records, return projects sorted by the strength of documented evidence for that posting's requirements. Rank S-prefixed projects, not R-prefixed roles or C-prefixed employers. Include those associations only as context. A relevance score is not a probability of employment, a candidate eligibility decision, or an assessment of overall ability.

Keep projects as Markdown with YAML frontmatter. Derive machine-readable JSON when needed rather than maintaining two authoritative copies. Preserve detailed accounts in the body. Job postings remain session-bound application data: never save full postings under evidence/. Persist runtime inputs outside this evidence workspace only in accordance with application storage policy.

## O*NET precedent and local design decisions

O*NET supplies a framework for describing work and competencies. This engine's scoring, header schema, review workflow, and domain extensions are local design decisions, not an O*NET matching algorithm. Do not call a locally invented concept an official O*NET term.

Use the following category identifiers for the controlled vocabulary. The first five draw on O*NET's organization; their local identifiers are not official O*NET identifiers.

| Category ID | Meaning | Possible concepts; examples are not an approved vocabulary |
|---|---|---|
| skill | Learned capability | Writing, programming, critical thinking |
| knowledge | Subject matter understood and applied | Design, computers and electronics |
| work_activity | Action performed in work | Analyzing information, teaching others, coordinating work |
| work_context | Conditions under which work occurs | Teamwork, contact with others, time pressure |
| tool | Software or technology actually used | Figma, Contentful, Git; verify individual external mappings |
| domain | Local extension: product, industry, or audience context | Enterprise SaaS, financial services, developer tools |
| deliverable | Local extension: produced artifact or system | Component library, design-token pipeline, technical demo |
| outcome | Local extension: observed result category | Adoption, reduced processing time, improved accessibility |

Ownership, scope, delivery stage, project year, provenance, and disclosure are structured qualifiers on evidence, not interchangeable skill tags. Project timing uses one representative year; a clearly labeled estimate from linked role tenure is allowed under the header schema. It is not a scoring bonus or a basis for inferring duration. Methods can be represented as skills or work activities according to their definition; do not create duplicate concepts in both categories merely to increase matches.

O*NET also describes abilities, work styles, interests, education, and experience. Do not infer personality, innate abilities, or interests from project descriptions. Candidate-level qualifications such as degrees, licenses, location, and total years of experience belong in a separate requirements report and do not enter project scores.

## Controlled vocabulary contract

The versioned registry is [vocabulary.yaml](vocabulary.yaml). Version 1.0.0 contains agent-reviewed definitions informed by the project collection and three representative postings, with verified mappings to O*NET 31.0 where appropriate. Vocabulary approval concerns the definitions, not Scott's proficiency or approval of project claims. Concepts can represent incoming requirements even when no current project supplies evidence. Every active concept must have:

- `id`: stable identifier; use `local:<slug>` for local concepts.
- `label`, `definition`, and `category`: one canonical meaning and category.
- `aliases`: expressions genuinely equivalent to that meaning; related words are not automatically synonyms.
- `status`: `proposed`, `approved`, or `deprecated`.
- `broader_ids`: optional hierarchy, with no cycles.
- `external_mappings`: zero or more objects with `system`, `release`, `source_file`, `source_id`, `source_url`, and `relation` (`exact`, `broader`, `narrower`, or `related`). State the relation from the local concept to the external concept.
- `review`: reviewer identity and ISO date for approved records; record actual review, never fabricate a user's approval.

The registry also records `evidence_rule` (boundaries for assigning a concept) and `basis` (`project_ids` and `requirement_source_ids` identifying discovery leads, not approved project annotations). Its top-level source metadata, category definitions, usage rules, coverage checks, and known unmapped examples document scope and provenance. Local project-source paths resolve relative to the registry. `external_mappings.source_label` preserves the verified O*NET name alongside its identifier. Never treat discovery leads as automatic tag assignments.

Pin the O*NET database release and vocabulary version. Look up identifiers and definitions in that release's downloaded data or official API; never invent or recall identifiers from memory. Preserve the original hierarchy and source family. A technology identifier may come from a different classification than a Content Model element. Record this explicitly. Check the chosen dataset's attribution and license terms when importing it.

An O*NET parent can help organize a local concept without being equivalent to it. For example, a broad activity involving teaching does not by itself prove experience teaching Figma. Related and broader/narrower mappings never yield full credit automatically.

Vocabulary changes are deliberate maintenance, not an incidental side effect of processing a posting. Map incoming wording to approved concepts. Keep unresolved wording as an unmapped requirement and propose a concept or alias for review. Do not force a match. Approved vocabulary changes create a new version; mark affected annotations for review rather than silently rewriting them.

## Project annotation workflow

1. Read the complete project and its source references, not just INDEX themes or polished resume copy.
2. Capture atomic claims about Scott's contribution. Preserve team-versus-personal attribution, uncertainty, delivery status, and evidence provenance.
3. Attach approved concepts to each claim and add qualifiers supported by that claim's sources. Keep unapproved suggestions separately as proposals.
4. Cite an exact section or artifact and explain what it supports. An artifact's existence does not verify every outcome.
5. Review and save the annotations using the companion header schema. Approved means the annotation faithfully represents the source, not that a self-reported claim has become independently verified.
6. Derive project-level concepts from approved claims. Never score a flat list of project tags as if it were proof.

Do not add job-specific weights or match scores to project headers. A project is annotated once and reused across postings. Changes to supporting text invalidate affected approvals until reviewed again.

## Job requirement representation

For each distinct requirement, retain these fields in the session's structured input:

| Field | Contract |
|---|---|
| id | Stable within the posting snapshot |
| source_text / source_location | Verbatim requirement and its location in that snapshot |
| normalized_statement | Faithful interpretation, including conjunctions and alternatives |
| scope | `project` or `candidate` |
| priority | `core`, `supporting`, or `preferred` |
| priority_basis | `explicit` or `inferred`, plus a brief rationale |
| weight | Defaults: core 3, supporting 2, preferred 1; any override needs a recorded rationale |
| concept_ids | Approved registry IDs; empty when unresolved |
| constraints | Ownership, scope, stage, domain, tool, or outcome conditions, preserving AND/OR meaning |
| mapping_status | `proposed`, `approved`, or `unmapped` |

These weights are local starting defaults to evaluate, not O*NET ratings. Do not copy an occupation's average importance ratings into a particular posting. Do not use word frequency as importance. Deduplicate paraphrases without losing source locations. Do not multiply one requirement's weight by its number of tags. Treat ordinary responsibilities as supporting unless the posting provides a reason to prioritize them; mark inferred priorities for review.

“Lead design-system adoption across teams” is one compound requirement: design-system work, leadership, and multi-team adoption must be connected in the evidence. Separate unrelated claims containing those words do not establish full support. Distinct independently requested capabilities can become separate requirements; preserve the original source relationship and avoid counting the same expectation twice.

## Evidence matching and scoring

For every eligible project and every project-level requirement, build an evidence assessment. A small personal collection should be scored exhaustively; search infrastructure is unnecessary for v1.

| Match value | Rule |
|---|---|
| 1 | Approved evidence directly supports the requirement and all its necessary constraints |
| 0.5 | Approved evidence supports a meaningful part or a defensible transferable equivalent; explicitly name the missing condition or transfer rationale |
| 0 | No approved documented support, a conflicting condition, or unresolved mapping |

Similarity, a matching keyword, or a broad parent concept alone is insufficient for 0.5. For each assessment save requirement ID, project ID, evidence IDs, match value, rationale, unmet constraints, and review status. AI may propose assessments; accepted assessments and frozen inputs produce deterministic arithmetic. Deterministic scoring does not make an AI's initial semantic judgments deterministic or correct.

For each requirement, take the strongest coherent evidence assessment within that project, not a sum of all mentions. Multiple claims can jointly support a requirement only if their relationship establishes the requested combination. Do not combine evidence across different projects for individual project scores.

`score(project) = 100 * sum(weight(requirement) * match(project, requirement)) / sum(weight(requirement))`

The denominator includes every distinct project-level requirement, including unmapped ones. Unmapped requirements contribute zero and are visibly reported as unresolved, not declared capability deficits. If mappings or assessments are unfinished, label the ranking provisional. If no project-level requirements exist, return `score: null` and explain that there is nothing to rank against.

Sort on unrounded score descending, then project ID ascending for reproducible ties. Round only displayed scores to one decimal. Do not add hidden employer prestige, recency, evidence length, tag count, or general project importance bonuses. Preserve provenance alongside the result; source type is not a hidden numeric multiplier.

Example: weights 3, 3, 1 with matches 1, 1, 0 produce 85.7. Matches 0.5, 0, 1 produce 35.7. These are relative evidence-coverage scores for one posting; do not compare them as universal project quality scores across postings.

## Hierarchy, exclusions, and result contract

Keep overarching narratives in role context, as with retired S004. Treat any future umbrella records as navigation by default. Rank the child projects that hold actual claims; do not inherit their evidence into an umbrella and rank the same accomplishment twice. An umbrella with independently documented work may be explicitly made eligible. Preserve shared evidence identity if claims are referenced by multiple projects; warn about overlap when selecting a shortlist.

Honor workspace and application exclusions before ranking, and report exclusions separately from zero scores. Private evidence may be useful internally, but ranking does not authorize publishing customer/client names or other restricted details.

Return:

- Run metadata: posting snapshot identifier/hash, project content hashes, schema/vocabulary/scoring versions, and versions of any AI-assisted extraction process.
- Ordered projects: project ID, score, supporting evidence IDs, requirement-by-requirement contributions, provenance, limitations, and context links to roles/employers.
- Unmapped requirements, pending assessments, missing project annotations, and candidate-level requirements outside scoring.
- Status: `provisional` or `reviewed`; use reviewed only when all relevant mappings and assessments have actual recorded review and no required project annotations are missing.

Missing annotations must not silently remove a project from consideration. Include it as pending with score null; show pending projects separately from the ordered scored results and mark the run provisional. A complete reviewed project with no matching evidence can receive zero.

An overall theme or tag summary may be derived for navigation, but cannot override requirement-level scoring. Selecting a complementary resume shortlist is a separate later operation; do not silently diversify or reorder this relevance ranking.

## Implementation sequence and acceptance checks

1. Build and review a small versioned vocabulary with verified O*NET mappings where appropriate.
2. Add draft headers to projects, preserve bodies and IDs, and review claim mappings.
3. Implement parsing/validation and structured job requirements.
4. Implement the assessment ledger, scoring, and explanations.
5. Evaluate on manually judged real postings, reserving separate postings for evaluation after tuning.

Verify: aliases do not add points; repeated requirements do not add weight; unrelated claims cannot satisfy a compound requirement; unknown vocabulary stays visible; self-reported outcomes stay labeled; personal projects do not become employer accomplishments; umbrella/child evidence is not duplicated; unchanged approved inputs yield identical scores; empty requirements yield null; project text edits trigger annotation review. Human relevance judgments should determine whether the top projects are useful. Improve vocabulary or scoring only in response to observed errors.

## Primary references

- [O*NET Content Model](https://www.onetcenter.org/content.html): category precedent and definitions; consulted September 26, 2026.
- [O*NET competency frameworks](https://www.onetcenter.org/competencyFrameworks.html): machine-readable framework resources.
- [O*NET database](https://www.onetcenter.org/database.html): select and pin an actual release when implementing.
- [O*NET license agreements](https://www.onetcenter.org/license.html): check terms for the selected resources.
- [Stanford: Information retrieval system evaluation](https://nlp.stanford.edu/IR-book/html/htmledition/information-retrieval-system-evaluation-1.html): relevance judgments and separation of tuning from evaluation.
