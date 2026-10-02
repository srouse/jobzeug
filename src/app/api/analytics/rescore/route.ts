import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { jobPostingEntryIdSchema } from "@/app/analytics/load";
import { saveJobPostingMatchGraph } from "@/lib/job-posting";
import { SESSION_COOKIE, getSessionId } from "@/lib/site-auth";

export async function POST(req: NextRequest) {
  const jar = await cookies();
  const sid = await getSessionId(jar.get(SESSION_COOKIE)?.value);
  if (!sid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = req.nextUrl.searchParams.get("jobPostingEntryId");
  const parsed = jobPostingEntryIdSchema.safeParse(raw ?? "");
  if (!parsed.success) {
    return NextResponse.json({ error: "jobPostingEntryId is required" }, { status: 400 });
  }

  try {
    const graph = await saveJobPostingMatchGraph(parsed.data);
    return NextResponse.json({
      ok: true,
      scoringVersion: graph.scoringVersion,
      edges: graph.edges.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save match graph";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
