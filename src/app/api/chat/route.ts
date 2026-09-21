import { handleChatStream } from "@mastra/ai-sdk";
import { toAISdkMessages } from "@mastra/ai-sdk/ui";
import { createUIMessageStreamResponse } from "ai";
import { NextResponse } from "next/server";

import { mastra } from "@/mastra";

const THREAD_ID = "jobzeug-local";
const RESOURCE_ID = "jobzeug-chat";

export async function POST(req: Request) {
  const params = await req.json();
  const stream = await handleChatStream({
    mastra,
    agentId: "jobzeug-agent",
    version: "v7",
    params: {
      ...params,
      memory: {
        ...params.memory,
        thread: THREAD_ID,
        resource: RESOURCE_ID,
      },
    },
  });
  return createUIMessageStreamResponse({ stream });
}

export async function GET() {
  const memory = await mastra.getAgentById("jobzeug-agent").getMemory();
  let response = null;

  try {
    response = await memory?.recall({
      threadId: THREAD_ID,
      resourceId: RESOURCE_ID,
    });
  } catch {
    console.log("No previous messages found.");
  }

  const uiMessages = toAISdkMessages(response?.messages || [], {
    version: "v7",
  });

  return NextResponse.json(uiMessages);
}
