import { prepareRequirementForScoring } from "./prepare";
import { SCORING_VERSION } from "./versions";

export { SCORING_VERSION, MAPPER_VERSION } from "./versions";

/** Points per exact overlapping concept id. Integer so totals stay exact. */
export const CONCEPT_HIT_POINTS = 10;
/** Points when ownership, scope, or delivery stage matches. Kept small so tags lead. */
export const AXIS_HIT_POINTS = 0;

/** Placeholder axis values. They are missing data, not a match. */
const IGNORED_AXIS_VALUES = new Set(["unknown", "null"]);

export function realAxisValues(values: readonly string[] | undefined): string[] {
  return (values ?? []).filter((value) => !isIgnoredAxisValue(value));
}

function isIgnoredAxisValue(value: string | undefined | null): boolean {
  if (value == null) return true;
  const key = value.trim().toLowerCase();
  return key.length === 0 || IGNORED_AXIS_VALUES.has(key);
}

type MatchingRequirement = {
  id: string;
  scope: string;
  weight: number;
  concept_ids: string[];
  mapping_status: string;
  constraints?: {
    ownership?: string[];
    scope?: string[];
    delivery_stage?: string[];
    tool_concept_ids?: string[];
  };
  source_text?: string;
  normalized_statement?: string;
};

type PostingLine = {
  entryId: string;
  section?: string;
  theme?: string;
  matchingRequirement?: MatchingRequirement;
};

type Posting = {
  matchingSnapshot?: {
    vocabularyVersion: string;
    status: string;
  };
  lines: PostingLine[];
};

type Claim = {
  id: string;
  concept_ids?: string[];
  ownership?: string;
  scope?: string;
  delivery_stage?: string;
  provenance?: string;
  review?: { status?: string };
};

type Project = {
  project_id: string;
  ranking_eligible: boolean;
  evidence?: Claim[];
  annotation?: { status?: string };
};

type Concept = {
  id: string;
  broader_ids?: string[];
  status?: string;
  label?: string;
  aliases?: string[];
};

type Vocabulary = {
  status: string;
  concepts: Concept[];
};

type EntryRevision = {
  entryId: string;
  revision: number;
  updatedAt: string;
};

type Catalog = {
  projects: Map<string, Project>;
  vocabularies: Map<string, Vocabulary>;
  pendingProjectIds?: string[];
  excludedProjectIds?: string[];
  entryRevisions?: Record<string, EntryRevision[]>;
};

export type LineScoreBreakdown = {
  points: number;
  conceptHits: number;
  ownershipHit: boolean;
  scopeHit: boolean;
  stageHit: boolean;
  overlapIds: string[];
  evidenceIds: string[];
  rationale: string;
};

export type Contribution = {
  requirementId: string;
  weight: number;
  points: number;
  conceptHits: number;
  ownershipHit: boolean;
  scopeHit: boolean;
  stageHit: boolean;
  overlapIds: string[];
  evidenceIds: string[];
  rationale: string;
};

export type MatchSummary = {
  projectId: string;
  points: number;
  conceptHits: number;
  ownershipHit: boolean;
  scopeHit: boolean;
  stageHit: boolean;
  overlapIds: string[];
  evidenceIds: string[];
  rationale: string;
};

function claimIsScorable(claim: Claim) {
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

/** Additive claim↔line points. Empty constraint axes add nothing and do not veto. */
export function scoreClaimAgainstLine(
  claim: Claim,
  requirement: MatchingRequirement,
): Omit<LineScoreBreakdown, "evidenceIds"> {
  const required = requiredConceptIds(requirement);
  if (requirement.mapping_status === "unmapped" || required.length === 0) {
    return {
      points: 0,
      conceptHits: 0,
      ownershipHit: false,
      scopeHit: false,
      stageHit: false,
      overlapIds: [],
      rationale: "Unmapped or empty concept_ids",
    };
  }

  const claimConcepts = new Set(claim.concept_ids ?? []);
  const overlapIds = required.filter((id) => claimConcepts.has(id));
  const conceptHits = overlapIds.length;

  const ownershipWanted = realAxisValues(requirement.constraints?.ownership);
  const scopeWanted = realAxisValues(requirement.constraints?.scope);
  const stageWanted = realAxisValues(requirement.constraints?.delivery_stage);

  const ownershipHit =
    !isIgnoredAxisValue(claim.ownership) &&
    ownershipWanted.includes(claim.ownership ?? "");
  const scopeHit =
    !isIgnoredAxisValue(claim.scope) &&
    scopeWanted.includes(claim.scope ?? "");
  const stageHit =
    !isIgnoredAxisValue(claim.delivery_stage) &&
    stageWanted.includes(claim.delivery_stage ?? "");

  const points =
    conceptHits * CONCEPT_HIT_POINTS +
    (ownershipHit ? AXIS_HIT_POINTS : 0) +
    (scopeHit ? AXIS_HIT_POINTS : 0) +
    (stageHit ? AXIS_HIT_POINTS : 0);

  const parts: string[] = [];
  if (conceptHits) {
    parts.push(`${conceptHits} concept(s): ${overlapIds.join(", ")}`);
  }
  if (ownershipHit) parts.push(`ownership=${claim.ownership}`);
  if (scopeHit) parts.push(`scope=${claim.scope}`);
  if (stageHit) parts.push(`stage=${claim.delivery_stage}`);

  return {
    points,
    conceptHits,
    ownershipHit,
    scopeHit,
    stageHit,
    overlapIds,
    rationale:
      points > 0
        ? `${claim.id}: ${parts.join("; ")}`
        : `No additive hits on ${claim.id}`,
  };
}

/** Best scorable claim for this project×line (max points). */
export function bestClaimForLine(
  project: Project,
  requirement: MatchingRequirement,
): LineScoreBreakdown {
  let best: LineScoreBreakdown = {
    points: 0,
    conceptHits: 0,
    ownershipHit: false,
    scopeHit: false,
    stageHit: false,
    overlapIds: [],
    evidenceIds: [],
    rationale: "No scorable claim hits",
  };

  for (const claim of project.evidence ?? []) {
    if (!claimIsScorable(claim)) continue;
    const scored = scoreClaimAgainstLine(claim, requirement);
    if (
      scored.points > best.points ||
      (scored.points === best.points &&
        scored.conceptHits > best.conceptHits &&
        scored.points > 0)
    ) {
      best = { ...scored, evidenceIds: [claim.id] };
    }
  }

  return best;
}

/**
 * Deterministic project↔job-line relationship scoring (engine v2).
 * Additive points; no constraint veto. Identical inputs → identical scores.
 */
export function scorePostingAgainstCatalog({
  posting,
  catalog,
  examplesPerLine = 3,
}: {
  posting: Posting;
  catalog: Catalog;
  examplesPerLine?: number;
}) {
  if (!posting?.matchingSnapshot) {
    return {
      mapped: false,
      scoringVersion: SCORING_VERSION,
      vocabularyVersion: null as string | null,
      status: "not_mapped" as const,
      projects: [] as Array<{
        projectId: string;
        score: number | null;
        contributions: Contribution[];
        evidenceIds: string[];
        pending: boolean;
      }>,
      jobLines: [] as Array<{
        lineEntryId: string;
        requirementId: string | null;
        matchSummaries: MatchSummary[];
        skipped?: string;
      }>,
      unmappedJobLineEntryIds: [] as string[],
      pendingProjectIds: catalog?.pendingProjectIds ?? [],
      excludedProjectIds: catalog?.excludedProjectIds ?? [],
      entryRevisions: catalog?.entryRevisions ?? {},
      message:
        "Posting has no matching snapshot (legacy ingest). Re-scrape to map.",
    };
  }

  const snapshot = posting.matchingSnapshot;
  const vocabularyVersion = snapshot.vocabularyVersion;
  const vocabulary = catalog.vocabularies.get(vocabularyVersion);
  if (!vocabulary || vocabulary.status !== "approved") {
    throw new Error(`Missing approved vocabulary ${vocabularyVersion}`);
  }

  const preparedLines = posting.lines.map((line) => {
    if (!line.matchingRequirement) return line;
    const prepared = prepareRequirementForScoring(
      line.matchingRequirement as Parameters<
        typeof prepareRequirementForScoring
      >[0],
      vocabulary as Parameters<typeof prepareRequirementForScoring>[1],
      {
        section: line.section,
        theme: line.theme,
      },
    );
    return { ...line, matchingRequirement: prepared };
  });
  const scoredPosting = {
    ...posting,
    lines: preparedLines,
    matchingSnapshot: snapshot,
  };

  const requirements = scoredPosting.lines
    .map((line) => line.matchingRequirement)
    .filter(Boolean) as MatchingRequirement[];

  const projectRequirements = requirements.filter((r) => r.scope === "project");
  const unmappedJobLineEntryIds = projectRequirements
    .filter(
      (r) => r.mapping_status === "unmapped" || r.concept_ids.length === 0,
    )
    .map((r) => r.id);

  const pendingSet = new Set(catalog.pendingProjectIds ?? []);
  const excludedSet = new Set(catalog.excludedProjectIds ?? []);

  const eligibleProjects = [...catalog.projects.values()].filter(
    (p) => p.ranking_eligible && !excludedSet.has(p.project_id),
  );

  const jobLines: Array<{
    lineEntryId: string;
    requirementId: string | null;
    matchSummaries: MatchSummary[];
    skipped?: string;
  }> = [];
  const projectAccum = new Map<
    string,
    {
      projectId: string;
      pointsSum: number;
      contributions: Contribution[];
      evidenceIds: Set<string>;
      pending: boolean;
    }
  >();

  for (const project of eligibleProjects) {
    projectAccum.set(project.project_id, {
      projectId: project.project_id,
      pointsSum: 0,
      contributions: [],
      evidenceIds: new Set(),
      pending: pendingSet.has(project.project_id),
    });
  }

  for (const line of scoredPosting.lines) {
    const req = line.matchingRequirement;
    if (!req) {
      jobLines.push({
        lineEntryId: line.entryId,
        requirementId: null,
        matchSummaries: [],
      });
      continue;
    }

    if (req.scope !== "project") {
      jobLines.push({
        lineEntryId: line.entryId,
        requirementId: req.id,
        matchSummaries: [],
        skipped: "candidate_scope",
      });
      continue;
    }

    const summaries: MatchSummary[] = [];
    for (const project of eligibleProjects) {
      const assessment = bestClaimForLine(project, req);
      const accum = projectAccum.get(project.project_id)!;
      accum.pointsSum += assessment.points;
      if (assessment.points > 0) {
        for (const eid of assessment.evidenceIds) accum.evidenceIds.add(eid);
        accum.contributions.push({
          requirementId: req.id,
          weight: req.weight,
          points: assessment.points,
          conceptHits: assessment.conceptHits,
          ownershipHit: assessment.ownershipHit,
          scopeHit: assessment.scopeHit,
          stageHit: assessment.stageHit,
          overlapIds: assessment.overlapIds,
          evidenceIds: assessment.evidenceIds,
          rationale: assessment.rationale,
        });
        summaries.push({
          projectId: project.project_id,
          points: assessment.points,
          conceptHits: assessment.conceptHits,
          ownershipHit: assessment.ownershipHit,
          scopeHit: assessment.scopeHit,
          stageHit: assessment.stageHit,
          overlapIds: assessment.overlapIds,
          evidenceIds: assessment.evidenceIds,
          rationale: assessment.rationale,
        });
      }
    }

    summaries.sort(
      (a, b) =>
        b.points - a.points || a.projectId.localeCompare(b.projectId),
    );
    jobLines.push({
      lineEntryId: line.entryId,
      requirementId: req.id,
      matchSummaries: summaries.slice(0, examplesPerLine),
    });
  }

  let status: "ready" | "provisional" = "ready";
  if (
    snapshot.status === "provisional" ||
    unmappedJobLineEntryIds.length > 0 ||
    pendingSet.size > 0 ||
    projectRequirements.some((r) => r.mapping_status === "proposed")
  ) {
    status = "provisional";
  }

  if (projectRequirements.length === 0) {
    return {
      mapped: true,
      scoringVersion: SCORING_VERSION,
      vocabularyVersion,
      status: "provisional" as const,
      projects: eligibleProjects.map((p) => ({
        projectId: p.project_id,
        score: null as number | null,
        contributions: [] as Contribution[],
        evidenceIds: [] as string[],
        pending: pendingSet.has(p.project_id),
      })),
      jobLines,
      unmappedJobLineEntryIds,
      pendingProjectIds: [...pendingSet],
      excludedProjectIds: [...excludedSet],
      entryRevisions: catalog.entryRevisions ?? {},
      message: "No project-scoped requirements to rank against",
    };
  }

  const projects = [...projectAccum.values()]
    .map((row) => {
      if (row.pending) {
        return {
          projectId: row.projectId,
          score: null as number | null,
          contributions: row.contributions,
          evidenceIds: [...row.evidenceIds].sort(),
          pending: true,
        };
      }
      return {
        projectId: row.projectId,
        score: row.pointsSum,
        contributions: row.contributions,
        evidenceIds: [...row.evidenceIds].sort(),
        pending: false,
      };
    })
    .sort((a, b) => {
      if (a.score == null && b.score == null)
        return a.projectId.localeCompare(b.projectId);
      if (a.score == null) return 1;
      if (b.score == null) return -1;
      if (b.score !== a.score) return b.score - a.score;
      return a.projectId.localeCompare(b.projectId);
    });

  return {
    mapped: true,
    scoringVersion: SCORING_VERSION,
    vocabularyVersion,
    status,
    projects,
    jobLines,
    unmappedJobLineEntryIds,
    pendingProjectIds: [...pendingSet],
    excludedProjectIds: [...excludedSet],
    entryRevisions: catalog.entryRevisions ?? {},
  };
}
