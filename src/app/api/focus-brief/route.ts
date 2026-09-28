import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  createFocusBrief,
  readFocusBrief,
  replaceFocusBrief,
} from "@/lib/focus-brief-entry";
import {
  capBriefSentences,
  focusBriefEntryId,
  focusBriefOutputSchema,
  focusBriefPrompt,
  focusBriefRequestSchema,
  loadProjectEvidence,
  type FocusBriefRequest,
} from "@/lib/focus-brief";
import { SESSION_COOKIE, getSessionId } from "@/lib/site-auth";
import { mastra } from "@/mastra";
import { ensureEvidenceWorkspace } from "@/mastra/workspace";

const pending = new Map<string, Promise<string>>();

async function writeBrief(
  briefId: string,
  input: FocusBriefRequest,
  refresh: boolean,
): Promise<string> {
  if (!refresh) {
    const cached = await readFocusBrief(briefId);
    if (cached) return cached;
  }

  await ensureEvidenceWorkspace();
  const files = await loadProjectEvidence(input);
  const agent = mastra.getAgentById("jobzeug-focus-brief");
  const result = await agent.generate(focusBriefPrompt(input, files), {
    structuredOutput: { schema: focusBriefOutputSchema },
  });
  const written = focusBriefOutputSchema.parse(
    (result as { object?: unknown }).object ??
      (result as { structuredOutput?: unknown }).structuredOutput,
  );
  const paragraph = capBriefSentences(written.paragraph);
  return refresh
    ? replaceFocusBrief(briefId, paragraph)
    : createFocusBrief(briefId, paragraph);
}

function resolveBrief(
  input: FocusBriefRequest,
  refresh: boolean,
): Promise<string> {
  const briefId = focusBriefEntryId(
    input.postingEntryId,
    input.kind,
    input.subject.id,
  );
  if (!refresh) {
    const current = pending.get(briefId);
    if (current) return current;
  }
  const work = writeBrief(briefId, input, refresh).finally(() => {
    if (pending.get(briefId) === work) pending.delete(briefId);
  });
  pending.set(briefId, work);
  return work;
}

export async function POST(request: Request) {
  const jar = await cookies();
  const sid = await getSessionId(jar.get(SESSION_COOKIE)?.value);
  if (!sid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = focusBriefRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid focus cluster" }, { status: 400 });
  }

  try {
    const paragraph = await resolveBrief(
      parsed.data,
      parsed.data.refresh === true,
    );
    return NextResponse.json({ paragraph });
  } catch (error) {
    console.error("[focus-brief]", error);
    return NextResponse.json({ error: "Focus brief failed" }, { status: 500 });
  }
}
