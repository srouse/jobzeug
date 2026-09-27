export type MatchEdge = {
  projectId: string;
  lineEntryId: string;
  points: number;
};

export const EMPTY_MATCH_EDGES: MatchEdge[] = [];

/** The one thing currently driving connector lines. */
export type LineFocus =
  | { kind: "project"; id: string }
  | { kind: "jobLine"; id: string }
  | { kind: "answer" };

export type ConnectionHub = "selection" | "answer";

/** Blue for the highest scores. Gray for the rest. */
export type ConnectionStrength = "primary" | "secondary";

export type ConnectionEndpoint = {
  id: string;
  strength: ConnectionStrength;
};

export type ConnectionTarget = {
  hub: ConnectionHub;
  ids: ConnectionEndpoint[];
};

/** Highest-scoring counterparts drawn in blue. */
const PRIMARY_CAP = 4;

function unique(ids: string[]): string[] {
  return [...new Set(ids)];
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
  const primaryIds = new Set(
    [...best.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, PRIMARY_CAP)
      .map(([id]) => id),
  );
  const endpoints: ConnectionEndpoint[] = [
    { id: focusId, strength: "primary" },
  ];
  const seen = new Set<string>([focusId]);
  for (const match of matches) {
    if (seen.has(match.id)) continue;
    seen.add(match.id);
    endpoints.push({
      id: match.id,
      strength: primaryIds.has(match.id) ? "primary" : "secondary",
    });
  }
  return endpoints;
}

/** Clicked row plus every saved counterpart. No edges → the clicked row only. */
export function selectionIds(
  focus: { kind: "project" | "jobLine"; id: string },
  edges: readonly MatchEdge[],
): ConnectionEndpoint[] {
  if (focus.kind === "project") {
    const lines = edges
      .filter((edge) => edge.projectId === focus.id && edge.points > 0)
      .map((edge) => ({ id: edge.lineEntryId, points: edge.points }));
    return selectionEndpoints(focus.id, lines);
  }
  const projects = edges
    .filter((edge) => edge.lineEntryId === focus.id && edge.points > 0)
    .map((edge) => ({ id: edge.projectId, points: edge.points }));
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
): ConnectionTarget | null {
  if (!focus) return null;
  if (focus.kind === "answer") {
    if (!showAnswer) return null;
    const ids = unique([...answerIds]).map((id) => ({
      id,
      strength: "primary" as const,
    }));
    if (ids.length === 0) return null;
    return { hub: "answer", ids };
  }
  return { hub: "selection", ids: selectionIds(focus, edges) };
}
