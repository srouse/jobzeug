import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { loadMatchingCatalog } from "@/lib/contentful/matching";
import {
  loadJobPostingByEntryId,
  mapJobPostingRequirements,
  publishJobPostingTree,
  scrapeJobListingMarkdown,
  structureJobPosting,
  toJobPostingPanelData,
} from "@/lib/job-posting";
import { SESSION_COOKIE, getSessionId } from "@/lib/site-auth";

type MatchingCatalog = Awaited<ReturnType<typeof loadMatchingCatalog>>;

const entryIdSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[\w-]+$/, "Invalid entry id");

const postBodySchema = z.object({
  url: z.url(),
});

async function requireSiteSession(): Promise<
  { ok: true } | { error: NextResponse }
> {
  const jar = await cookies();
  const sid = await getSessionId(jar.get(SESSION_COOKIE)?.value);
  if (!sid) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true };
}

function pickApprovedVocabulary(vocabularies: MatchingCatalog["vocabularies"]) {
  const approved = [...vocabularies.values()].filter((v) => v.status === "approved");
  if (!approved.length) {
    throw new Error("No approved matching vocabulary published");
  }
  approved.sort((a, b) =>
    b.vocabulary_version.localeCompare(a.vocabulary_version, undefined, {
      numeric: true,
    }),
  );
  return approved[0]!;
}

/** Load a Contentful job posting by entry id (from the resume route). */
export async function GET(req: NextRequest) {
  const session = await requireSiteSession();
  if ("error" in session) return session.error;

  const raw = req.nextUrl.searchParams.get("entryId");
  const parsed = entryIdSchema.safeParse(raw ?? "");
  if (!parsed.success) {
    return NextResponse.json(
      { error: "entryId query param is required" },
      { status: 400 },
    );
  }

  try {
    const view = await loadJobPostingByEntryId(parsed.data);
    if (!view) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      bound: true,
      ...toJobPostingPanelData(view),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load job posting";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Scrape → structure → map requirements → Contentful (forward-only; no legacy remap). */
export async function POST(req: NextRequest) {
  const session = await requireSiteSession();
  if ("error" in session) return session.error;

  let url: string;
  try {
    const body = postBodySchema.parse(await req.json());
    url = body.url;
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  try {
    const fullText = await scrapeJobListingMarkdown(url);
    const structured = await structureJobPosting({ sourceUrl: url, fullText });

    const catalog = await loadMatchingCatalog();
    const vocabulary = pickApprovedVocabulary(catalog.vocabularies);
    const matching = await mapJobPostingRequirements({
      structured,
      vocabulary,
    });

    const { entryId, postingId } = await publishJobPostingTree({
      sourceUrl: url,
      fullText,
      structured,
      matching,
    });

    const view = await loadJobPostingByEntryId(entryId);
    return NextResponse.json(
      view
        ? { bound: true, ...toJobPostingPanelData(view) }
        : {
            bound: true,
            entryId,
            postingId,
            sourceUrl: url,
            company: structured.company,
            title: structured.title,
            fullText,
            lines: [],
            tools: [],
            matchingSnapshot: matching.snapshot,
          },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Job posting ingest failed";
    const status = message.includes("FIRECRAWL") || message.includes("Firecrawl")
      ? 502
      : message.includes("Missing Contentful") ||
          message.includes("matching vocabulary")
        ? 503
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
