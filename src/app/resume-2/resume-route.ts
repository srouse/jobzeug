const ID_RE = /^[\w-]+$/;

export type Resume2Route = {
  entryId: string | null;
};

export function normalizeRouteEntryId(
  raw: string | null | undefined,
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return ID_RE.test(trimmed) ? trimmed : null;
}

/** Segments after `/resume-2`. Only the posting id is in the path. */
export function resumeRouteFromSegments(
  segments: readonly string[] | undefined,
): Resume2Route {
  return { entryId: normalizeRouteEntryId(segments?.[0]) };
}

/** Parse `/resume-2` or `/resume-2/{entryId}`. */
export function resumeRouteFromPathname(pathname: string): Resume2Route {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "resume-2") return { entryId: null };
  return resumeRouteFromSegments(parts.slice(1));
}

export function resumePath(entryId: string | null): string {
  const entry = normalizeRouteEntryId(entryId);
  return entry ? `/resume-2/${entry}` : "/resume-2";
}
