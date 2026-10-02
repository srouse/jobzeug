import type { Entry, EntrySkeletonType } from "contentful";

import { getDeliveryClient } from "@/lib/contentful/delivery";
import { contentfulEditorUrl } from "@/lib/contentful/editor-url";
import { loadMatchingCatalog } from "@/lib/matching/catalog";
import { matchGraphSchema } from "@/lib/matching/schema";
import {
  matchingRequirementSchema,
  matchingSnapshotSchema,
  type JobPostingView,
} from "./schema";

/** One Delivery call stays small once each posting brings its lines and tools. */
const POSTING_BATCH = 10;

type LooseEntry = {
  sys: {
    id: string;
    type?: string;
    revision?: number;
    updatedAt?: string;
  };
  fields?: Record<string, unknown>;
};

function deliveryLocale(): string {
  return process.env.CONTENTFUL_LOCALE?.trim() || "en-US";
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function revisionOf(entry: LooseEntry): number {
  return typeof entry.sys.revision === "number" ? entry.sys.revision : 0;
}

function asLooseEntry(value: unknown): LooseEntry | undefined {
  if (!value || typeof value !== "object") return undefined;
  const sys = (value as LooseEntry).sys;
  if (!sys || typeof sys.id !== "string") return undefined;
  return value as LooseEntry;
}

function resolveLinked(
  value: unknown,
  included: Map<string, LooseEntry>,
): LooseEntry | undefined {
  const entry = asLooseEntry(value);
  if (!entry) return undefined;
  if (entry.fields) return entry;
  return included.get(entry.sys.id);
}

function viewFromPosting(
  posting: LooseEntry,
  included: Map<string, LooseEntry>,
): JobPostingView | null {
  const fields = posting.fields ?? {};
  const postingIdValue = asString(fields.postingId);
  const sourceUrl = asString(fields.sourceUrl);
  const company = asString(fields.company);
  const title = asString(fields.title);
  const fullText = asString(fields.fullText);
  if (!postingIdValue || !sourceUrl || !company || !title || !fullText) return null;

  const lineRevisions: NonNullable<JobPostingView["entryRevisions"]>["jobzeugJobLine"] = [];
  const lines: JobPostingView["lines"] = [];
  const lineLinks = Array.isArray(fields.lines) ? fields.lines : [];
  for (const link of lineLinks) {
    const lineEntry = resolveLinked(link, included);
    if (!lineEntry) continue;
    lineRevisions.push({
      entryId: lineEntry.sys.id,
      revision: revisionOf(lineEntry),
      updatedAt: String(lineEntry.sys.updatedAt ?? ""),
    });
    const lineFields = lineEntry.fields ?? {};
    const text = asString(lineFields.text);
    const section = asString(lineFields.section) as JobPostingView["lines"][0]["section"] | undefined;
    const kind = asString(lineFields.kind) as JobPostingView["lines"][0]["kind"] | undefined;
    const theme = asString(lineFields.theme);
    if (!text || !section || !kind || !theme) continue;
    const parsed = lineFields.matchingRequirement
      ? matchingRequirementSchema.safeParse(lineFields.matchingRequirement)
      : undefined;
    lines.push({
      entryId: lineEntry.sys.id,
      text,
      section,
      kind,
      theme,
      ...(parsed?.success ? { matchingRequirement: parsed.data } : {}),
      contentfulUrl: contentfulEditorUrl(lineEntry.sys.id),
    });
  }

  const toolRevisions: NonNullable<JobPostingView["entryRevisions"]>["jobzeugJobTool"] = [];
  const tools: JobPostingView["tools"] = [];
  const toolLinks = Array.isArray(fields.tools) ? fields.tools : [];
  for (const link of toolLinks) {
    const toolEntry = resolveLinked(link, included);
    if (!toolEntry) continue;
    toolRevisions.push({
      entryId: toolEntry.sys.id,
      revision: revisionOf(toolEntry),
      updatedAt: String(toolEntry.sys.updatedAt ?? ""),
    });
    const toolFields = toolEntry.fields ?? {};
    const name = asString(toolFields.name);
    const context = asString(toolFields.context) as JobPostingView["tools"][0]["context"] | undefined;
    if (!name || !context) continue;
    tools.push({ entryId: toolEntry.sys.id, name, context });
  }

  const snapshot = fields.matchingSnapshot
    ? matchingSnapshotSchema.safeParse(fields.matchingSnapshot)
    : undefined;
  const graph = fields.matchGraph ? matchGraphSchema.safeParse(fields.matchGraph) : undefined;

  return {
    entryId: posting.sys.id,
    postingId: postingIdValue,
    sourceUrl,
    company,
    title,
    location: asString(fields.location),
    employmentType: asString(fields.employmentType),
    seniority: asString(fields.seniority),
    summary: asString(fields.summary),
    yearsExperienceMin: asNumber(fields.yearsExperienceMin),
    yearsExperienceNote: asString(fields.yearsExperienceNote),
    travelNote: asString(fields.travelNote),
    compensationNote: asString(fields.compensationNote),
    fullText,
    lines,
    tools,
    ...(snapshot?.success ? { matchingSnapshot: snapshot.data } : {}),
    ...(graph?.success ? { matchGraph: graph.data } : {}),
    entryRevisions: {
      jobzeugJobPosting: [
        {
          entryId: posting.sys.id,
          revision: revisionOf(posting),
          updatedAt: String(posting.sys.updatedAt ?? ""),
        },
      ],
      jobzeugJobLine: lineRevisions,
      jobzeugJobTool: toolRevisions,
    },
  };
}

function includedEntries(includes: { Entry?: Entry<EntrySkeletonType>[] } | undefined): Map<string, LooseEntry> {
  const map = new Map<string, LooseEntry>();
  for (const entry of includes?.Entry ?? []) {
    const loose = asLooseEntry(entry);
    if (loose) map.set(loose.sys.id, loose);
  }
  return map;
}

/**
 * Published postings, each with its lines and tools, from Delivery.
 * Missing or unpublished ids are absent from the map.
 */
export async function loadPublishedJobPostings(
  entryIds: string[],
): Promise<Map<string, JobPostingView>> {
  const ids = [...new Set(entryIds.map((id) => id.trim()).filter(Boolean))];
  const views = new Map<string, JobPostingView>();
  if (!ids.length) return views;

  const client = getDeliveryClient();
  const locale = deliveryLocale();
  for (let index = 0; index < ids.length; index += POSTING_BATCH) {
    const chunk = ids.slice(index, index + POSTING_BATCH);
    const res = await client.getEntries({
      content_type: "jobzeugJobPosting",
      "sys.id[in]": chunk.join(","),
      include: 2,
      locale,
      limit: chunk.length,
    } as Parameters<typeof client.getEntries>[0]);
    const included = includedEntries(res.includes);
    for (const item of res.items) {
      const posting = asLooseEntry(item);
      if (!posting) continue;
      const view = viewFromPosting(posting, included);
      if (view) views.set(view.entryId, view);
    }
  }
  return views;
}

async function catalogProjectYears(): Promise<Record<string, number | null>> {
  const catalog = await loadMatchingCatalog();
  const projectYears: Record<string, number | null> = {};
  for (const project of catalog.projects.values() as Iterable<{
    project_id: string;
    year?: number | null;
  }>) {
    if (project.year === null || typeof project.year === "number") {
      projectYears[project.project_id] = project.year;
    }
  }
  return projectYears;
}

/**
 * Age lives on the catalog, not on the saved edges. Older graphs omit
 * `projectYears`, which made the homepage repeat the raw score.
 */
async function withCatalogProjectYears(view: JobPostingView): Promise<JobPostingView> {
  const graph = view.matchGraph;
  if (!graph) return view;
  try {
    const projectYears = await catalogProjectYears();
    if (Object.keys(projectYears).length === 0) return view;
    return {
      ...view,
      matchGraph: {
        ...graph,
        projectYears: { ...graph.projectYears, ...projectYears },
      },
    };
  } catch {
    return view;
  }
}

/** One published posting, or null when Delivery does not return it. */
export async function loadPublishedJobPosting(
  entryId: string,
): Promise<JobPostingView | null> {
  const views = await loadPublishedJobPostings([entryId]);
  const view = views.get(entryId.trim()) ?? null;
  if (!view) return null;
  return withCatalogProjectYears(view);
}
