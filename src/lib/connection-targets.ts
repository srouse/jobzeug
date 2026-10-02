import { recencyWeight } from "./matching/recency";

export type MatchEdge = {
  projectId: string;
  lineEntryId: string;
  points: number;
};

export type ProjectYears = Readonly<
  Record<string, number | null | undefined>
>;

export const EMPTY_MATCH_EDGES: MatchEdge[] = [];

/** The one thing currently driving connector lines. */
export type LineFocus =
  | { kind: "project"; id: string }
  | { kind: "jobLine"; id: string }
  | { kind: "answer" };

export type ConnectionHub = "selection" | "answer";

/** Blue for the highest scores. Gray for the rest. */
export type ConnectionStrength = "primary" | "secondary";

/** The focused row is the subject. The rows it points at are references. */
export type ConnectionRole = "subject" | "reference";

export type ConnectionEndpoint = {
  id: string;
  role: ConnectionRole;
  strength: ConnectionStrength;
};

export type ConnectionTarget = {
  hub: ConnectionHub;
  ids: ConnectionEndpoint[];
};

/** Highest-scoring counterparts drawn in blue. */
const PRIMARY_CAP = 4;
/** Subject plus references, or answer citations alone. */
const CONNECTION_CAP = 10;

function unique(ids: string[]): string[] {
  return [...new Set(ids)];
}

/** Age weight for a project id. A missing year stays at full weight. */
function projectWeight(projectId: string, projectYears?: ProjectYears): number {
  const year =
    projectYears?.[projectId] ?? projectYears?.[projectId.replace(/^jz-/, "")];
  return recencyWeight(year);
}

function selectionEndpoints(
  focusId: string,
  matches: Array<{ id: string; points: number }>,
): ConnectionEndpoint[] {
  const best = new Map<string, number>();
  for (const match of matches) {
    if (match.id === focusId) continue;
    const previous = best.get(match.id);
    if (previous == null || match.points > previous) best.set(match.id, match.points);
  }
  const ranked = [...best.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );
  const primaryIds = new Set(
    ranked.slice(0, PRIMARY_CAP).map(([id]) => id),
  );
  const keptIds = new Set(
    ranked.slice(0, CONNECTION_CAP - 1).map(([id]) => id),
  );
  const endpoints: ConnectionEndpoint[] = [
    { id: focusId, role: "subject", strength: "primary" },
  ];
  const seen = new Set<string>([focusId]);
  for (const match of matches) {
    if (seen.has(match.id) || !keptIds.has(match.id)) continue;
    seen.add(match.id);
    endpoints.push({
      id: match.id,
      role: "reference",
      strength: primaryIds.has(match.id) ? "primary" : "secondary",
    });
  }
  return endpoints;
}

/** Clicked row plus its strongest counterparts, capped at ten lines. */
export function selectionIds(
  focus: { kind: "project" | "jobLine"; id: string },
  edges: readonly MatchEdge[],
  projectYears?: ProjectYears,
): ConnectionEndpoint[] {
  if (focus.kind === "project") {
    const lines = edges
      .filter((edge) => edge.projectId === focus.id && edge.points > 0)
      .map((edge) => ({ id: edge.lineEntryId, points: edge.points }));
    return selectionEndpoints(focus.id, lines);
  }
  const projects = edges
    .filter((edge) => edge.lineEntryId === focus.id && edge.points > 0)
    .map((edge) => ({
      id: edge.projectId,
      points: edge.points * projectWeight(edge.projectId, projectYears),
    }));
  return selectionEndpoints(focus.id, projects);
}

/**
 * One target at a time. A project or job line meets the top hub.
 * An AI result meets the bottom card. They do not draw together.
 */
export function activeConnectionTarget(
  focus: LineFocus | null,
  edges: readonly MatchEdge[],
  answerIds: Iterable<string>,
  showAnswer: boolean,
  projectYears?: ProjectYears,
): ConnectionTarget | null {
  if (!focus) return null;
  if (focus.kind === "answer") {
    if (!showAnswer) return null;
    const ids = unique([...answerIds]).slice(0, CONNECTION_CAP).map((id) => ({
      id,
      role: "reference" as const,
      strength: "primary" as const,
    }));
    if (ids.length === 0) return null;
    return { hub: "answer", ids };
  }
  return { hub: "selection", ids: selectionIds(focus, edges, projectYears) };
}
