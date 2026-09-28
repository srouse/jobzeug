import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { loadMatchingCatalog } from "@/lib/matching/catalog";
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

const BIND_STAGES = ["scraping", "structuring", "matching", "saving"] as const;

function ingestErrorStatus(message: string): number {
  if (message.includes("FIRECRAWL") || message.includes("Firecrawl")) return 502;
  if (
    message.includes("Missing Contentful") ||
    message.includes("matching vocabulary")
  ) {
    return 503;
  }
  return 500;
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

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const write = (value: unknown) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`));
      };
      const stage = async <T>(name: (typeof BIND_STAGES)[number], work: () => Promise<T>) => {
        write({ stage: name, status: "working" });
        const started = performance.now();
        try {
          const result = await work();
          write({
            stage: name,
            status: "done",
            ms: Math.round(performance.now() - started),
          });
          return result;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Job posting ingest failed";
          write({ error: message, status: ingestErrorStatus(message) });
          throw error;
        }
      };

      try {
        const fullText = await stage("scraping", () =>
          scrapeJobListingMarkdown(url),
        );
        const structured = await stage("structuring", () =>
          structureJobPosting({ sourceUrl: url, fullText }),
        );
        const matching = await stage("matching", async () => {
          const catalog = await loadMatchingCatalog();
          const vocabulary = pickApprovedVocabulary(catalog.vocabularies);
          const mapped = await mapJobPostingRequirements({
            structured,
            vocabulary,
          });
          return { ...mapped, catalog };
        });
        const posting = await stage("saving", async () => {
          const { entryId, postingId } = await publishJobPostingTree({
            sourceUrl: url,
            fullText,
            structured,
            matching,
          });
          const view = await loadJobPostingByEntryId(entryId);
          return view
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
              };
        });
        write({ status: "result", posting });
      } catch {
        // The failing stage already wrote the error line.
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
