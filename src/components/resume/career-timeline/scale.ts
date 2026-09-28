/** Intermediate labels are decade years (2010, 2020, …). */
const DECADE = 10;

/** Drop a decade when it sits this close to the first or last year. */
const ENDPOINT_CLEARANCE_YEARS = 4;

export type CareerTimelineProject = {
  evidenceId: string;
  name: string;
};

export type CareerTimelineRole = {
  roleId: string;
  title: string;
  startDate: string;
  endDate?: string;
  projects?: readonly CareerTimelineProject[];
};

export type CareerTimelineEmployer = {
  roles: CareerTimelineRole[];
};

export type CareerTimelineLabel = {
  year: number;
  /** 0 at the latest instant, 1 at the earliest. */
  offset: number;
  edge: "top" | "bottom" | "middle";
};

export type CareerTimelineSegment = {
  roleId: string;
  title: string;
  tooltip: string;
  /** Fraction from the top of the span. */
  top: number;
  /** Fraction of the span. */
  height: number;
};

export type CareerTimelineMark = {
  projectId: string;
  name: string;
  /** Fraction from the top of the span. */
  offset: number;
  /** Highlighted selections are primary. Other selections are secondary. */
  selected: "primary" | "secondary" | null;
};

export type CareerTimelineSelection = {
  id: string;
  strength: "primary" | "secondary";
};

export type CareerTimelineScale = {
  labels: CareerTimelineLabel[];
  segments: CareerTimelineSegment[];
  marks: CareerTimelineMark[];
};

type Instant = {
  utc: number;
  year: number;
};

function parseInstant(value: string): Instant | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const utc = Date.UTC(year, month - 1, day);
  if (Number.isNaN(utc)) return null;
  return { utc, year };
}

function instantFromDate(date: Date): Instant {
  const year = date.getFullYear();
  return {
    year,
    utc: Date.UTC(year, date.getMonth(), date.getDate()),
  };
}

function yearSpanLabel(startYear: number, endYear: number): string {
  return startYear === endYear ? String(startYear) : `${startYear}–${endYear}`;
}

function projectKey(id: string): string {
  return id.startsWith("jz-") ? id.slice(3) : id;
}

function marksInRole(
  role: CareerTimelineRole,
  top: number,
  height: number,
  selected: ReadonlyMap<string, "primary" | "secondary">,
): CareerTimelineMark[] {
  const projects = role.projects ?? [];
  return projects.map((project, index) => ({
    projectId: project.evidenceId,
    name: project.name,
    offset: top + height * ((index + 1) / (projects.length + 1)),
    selected: selected.get(projectKey(project.evidenceId)) ?? null,
  }));
}

/**
 * Map resume roles onto one vertical span.
 * The top is the present. The bottom is the earliest start.
 */
export function careerTimelineScale(
  employers: readonly CareerTimelineEmployer[],
  now: Date = new Date(),
  selectedProjects: readonly CareerTimelineSelection[] = [],
): CareerTimelineScale | null {
  const nowInstant = instantFromDate(now);
  const placed: Array<{
    role: CareerTimelineRole;
    start: Instant;
    end: Instant;
  }> = [];

  for (const employer of employers) {
    for (const role of employer.roles) {
      const start = parseInstant(role.startDate);
      if (!start) continue;
      const end = role.endDate ? parseInstant(role.endDate) : nowInstant;
      if (!end || end.utc < start.utc) continue;
      placed.push({ role, start, end });
    }
  }

  if (placed.length === 0) return null;

  const rangeStart = Math.min(...placed.map((item) => item.start.utc));
  const rangeEnd = nowInstant.utc;
  const span = rangeEnd - rangeStart;
  if (span <= 0) return null;

  const offsetAt = (utc: number) => (rangeEnd - utc) / span;
  const topYear = new Date(rangeEnd).getUTCFullYear();
  const bottomYear = new Date(rangeStart).getUTCFullYear();

  const labels: CareerTimelineLabel[] = [
    { year: topYear, offset: 0, edge: "top" },
  ];

  for (
    let year = Math.floor((topYear - 1) / DECADE) * DECADE;
    year > bottomYear;
    year -= DECADE
  ) {
    if (topYear - year < ENDPOINT_CLEARANCE_YEARS) continue;
    if (year - bottomYear < ENDPOINT_CLEARANCE_YEARS) continue;
    const at = Date.UTC(year, 0, 1);
    if (at <= rangeStart || at >= rangeEnd) continue;
    labels.push({ year, offset: offsetAt(at), edge: "middle" });
  }

  labels.push({ year: bottomYear, offset: 1, edge: "bottom" });

  const selected = new Map<string, "primary" | "secondary">();
  for (const project of selectedProjects) {
    const key = projectKey(project.id);
    if (selected.get(key) !== "primary") selected.set(key, project.strength);
  }
  const segments: CareerTimelineSegment[] = [];
  const marks: CareerTimelineMark[] = [];

  for (const item of placed) {
    if (item.start.utc >= rangeEnd) continue;
    const visualEnd = Math.min(item.end.utc, rangeEnd);
    const top = offsetAt(visualEnd);
    const bottom = offsetAt(item.start.utc);
    const height = Math.max(0, bottom - top);
    segments.push({
      roleId: item.role.roleId,
      title: item.role.title,
      tooltip: `${item.role.title}, ${yearSpanLabel(item.start.year, item.end.year)}`,
      top,
      height,
    });
    marks.push(...marksInRole(item.role, top, height, selected));
  }

  return { labels, segments, marks };
}
