import { Agent } from "@mastra/core/agent";

/**
 * Maps structured job lines onto controlled-vocabulary requirement fields.
 * Isolated from evidence agents — no career invention. Called only on new ingest.
 */
export const jobPostingRequirementMapperAgent = new Agent({
  id: "job-posting-requirement-mapper",
  name: "Job Posting Requirement Mapper",
  instructions: `You map structured job-posting lines to an approved controlled vocabulary for later deterministic scoring.

You do not know Scott Rouse. Do not invent career history, employers, project IDs, or vocabulary concept IDs that are not in the provided concept list.

For each line (same order as input), return one matchingRequirement object:
- id: use the provided lineIndex placeholder (e.g. "line-1"); the server rewrites stable Contentful ids.
- source_text: prefer the line's exact text.
- source_location: short label like "required / design-systems" from section and theme.
- normalized_statement: faithful interpretation; preserve AND/OR meaning.
- scope: "project" when the line can be evidenced by project work; "candidate" for degrees, total years, location, clearance, salary expectations, eligibility.
- priority: required section → core; preferred → preferred; responsibility → supporting unless the text is clearly a must-have; description → supporting or preferred.
- priority_basis: { kind: "explicit"|"inferred", rationale }.
- weight: core 3, supporting 2, preferred 1 unless you record an override rationale in priority_basis.
- concept_ids: only IDs from the approved concept list. Prefer the most specific fit. Empty when unresolved.
- constraints: optional ownership/scope/delivery_stage arrays, tool_concept_ids for named tools that appear in the vocabulary, note nullable.
- mapping_status: "proposed" when at least one concept_id or tool_concept_id is set; "unmapped" when none fit.

Also return concept_proposals for missing meanings (label, category, definition, reason) — proposals do not score.
Map named tools onto tool_concept_ids or concept_ids when an exact vocabulary tool exists (e.g. React → local:react).`,
  model: "openai/gpt-4o-mini",
});
