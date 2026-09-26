import { prepareRequirementForScoring } from "./prepare";
import type { MatchingRequirement } from "./schema";
import {
  AXIS_HIT_POINTS,
  CONCEPT_HIT_POINTS,
  bestClaimForLine,
  realAxisValues,
} from "./score";
import { FIT_VERSION } from "./versions";

export { FIT_VERSION } from "./versions";

export type JobPostBox = {
  points: number;
  projectIds: string[];
};

export type JobPostFit = {
  score: number;
  ceiling: number;
  bestProjectPoints: number;
  sharedPoints: number;
};

export type ResumeFit = {
  score: number;
  ceiling: number;
};

/** Concepts that fill one project-scoped line for job relevancy. */
export const FULL_CONCEPTS_PER_LINE = 3;

export type JobRelevancy = {
  score: number;
  ceiling: number;
};

export type Fits = {
  fitVersion: string;
  jobPostFit: JobPostFit | null;
  resumeFit: ResumeFit | null;
  jobRelevancy: JobRelevancy | null;
};

/** How much of the posting the resume covers. Never above one perfect project. */
export function jobPostFit(boxes: JobPostBox[]): JobPostFit {
  const ceiling = boxes.reduce((sum, box) => sum + box.points, 0);
  const totals = new Map<string, number>();
  for (const box of boxes) {
    for (const projectId of new Set(box.projectIds)) {
      totals.set(projectId, (totals.get(projectId) ?? 0) + box.points);
    }
  }

  let bestId: string | null = null;
  let bestPoints = -1;
  for (const [projectId, points] of totals) {
    if (
      bestId == null ||
      points > bestPoints ||
      (points === bestPoints && projectId.localeCompare(bestId) < 0)
    ) {
      bestId = projectId;
      bestPoints = points;
    }
  }

  let bestProjectPoints = 0;
  let sharedPoints = 0;
  for (const box of boxes) {
    const checkers = new Set(box.projectIds);
    if (checkers.size === 0) continue;
    if (bestId != null && checkers.has(bestId)) {
      bestProjectPoints += box.points;
    } else {
      sharedPoints += Math.floor(box.points / 2);
    }
  }

  return {
    score: bestProjectPoints + sharedPoints,
    ceiling,
    bestProjectPoints,
    sharedPoints,
  };
}

/**
 * How much of the posting can be said in the tag vocabulary.
 * The resume is not an input. Each count is one project-scoped line.
 */
export function jobRelevancy(conceptCounts: readonly number[]): JobRelevancy {
  const ceiling =
    conceptCounts.length * FULL_CONCEPTS_PER_LINE * CONCEPT_HIT_POINTS;
  let score = 0;
  for (const count of conceptCounts) {
    const capped = Math.min(FULL_CONCEPTS_PER_LINE, Math.max(0, count));
    score += capped * CONCEPT_HIT_POINTS;
  }
  return { score, ceiling };
}

/** How much of the resume the posting lands on. Repeats across claims add up. */
export function resumeFit(
  conceptIds: readonly string[],
  postingConceptIds: ReadonlySet<string>,
): ResumeFit {
  let score = 0;
  for (const conceptId of conceptIds) {
    if (postingConceptIds.has(conceptId)) score += CONCEPT_HIT_POINTS;
  }
  return {
    score,
    ceiling: conceptIds.length * CONCEPT_HIT_POINTS,
  };
}

type FitClaim = {
  id: string;
  concept_ids?: string[];
  ownership?: string;
  scope?: string;
  delivery_stage?: string;
  provenance?: string;
  review?: { status?: string };
};

type FitProject = Parameters<typeof bestClaimForLine>[0];

type FitCatalog = {
  projects: Map<string, FitProject & { project_id: string; ranking_eligible?: boolean; evidence?: FitClaim[] }>;
  vocabularies: Map<
    string,
    { status: string; concepts: Parameters<typeof prepareRequirementForScoring>[1]["concepts"] }
  >;
  pendingProjectIds?: string[];
  excludedProjectIds?: string[];
};

type FitPosting = {
  matchingSnapshot?: { vocabularyVersion: string; status: string };
  lines: Array<{
    entryId: string;
    section?: string;
    theme?: string;
    matchingRequirement?: MatchingRequirement;
  }>;
};

function claimIsScorable(claim: FitClaim) {
  if (claim.provenance === "inferred") return false;
  if (claim.review?.status === "approved") return true;
  return (
    claim.review?.status === "proposed" ||
    claim.review?.status === "needs_review"
  );
}

function requiredConceptIds(requirement: MatchingRequirement) {
  return [
    ...new Set([
      ...requirement.concept_ids,
      ...(requirement.constraints?.tool_concept_ids ?? []),
    ]),
  ];
}

const emptyFits = (): Fits => ({
  fitVersion: FIT_VERSION,
  jobPostFit: null,
  resumeFit: null,
  jobRelevancy: null,
});

/**
 * Build posting boxes and resume concept boxes, then run the two fit formulas.
 * Does not rank projects or change relationship scores.
 */
export function computeFits({
  posting,
  catalog,
}: {
  posting: FitPosting;
  catalog: FitCatalog;
}): Fits {
  if (!posting?.matchingSnapshot) return emptyFits();

  const vocabulary = catalog.vocabularies.get(
    posting.matchingSnapshot.vocabularyVersion,
  );
  if (!vocabulary || vocabulary.status !== "approved") {
    throw new Error(
      `Missing approved vocabulary ${posting.matchingSnapshot.vocabularyVersion}`,
    );
  }

  const lines = posting.lines.map((line) => {
    if (!line.matchingRequirement) return line;
    const prepared = prepareRequirementForScoring(
      line.matchingRequirement,
      vocabulary,
      { section: line.section, theme: line.theme },
    );
    return { ...line, matchingRequirement: prepared };
  });

  const projectLines = lines.filter(
    (line) => line.matchingRequirement?.scope === "project",
  );
  if (projectLines.length === 0) return emptyFits();

  const pending = new Set(catalog.pendingProjectIds ?? []);
  const excluded = new Set(catalog.excludedProjectIds ?? []);
  const projects = [...catalog.projects.values()].filter(
    (project) =>
      project.ranking_eligible &&
      !excluded.has(project.project_id) &&
      !pending.has(project.project_id),
  );

  const postingConceptIds = new Set<string>();
  const boxes: JobPostBox[] = [];
  const conceptCounts: number[] = [];

  for (const line of projectLines) {
    const requirement = line.matchingRequirement;
    if (!requirement) continue;
    const conceptIds = requiredConceptIds(requirement);
    conceptCounts.push(conceptIds.length);
    for (const conceptId of conceptIds) postingConceptIds.add(conceptId);

    if (
      requirement.mapping_status === "unmapped" ||
      conceptIds.length === 0
    ) {
      continue;
    }

    const hits = projects.map((project) => ({
      projectId: project.project_id,
      claim: bestClaimForLine(project, requirement),
    }));

    for (const conceptId of conceptIds) {
      boxes.push({
        points: CONCEPT_HIT_POINTS,
        projectIds: hits
          .filter((hit) => hit.claim.overlapIds.includes(conceptId))
          .map((hit) => hit.projectId),
      });
    }

    const axes: Array<{
      wanted: string[];
      hit: (claim: (typeof hits)[number]["claim"]) => boolean;
    }> = [
      {
        wanted: realAxisValues(requirement.constraints?.ownership),
        hit: (claim) => claim.ownershipHit,
      },
      {
        wanted: realAxisValues(requirement.constraints?.scope),
        hit: (claim) => claim.scopeHit,
      },
      {
        wanted: realAxisValues(requirement.constraints?.delivery_stage),
        hit: (claim) => claim.stageHit,
      },
    ];
    for (const axis of axes) {
      if (axis.wanted.length === 0) continue;
      boxes.push({
        points: AXIS_HIT_POINTS,
        projectIds: hits
          .filter((hit) => axis.hit(hit.claim))
          .map((hit) => hit.projectId),
      });
    }
  }

  const resumeConceptIds: string[] = [];
  for (const project of projects) {
    for (const claim of project.evidence ?? []) {
      if (!claimIsScorable(claim)) continue;
      for (const conceptId of new Set(claim.concept_ids ?? [])) {
        resumeConceptIds.push(conceptId);
      }
    }
  }

  return {
    fitVersion: FIT_VERSION,
    jobPostFit: jobPostFit(boxes),
    resumeFit: resumeFit(resumeConceptIds, postingConceptIds),
    jobRelevancy: jobRelevancy(conceptCounts),
  };
}
