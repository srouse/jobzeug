import { createClient, type ContentfulClientApi, type Entry } from "contentful";

export type NormalizedEmployer = {
  evidenceId: string;
  name: string;
  descriptor?: string;
  websiteUrl?: string;
  tags: string[];
};

export type NormalizedRole = {
  evidenceId: string;
  employerId: string;
  title: string;
  dateLabel: string;
  startDate: string;
  endDate?: string;
  location?: string;
  summary?: string;
  highlights: string[];
  showOnResume: boolean;
  tags: string[];
};

export type NormalizedProject = {
  evidenceId: string;
  employerId: string;
  roleIds: string[];
  name: string;
  summary?: string;
  url?: string;
  tags: string[];
};

export type ProjectPresentation = {
  blurb: string;
  videoUrl: string;
  metrics: [
    { value: string; label: string },
    { value: string; label: string },
  ];
};

export type CoreCatalog = {
  employers: Map<string, NormalizedEmployer>;
  roles: Map<string, NormalizedRole>;
  projects: Map<string, NormalizedProject>;
  /** Keyed by the project evidence id, only when that project links a complete presentation. */
  presentations: Map<string, ProjectPresentation>;
};

function requireDeliveryEnv() {
  const space = process.env.CONTENTFUL_SPACE_ID?.trim();
  const environment = process.env.CONTENTFUL_ENVIRONMENT?.trim();
  const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN?.trim();
  const missing = [
    !space && "CONTENTFUL_SPACE_ID",
    !environment && "CONTENTFUL_ENVIRONMENT",
    !accessToken && "CONTENTFUL_DELIVERY_TOKEN",
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(`Missing Contentful delivery env: ${missing.join(", ")}`);
  }
  return {
    space: space!,
    environment: environment!,
    accessToken: accessToken!,
    locale: process.env.CONTENTFUL_LOCALE?.trim() || "en-US",
  };
}

let cachedClient: ContentfulClientApi<undefined> | null = null;

export function getDeliveryClient() {
  if (cachedClient) return cachedClient;
  const { space, environment, accessToken } = requireDeliveryEnv();
  cachedClient = createClient({ space, environment, accessToken });
  return cachedClient;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function entryTags(entry: Entry): string[] {
  const tags = entry.metadata?.tags;
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => (tag && typeof tag === "object" && "sys" in tag ? (tag.sys as { id?: string }).id : undefined))
    .filter((id): id is string => typeof id === "string" && id.length > 0);
}

function asDateString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.slice(0, 10);
  return undefined;
}

function assetFileUrl(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const file = (value as { fields?: { file?: { url?: unknown } } }).fields?.file;
  const raw = typeof file?.url === "string" ? file.url.trim() : "";
  if (!raw) return undefined;
  return raw.startsWith("//") ? `https:${raw}` : raw;
}

function linkedAssetId(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const sys = (value as { sys?: { type?: string; linkType?: string; id?: string } }).sys;
  if (sys?.type === "Link" && sys.linkType === "Asset" && sys.id) return sys.id;
  return undefined;
}

function linkEvidenceId(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const entry = value as Entry;
  if (entry.fields && typeof entry.fields === "object") {
    const evidenceId = asString((entry.fields as Record<string, unknown>).evidenceId);
    if (evidenceId) return evidenceId;
  }
  const id = entry.sys?.id;
  if (typeof id === "string") return id.startsWith("jz-") ? id.slice(3) : id;
  return undefined;
}

export type JobPostingListItem = {
  entryId: string;
  company: string;
  title: string;
};

/** Published postings only: id, company, and title. Newest first. */
export async function listJobPostings(): Promise<JobPostingListItem[]> {
  const client = getDeliveryClient();
  const { locale } = requireDeliveryEnv();
  const res = await client.getEntries({
    content_type: "jobzeugJobPosting",
    locale,
    limit: 100,
    order: ["-sys.updatedAt"],
    select: ["sys.id", "fields.company", "fields.title"],
  });
  const items: JobPostingListItem[] = [];
  for (const entry of res.items) {
    const fields = entry.fields as Record<string, unknown>;
    const company = asString(fields.company);
    const title = asString(fields.title);
    if (!company || !title) continue;
    items.push({ entryId: entry.sys.id, company, title });
  }
  return items;
}

export async function fetchCoreCatalog(): Promise<CoreCatalog> {
  const client = getDeliveryClient();
  const { locale } = requireDeliveryEnv();
  const query = { limit: 100, locale, include: 2 as const };

  const [employerRes, roleRes, projectRes, presentationRes] = await Promise.all([
    client.getEntries({ ...query, content_type: "jobzeugEmployer" }),
    client.getEntries({ ...query, content_type: "jobzeugRole" }),
    client.getEntries({ ...query, content_type: "jobzeugProject" }),
    client.getEntries({ ...query, content_type: "jobzeugProjectPresentation", include: 1 }),
  ]);

  const employers = new Map<string, NormalizedEmployer>();
  for (const entry of employerRes.items) {
    const fields = entry.fields as Record<string, unknown>;
    const evidenceId = asString(fields.evidenceId);
    const name = asString(fields.name);
    if (!evidenceId || !name) continue;
    employers.set(evidenceId, {
      evidenceId,
      name,
      descriptor: asString(fields.descriptor),
      websiteUrl: asString(fields.websiteUrl),
      tags: entryTags(entry),
    });
  }

  const roles = new Map<string, NormalizedRole>();
  for (const entry of roleRes.items) {
    const fields = entry.fields as Record<string, unknown>;
    const evidenceId = asString(fields.evidenceId);
    const employerId = linkEvidenceId(fields.employer);
    const title = asString(fields.title);
    const dateLabel = asString(fields.dateLabel);
    const startDate = asDateString(fields.startDate);
    if (!evidenceId || !employerId || !title || !dateLabel || !startDate) continue;
    roles.set(evidenceId, {
      evidenceId,
      employerId,
      title,
      dateLabel,
      startDate,
      endDate: asDateString(fields.endDate),
      location: asString(fields.location),
      summary: asString(fields.summary),
      highlights: asStringArray(fields.highlights),
      showOnResume: asBoolean(fields.showOnResume, true),
      tags: entryTags(entry),
    });
  }

  const presentationsById = new Map<string, ProjectPresentation>();
  for (const entry of presentationRes.items) {
    const fields = entry.fields as Record<string, unknown>;
    const evidenceId = asString(fields.evidenceId);
    const blurb = asString(fields.blurb);
    const videoUrl =
      assetFileUrl(fields.video) ??
      assetFileUrl(
        presentationRes.includes?.Asset?.find(
          (asset) => asset.sys.id === linkedAssetId(fields.video),
        ),
      );
    const metricOneValue = asString(fields.metricOneValue);
    const metricOneLabel = asString(fields.metricOneLabel);
    const metricTwoValue = asString(fields.metricTwoValue);
    const metricTwoLabel = asString(fields.metricTwoLabel);
    if (
      !evidenceId ||
      !blurb ||
      !videoUrl ||
      !metricOneValue ||
      !metricOneLabel ||
      !metricTwoValue ||
      !metricTwoLabel
    ) {
      continue;
    }
    presentationsById.set(evidenceId, {
      blurb,
      videoUrl,
      metrics: [
        { value: metricOneValue, label: metricOneLabel },
        { value: metricTwoValue, label: metricTwoLabel },
      ],
    });
  }

  const projects = new Map<string, NormalizedProject>();
  const presentations = new Map<string, ProjectPresentation>();
  for (const entry of projectRes.items) {
    const fields = entry.fields as Record<string, unknown>;
    const evidenceId = asString(fields.evidenceId);
    const employerId = linkEvidenceId(fields.employer);
    const name = asString(fields.name);
    const roleLinks = Array.isArray(fields.roles) ? fields.roles : [];
    const roleIds = roleLinks
      .map((role) => linkEvidenceId(role))
      .filter((id): id is string => Boolean(id));
    if (!evidenceId || !employerId || !name || !roleIds.length) continue;
    const presentationId = linkEvidenceId(fields.presentation);
    const presentation = presentationId
      ? presentationsById.get(presentationId)
      : undefined;
    if (presentation) presentations.set(evidenceId, presentation);
    projects.set(evidenceId, {
      evidenceId,
      employerId,
      roleIds,
      name,
      summary: asString(fields.summary),
      url: asString(fields.url),
      tags: entryTags(entry),
    });
  }

  return { employers, roles, projects, presentations };
}
