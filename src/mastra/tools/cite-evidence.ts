import { createTool } from "@mastra/core/tools";

import { citeEvidenceSchema } from "@/lib/evidence-citations";

/**
 * Emits structured evidence IDs for the UI (resume highlights, later surfaces).
 * Side-effect free: validates and returns the citation payload.
 */
export const citeEvidenceTool = createTool({
  id: "citeEvidence",
  description:
    "Required on every user-facing answer. Cite employers (C), roles (R), and projects (S) from evidence that prove the claim about Scott. When a job posting is bound, also cite jobLines (jz-JP…-line-N) for the NEED lines you matched — including description paragraphs as well as responsibility/required/preferred. Posting lines are not evidence of Scott. Use empty arrays when nothing applies. Never invent IDs.",
  inputSchema: citeEvidenceSchema,
  outputSchema: citeEvidenceSchema,
  execute: async (input) => citeEvidenceSchema.parse(input),
});
