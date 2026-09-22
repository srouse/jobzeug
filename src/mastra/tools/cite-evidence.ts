import { createTool } from "@mastra/core/tools";

import { citeEvidenceSchema } from "@/lib/evidence-citations";

/**
 * Emits structured evidence IDs for the UI (resume highlights, later surfaces).
 * Side-effect free: validates and returns the citation payload.
 */
export const citeEvidenceTool = createTool({
  id: "citeEvidence",
  description:
    "Required on every user-facing answer. Cite the employer (C), role (R), and project (S) evidence IDs that support your reply so the UI can highlight them. Use empty arrays when nothing applies. Never invent IDs.",
  inputSchema: citeEvidenceSchema,
  outputSchema: citeEvidenceSchema,
  execute: async (input) => citeEvidenceSchema.parse(input),
});
