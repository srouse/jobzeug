/**
 * Home-stage fit from the saved match graph only.
 * A perfect side is every item at {@link PERFECT_MATCH_SHARE} of its counterpart.
 */

import { CONCEPT_HIT_POINTS } from "./score";

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

/** Each possible counterpart can contribute one hit and this many tags. */
export const FIT_TAGS_PER_COUNTERPART = 1;

/** A perfect resume is every project at about this share of the posting. */
export const PERFECT_MATCH_SHARE = 0.7;

/**
 * Required strong projects need more concept tags than this, summed across
 * their required lines. Equal to the cutoff does not count.
 */
export const REQUIRED_STRONG_OVER = 2;

/**
 * One way to be a strong example: a single line connection with more concept
 * tags than this. Tags on separate lines do not add together for this path.
 */
export const STRONG_CONNECTION_OVER = 1;

/**
 * The other way to be a strong example: at least this many distinct line
 * connections, even when each one is a single tag.
 */
export const STRONG_LINE_ITEMS = 4;

/**
 * Preferred strong projects need at least this many concept tags on
 * preferred lines. Landing on this number counts.
 */
export const PREFERRED_STRONG_TAGS = 2;

function uniqueIds(ids: readonly string[]) {
  return [...new Set(ids)];
}

function projectLineIds(lines: readonly HomeLine[]) {
  return uniqueIds(
    lines
      .filter((line) => line.matchingRequirement?.scope === "project")
      .map((line) => line.entryId),
  );
}

function projectIdsOf(projects: readonly HomeProject[]) {
  return uniqueIds(projects.map((project) => project.id));
}

function populationCeiling(population: number) {
  return population * (1 + FIT_TAGS_PER_COUNTERPART);
}

/** Count items, each at {@link PERFECT_MATCH_SHARE} of a full counterpart score. */
function perfectMatchCeiling(count: number, eachCeiling: number) {
  return count * eachCeiling * PERFECT_MATCH_SHARE;
}

/** How well the resume meets this posting. Perfect is every project at 70%. */
export function resumeHitsPosting(
  lines: readonly HomeLine[],
  projects: readonly HomeProject[],
  edges: readonly HomeEdge[],
): HomeCoverage {
  const lineIds = new Set(projectLineIds(lines));
  const ids = projectIdsOf(projects);
  const byProject = new Map(
    ids.map((id) => [id, { points: 0, lines: new Set<string>() }]),
  );
  for (const edge of edges) {
    const row = byProject.get(edge.projectId);
    if (!row || edge.points <= 0 || !lineIds.has(edge.lineEntryId)) continue;
    row.points += edge.points;
    row.lines.add(edge.lineEntryId);
  }
  let score = 0;
  for (const row of byProject.values()) {
    score += row.points / CONCEPT_HIT_POINTS + row.lines.size;
  }
  return {
    score,
    ceiling: perfectMatchCeiling(ids.length, populationCeiling(lineIds.size)),
  };
}

/** How well this posting reaches the resume. Perfect is every line at 70%. */
export function postingHitsResume(
  projects: readonly HomeProject[],
  lines: readonly HomeLine[],
  edges: readonly HomeEdge[],
): HomeCoverage {
  const ids = projectIdsOf(projects);
  const allowed = new Set(ids);
  const lineIds = projectLineIds(lines);
  const byLine = new Map(
    lineIds.map((id) => [id, { points: 0, projects: new Set<string>() }]),
  );
  for (const edge of edges) {
    const row = byLine.get(edge.lineEntryId);
    if (!row || edge.points <= 0 || !allowed.has(edge.projectId)) continue;
    row.points += edge.points;
    row.projects.add(edge.projectId);
  }
  let score = 0;
  for (const row of byLine.values()) {
    score += row.points / CONCEPT_HIT_POINTS + row.projects.size;
  }
  return {
    score,
    ceiling: perfectMatchCeiling(lineIds.length, populationCeiling(ids.length)),
  };
}

/**
 * Equal weight of tags and hits, over a ceiling of one hit and
 * {@link FIT_TAGS_PER_COUNTERPART} tags for every possible counterpart.
 */
export function absoluteFitShare(
  tags: number,
  hits: number,
  population: number,
): number {
  const ceiling = population * (1 + FIT_TAGS_PER_COUNTERPART);
  if (ceiling <= 0) return 0;
  return (tags + hits) / ceiling;
}

/** Top projects by equal weight: tags plus lines hit. */
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
    const tags = points / CONCEPT_HIT_POINTS;
    return {
      projectId,
      points,
      score: tags + hits.length,
    };
  });
  return rows
    .sort(
      (a, b) => b.score - a.score || a.projectId.localeCompare(b.projectId),
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

export type CoverageLine = {
  entryId: string;
  section?: string;
  matchingRequirement?: { scope?: string };
};

export type LineExampleCoverage = {
  covered: number;
  total: number;
  percent: number;
};

const REQUIRED_SECTIONS = new Set([
  "description",
  "responsibility",
  "required",
]);

/**
 * Headline lines are project-scoped. Required is the description, the
 * responsibilities, and the required lines. Preferred is preferred only.
 */
export function coverageLineIds(lines: readonly CoverageLine[]) {
  const projectLines = lines.filter(
    (line) => line.matchingRequirement?.scope === "project",
  );
  return {
    all: uniqueIds(projectLines.map((line) => line.entryId)),
    required: uniqueIds(
      projectLines
        .filter(
          (line) => line.section != null && REQUIRED_SECTIONS.has(line.section),
        )
        .map((line) => line.entryId),
    ),
    preferred: uniqueIds(
      projectLines
        .filter((line) => line.section === "preferred")
        .map((line) => line.entryId),
    ),
  };
}

/** Lines with at least one positive edge to a resume project. */
export function lineExampleCoverage(
  lineIds: readonly string[],
  edges: readonly HomeEdge[],
  projectIds: readonly string[],
): LineExampleCoverage {
  const ids = uniqueIds(lineIds);
  const allowedLines = new Set(ids);
  const allowedProjects = new Set(projectIds);
  const coveredIds = new Set<string>();
  for (const edge of edges) {
    if (edge.points <= 0) continue;
    if (!allowedProjects.has(edge.projectId)) continue;
    if (!allowedLines.has(edge.lineEntryId)) continue;
    coveredIds.add(edge.lineEntryId);
  }
  const total = ids.length;
  const covered = coveredIds.size;
  return {
    covered,
    total,
    percent: total === 0 ? 0 : Math.round((covered / total) * 100),
  };
}

function pointsByProject(
  projectIds: readonly string[],
  edges: readonly HomeEdge[],
  lineIds?: readonly string[],
) {
  const ids = new Set(projectIds);
  const allowedLines = lineIds ? new Set(lineIds) : null;
  const points = new Map<string, number>();
  for (const edge of edges) {
    if (edge.points <= 0 || !ids.has(edge.projectId)) continue;
    if (allowedLines && !allowedLines.has(edge.lineEntryId)) continue;
    points.set(
      edge.projectId,
      (points.get(edge.projectId) ?? 0) + edge.points,
    );
  }
  return points;
}

export type StrongTagRule = {
  /** Count a project when its tags are greater than this. */
  over?: number;
  /** Count a project when its tags are at least this. */
  atLeast?: number;
};

/**
 * The one strong-example rule. A project qualifies when one line connection
 * has more than {@link STRONG_CONNECTION_OVER} tags, or it connects to at
 * least {@link STRONG_LINE_ITEMS} lines in this pot.
 * Pass line ids to judge only that bucket. Lines outside the pot do not count,
 * so a project that is strong only on preferred lines is not strong in required.
 */
export function strongExampleIds(
  projectIds: readonly string[],
  edges: readonly HomeEdge[],
  lineIds?: readonly string[],
): Set<string> {
  const ids = new Set(projectIds);
  const allowedLines = lineIds ? new Set(lineIds) : null;
  const linesByProject = new Map<string, Set<string>>();
  const strong = new Set<string>();
  for (const edge of edges) {
    if (edge.points <= 0 || !ids.has(edge.projectId)) continue;
    if (allowedLines && !allowedLines.has(edge.lineEntryId)) continue;
    const lines = linesByProject.get(edge.projectId) ?? new Set<string>();
    lines.add(edge.lineEntryId);
    linesByProject.set(edge.projectId, lines);
    if (edge.points / CONCEPT_HIT_POINTS > STRONG_CONNECTION_OVER) {
      strong.add(edge.projectId);
    }
  }
  for (const [projectId, lines] of linesByProject) {
    if (lines.size >= STRONG_LINE_ITEMS) strong.add(projectId);
  }
  return strong;
}

/** How many projects that rule marks strong in this pot. */
export function strongExampleProjects(
  projectIds: readonly string[],
  edges: readonly HomeEdge[],
  lineIds?: readonly string[],
): number {
  return strongExampleIds(projectIds, edges, lineIds).size;
}

/** Projects whose concept tags meet the rule. Defaults to more than {@link REQUIRED_STRONG_OVER}. */
export function strongTagProjects(
  projectIds: readonly string[],
  edges: readonly HomeEdge[],
  lineIds?: readonly string[],
  rule: StrongTagRule = { over: REQUIRED_STRONG_OVER },
): number {
  const atLeast = rule.atLeast;
  const qualifies =
    atLeast != null
      ? (tags: number) => tags >= atLeast
      : (tags: number) => tags > (rule.over ?? REQUIRED_STRONG_OVER);
  let count = 0;
  for (const points of pointsByProject(projectIds, edges, lineIds).values()) {
    if (qualifies(points / CONCEPT_HIT_POINTS)) count += 1;
  }
  return count;
}

/** Distinct lines in the set that this project hits. */
export function projectLineHits(
  projectId: string,
  edges: readonly HomeEdge[],
  lineIds: readonly string[],
): number {
  const allowedLines = new Set(lineIds);
  const hit = new Set<string>();
  for (const edge of edges) {
    if (edge.projectId !== projectId || edge.points <= 0) continue;
    if (!allowedLines.has(edge.lineEntryId)) continue;
    hit.add(edge.lineEntryId);
  }
  return hit.size;
}

/** Through 33% of the score: gray. */
const OK_LIMIT = 0.33;
/** Through 70% of the score: blue. Above that: green. */
const GOOD_LIMIT = 0.7;

export type FitBarTone = "ok" | "good" | "great";

export type FitBar = {
  width: number;
  tone: FitBarTone | null;
  rows: number;
  tags: number;
  percent: number;
};

type HitRow = {
  id: string;
  points: number[];
};

function fitTone(width: number): FitBarTone | null {
  if (width <= 0) return null;
  if (width <= OK_LIMIT) return "ok";
  if (width <= GOOD_LIMIT) return "good";
  return "great";
}

function hitsFor(
  edges: readonly HomeEdge[],
  edgeId: (edge: HomeEdge) => string,
): HitRow[] {
  const byId = new Map<string, number[]>();
  for (const edge of edges) {
    if (edge.points <= 0) continue;
    const id = edgeId(edge);
    const hits = byId.get(id) ?? [];
    hits.push(edge.points);
    byId.set(id, hits);
  }
  return [...byId.entries()].map(([id, points]) => ({ id, points }));
}

function barsFromRows(
  ids: readonly string[],
  rows: readonly HitRow[],
  population: number,
): Map<string, FitBar> {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const bars = new Map<string, FitBar>();
  for (const id of ids) {
    const row = byId.get(id);
    const points = row?.points.reduce((sum, value) => sum + value, 0) ?? 0;
    const hits = row?.points.length ?? 0;
    const tags = points / CONCEPT_HIT_POINTS;
    const share = absoluteFitShare(tags, hits, population);
    const width = Math.min(1, Math.max(0, share));
    bars.set(id, {
      width,
      tone: fitTone(share),
      rows: hits,
      tags,
      percent: Math.round(share * 100),
    });
  }
  return bars;
}

/**
 * The two header percents on the analytics page.
 * Project is the strongest project against the project-scoped lines.
 * Line is the strongest line against the full project catalog.
 */
export function bestDirectionalFits({
  projectScopedLineCount,
  catalogProjectCount,
  lineCount,
  projects,
}: {
  projectScopedLineCount: number;
  catalogProjectCount: number;
  lineCount: number;
  projects: readonly {
    contributions: readonly { requirementId: string; points: number }[];
  }[];
}): { project: number | null; line: number | null } {
  const project =
    projectScopedLineCount > 0 && catalogProjectCount > 0
      ? Math.round(
          Math.max(
            0,
            ...projects.map((row) => {
              const hits = row.contributions.filter((hit) => hit.points > 0);
              const tags =
                hits.reduce((sum, hit) => sum + hit.points, 0) /
                CONCEPT_HIT_POINTS;
              return absoluteFitShare(tags, hits.length, projectScopedLineCount);
            }),
          ) * 100,
        )
      : null;

  const byLine = new Map<string, number[]>();
  for (const row of projects) {
    for (const hit of row.contributions) {
      if (hit.points <= 0) continue;
      const points = byLine.get(hit.requirementId) ?? [];
      points.push(hit.points);
      byLine.set(hit.requirementId, points);
    }
  }
  const lineShares = [...byLine.values()].map((points) => {
    const tags = points.reduce((sum, value) => sum + value, 0) / CONCEPT_HIT_POINTS;
    return absoluteFitShare(tags, points.length, catalogProjectCount);
  });
  const line =
    catalogProjectCount > 0 && lineCount > 0
      ? Math.round((lineShares.length ? Math.max(...lineShares) : 0) * 100)
      : null;

  return { project, line };
}

/** Bar for every resume project, against the posting's project-scoped line count. */
export function projectFitBars(
  projectIds: readonly string[],
  edges: readonly HomeEdge[],
  lineCount: number,
): Map<string, FitBar> {
  return barsFromRows(
    projectIds,
    hitsFor(edges, (edge) => edge.projectId),
    lineCount,
  );
}

/**
 * Bar for every job line, against the resume project count.
 * Edges whose project is outside that set do not count.
 */
export function lineFitBars(
  lineIds: readonly string[],
  edges: readonly HomeEdge[],
  projectIds: readonly string[],
): Map<string, FitBar> {
  const allowed = new Set(projectIds);
  return barsFromRows(
    lineIds,
    hitsFor(
      edges.filter((edge) => allowed.has(edge.projectId)),
      (edge) => edge.lineEntryId,
    ),
    allowed.size,
  );
}
