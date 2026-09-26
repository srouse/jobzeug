import {
  matchingRequirementSchema,
  type MatchingRequirement,
} from "./schema";

type VocabularyLike = {
  concepts: Array<{ id: string; status: string }>;
};

/** Drop concept IDs not approved in the pinned vocabulary; mark empty as unmapped. */
export function sanitizeMatchingRequirement(
  requirement: MatchingRequirement,
  vocabulary: VocabularyLike,
): MatchingRequirement {
  const concepts = new Map(vocabulary.concepts.map((c) => [c.id, c]));
  const keep = (ids: string[]) =>
    ids.filter((key) => concepts.get(key)?.status === "approved");
  const concept_ids = keep(requirement.concept_ids);
  const tool_concept_ids = keep(
    requirement.constraints?.tool_concept_ids ?? [],
  );
  const mapping_status =
    concept_ids.length === 0 && tool_concept_ids.length === 0
      ? "unmapped"
      : requirement.mapping_status === "unmapped" && concept_ids.length
        ? "proposed"
        : requirement.mapping_status;
  return matchingRequirementSchema.parse({
    ...requirement,
    concept_ids,
    mapping_status,
    constraints: {
      ownership: requirement.constraints?.ownership ?? [],
      scope: requirement.constraints?.scope ?? [],
      delivery_stage: requirement.constraints?.delivery_stage ?? [],
      tool_concept_ids,
      note: requirement.constraints?.note ?? null,
    },
  });
}
