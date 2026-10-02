import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { loadMatchingCatalog } from "@/lib/matching/catalog";
import { computeFits } from "@/lib/matching/fit";
import { loadPublishedJobPosting } from "@/lib/job-posting";
import { scorePostingAgainstCatalog } from "@/lib/matching/score";
import { SESSION_COOKIE, getSessionId } from "@/lib/site-auth";

const jobPostingEntryIdSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[\w-]+$/, "Invalid entry id");

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

/** Deterministic project match for a bound posting. No AI. */
export async function GET(req: NextRequest) {
  const session = await requireSiteSession();
  if ("error" in session) return session.error;

  const raw = req.nextUrl.searchParams.get("jobPostingEntryId");
  const parsed = jobPostingEntryIdSchema.safeParse(raw ?? "");
  if (!parsed.success) {
    return NextResponse.json(
      { error: "jobPostingEntryId query param is required" },
      { status: 400 },
    );
  }

  try {
    const view = await loadPublishedJobPosting(parsed.data);
    if (!view) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 },
      );
    }

    const postingEntryRevisions = view.entryRevisions ?? {
      jobzeugJobPosting: [],
      jobzeugJobLine: [],
      jobzeugJobTool: [],
    };

    if (!view.matchingSnapshot) {
      return NextResponse.json({
        jobPostingEntryId: view.entryId,
        postingId: view.postingId,
        mapped: false,
        status: "not_mapped",
        projects: [],
        jobLines: [],
        unmappedJobLineEntryIds: [],
        jobPostFit: null,
        resumeFit: null,
        jobRelevancy: null,
        entryRevisions: postingEntryRevisions,
        message:
          "Posting has no matching snapshot (legacy ingest). Re-scrape to map.",
      });
    }

    const catalog = await loadMatchingCatalog();
    const result = scorePostingAgainstCatalog({ posting: view, catalog });
    const fits = computeFits({ posting: view, catalog });
    return NextResponse.json({
      jobPostingEntryId: view.entryId,
      postingId: view.postingId,
      ...result,
      fitVersion: fits.fitVersion,
      jobPostFit: fits.jobPostFit,
      resumeFit: fits.resumeFit,
      jobRelevancy: fits.jobRelevancy,
      entryRevisions: {
        ...result.entryRevisions,
        ...postingEntryRevisions,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to score job posting";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
