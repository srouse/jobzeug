import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { loadMatchingCatalog } from "@/lib/contentful/matching";
import { loadJobPostingByEntryId } from "@/lib/job-posting";
import { scorePostingAgainstCatalog } from "@/lib/matching/score";
import { SESSION_COOKIE, getSessionId } from "@/lib/site-auth";

const entryIdSchema = z
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

    if (!view.matchingSnapshot) {
      return NextResponse.json({
        entryId: view.entryId,
        postingId: view.postingId,
        mapped: false,
        status: "not_mapped",
        projects: [],
        byLine: [],
        unmappedRequirementIds: [],
        message:
          "Posting has no matching snapshot (legacy ingest). Re-scrape to map.",
      });
    }

    const catalog = await loadMatchingCatalog();
    const result = scorePostingAgainstCatalog({ posting: view, catalog });
    return NextResponse.json({
      entryId: view.entryId,
      postingId: view.postingId,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to score job posting";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
