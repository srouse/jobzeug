import { mastra } from "@/mastra";
import type { StructuredJobPosting } from "./schema";
import type { MatchingRequirement, MatchingSnapshot } from "./schema";
import {
  hashStructuredPosting,
  slimConceptsForMapper,
} from "@/mastra/workflows/map-job-posting-lines";

export { hashStructuredPosting };

export type MappedJobPostingRequirements = {
  lineRequirements: MatchingRequirement[];
  snapshot: MatchingSnapshot;
};

/** AI maps each job line → vocabulary requirements via parallel workflow; soft rematch never fails ingest. */
export async function mapJobPostingRequirements(input: {
  structured: StructuredJobPosting;
  vocabulary: {
    vocabulary_version: string;
    status: string;
    concepts: Array<{
      id: string;
      label: string;
      definition: string;
      category: string;
      aliases: string[];
      status: string;
    }>;
  };
  postingId?: string;
}): Promise<MappedJobPostingRequirements> {
  if (input.vocabulary.status !== "approved") {
    throw new Error("Matching vocabulary is not approved");
  }

  const workflow = mastra.getWorkflow("mapJobPostingLinesWorkflow");
  const run = await workflow.createRun();
  const result = await run.start({
    inputData: {
      postingId: input.postingId,
      vocabularyVersion: input.vocabulary.vocabulary_version,
      concepts: slimConceptsForMapper(input.vocabulary),
      tools: input.structured.tools,
      lines: input.structured.lines,
      sourceHash: hashStructuredPosting(input.structured),
    },
  });

  if (result.status !== "success") {
    const message =
      result.status === "failed"
        ? result.error?.message ?? "Job posting line mapping failed"
        : `Job posting line mapping ended with status ${result.status}`;
    throw new Error(message);
  }

  const output = result.result;
  return {
    lineRequirements: output.lineRequirements,
    snapshot: output.snapshot,
  };
}
