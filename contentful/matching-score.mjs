export const SCORING_VERSION = "1.0.0";
export const MAPPER_VERSION = "1.0.0";

/**
 * Deterministic project↔requirement scoring (engine v1 arithmetic).
 * No AI. Identical inputs yield identical scores.
 */
export function scorePostingAgainstCatalog({ posting, catalog, examplesPerLine = 3 }) {
  if (!posting?.matchingSnapshot) {
    return {
      mapped: false,
      scoringVersion: SCORING_VERSION,
      vocabularyVersion: null,
      status: "not_mapped",
      projects: [],
      byLine: [],
      unmappedRequirementIds: [],
      pendingProjectIds: catalog?.pendingProjectIds ?? [],
      excludedProjectIds: catalog?.excludedProjectIds ?? [],
      catalogRevisions: catalog?.revisions ?? [],
      message: "Posting has no matching snapshot (legacy ingest). Re-scrape to map.",
    };
  }

  const vocabularyVersion = posting.matchingSnapshot.vocabularyVersion;
  const vocabulary = catalog.vocabularies.get(vocabularyVersion);
  if (!vocabulary || vocabulary.status !== "approved") {
    throw new Error(`Missing approved vocabulary ${vocabularyVersion}`);
  }

  const concepts = new Map(vocabulary.concepts.map((c) => [c.id, c]));
  const broaderOf = (conceptKey) => {
    const parents = new Set();
    const walk = (key, seen) => {
      const node = concepts.get(key);
      if (!node) return;
      for (const parent of node.broader_ids ?? []) {
        if (seen.has(parent)) continue;
        parents.add(parent);
        walk(parent, new Set([...seen, parent]));
      }
    };
    walk(conceptKey, new Set([conceptKey]));
    return parents;
  };
  const childrenOf = (parentKey) => {
    const kids = new Set();
    for (const [id, c] of concepts) {
      if ((c.broader_ids ?? []).includes(parentKey)) kids.add(id);
    }
    return kids;
  };

  const requirements = posting.lines
    .map((line) => line.matchingRequirement)
    .filter(Boolean);

  const projectRequirements = requirements.filter((r) => r.scope === "project");
  const unmappedRequirementIds = projectRequirements
    .filter((r) => r.mapping_status === "unmapped" || r.concept_ids.length === 0)
    .map((r) => r.id);

  const pendingSet = new Set(catalog.pendingProjectIds ?? []);
  const excludedSet = new Set(catalog.excludedProjectIds ?? []);

  const eligibleProjects = [...catalog.projects.values()].filter(
    (p) => p.ranking_eligible && !excludedSet.has(p.project_id),
  );

  const byLine = [];
  const projectAccum = new Map();

  for (const project of eligibleProjects) {
    projectAccum.set(project.project_id, {
      projectId: project.project_id,
      weightSum: 0,
      weightedMatch: 0,
      contributions: [],
      evidenceIds: new Set(),
      pending: pendingSet.has(project.project_id),
    });
  }

  for (const line of posting.lines) {
    const req = line.matchingRequirement;
    if (!req) {
      byLine.push({
        lineEntryId: line.entryId,
        requirementId: null,
        matchSummaries: [],
      });
      continue;
    }

    const summaries = [];
    if (req.scope !== "project") {
      byLine.push({
        lineEntryId: line.entryId,
        requirementId: req.id,
        matchSummaries: [],
        skipped: "candidate_scope",
      });
      continue;
    }

    for (const project of eligibleProjects) {
      const assessment = assessRequirement(project, req, {
        concepts,
        broaderOf,
        childrenOf,
      });
      const accum = projectAccum.get(project.project_id);
      accum.weightSum += req.weight;
      accum.weightedMatch += req.weight * assessment.match;
      if (assessment.match > 0) {
        for (const eid of assessment.evidenceIds) accum.evidenceIds.add(eid);
        accum.contributions.push({
          requirementId: req.id,
          match: assessment.match,
          weight: req.weight,
          evidenceIds: assessment.evidenceIds,
          rationale: assessment.rationale,
        });
      }
      if (assessment.match > 0) {
        summaries.push({
          projectId: project.project_id,
          match: assessment.match,
          evidenceIds: assessment.evidenceIds,
          rationale: assessment.rationale,
        });
      }
    }

    summaries.sort((a, b) => b.match - a.match || a.projectId.localeCompare(b.projectId));
    byLine.push({
      lineEntryId: line.entryId,
      requirementId: req.id,
      matchSummaries: summaries.slice(0, examplesPerLine),
    });
  }

  let status = "ready";
  if (
    posting.matchingSnapshot.status === "provisional" ||
    unmappedRequirementIds.length > 0 ||
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
      status: "provisional",
      projects: eligibleProjects.map((p) => ({
        projectId: p.project_id,
        score: null,
        contributions: [],
        evidenceIds: [],
        pending: pendingSet.has(p.project_id),
      })),
      byLine,
      unmappedRequirementIds,
      pendingProjectIds: [...pendingSet],
      excludedProjectIds: [...excludedSet],
      catalogRevisions: catalog.revisions ?? [],
      message: "No project-scoped requirements to rank against",
    };
  }

  const projects = [...projectAccum.values()]
    .map((row) => {
      if (row.pending) {
        return {
          projectId: row.projectId,
          score: null,
          contributions: row.contributions,
          evidenceIds: [...row.evidenceIds].sort(),
          pending: true,
        };
      }
      const score =
        row.weightSum === 0
          ? null
          : (100 * row.weightedMatch) / row.weightSum;
      return {
        projectId: row.projectId,
        score,
        contributions: row.contributions,
        evidenceIds: [...row.evidenceIds].sort(),
        pending: false,
      };
    })
    .sort((a, b) => {
      if (a.score == null && b.score == null) return a.projectId.localeCompare(b.projectId);
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
    byLine,
    unmappedRequirementIds,
    pendingProjectIds: [...pendingSet],
    excludedProjectIds: [...excludedSet],
    catalogRevisions: catalog.revisions ?? [],
  };
}

function claimIsScorable(claim) {
  if (claim.provenance === "inferred") return false;
  if (claim.review?.status === "approved") return true;
  // Draft/proposed claims still participate provisionally (engine: pending projects stay visible)
  return claim.review?.status === "proposed" || claim.review?.status === "needs_review";
}

function constraintsConflict(claim, constraints) {
  if (constraints.ownership?.length && !constraints.ownership.includes(claim.ownership)) {
    return true;
  }
  if (constraints.scope?.length && !constraints.scope.includes(claim.scope)) {
    return true;
  }
  if (
    constraints.delivery_stage?.length &&
    !constraints.delivery_stage.includes(claim.delivery_stage)
  ) {
    return true;
  }
  return false;
}

function assessRequirement(project, requirement, { concepts, broaderOf, childrenOf }) {
  const required = [...new Set([
    ...requirement.concept_ids,
    ...(requirement.constraints?.tool_concept_ids ?? []),
  ])];

  if (
    requirement.mapping_status === "unmapped" ||
    required.length === 0
  ) {
    return {
      match: 0,
      evidenceIds: [],
      rationale: "Unmapped or empty concept_ids",
    };
  }

  let best = { match: 0, evidenceIds: [], rationale: "No overlapping concepts", covered: new Set() };

  for (const claim of project.evidence ?? []) {
    if (!claimIsScorable(claim)) continue;
    if (constraintsConflict(claim, requirement.constraints ?? {})) {
      continue;
    }

    const claimConcepts = new Set(claim.concept_ids ?? []);
    const exact = required.filter((id) => claimConcepts.has(id));
    const related = required.filter((id) => {
      if (claimConcepts.has(id)) return false;
      const parents = broaderOf(id);
      for (const c of claimConcepts) {
        if (parents.has(c)) return true;
        if (broaderOf(c).has(id)) return true;
        if (childrenOf(id).has(c)) return true;
      }
      return false;
    });

    const covered = new Set([...exact, ...related]);
    let match = 0;
    let rationale = "";
    if (exact.length === required.length) {
      match = 1;
      rationale = `Exact concepts on ${claim.id}: ${exact.join(", ")}`;
    } else if (exact.length > 0) {
      match = 0.5;
      rationale = `Partial exact concepts on ${claim.id}: ${exact.join(", ")} (missing ${required.filter((id) => !exact.includes(id)).join(", ")})`;
    } else if (related.length > 0) {
      match = 0.5;
      rationale = `Broader/narrower concept link on ${claim.id}: ${related.join(", ")}`;
    } else {
      continue;
    }

    if (
      match > best.match ||
      (match === best.match && covered.size > best.covered.size)
    ) {
      best = { match, evidenceIds: [claim.id], rationale, covered };
    }
  }

  // Multi-claim joint coverage for compound requirements (union of exact concepts)
  if (best.match < 1 && required.length > 1) {
    const unionExact = new Set();
    const evidenceIds = [];
    for (const claim of project.evidence ?? []) {
      if (!claimIsScorable(claim)) continue;
      if (constraintsConflict(claim, requirement.constraints ?? {})) continue;
      const claimConcepts = new Set(claim.concept_ids ?? []);
      let hit = false;
      for (const id of required) {
        if (claimConcepts.has(id)) {
          unionExact.add(id);
          hit = true;
        }
      }
      if (hit) evidenceIds.push(claim.id);
    }
    if (unionExact.size === required.length && evidenceIds.length) {
      return {
        match: 1,
        evidenceIds: [...new Set(evidenceIds)].sort(),
        rationale: `Joint exact coverage across ${evidenceIds.join(", ")}`,
      };
    }
    if (unionExact.size > 0 && unionExact.size < required.length && best.match < 0.5) {
      return {
        match: 0.5,
        evidenceIds: [...new Set(evidenceIds)].sort(),
        rationale: `Joint partial coverage (${[...unionExact].join(", ")})`,
      };
    }
  }

  return { match: best.match, evidenceIds: best.evidenceIds, rationale: best.rationale };
}
