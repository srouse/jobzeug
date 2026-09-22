import { handleChatStream } from "@mastra/ai-sdk";
import { toAISdkMessages } from "@mastra/ai-sdk/ui";
import { createUIMessageStreamResponse } from "ai";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  const session = await requireSession();
  if ("error" in session) return session.error;

  const params = await req.json();
  const surface = resolveSurface(req, params);
  const { resource, thread } = chatMemoryIds(session.sid, surface);

  const stream = await handleChatStream({
    mastra,
    agentId: "jobzeug-agent",
    version: "v7",
    params: {
      ...params,
      memory: {
        ...params.memory,
        thread,
        resource,
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
