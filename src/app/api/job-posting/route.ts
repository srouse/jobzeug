import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  loadJobPostingByEntryId,
  publishJobPostingTree,
  scrapeJobListingMarkdown,
  structureJobPosting,
  toJobPostingPanelData,
} from "@/lib/job-posting";
import { SESSION_COOKIE, getSessionId } from "@/lib/site-auth";

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

/** Scrape URL → structure → Contentful; returns panel payload (no cookie). */
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
    const { entryId, postingId } = await publishJobPostingTree({
      sourceUrl: url,
      fullText,
      structured,
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
          },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Job posting ingest failed";
    const status = message.includes("FIRECRAWL") || message.includes("Firecrawl")
      ? 502
      : message.includes("Missing Contentful")
        ? 503
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
