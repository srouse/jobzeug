const ID_RE = /^[\w-]+$/;

/** The stage subject encoded in the path. A project and a job line never coexist. */
export type ResumeFocus = {
  kind: "project" | "jobLine";
  id: string;
};

export type ResumeRoute = {
  entryId: string | null;
  focus: ResumeFocus | null;
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

/** Segments after `/resume`, from the catch-all route or a pathname. */
export function resumeRouteFromSegments(
  segments: readonly string[] | undefined,
): ResumeRoute {
  const parts = segments ?? [];
  if (parts[0] === "project") {
    return {
      entryId: null,
      focus: focusSegment("project", parts[1]),
    };
  }
  const entryId = normalizeRouteEntryId(parts[0]);
  if (parts[1] === "project") {
    return { entryId, focus: focusSegment("project", parts[2]) };
  }
  if (parts[1] === "job-line") {
    return { entryId, focus: focusSegment("jobLine", parts[2]) };
  }
  return { entryId, focus: null };
}

/** Parse `/resume`, `/resume/{entryId}`, and an optional project or job-line subject. */
export function resumeRouteFromPathname(pathname: string): ResumeRoute {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "resume") return { entryId: null, focus: null };
  return resumeRouteFromSegments(parts.slice(1));
}

export function resumePath(
  entryId: string | null,
  focus: ResumeFocus | null = null,
): string {
  const entry = normalizeRouteEntryId(entryId);
  const segments = ["/resume"];
  if (entry) segments.push(entry);
  if (focus?.kind === "project") {
    const id = normalizeRouteEntryId(focus.id);
    if (id) segments.push("project", id);
  } else if (focus?.kind === "jobLine" && entry) {
    const id = normalizeRouteEntryId(focus.id);
    if (id) segments.push("job-line", id);
  }
  return segments.join("/");
}
