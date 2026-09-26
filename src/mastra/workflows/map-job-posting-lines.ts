import { createHash } from "node:crypto";
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

import {
  matchingRequirementSchema,
  matchingSnapshotSchema,
} from "@/lib/matching/schema";
import { sanitizeMatchingRequirement } from "@/lib/matching/sanitize";
import { MAPPER_VERSION } from "@/lib/matching/versions";
import { planSoftRematch } from "@/lib/job-posting/map-line-gate";
import {
  jobLineKindSchema,
  jobLineSectionSchema,
  type MatchingRequirement,
  type MatchingSnapshot,
  type StructuredJobPosting,
} from "@/lib/job-posting/schema";

const conceptProposalSchema = z.object({
  label: z.string().min(1),
  category: z.enum([
    "skill",
    "knowledge",
    "work_activity",
    "work_context",
    "tool",
    "domain",
    "deliverable",
    "outcome",
  ]),
  definition: z.string().min(1),
  reason: z.string().min(1),
});

const slimConceptSchema = z.object({
  id: z.string(),
  label: z.string(),
  definition: z.string(),
  category: z.string(),
  aliases: z.array(z.string()),
  status: z.string(),
});

const toolSchema = z.object({
  name: z.string(),
  context: z.enum(["required", "preferred", "responsibility"]),
});

const workflowInputSchema = z.object({
  postingId: z.string().optional(),
  vocabularyVersion: z.string().min(1),
  concepts: z.array(slimConceptSchema).min(1),
  tools: z.array(toolSchema).default([]),
  lines: z
    .array(
      z.object({
        text: z.string().min(1),
        section: jobLineSectionSchema,
        kind: jobLineKindSchema,
        theme: z.string().min(1),
      }),
    )
    .min(1)
    .max(40),
  sourceHash: z.string().regex(/^[a-f0-9]{64}$/),
});

const lineTaskSchema = z.object({
  lineIndex: z.number().int().positive(),
  text: z.string().min(1),
  section: jobLineSectionSchema,
  kind: jobLineKindSchema,
  theme: z.string().min(1),
  tools: z.array(toolSchema),
  concepts: z.array(slimConceptSchema),
  vocabularyVersion: z.string().min(1),
});

const mapperLineSchema = matchingRequirementSchema.omit({ id: true }).extend({
  id: z.string().min(1),
});

const singleLineMapperOutputSchema = z.object({
  matchingRequirement: mapperLineSchema,
  concept_proposals: z.array(conceptProposalSchema).default([]),
});

const mappedLineSchema = z.object({
  lineIndex: z.number().int().positive(),
  section: jobLineSectionSchema,
  text: z.string().min(1),
  theme: z.string().min(1),
  requirement: matchingRequirementSchema,
  concept_proposals: z.array(conceptProposalSchema),
  rematched: z.boolean(),
});

const workflowOutputSchema = z.object({
  lineRequirements: z.array(matchingRequirementSchema),
  snapshot: matchingSnapshotSchema,
});

function defaultWeight(priority: MatchingRequirement["priority"]) {
  if (priority === "core") return 3;
  if (priority === "preferred") return 1;
  return 2;
}

function approvedConcepts(
  concepts: z.infer<typeof slimConceptSchema>[],
) {
  return concepts.filter((c) => c.status === "approved");
}

function promptConcepts(concepts: z.infer<typeof slimConceptSchema>[]) {
  return approvedConcepts(concepts).map((c) => ({
    id: c.id,
    label: c.label,
    definition: c.definition,
    category: c.category,
    aliases: c.aliases.slice(0, 6),
  }));
}

function buildLinePrompt(input: {
  vocabularyVersion: string;
  concepts: z.infer<typeof slimConceptSchema>[];
  tools: z.infer<typeof toolSchema>[];
  lineIndex: number;
  text: string;
  section: string;
  kind: string;
  theme: string;
  rematch?: boolean;
}) {
  const rematchBlock = input.rematch
    ? `\nThis is a rematch. The first pass left concept_ids empty. Tag every clearly supported vocabulary ID if any fit. Empty concept_ids is still allowed if nothing fits; a concept_proposal is optional.\n`
    : "";

  return `Vocabulary version: ${input.vocabularyVersion}
Mapper version: ${MAPPER_VERSION}
${rematchBlock}
Approved concepts (JSON):
${JSON.stringify(promptConcepts(input.concepts))}

Job line (JSON):
${JSON.stringify({
  lineIndex: input.lineIndex,
  text: input.text,
  section: input.section,
  kind: input.kind,
  theme: input.theme,
})}

Named tools for the posting (JSON):
${JSON.stringify(input.tools)}

Return one matchingRequirement for this line only. Use id "line-${input.lineIndex}".`;
}

async function generateLineMap(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  agent: { generate: (...args: any[]) => Promise<unknown> },
  prompt: string,
): Promise<z.infer<typeof singleLineMapperOutputSchema>> {
  const runOnce = async () => {
    const result = await agent.generate(prompt, {
      structuredOutput: { schema: singleLineMapperOutputSchema },
    });
    const object =
      (result as { object?: unknown }).object ??
      (result as { structuredOutput?: unknown }).structuredOutput;
    return singleLineMapperOutputSchema.parse(object);
  };

  try {
    return await runOnce();
  } catch (firstError) {
    try {
      return await runOnce();
    } catch {
      throw firstError instanceof Error
        ? firstError
        : new Error("Job line requirement mapping failed");
    }
  }
}

function toRequirement(
  raw: z.infer<typeof mapperLineSchema>,
  line: { text: string; section: string; theme: string },
  id: string,
  vocabulary: { concepts: z.infer<typeof slimConceptSchema>[] },
): MatchingRequirement {
  const priority = raw.priority;
  const weight = raw.weight > 0 ? raw.weight : defaultWeight(priority);
  return sanitizeMatchingRequirement(
    {
      id,
      source_text: raw.source_text || line.text,
      source_location: raw.source_location || `${line.section} / ${line.theme}`,
      normalized_statement: raw.normalized_statement || line.text,
      scope: raw.scope,
      priority,
      priority_basis: raw.priority_basis,
      weight,
      concept_ids: raw.concept_ids,
      constraints: raw.constraints,
      mapping_status: raw.mapping_status,
    },
    vocabulary,
  );
}

const buildLineTasks = createStep({
  id: "buildLineTasks",
  inputSchema: workflowInputSchema,
  outputSchema: z.array(lineTaskSchema),
  execute: async ({ inputData }) => {
    return inputData.lines.map((line, index) => ({
      lineIndex: index + 1,
      text: line.text,
      section: line.section,
      kind: line.kind,
      theme: line.theme,
      tools: inputData.tools,
      concepts: inputData.concepts,
      vocabularyVersion: inputData.vocabularyVersion,
    }));
  },
});

const mapLine = createStep({
  id: "mapLine",
  inputSchema: lineTaskSchema,
  outputSchema: mappedLineSchema,
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgentById("job-posting-requirement-mapper");
    const mapped = await generateLineMap(
      agent,
      buildLinePrompt({
        vocabularyVersion: inputData.vocabularyVersion,
        concepts: inputData.concepts,
        tools: inputData.tools,
        lineIndex: inputData.lineIndex,
        text: inputData.text,
        section: inputData.section,
        kind: inputData.kind,
        theme: inputData.theme,
      }),
    );

    const requirement = toRequirement(
      mapped.matchingRequirement,
      inputData,
      `line-${inputData.lineIndex}`,
      { concepts: inputData.concepts },
    );

    return {
      lineIndex: inputData.lineIndex,
      section: inputData.section,
      text: inputData.text,
      theme: inputData.theme,
      requirement,
      concept_proposals: mapped.concept_proposals,
      rematched: false,
    };
  },
});

const normalizeAndSoftRematch = createStep({
  id: "normalizeAndSoftRematch",
  inputSchema: z.array(mappedLineSchema),
  outputSchema: z.array(mappedLineSchema),
  execute: async ({ inputData, mastra, getInitData }) => {
    const init = getInitData<z.infer<typeof workflowInputSchema>>();
    const agent = mastra.getAgentById("job-posting-requirement-mapper");

    const results = await Promise.all(
      inputData.map(async (mapped) => {
        const planned = planSoftRematch(mapped.requirement, {
          section: mapped.section,
          text: mapped.text,
        });
        let requirement = sanitizeMatchingRequirement(planned.requirement, {
          concepts: init.concepts,
        });
        let proposals = mapped.concept_proposals;
        let rematched = false;

        if (planned.rematch) {
          try {
            const remapped = await generateLineMap(
              agent,
              buildLinePrompt({
                vocabularyVersion: init.vocabularyVersion,
                concepts: init.concepts,
                tools: init.tools,
                lineIndex: mapped.lineIndex,
                text: mapped.text,
                section: mapped.section,
                kind:
                  init.lines[mapped.lineIndex - 1]?.kind ?? "other",
                theme: mapped.theme,
                rematch: true,
              }),
            );
            const rematchedReq = toRequirement(
              remapped.matchingRequirement,
              mapped,
              requirement.id,
              { concepts: init.concepts },
            );
            requirement = forceAcceptScoped(
              rematchedReq,
              mapped.section,
              mapped.text,
            );
            proposals = [...proposals, ...remapped.concept_proposals];
            rematched = true;
          } catch {
            // Soft path: keep the first-pass (scope-forced) result; never fail ingest.
            rematched = false;
          }
        }

        return {
          ...mapped,
          requirement,
          concept_proposals: proposals,
          rematched,
        };
      }),
    );

    return results;
  },
});

function forceAcceptScoped(
  requirement: MatchingRequirement,
  section: string,
  text: string,
): MatchingRequirement {
  return planSoftRematch(requirement, { section, text }).requirement;
}

const assemble = createStep({
  id: "assemble",
  inputSchema: z.array(mappedLineSchema),
  outputSchema: workflowOutputSchema,
  execute: async ({ inputData, getInitData }) => {
    const init = getInitData<z.infer<typeof workflowInputSchema>>();
    const ordered = [...inputData].sort((a, b) => a.lineIndex - b.lineIndex);

    const lineRequirements: MatchingRequirement[] = ordered.map((mapped) => {
      const id = init.postingId
        ? `jz-${init.postingId}-line-${mapped.lineIndex}`
        : `line-${mapped.lineIndex}`;
      return sanitizeMatchingRequirement(
        { ...mapped.requirement, id },
        { concepts: init.concepts },
      );
    });

    const concept_proposals = ordered.flatMap((m) => m.concept_proposals);
    const hasUnmappedProject = lineRequirements.some(
      (r) =>
        r.scope === "project" &&
        r.concept_ids.length === 0 &&
        (r.constraints?.tool_concept_ids?.length ?? 0) === 0,
    );
    const status: MatchingSnapshot["status"] =
      hasUnmappedProject || concept_proposals.length > 0
        ? "provisional"
        : "ready";

    const snapshot = matchingSnapshotSchema.parse({
      vocabularyVersion: init.vocabularyVersion,
      mapperVersion: MAPPER_VERSION,
      sourceHash: init.sourceHash,
      status,
      concept_proposals,
    });

    return { lineRequirements, snapshot };
  },
});

export const mapJobPostingLinesWorkflow = createWorkflow({
  id: "map-job-posting-lines",
  inputSchema: workflowInputSchema,
  outputSchema: workflowOutputSchema,
})
  .then(buildLineTasks)
  .foreach(mapLine, { concurrency: 12 })
  .then(normalizeAndSoftRematch)
  .then(assemble)
  .commit();

export type MapJobPostingLinesInput = z.infer<typeof workflowInputSchema>;
export type MapJobPostingLinesOutput = z.infer<typeof workflowOutputSchema>;

export function hashStructuredPosting(structured: StructuredJobPosting): string {
  const payload = JSON.stringify({
    lines: structured.lines,
    tools: structured.tools,
  });
  return createHash("sha256").update(payload).digest("hex");
}

export function slimConceptsForMapper(vocabulary: {
  concepts: Array<{
    id: string;
    label: string;
    definition: string;
    category: string;
    aliases: string[];
    status: string;
  }>;
}) {
  return vocabulary.concepts.map((c) => ({
    id: c.id,
    label: c.label,
    definition: c.definition,
    category: c.category,
    aliases: c.aliases.slice(0, 6),
    status: c.status,
  }));
}
