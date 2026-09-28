/**
 * Home-stage fit from the saved match graph only.
 * A single hit scores 1. More than one hit on the same item scores 2.
 */

export type HomeCoverage = {
  score: number;
  ceiling: number;
};

export type HomeEdge = {
  projectId: string;
  lineEntryId: string;
  points: number;
};

export type HomeLine = {
  entryId: string;
  matchingRequirement?: { scope?: string };
};

export type HomeProject = {
  id: string;
  name: string;
};

export type HomeTopProject = {
  projectId: string;
  name: string;
  points: number;
};

function hitScore(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  return 2;
}

function projectsByLine(edges: readonly HomeEdge[]): Map<string, Set<string>> {
  const byLine = new Map<string, Set<string>>();
  for (const edge of edges) {
    const projects = byLine.get(edge.lineEntryId) ?? new Set<string>();
    projects.add(edge.projectId);
    byLine.set(edge.lineEntryId, projects);
  }
  return byLine;
}

function linesByProject(edges: readonly HomeEdge[]): Map<string, Set<string>> {
  const byProject = new Map<string, Set<string>>();
  for (const edge of edges) {
    const lines = byProject.get(edge.projectId) ?? new Set<string>();
    lines.add(edge.lineEntryId);
    byProject.set(edge.projectId, lines);
  }
  return byProject;
}

/** How well the resume meets this posting. One item per project-scoped line. */
export function resumeHitsPosting(
  lines: readonly HomeLine[],
  edges: readonly HomeEdge[],
): HomeCoverage {
  const projectLines = lines.filter(
    (line) => line.matchingRequirement?.scope === "project",
  );
  const byLine = projectsByLine(edges);
  let score = 0;
  for (const line of projectLines) {
    score += hitScore(byLine.get(line.entryId)?.size ?? 0);
  }
  return { score, ceiling: projectLines.length * 2 };
}

/** How well this posting reaches the resume. One item per resume project. */
export function postingHitsResume(
  projects: readonly HomeProject[],
  edges: readonly HomeEdge[],
): HomeCoverage {
  const seen = new Set<string>();
  const unique = projects.filter((project) => {
    if (seen.has(project.id)) return false;
    seen.add(project.id);
    return true;
  });
  const byProject = linesByProject(edges);
  let score = 0;
  for (const project of unique) {
    score += hitScore(byProject.get(project.id)?.size ?? 0);
  }
  return { score, ceiling: unique.length * 2 };
}

/** Top projects by the debug mix: 60% average strength, 40% lines hit. */
export function topHomeProjects(
  projects: readonly HomeProject[],
  edges: readonly HomeEdge[],
  limit = 3,
): HomeTopProject[] {
  const names = new Map(projects.map((project) => [project.id, project.name]));
  const hitsByProject = new Map<string, number[]>();
  for (const edge of edges) {
    if (edge.points <= 0) continue;
    const hits = hitsByProject.get(edge.projectId) ?? [];
    hits.push(edge.points);
    hitsByProject.set(edge.projectId, hits);
  }
  const rows = [...hitsByProject.entries()].map(([projectId, hits]) => {
    const points = hits.reduce((sum, value) => sum + value, 0);
    return {
      projectId,
      points,
      average: points / hits.length,
      lines: hits.length,
    };
  });
  const bestAverage = Math.max(0, ...rows.map((row) => row.average));
  const mostLines = Math.max(0, ...rows.map((row) => row.lines));
  return rows
    .map((row) => ({
      ...row,
      final:
        (bestAverage > 0 ? 0.6 * (row.average / bestAverage) : 0) +
        (mostLines > 0 ? 0.4 * (row.lines / mostLines) : 0),
    }))
    .sort(
      (a, b) => b.final - a.final || a.projectId.localeCompare(b.projectId),
    )
    .slice(0, limit)
    .map((row) => ({
      projectId: row.projectId,
      name: names.get(row.projectId) ?? row.projectId,
      points: row.points,
    }));
}

export function coveragePercent(coverage: HomeCoverage): number {
  if (coverage.ceiling <= 0) return 0;
  return Math.round((coverage.score / coverage.ceiling) * 100);
}
