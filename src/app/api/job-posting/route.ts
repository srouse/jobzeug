import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  JOB_POSTING_COOKIE,
  createJobPostingCookieValue,
  getBoundJobPostingEntryId,
  getJobPostingCookieOptions,
  loadJobPostingByEntryId,
  publishJobPostingTree,
  scrapeJobListingMarkdown,
  structureJobPosting,
  toJobPostingPanelData,
} from "@/lib/job-posting";
import { SESSION_COOKIE, getSessionId } from "@/lib/site-auth";

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

function isSecureRequest(req: NextRequest) {
  return (
    req.nextUrl.protocol === "https:" ||
    process.env.NODE_ENV === "production"
  );
}

/** Bound posting for this browser session (title + entry id + optional full view). */
export async function GET() {
  const session = await requireSiteSession();
  if ("error" in session) return session.error;

  const jar = await cookies();
  const entryId = await getBoundJobPostingEntryId(
    jar.get(JOB_POSTING_COOKIE)?.value,
  );
  if (!entryId) {
    return NextResponse.json({ bound: false });
  }

  try {
    const view = await loadJobPostingByEntryId(entryId);
    if (!view) {
      return NextResponse.json({ bound: false, staleEntryId: entryId });
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

/** Scrape URL → structure → Contentful → bind entry id cookie. */
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

    const cookieValue = await createJobPostingCookieValue(entryId);
    // Reload published tree so Bind returns the same panel payload as GET.
    const view = await loadJobPostingByEntryId(entryId);
    const response = NextResponse.json(
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
    response.cookies.set(
      JOB_POSTING_COOKIE,
      cookieValue,
      getJobPostingCookieOptions(isSecureRequest(req)),
    );
    return response;
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

/** Clear session binding (does not delete Contentful entries). */
export async function DELETE(req: NextRequest) {
  const session = await requireSiteSession();
  if ("error" in session) return session.error;

  const response = NextResponse.json({ ok: true, bound: false });
  response.cookies.set(JOB_POSTING_COOKIE, "", {
    ...getJobPostingCookieOptions(isSecureRequest(req)),
    maxAge: 0,
  });
  return response;
}
