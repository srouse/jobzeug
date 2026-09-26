import { createHash } from "node:crypto";
import { z } from "zod";

import { mastra } from "@/mastra";
import {
  matchingRequirementSchema,
  matchingSnapshotSchema,
  sanitizeMatchingRequirement,
} from "../../../contentful/matching-schema.mjs";
import { MAPPER_VERSION } from "../../../contentful/matching-score.mjs";
import type { StructuredJobPosting } from "./schema";
import type { MatchingRequirement, MatchingSnapshot } from "./schema";

const mapperLineSchema = matchingRequirementSchema.omit({ id: true }).extend({
  id: z.string().min(1),
  lineIndex: z.number().int().positive().optional(),
});

const mapperOutputSchema = z.object({
  lines: z.array(mapperLineSchema).min(1).max(40),
  concept_proposals: z
    .array(
      z.object({
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
      }),
    )
    .default([]),
});

export type MappedJobPostingRequirements = {
  lineRequirements: MatchingRequirement[];
  snapshot: MatchingSnapshot;
};

function defaultWeight(priority: MatchingRequirement["priority"]) {
  if (priority === "core") return 3;
  if (priority === "preferred") return 1;
  return 2;
}

function slimConcepts(vocabulary: {
  concepts: Array<{
    id: string;
    label: string;
    definition: string;
    category: string;
    aliases: string[];
    status: string;
  }>;
}) {
  return vocabulary.concepts
    .filter((c) => c.status === "approved")
    .map((c) => ({
      id: c.id,
      label: c.label,
      definition: c.definition,
      category: c.category,
      aliases: c.aliases.slice(0, 6),
    }));
}

export function hashStructuredPosting(structured: StructuredJobPosting): string {
  const payload = JSON.stringify({
    lines: structured.lines,
    tools: structured.tools,
  });
  return createHash("sha256").update(payload).digest("hex");
}

/** AI maps lines → vocabulary requirements; sanitizes against the pinned registry. */
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

  const agent = mastra.getAgentById("job-posting-requirement-mapper");
  const concepts = slimConcepts(input.vocabulary);
  const prompt = `Vocabulary version: ${input.vocabulary.vocabulary_version}
Mapper version: ${MAPPER_VERSION}

Approved concepts (JSON):
${JSON.stringify(concepts)}

Structured posting lines (JSON, 1-based lineIndex):
${JSON.stringify(
  input.structured.lines.map((line, i) => ({
    lineIndex: i + 1,
    text: line.text,
    section: line.section,
    kind: line.kind,
    theme: line.theme,
  })),
)}

Named tools (JSON):
${JSON.stringify(input.structured.tools)}

Return one requirement per line in the same order. Use id "line-N" matching lineIndex.`;

  const runOnce = async () => {
    const result = await agent.generate(prompt, {
      structuredOutput: { schema: mapperOutputSchema },
    });
    const object =
      (result as { object?: unknown }).object ??
      (result as { structuredOutput?: unknown }).structuredOutput;
    return mapperOutputSchema.parse(object);
  };

  let mapped;
  try {
    mapped = await runOnce();
  } catch (firstError) {
    try {
      mapped = await runOnce();
    } catch {
      throw firstError instanceof Error
        ? firstError
        : new Error("Job posting requirement mapping failed");
    }
  }

  if (mapped.lines.length !== input.structured.lines.length) {
    throw new Error(
      `Mapper returned ${mapped.lines.length} lines; expected ${input.structured.lines.length}`,
    );
  }

  const lineRequirements: MatchingRequirement[] = mapped.lines.map((raw, index) => {
    const line = input.structured.lines[index]!;
    const id = input.postingId
      ? `jz-${input.postingId}-line-${index + 1}`
      : raw.id.startsWith("line-")
        ? raw.id
        : `line-${index + 1}`;
    const priority = raw.priority;
    const weight = raw.weight > 0 ? raw.weight : defaultWeight(priority);
    const sanitized = sanitizeMatchingRequirement(
      {
        id,
        source_text: raw.source_text || line.text,
        source_location:
          raw.source_location || `${line.section} / ${line.theme}`,
        normalized_statement: raw.normalized_statement || line.text,
        scope: raw.scope,
        priority,
        priority_basis: raw.priority_basis,
        weight,
        concept_ids: raw.concept_ids,
        constraints: raw.constraints,
        mapping_status: raw.mapping_status,
      },
      input.vocabulary,
    );
    return sanitized;
  });

  const snapshot = matchingSnapshotSchema.parse({
    vocabularyVersion: input.vocabulary.vocabulary_version,
    mapperVersion: MAPPER_VERSION,
    sourceHash: hashStructuredPosting(input.structured),
    status: "ready",
    concept_proposals: mapped.concept_proposals,
  });

  return { lineRequirements, snapshot };
}
