const ID_RE = /^[\w-]+$/;

export type ResumeRoute = {
  entryId: string | null;
  projectId: string | null;
};

export function normalizeRouteEntryId(
  raw: string | null | undefined,
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return ID_RE.test(trimmed) ? trimmed : null;
}

/** Segments after `/resume`, from the catch-all route or a pathname. */
export function resumeRouteFromSegments(
  segments: readonly string[] | undefined,
): ResumeRoute {
  const parts = segments ?? [];
  if (parts[0] === "project") {
    return {
      entryId: null,
      projectId: normalizeRouteEntryId(parts[1]),
    };
  }
  return {
    entryId: normalizeRouteEntryId(parts[0]),
    projectId: parts[1] === "project" ? normalizeRouteEntryId(parts[2]) : null,
  };
}

/** Parse `/resume`, `/resume/{entryId}`, and optional `/project/{projectId}`. */
export function resumeRouteFromPathname(pathname: string): ResumeRoute {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "resume") return { entryId: null, projectId: null };
  return resumeRouteFromSegments(parts.slice(1));
}

export function resumePath(
  entryId: string | null,
  projectId: string | null,
): string {
  const entry = normalizeRouteEntryId(entryId);
  const project = normalizeRouteEntryId(projectId);
  const segments = ["/resume"];
  if (entry) segments.push(entry);
  if (project) segments.push("project", project);
  return segments.join("/");
}
