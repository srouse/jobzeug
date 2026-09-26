import type { MatchingRequirement } from "@/lib/matching/schema";
import {
  looksLikeCandidateOnlyText,
  PROJECTISH_SECTIONS,
} from "@/lib/matching/scope";

export type LineGateContext = {
  section?: string;
  text?: string;
};

/**
 * Force project scope for craft-like job lines mis-tagged as candidate.
 * Never throws — returns a shallow-updated requirement.
 */
export function forceProjectScopeIfCraft(
  requirement: MatchingRequirement,
  { section, text }: LineGateContext = {},
): MatchingRequirement {
  const haystack = [
    text || "",
    requirement.source_text || "",
    requirement.normalized_statement || "",
  ]
    .filter(Boolean)
    .join(" ");

  if (requirement.scope !== "candidate") return requirement;
  if (looksLikeCandidateOnlyText(haystack)) return requirement;
  if (!PROJECTISH_SECTIONS.has(section ?? "")) return requirement;

  return { ...requirement, scope: "project" };
}

/**
 * Soft rematch cue: project-scoped line with no concepts / tool concepts after sanitize.
 * Empty is allowed to publish — this only queues one rematch attempt.
 */
export function shouldSoftRematch(requirement: MatchingRequirement): boolean {
  if (requirement.scope !== "project") return false;
  const concepts = requirement.concept_ids?.length ?? 0;
  const tools = requirement.constraints?.tool_concept_ids?.length ?? 0;
  return concepts === 0 && tools === 0;
}

/**
 * Decide whether a mapped line should be rematched once.
 * Applies force-scope first; never throws.
 */
export function planSoftRematch(
  requirement: MatchingRequirement,
  context: LineGateContext = {},
): { requirement: MatchingRequirement; rematch: boolean } {
  const scoped = forceProjectScopeIfCraft(requirement, context);
  return { requirement: scoped, rematch: shouldSoftRematch(scoped) };
}
