import { handleChatStream } from "@mastra/ai-sdk";
import { toAISdkMessages } from "@mastra/ai-sdk/ui";
import { Memory } from "@mastra/memory";
import { createUIMessageStreamResponse } from "ai";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  buildChatRunMetrics,
  type ChatRunMetrics,
} from "@/lib/chat-run-metrics";
import {
  chatJobPostingPayloadSchema,
  formatJobPostingContext,
} from "@/lib/job-posting";
import { mastra } from "@/mastra";
import {
  SESSION_COOKIE,
  chatMemoryIds,
  getSessionId,
  parseChatSurface,
  type ChatSurface,
} from "@/lib/site-auth";

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

function resolveSurface(req: NextRequest, body?: { surface?: unknown }): ChatSurface {
  const fromQuery = req.nextUrl.searchParams.get("surface");
  if (fromQuery != null) return parseChatSurface(fromQuery);
  if (body && "surface" in body) return parseChatSurface(body.surface);
  return "chat";
}

/** Prefer client hand-off of the bound posting from the resume UI. */
async function resolveJobSystemContext(
  rawJobPosting: unknown,
): Promise<{ system: string | null; error?: NextResponse }> {
  if (rawJobPosting === undefined || rawJobPosting === null) {
    return { system: null };
  }

  const parsed = chatJobPostingPayloadSchema.safeParse(rawJobPosting);
  if (!parsed.success) {
    return {
      system: null,
      error: NextResponse.json(
        { error: "Invalid jobPosting payload" },
        { status: 400 },
      ),
    };
  }

  return { system: formatJobPostingContext(parsed.data) };
}

function usageFromUnknown(value: unknown): {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
} | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  return {
    inputTokens:
      typeof record.inputTokens === "number" ? record.inputTokens : undefined,
    outputTokens:
      typeof record.outputTokens === "number" ? record.outputTokens : undefined,
    totalTokens:
      typeof record.totalTokens === "number" ? record.totalTokens : undefined,
  };
}

async function persistAssistantRunMetrics(args: {
  thread: string;
  resource: string;
  metrics: ChatRunMetrics;
  preferredMessageId?: string | null;
}): Promise<void> {
  const memory = await mastra.getAgentById("jobzeug-agent").getMemory();
  if (!(memory instanceof Memory)) return;

  let messageId = args.preferredMessageId ?? null;
  if (!messageId) {
    try {
      const recalled = await memory.recall({
        threadId: args.thread,
        resourceId: args.resource,
      });
      messageId =
        [...(recalled?.messages ?? [])]
          .reverse()
          .find((message) => message.role === "assistant")?.id ?? null;
    } catch {
      return;
    }
  }
  if (!messageId) return;

  try {
    await memory.updateMessages({
      messages: [
        {
          id: messageId,
          content: { metadata: args.metrics },
        } as unknown as Parameters<Memory["updateMessages"]>[0]["messages"][number],
      ],
    });
  } catch (error) {
    console.error("Failed to persist chat run metrics", error);
  }
}

export async function POST(req: NextRequest) {
  const session = await requireSession();
  if ("error" in session) return session.error;

  const params = await req.json();
  const surface = resolveSurface(req, params);
  const { resource, thread } = chatMemoryIds(session.sid, surface);

  const jobResolved = await resolveJobSystemContext(params?.jobPosting);
  if (jobResolved.error) return jobResolved.error;

  // Strip client hand-off so it is not passed into the model stream.
  if (params && typeof params === "object" && "jobPosting" in params) {
    delete params.jobPosting;
  }

  // Memory is source of truth — only the latest client message is input.
  // Full history re-sent from useChat causes duplicate assistant rows on save.
  const incomingMessages = Array.isArray(params?.messages) ? params.messages : [];
  const messagesForAgent =
    incomingMessages.length > 0
      ? [incomingMessages[incomingMessages.length - 1]]
      : incomingMessages;

  const startedAtMs = Date.now();
  let streamMetrics: ChatRunMetrics | null = null;

  const stream = await handleChatStream({
    mastra,
    agentId: "jobzeug-agent",
    version: "v7",
    // Attach metrics to the AI SDK finish part so the live client sees them.
    messageMetadata: ({ part }) => {
      if (!part || typeof part !== "object") return undefined;
      const typed = part as {
        type?: string;
        totalUsage?: unknown;
        usage?: unknown;
      };
      if (typed.type !== "finish") return undefined;
      streamMetrics = buildChatRunMetrics(
        startedAtMs,
        usageFromUnknown(typed.totalUsage ?? typed.usage),
      );
      return streamMetrics;
    },
    params: {
      ...params,
      messages: messagesForAgent,
      ...(jobResolved.system ? { system: jobResolved.system } : {}),
      memory: {
        ...params.memory,
        thread,
        resource,
      },
      // Persist onto Mastra message content.metadata after memory save.
      onFinish: async (event) => {
        const metrics =
          streamMetrics ??
          buildChatRunMetrics(
            startedAtMs,
            usageFromUnknown(event.totalUsage ?? event.usage),
          );
        const dbMessages = event.response?.dbMessages;
        const preferredMessageId = Array.isArray(dbMessages)
          ? [...dbMessages]
              .reverse()
              .find((message) => message.role === "assistant")?.id
          : null;
        await persistAssistantRunMetrics({
          thread,
          resource,
          metrics,
          preferredMessageId,
        });
      },
    },
  });
  return createUIMessageStreamResponse({ stream });
}

export async function GET(req: NextRequest) {
  const session = await requireSession();
  if ("error" in session) return session.error;

  const surface = resolveSurface(req);
  const { resource, thread } = chatMemoryIds(session.sid, surface);
  const memory = await mastra.getAgentById("jobzeug-agent").getMemory();
  let response = null;

  try {
    response = await memory?.recall({
      threadId: thread,
      resourceId: resource,
    });
  } catch {
    console.log("No previous messages found.");
  }

  const uiMessages = toAISdkMessages(response?.messages || [], {
    version: "v7",
  });

  return NextResponse.json(uiMessages);
}

/** Wipe this session's surface thread and start fresh. */
export async function DELETE(req: NextRequest) {
  const session = await requireSession();
  if ("error" in session) return session.error;

  const surface = resolveSurface(req);
  const { thread } = chatMemoryIds(session.sid, surface);
  const memory = await mastra.getAgentById("jobzeug-agent").getMemory();
  if (!memory) {
    return NextResponse.json({ error: "Memory unavailable" }, { status: 503 });
  }

  try {
    await memory.deleteThread(thread);
  } catch {
    // Thread may not exist yet — treat as already clear.
  }

  return NextResponse.json({ ok: true });
}
