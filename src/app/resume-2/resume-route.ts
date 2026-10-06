const ID_RE = /^[\w-]+$/;

export type Resume2Route = {
  entryId: string | null;
  lineId: string | null;
  projectId: string | null;
};

const EMPTY_ROUTE: Resume2Route = {
  entryId: null,
  lineId: null,
  projectId: null,
};

export function normalizeRouteEntryId(
  raw: string | null | undefined,
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return ID_RE.test(trimmed) ? trimmed : null;
}

/**
 * Segments after `/resume-2`. The posting id, an optional job line, and an
 * optional project are stored state on the same page.
 */
export function resumeRouteFromSegments(
  segments: readonly string[] | undefined,
): Resume2Route {
  const parts = segments ?? [];
  const entryId = normalizeRouteEntryId(parts[0]);
  if (!entryId) return EMPTY_ROUTE;

  let index = 1;
  let lineId: string | null = null;
  if (parts[index] === "job-line") {
    lineId = normalizeRouteEntryId(parts[index + 1]);
    index += 2;
  }
  const projectId =
    parts[index] === "project" ? normalizeRouteEntryId(parts[index + 1]) : null;
  return { entryId, lineId, projectId };
}

/** Parse the Resume V2 address. Other pathnames are empty. */
export function resumeRouteFromPathname(pathname: string): Resume2Route {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "resume-2") return EMPTY_ROUTE;
  return resumeRouteFromSegments(parts.slice(1));
}

export function resumePath(
  entryId: string | null,
  lineId: string | null = null,
  projectId: string | null = null,
): string {
  const entry = normalizeRouteEntryId(entryId);
  if (!entry) return "/resume-2";
  const segments = ["/resume-2", entry];
  const line = normalizeRouteEntryId(lineId);
  if (line) segments.push("job-line", line);
  const project = normalizeRouteEntryId(projectId);
  if (project) segments.push("project", project);
  return segments.join("/");
}
