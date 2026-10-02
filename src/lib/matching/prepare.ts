import { sanitizeMatchingRequirement } from "./sanitize";
import { looksLikeCandidateOnlyText, PROJECTISH_SECTIONS } from "./scope";
import type { MatchingRequirement } from "./schema";

type VocabularyConcept = {
  id: string;
  label: string;
  aliases?: string[];
  status: string;
  category?: string;
};

type VocabularyLike = {
  concepts: VocabularyConcept[];
};

function normalizeMatchText(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function conceptMatchesText(haystack: string, concept: VocabularyConcept) {
  const terms = [concept.label, ...(concept.aliases || [])];
  for (const term of terms) {
    const normalized = normalizeMatchText(term);
    if (normalized.length >= 4 && haystack.includes(normalized)) return true;
    const shortened = normalized
      .replace(
        /\b(development|engineering|design|work|integration|fundamentals|principles)\b/g,
        " ",
      )
      .replace(/\s+/g, " ")
      .trim();
    if (shortened.length >= 5 && haystack.includes(shortened)) return true;
  }
  return false;
}

/**
 * Deterministic repair for weak AI maps: fix candidate mis-scope and fill empty
 * concept_ids from vocabulary label/alias hits in the requirement text.
 * Score-time only — not written back to Contentful.
 */
export function prepareRequirementForScoring(
  requirement: MatchingRequirement,
  vocabulary: VocabularyLike,
  { section, theme }: { section?: string; theme?: string } = {},
): MatchingRequirement {
  const text = [
    requirement.source_text || "",
    requirement.normalized_statement || "",
    section || "",
    String(theme || "").replace(/[-_]+/g, " "),
  ].join(" ");
  let scope = requirement.scope;
  let concept_ids = [...(requirement.concept_ids || [])];
  let mapping_status = requirement.mapping_status;

  if (scope === "candidate" && !looksLikeCandidateOnlyText(text)) {
    const projectishSection = PROJECTISH_SECTIONS.has(section ?? "");
    if (projectishSection || concept_ids.length > 0) scope = "project";
  }

  if (concept_ids.length === 0) {
    const haystack = normalizeMatchText(text);
    const hits: string[] = [];
    for (const concept of vocabulary.concepts || []) {
      if (concept.status !== "approved") continue;
      if (conceptMatchesText(haystack, concept)) hits.push(concept.id);
    }
    if (hits.length) {
      concept_ids = [...new Set(hits)];
      mapping_status =
        mapping_status === "unmapped" ? "proposed" : mapping_status;
    }
  }

  return sanitizeMatchingRequirement(
    {
      ...requirement,
      scope,
      concept_ids,
      mapping_status,
    },
    vocabulary,
  );
}

/** Highest approved registry. Role tags live here even when a posting is pinned older. */
export function newestApprovedVocabulary<T extends { status: string }>(
  vocabularies: Map<string, T> | undefined,
): T | undefined {
  if (!vocabularies) return undefined;
  const approved = [...vocabularies.entries()].filter(
    ([, vocabulary]) => vocabulary.status === "approved",
  );
  approved.sort(([a], [b]) =>
    b.localeCompare(a, undefined, { numeric: true }),
  );
  return approved[0]?.[1];
}

/**
 * Add role concepts when the line names a resume title, even if other tags are
 * already set. Candidate-only lines stay untouched. Does not drop IDs that the
 * posting's pinned vocabulary does not know.
 */
export function appendRoleConceptHits(
  requirement: MatchingRequirement,
  vocabulary: VocabularyLike,
  { section, theme }: { section?: string; theme?: string } = {},
): MatchingRequirement {
  if (requirement.scope === "candidate") return requirement;
  const haystack = normalizeMatchText(
    [
      requirement.source_text || "",
      requirement.normalized_statement || "",
      section || "",
      String(theme || "").replace(/[-_]+/g, " "),
    ].join(" "),
  );
  const hits: string[] = [];
  for (const concept of vocabulary.concepts || []) {
    if (concept.status !== "approved" || concept.category !== "role") continue;
    if (conceptMatchesText(haystack, concept)) hits.push(concept.id);
  }
  if (!hits.length) return requirement;
  const concept_ids = [...new Set([...(requirement.concept_ids || []), ...hits])];
  return {
    ...requirement,
    concept_ids,
    mapping_status:
      requirement.mapping_status === "unmapped"
        ? "proposed"
        : requirement.mapping_status,
  };
}
