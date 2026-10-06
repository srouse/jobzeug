import type { ResumeViewModel } from "@/lib/contentful/resume-model";
import type { MatchEdge, ProjectYears } from "@/lib/connection-targets";
import { recencyWeight } from "@/lib/matching/recency";

export type SimpleProject = {
  id: string;
  name: string;
  employer: string;
  summary: string;
};

/** Each resume project once, in document order. */
export function listResumeProjects(
  resume: ResumeViewModel | null,
): SimpleProject[] {
  if (!resume) return [];
  const seen = new Set<string>();
  const projects: SimpleProject[] = [];
  for (const employer of resume.employers) {
    for (const role of employer.roles) {
      for (const project of role.projects) {
        if (seen.has(project.evidenceId)) continue;
        seen.add(project.evidenceId);
        projects.push({
          id: project.evidenceId,
          name: project.name,
          employer: employer.name,
          summary: project.summary?.trim() ?? "",
        });
      }
    }
  }
  return projects;
}

function sameId(a: string, b: string): boolean {
  return a === b || `jz-${a}` === b || a === `jz-${b}`;
}

function yearOf(years: ProjectYears | undefined, id: string): number | null | undefined {
  if (!years) return undefined;
  if (id in years) return years[id];
  const bare = id.replace(/^jz-/, "");
  if (bare in years) return years[bare];
  const prefixed = `jz-${bare}`;
  if (prefixed in years) return years[prefixed];
  return undefined;
}

function pointsOf(
  edges: readonly MatchEdge[],
  lineId: string,
  projectId: string,
): number {
  let best = 0;
  for (const edge of edges) {
    if (edge.lineEntryId !== lineId || !sameId(edge.projectId, projectId)) continue;
    if (edge.points > best) best = edge.points;
  }
  return best;
}

/**
 * Projects with a hit on this job line, highest match-points × recency first.
 * Same ordering the stage uses for a job line.
 */
export function topProjectsForLine(
  projects: readonly SimpleProject[],
  edges: readonly MatchEdge[],
  lineId: string,
  years: ProjectYears | undefined,
  count = 3,
): SimpleProject[] {
  return projects
    .map((project) => {
      const points = pointsOf(edges, lineId, project.id);
      return {
        project,
        points,
        weighted: points * recencyWeight(yearOf(years, project.id)),
      };
    })
    .filter((row) => row.points > 0)
    .sort(
      (a, b) =>
        b.weighted - a.weighted || a.project.id.localeCompare(b.project.id),
    )
    .slice(0, count)
    .map((row) => row.project);
}
