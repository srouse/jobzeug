"use client";

import { useEffect, useState } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import Link from "next/link";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, setMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch("/api/chat");
      if (!res.ok) return;
      const data = await res.json();
      setMessages([...data]);
    };
    void fetchMessages();
  }, [setMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 p-6">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">
            <Link href="/" className="underline-offset-4 hover:underline">
              Jobzeug
            </Link>
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Agent chat</h1>
        </div>
        <p className="text-xs text-zinc-500">jobzeug-agent · Postgres memory</p>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Ask about the evidence model, or smoke-test the agent. File tools
            for evidence/ are not wired yet.
          </p>
        ) : null}
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "ml-8 rounded-lg bg-zinc-100 p-3 text-sm dark:bg-zinc-900"
                : "mr-8 rounded-lg bg-white p-3 text-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800"
            }
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
              {message.role}
            </p>
            {message.parts?.map((part, i) =>
              part.type === "text" ? (
                <p key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                  {part.text}
                </p>
              ) : null,
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          disabled={status !== "ready"}
        />
        <button
          type="submit"
          disabled={status !== "ready"}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Send
        </button>
      </form>
    </main>
  );
}
