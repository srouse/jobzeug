"use client";

import { useEffect, useState } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { JzButton, JzText } from "@jobzeug/design-system/react";
import Link from "next/link";
import styles from "./chat.module.css";

const CHAT_API = "/api/chat?surface=chat";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [restarting, setRestarting] = useState(false);
  const { messages, setMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: CHAT_API,
      // Memory owns history — only send the newest message (Mastra requirement).
      prepareSendMessagesRequest({ messages, body }) {
        const last = messages.at(-1);
        return {
          body: {
            ...body,
            messages: last ? [last] : [],
          },
        };
      },
    }),
  });

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(CHAT_API);
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

  const handleRestart = async () => {
    if (restarting || status !== "ready") return;
    setRestarting(true);
    try {
      const res = await fetch(CHAT_API, { method: "DELETE" });
      if (!res.ok) return;
      setMessages([]);
      setInput("");
    } finally {
      setRestarting(false);
    }
  };

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div>
          <Link href="/" className={styles.crumb}>
            <JzText variant="label" color="muted" label="Jobzeug" />
          </Link>
          <JzText
            level={1}
            variant="heading"
            label="Agent chat"
            className={styles.title}
          />
        </div>
        <div className={styles.headerMeta}>
          <JzText
            variant="caption"
            color="muted"
            label="jobzeug-agent · session memory"
            className={styles.meta}
          />
          <JzButton
            variant="secondary"
            size="small"
            label={restarting ? "Restarting…" : "Restart"}
            disabled={restarting || status !== "ready"}
            showIcon={false}
            onClick={() => void handleRestart()}
          />
        </div>
      </header>

      <div className={styles.thread}>
        <div className={styles.messages}>
          {messages.length === 0 ? (
            <JzText
              variant="label"
              color="muted"
              label="Ask about the evidence model, or smoke-test the agent. File tools for evidence/ are not wired yet."
              className={styles.empty}
            />
          ) : null}
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user" ? styles.bubbleUser : styles.bubbleAssistant
              }
            >
              <JzText
                variant="overline"
                color="muted"
                label={message.role}
                className={styles.role}
              />
              {message.parts?.map((part, i) =>
                part.type === "text" ? (
                  <JzText
                    key={`${message.id}-${i}`}
                    variant="label"
                    label={part.text}
                    className={styles.prewrap}
                  />
                ) : null,
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.composer}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          disabled={status !== "ready"}
        />
        <JzButton
          label="Send"
          variant="primary"
          size="small"
          disabled={status !== "ready"}
          showIcon={false}
          onClick={(event: Event) => {
            (event.currentTarget as HTMLElement | null)
              ?.closest("form")
              ?.requestSubmit();
          }}
        />
      </form>
    </main>
  );
}
