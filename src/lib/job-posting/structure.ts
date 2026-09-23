import { mastra } from "@/mastra";
import {
  structuredJobPostingSchema,
  type StructuredJobPosting,
} from "./schema";

export async function structureJobPosting(input: {
  sourceUrl: string;
  fullText: string;
}): Promise<StructuredJobPosting> {
  const agent = mastra.getAgentById("job-posting-structurer");
  const prompt = `Source URL: ${input.sourceUrl}

Listing markdown:
---
${input.fullText.slice(0, 60_000)}
---

Extract the structured job posting fields.`;

  const runOnce = async () => {
    const result = await agent.generate(prompt, {
      structuredOutput: {
        schema: structuredJobPostingSchema,
      },
    });
    const object =
      (result as { object?: unknown }).object ??
      (result as { structuredOutput?: unknown }).structuredOutput;
    return structuredJobPostingSchema.parse(object);
  };

  try {
    return await runOnce();
  } catch (firstError) {
    try {
      return await runOnce();
    } catch {
      throw firstError instanceof Error
        ? firstError
        : new Error("Job posting structure failed");
    }
  }
}
