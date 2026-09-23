import { createClient, type PlainClientAPI } from "contentful-management";
import type { JobPostingView, StructuredJobPosting } from "./schema";

function typeId(kind: string) {
  return `jobzeug${kind[0]!.toUpperCase()}${kind.slice(1)}`;
}

function entryId(key: string) {
  return `jz-${key}`;
}

function requireCmaEnv() {
  const space = process.env.CONTENTFUL_SPACE_ID?.trim();
  const environment = process.env.CONTENTFUL_ENVIRONMENT?.trim();
  const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN?.trim();
  const locale = process.env.CONTENTFUL_LOCALE?.trim() || "en-US";
  const missing = [
    !space && "CONTENTFUL_SPACE_ID",
    !environment && "CONTENTFUL_ENVIRONMENT",
    !token && "CONTENTFUL_MANAGEMENT_TOKEN",
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(`Missing Contentful CMA env: ${missing.join(", ")}`);
  }
  return { space: space!, environment: environment!, token: token!, locale };
}

function isNotFound(error: unknown): boolean {
  const err = error as { name?: string; status?: number; message?: string };
  if (err?.name === "NotFound" || err?.status === 404) return true;
  try {
    const body =
      typeof err?.message === "string" ? JSON.parse(err.message) : null;
    return body?.status === 404;
  } catch {
    return false;
  }
}

function localized(
  locale: string,
  value: unknown,
): Record<string, unknown> | undefined {
  if (value === undefined || value === null) return undefined;
  return { [locale]: value };
}

function entryLink(id: string) {
  return { sys: { type: "Link", linkType: "Entry", id } };
}

function mintPostingId(sourceUrl: string): string {
  try {
    const path = new URL(sourceUrl).pathname;
    const digits = path.match(/(\d{6,})/)?.[1];
    if (digits) return `JP${digits}`;
  } catch {
    // fall through
  }
  return `JP${Date.now()}`;
}

function getPlainClient(token: string): PlainClientAPI {
  return createClient({ accessToken: token }, { type: "plain" });
}

async function upsertAndPublish(
  client: PlainClientAPI,
  params: { spaceId: string; environmentId: string },
  contentTypeId: string,
  id: string,
  fields: Record<string, unknown>,
) {
  const entryParams = { ...params, entryId: id };
  try {
    const existing = await client.entry.get(entryParams);
    const updated = await client.entry.update(entryParams, {
      ...existing,
      fields: { ...existing.fields, ...fields },
    });
    await client.entry.publish(entryParams, updated);
  } catch (error) {
    if (!isNotFound(error)) throw error;
    const created = await client.entry.createWithId(
      { ...params, entryId: id, contentTypeId },
      { fields },
    );
    await client.entry.publish(entryParams, created);
  }
  return id;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function linkIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return undefined;
      const id = (item as { sys?: { id?: string } }).sys?.id;
      return typeof id === "string" ? id : undefined;
    })
    .filter((id): id is string => Boolean(id));
}

export async function publishJobPostingTree(input: {
  sourceUrl: string;
  fullText: string;
  structured: StructuredJobPosting;
}): Promise<{ entryId: string; postingId: string }> {
  const { space, environment, token, locale } = requireCmaEnv();
  const client = getPlainClient(token);
  const params = { spaceId: space, environmentId: environment };
  const postingId = mintPostingId(input.sourceUrl);
  const parentEntryId = entryId(postingId);

  const lineIds: string[] = [];
  for (const [index, line] of input.structured.lines.entries()) {
    const id = entryId(`${postingId}-line-${index + 1}`);
    await upsertAndPublish(client, params, typeId("jobLine"), id, {
      text: localized(locale, line.text),
      section: localized(locale, line.section),
      kind: localized(locale, line.kind),
      theme: localized(locale, line.theme),
    });
    lineIds.push(id);
  }

  const toolIds: string[] = [];
  for (const [index, tool] of input.structured.tools.entries()) {
    const id = entryId(`${postingId}-tool-${index + 1}`);
    await upsertAndPublish(client, params, typeId("jobTool"), id, {
      name: localized(locale, tool.name),
      context: localized(locale, tool.context),
    });
    toolIds.push(id);
  }

  const fields: Record<string, unknown> = {
    postingId: localized(locale, postingId),
    sourceUrl: localized(locale, input.sourceUrl),
    company: localized(locale, input.structured.company),
    title: localized(locale, input.structured.title),
    location: localized(locale, input.structured.location),
    employmentType: localized(locale, input.structured.employmentType),
    seniority: localized(locale, input.structured.seniority),
    summary: localized(locale, input.structured.summary),
    yearsExperienceMin: localized(locale, input.structured.yearsExperienceMin),
    yearsExperienceNote: localized(
      locale,
      input.structured.yearsExperienceNote,
    ),
    travelNote: localized(locale, input.structured.travelNote),
    compensationNote: localized(locale, input.structured.compensationNote),
    fullText: localized(locale, input.fullText),
    lines: localized(
      locale,
      lineIds.map((id) => entryLink(id)),
    ),
    tools: localized(
      locale,
      toolIds.map((id) => entryLink(id)),
    ),
  };

  // Drop undefined localized wrappers so CMA does not get { "en-US": undefined }
  for (const key of Object.keys(fields)) {
    if (fields[key] === undefined) delete fields[key];
  }

  await upsertAndPublish(
    client,
    params,
    typeId("jobPosting"),
    parentEntryId,
    fields,
  );

  return { entryId: parentEntryId, postingId };
}

export async function loadJobPostingByEntryId(
  entryIdValue: string,
): Promise<JobPostingView | null> {
  const { space, environment, token, locale } = requireCmaEnv();
  const client = getPlainClient(token);
  const params = { spaceId: space, environmentId: environment };

  let entry;
  try {
    entry = await client.entry.get({ ...params, entryId: entryIdValue });
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }

  const fields = entry.fields as Record<string, Record<string, unknown>>;
  const at = (name: string) => fields[name]?.[locale] ?? fields[name]?.["en-US"];

  const lineEntryIds = linkIds(at("lines"));
  const toolEntryIds = linkIds(at("tools"));

  const lines: JobPostingView["lines"] = [];
  for (const id of lineEntryIds) {
    try {
      const lineEntry = await client.entry.get({ ...params, entryId: id });
      const lf = lineEntry.fields as Record<string, Record<string, unknown>>;
      const lat = (name: string) => lf[name]?.[locale] ?? lf[name]?.["en-US"];
      const text = asString(lat("text"));
      const section = asString(lat("section")) as JobPostingView["lines"][0]["section"] | undefined;
      const kind = asString(lat("kind")) as JobPostingView["lines"][0]["kind"] | undefined;
      const theme = asString(lat("theme"));
      if (!text || !section || !kind || !theme) continue;
      lines.push({ entryId: id, text, section, kind, theme });
    } catch {
      // skip missing child
    }
  }

  const tools: JobPostingView["tools"] = [];
  for (const id of toolEntryIds) {
    try {
      const toolEntry = await client.entry.get({ ...params, entryId: id });
      const tf = toolEntry.fields as Record<string, Record<string, unknown>>;
      const tat = (name: string) => tf[name]?.[locale] ?? tf[name]?.["en-US"];
      const name = asString(tat("name"));
      const context = asString(tat("context")) as JobPostingView["tools"][0]["context"] | undefined;
      if (!name || !context) continue;
      tools.push({ entryId: id, name, context });
    } catch {
      // skip
    }
  }

  const postingIdValue = asString(at("postingId"));
  const sourceUrl = asString(at("sourceUrl"));
  const company = asString(at("company"));
  const title = asString(at("title"));
  const fullText = asString(at("fullText"));
  if (!postingIdValue || !sourceUrl || !company || !title || !fullText) {
    return null;
  }

  return {
    entryId: entryIdValue,
    postingId: postingIdValue,
    sourceUrl,
    company,
    title,
    location: asString(at("location")),
    employmentType: asString(at("employmentType")),
    seniority: asString(at("seniority")),
    summary: asString(at("summary")),
    yearsExperienceMin: asNumber(at("yearsExperienceMin")),
    yearsExperienceNote: asString(at("yearsExperienceNote")),
    travelNote: asString(at("travelNote")),
    compensationNote: asString(at("compensationNote")),
    fullText,
    lines,
    tools,
  };
}

type FormatJobPostingInput = Pick<
  JobPostingView,
  | "company"
  | "title"
  | "location"
  | "seniority"
  | "yearsExperienceNote"
  | "yearsExperienceMin"
  | "summary"
  | "lines"
  | "tools"
>;

/** Build agent system context from structured posting (no fullText dump). */
export function formatJobPostingContext(view: FormatJobPostingInput): string {
  const linesBySection = {
    responsibility: view.lines.filter((l) => l.section === "responsibility"),
    required: view.lines.filter((l) => l.section === "required"),
    preferred: view.lines.filter((l) => l.section === "preferred"),
  };

  const block = (label: string, items: FormatJobPostingInput["lines"]) =>
    items.length
      ? `${label}:\n${items
          .map((l) => `- [${l.entryId}] [${l.theme}/${l.kind}] ${l.text}`)
          .join("\n")}`
      : null;

  const parts = [
    `Active job posting — NEED only (session-bound; not Scott evidence): ${view.company} — ${view.title}`,
    view.location ? `Location: ${view.location}` : null,
    view.seniority ? `Seniority: ${view.seniority}` : null,
    view.yearsExperienceNote
      ? `Experience bar: ${view.yearsExperienceNote}`
      : view.yearsExperienceMin != null
        ? `Years experience (min): ${view.yearsExperienceMin}`
        : null,
    view.summary ? `Summary: ${view.summary}` : null,
    block("Responsibilities", linesBySection.responsibility),
    block("Required", linesBySection.required),
    block("Preferred", linesBySection.preferred),
    view.tools.length
      ? `Tools: ${view.tools.map((t) => `${t.name} (${t.context})`).join(", ")}`
      : null,
    "This block is NEED only (what the role asks for) — not evidence of Scott. Map evidence/ → these lines. Cite matching line entryIds in citeEvidence.jobLines and C/R/S for the proof. Do not invent another posting or treat listing text as Scott's history.",
  ].filter(Boolean);

  return parts.join("\n\n");
}
