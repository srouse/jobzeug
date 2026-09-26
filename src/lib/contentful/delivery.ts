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
  tags: string[];
};

export type CoreCatalog = {
  employers: Map<string, NormalizedEmployer>;
  roles: Map<string, NormalizedRole>;
  projects: Map<string, NormalizedProject>;
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

export async function fetchCoreCatalog(): Promise<CoreCatalog> {
  const client = getDeliveryClient();
  const { locale } = requireDeliveryEnv();
  const query = { limit: 100, locale, include: 2 as const };

  const [employerRes, roleRes, projectRes] = await Promise.all([
    client.getEntries({ ...query, content_type: "jobzeugEmployer" }),
    client.getEntries({ ...query, content_type: "jobzeugRole" }),
    client.getEntries({ ...query, content_type: "jobzeugProject" }),
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

  const projects = new Map<string, NormalizedProject>();
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
    projects.set(evidenceId, {
      evidenceId,
      employerId,
      roleIds,
      name,
      summary: asString(fields.summary),
      tags: entryTags(entry),
    });
  }

  return { employers, roles, projects };
}
