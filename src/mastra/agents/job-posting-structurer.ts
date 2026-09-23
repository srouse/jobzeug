import { Agent } from "@mastra/core/agent";

/**
 * Stateless structured extractor for job listing markdown.
 * Isolated from jobzeug-agent — no evidence workspace, no cite tool, no memory.
 * Only called from job-posting ingest.
 */
export const jobPostingStructurerAgent = new Agent({
  id: "job-posting-structurer",
  name: "Job Posting Structurer",
  instructions: `You extract structured fields from a job listing's markdown. You do not know Scott Rouse and must not invent career history, employers, or evidence IDs.

Return only the structured object requested by the schema.

Rules:
- Prefer the posting's own wording for each line's text.
- section must be one of: responsibility (what you'll do), required (must-haves), preferred (nice-to-haves).
- kind: use duty for responsibilities; years/skill/domain/soft/other for requirements and preferred.
- theme: short kebab-ish label for search (e.g. design-systems-ai, customer-facing).
- Extract 6–25 strong lines; do not turn the apply form, EEO, or benefits legalese into lines.
- tools: named technologies (TypeScript, MCP, Code Connect, SSO, etc.) with context where they appeared.
- company, title, location, seniority, yearsExperienceMin/Note from the listing when present.
- summary: short narrative of the role, not the whole page.`,
  model: "openai/gpt-4o-mini",
});
