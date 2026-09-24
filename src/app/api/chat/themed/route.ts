import { Memory } from "@mastra/memory";
import { toAISdkMessages } from "@mastra/ai-sdk/ui";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  buildChatRunMetrics,
  type ChatRunMetrics,
} from "@/lib/chat-run-metrics";
import {
  chatJobPostingPayloadSchema,
  formatJobPostingContext,
  type ChatJobPostingPayload,
} from "@/lib/job-posting";
import { SESSION_COOKIE, getSessionId } from "@/lib/site-auth";
import {
  answerSectionSchema,
  unionCitations,
  type AnswerSection,
} from "@/lib/themed-answer";
import { runThemedAnswer } from "@/lib/themed-answer-run";
import { citeEvidenceSchema, emptyCitations } from "@/lib/evidence-citations";
import { mastra } from "@/mastra";
import { z } from "zod";

const THEMED_SURFACE = "resume-themed";

function themedMemoryIds(sid: string) {
  return {
    resource: `session:${sid}`,
    thread: `${THEMED_SURFACE}:${sid}`,
  };
}

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

async function resolveJob(
  raw: unknown,
): Promise<
  | { system: string | null; jobPosting: ChatJobPostingPayload | null; error?: undefined }
  | { system: null; jobPosting: null; error: NextResponse }
> {
  if (raw === undefined || raw === null) {
    return { system: null, jobPosting: null };
  }
  const parsed = chatJobPostingPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      system: null,
      jobPosting: null,
      error: NextResponse.json(
        { error: "Invalid jobPosting payload" },
        { status: 400 },
      ),
    };
  }
  return {
    system: formatJobPostingContext(parsed.data),
    jobPosting: parsed.data,
  };
}

function sseEncode(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

const themedMetadataSchema = z.object({
  sections: z.array(answerSectionSchema),
  citations: citeEvidenceSchema,
  durationMs: z.number(),
  inputTokens: z.number().nullable().optional(),
  outputTokens: z.number().nullable().optional(),
  totalTokens: z.number().nullable().optional(),
});

async function getMemory(): Promise<Memory | null> {
  const memory = await mastra.getAgentById("jobzeug-agent").getMemory();
  return memory instanceof Memory ? memory : null;
}

async function persistThemedTurn(args: {
  memory: Memory;
  thread: string;
  resource: string;
  question: string;
  answerMarkdown: string;
  sections: AnswerSection[];
  citations: ReturnType<typeof citeEvidenceSchema.parse>;
  metrics: ChatRunMetrics;
  userMessageId: string;
  assistantMessageId: string;
}) {
  try {
    await args.memory.createThread({
      threadId: args.thread,
      resourceId: args.resource,
      title: "Resume themed answers",
    });
  } catch {
    // Thread may already exist.
  }

  const now = new Date();
  await args.memory.saveMessages({
    messages: [
      {
        id: args.userMessageId,
        role: "user",
        createdAt: now,
        threadId: args.thread,
        resourceId: args.resource,
        content: {
          format: 2,
          parts: [{ type: "text", text: args.question }],
        },
      },
      {
        id: args.assistantMessageId,
        role: "assistant",
        createdAt: new Date(now.getTime() + 1),
        threadId: args.thread,
        resourceId: args.resource,
        content: {
          format: 2,
          parts: [{ type: "text", text: args.answerMarkdown }],
          metadata: {
            ...args.metrics,
            sections: args.sections,
            citations: args.citations,
          },
        },
      },
    ],
  });
}

/** NDJSON-style SSE: themes → section* → done | error */
export async function POST(req: NextRequest) {
  const session = await requireSession();
  if ("error" in session) return session.error;

  const body = (await req.json()) as {
    message?: string;
    jobPosting?: unknown;
  };
  const question = typeof body.message === "string" ? body.message.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const jobResolved = await resolveJob(body.jobPosting);
  if (jobResolved.error) return jobResolved.error;

  const { resource, thread } = themedMemoryIds(session.sid);
  const startedAtMs = Date.now();
  const assistantMessageId = crypto.randomUUID();
  const userMessageId = crypto.randomUUID();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(sseEncode(data)));
      };

      try {
        const result = await runThemedAnswer({
          question,
          system: jobResolved.system,
          jobPosting: jobResolved.jobPosting,
          progress: {
            onThemes: (sections) => {
              send({
                type: "themes",
                id: assistantMessageId,
                question,
                sections,
                citations: unionCitations(
                  sections.map((section) => section.citations),
                ),
              });
            },
            onSection: (section) => {
              send({ type: "section", id: assistantMessageId, section });
            },
          },
        });

        const metrics = buildChatRunMetrics(startedAtMs, result.usage);
        send({
          type: "done",
          id: assistantMessageId,
          userMessageId,
          question,
          sections: result.sections,
          citations: result.citations,
          answerMarkdown: result.answerMarkdown,
          ...metrics,
        });

        const memory = await getMemory();
        if (memory) {
          try {
            await persistThemedTurn({
              memory,
              thread,
              resource,
              question,
              answerMarkdown: result.answerMarkdown,
              sections: result.sections,
              citations: result.citations,
              metrics,
              userMessageId,
              assistantMessageId,
            });
          } catch (error) {
            console.error("[themed] persist failed", error);
          }
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Themed answer failed";
        send({ type: "error", error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function GET() {
  const session = await requireSession();
  if ("error" in session) return session.error;

  const { resource, thread } = themedMemoryIds(session.sid);
  const memory = await getMemory();
  if (!memory) {
    return NextResponse.json([]);
  }

  let recalled = null;
  try {
    recalled = await memory.recall({
      threadId: thread,
      resourceId: resource,
    });
  } catch {
    return NextResponse.json([]);
  }

  const uiMessages = toAISdkMessages(recalled?.messages || [], {
    version: "v7",
  }) as Array<{
    id: string;
    role: string;
    parts?: Array<{ type: string; text?: string }>;
    metadata?: unknown;
  }>;

  // Attach parsed sections onto metadata for the client cluster builder.
  const enriched = uiMessages.map((message) => {
    if (message.role !== "assistant") return message;
    const raw = message.metadata;
    const parsed = themedMetadataSchema.safeParse(raw);
    if (!parsed.success) return message;
    return {
      ...message,
      metadata: {
        ...parsed.data,
        citations: parsed.data.citations ?? emptyCitations,
      },
    };
  });

  return NextResponse.json(enriched);
}

export async function DELETE() {
  const session = await requireSession();
  if ("error" in session) return session.error;

  const { thread } = themedMemoryIds(session.sid);
  const memory = await getMemory();
  if (!memory) {
    return NextResponse.json({ ok: true });
  }

  try {
    await memory.deleteThread(thread);
  } catch {
    // Thread may not exist.
  }

  return NextResponse.json({ ok: true });
}
