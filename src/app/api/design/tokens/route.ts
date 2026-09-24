import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  ALLOWED_FONT_FAMILIES,
  DEFAULT_SESSION_TOKEN_KNOBS,
  designTokensAgentOutputSchema,
  extractUrlFromMessage,
  parseSessionTokenKnobs,
  resolveBrandSiteFromMessage,
  scrapeBrandSnapshot,
  type BrandSnapshot,
  type SessionTokenKnobs,
} from "@/design/session-tokens";
import { SESSION_COOKIE, getSessionId } from "@/lib/site-auth";
import { mastra } from "@/mastra";

async function requireSession(): Promise<
  { sid: string } | { error: NextResponse }
> {
  const jar = await cookies();
  const sid = await getSessionId(jar.get(SESSION_COOKIE)?.value);
  if (!sid) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { sid };
}

const requestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  knobs: z.record(z.string(), z.unknown()).optional(),
});

function parseStructured(result: unknown) {
  const object =
    (result as { object?: unknown }).object ??
    (result as { structuredOutput?: unknown }).structuredOutput;

  // Prefer full schema; if the model drifts, still coerce knobs from a loose object.
  const strict = designTokensAgentOutputSchema.safeParse(object);
  if (strict.success) {
    return {
      knobs: parseSessionTokenKnobs(strict.data.knobs),
      summary: strict.data.summary.trim(),
    };
  }

  const loose = object && typeof object === "object" ? (object as Record<string, unknown>) : {};
  const summaryRaw = loose.summary;
  const summary =
    typeof summaryRaw === "string" && summaryRaw.trim()
      ? summaryRaw.trim().slice(0, 240)
      : "Updated session tokens.";

  return {
    knobs: parseSessionTokenKnobs(loose.knobs ?? loose),
    summary,
  };
}

type BrandContext = {
  url: string;
  snapshot: BrandSnapshot;
  resolvedFrom?: string;
};

async function resolveBrandContext(
  message: string,
): Promise<BrandContext | null> {
  const directUrl = extractUrlFromMessage(message);
  let url = directUrl;
  let resolvedFrom: string | undefined;

  if (!url) {
    const resolved = await resolveBrandSiteFromMessage(message);
    if (!resolved) return null;
    url = resolved.url;
    resolvedFrom = resolved.searchQuery;
  }

  const snapshot = await scrapeBrandSnapshot(url);
  if (!snapshot) return null;
  return { url, snapshot, resolvedFrom };
}

function buildPrompt(
  current: SessionTokenKnobs,
  message: string,
  brand: BrandContext | null,
): string {
  const brandBlock = brand
    ? `Brand snapshot from ${brand.url} (Firecrawl):
${JSON.stringify(brand.snapshot, null, 2)}
${brand.resolvedFrom ? `\nResolved from user phrasing: "${brand.resolvedFrom}"\n` : ""}
When a brand snapshot is present, map the parts the user asked for (font / colors / space / full restyle). Leave unrelated knobs alone unless this is a full site mimic. Clamp brand colors to mid-tone #RRGGBB. fontFamily must stay in the allowlist; if their face is not listed, pick the closest allowed family and say so in the summary. Cite the brand URL in the summary.
`
    : "";

  return `Current session knobs (JSON):
${JSON.stringify(current, null, 2)}

${brandBlock}Allowed fontFamily values (exact spelling):
${ALLOWED_FONT_FAMILIES.join(", ")}

User request:
${message}

Return the full updated knobs object and a short summary. Only change what the request asks for.`;
}

/** Design-tab agent: message + current knobs → validated knobs + summary. */
export async function POST(req: NextRequest) {
  const session = await requireSession();
  if ("error" in session) return session.error;

  let body: z.infer<typeof requestSchema>;
  try {
    body = requestSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const current: SessionTokenKnobs = body.knobs
    ? parseSessionTokenKnobs(body.knobs)
    : DEFAULT_SESSION_TOKEN_KNOBS;

  let brand: BrandContext | null = null;
  try {
    brand = await resolveBrandContext(body.message);
  } catch (err) {
    console.warn(
      "[design/tokens] brand preprocess failed",
      err instanceof Error ? err.message : err,
    );
  }

  const agent = mastra.getAgentById("jobzeug-design-tokens");
  const prompt = buildPrompt(current, body.message, brand);

  try {
    const result = await agent.generate(prompt, {
      structuredOutput: { schema: designTokensAgentOutputSchema },
    });
    const output = parseStructured(result);
    return NextResponse.json({
      knobs: output.knobs,
      summary: output.summary,
      brandUrl: brand?.url ?? null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Design tokens agent failed";
    console.error("[design/tokens]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
