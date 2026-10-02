const ID_RE = /^[\w-]+$/;

/** The stage subject encoded in the path. A project and a job line never coexist. */
export type ResumeFocus = {
  kind: "project" | "jobLine";
  id: string;
};

export type ResumeRoute = {
  entryId: string | null;
  focus: ResumeFocus | null;
  /** Project walkthrough. Only meaningful when `focus` is a project. */
  details: boolean;
};

export function normalizeRouteEntryId(
  raw: string | null | undefined,
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return ID_RE.test(trimmed) ? trimmed : null;
}

function focusSegment(
  kind: ResumeFocus["kind"],
  raw: string | undefined,
): ResumeFocus | null {
  const id = normalizeRouteEntryId(raw);
  return id ? { kind, id } : null;
}

function projectRoute(
  entryId: string | null,
  id: string | undefined,
  tail: string | undefined,
): ResumeRoute {
  const focus = focusSegment("project", id);
  return {
    entryId,
    focus,
    details: Boolean(focus && tail === "details"),
  };
}

/** Segments after `/resume`, from the catch-all route or a pathname. */
export function resumeRouteFromSegments(
  segments: readonly string[] | undefined,
): ResumeRoute {
  const parts = segments ?? [];
  if (parts[0] === "project") {
    return projectRoute(null, parts[1], parts[2]);
  }
  const entryId = normalizeRouteEntryId(parts[0]);
  if (parts[1] === "project") {
    return projectRoute(entryId, parts[2], parts[3]);
  }
  if (parts[1] === "job-line") {
    return { entryId, focus: focusSegment("jobLine", parts[2]), details: false };
  }
  return { entryId, focus: null, details: false };
}

/**
 * Parse `/resume`, `/resume/{entryId}`, an optional project or job-line
 * subject, and `/details` after a project.
 */
export function resumeRouteFromPathname(pathname: string): ResumeRoute {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "resume") return { entryId: null, focus: null, details: false };
  return resumeRouteFromSegments(parts.slice(1));
}

export function resumePath(
  entryId: string | null,
  focus: ResumeFocus | null = null,
  details = false,
): string {
  const entry = normalizeRouteEntryId(entryId);
  const segments = ["/resume"];
  if (entry) segments.push(entry);
  if (focus?.kind === "project") {
    const id = normalizeRouteEntryId(focus.id);
    if (id) {
      segments.push("project", id);
      if (details) segments.push("details");
    }
  } else if (focus?.kind === "jobLine" && entry) {
    const id = normalizeRouteEntryId(focus.id);
    if (id) segments.push("job-line", id);
  }
  return segments.join("/");
}
