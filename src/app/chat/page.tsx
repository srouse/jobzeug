"use client";

import { useEffect, useState } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { JzButton } from "@jobzeug/design-system/react";
import Link from "next/link";
import styles from "./chat.module.css";

const CHAT_API = "/api/chat?surface=chat";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [restarting, setRestarting] = useState(false);
  const { messages, setMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: CHAT_API,
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
          <p className={styles.crumb}>
            <Link href="/">Jobzeug</Link>
          </p>
          <h1 className={styles.title}>Agent chat</h1>
        </div>
        <div className={styles.headerMeta}>
          <p className={styles.meta}>jobzeug-agent · session memory</p>
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
            <p className={styles.empty}>
              Ask about the evidence model, or smoke-test the agent. File tools
              for evidence/ are not wired yet.
            </p>
          ) : null}
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user" ? styles.bubbleUser : styles.bubbleAssistant
              }
            >
              <p className={styles.role}>{message.role}</p>
              {message.parts?.map((part, i) =>
                part.type === "text" ? (
                  <p key={`${message.id}-${i}`} className={styles.prewrap}>
                    {part.text}
                  </p>
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
