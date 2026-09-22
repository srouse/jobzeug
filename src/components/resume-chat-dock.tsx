"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { JzButton } from "@jobzeug/design-system/react";
import { CircleNotch } from "@phosphor-icons/react";
import Markdown from "react-markdown";

import { useResumeHighlights } from "@/components/resume-highlight-context";
import {
  citationsFromMessages,
  extractCiteEvidence,
} from "@/lib/extract-cite-evidence";
import type { CiteEvidencePayload } from "@/lib/evidence-citations";
import styles from "./resume-chat-dock.module.css";

const RESUME_CHAT_API = "/api/chat?surface=resume";

function textFromParts(parts: Array<{ type: string; text?: string }> | undefined): string {
  if (!parts?.length) return "";
  return parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text ?? "")
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const markdownComponents = {
  p: ({ children }: ComponentPropsWithoutRef<"p">) => (
    <p className={styles.mdP}>{children}</p>
  ),
  ul: ({ children }: ComponentPropsWithoutRef<"ul">) => (
    <ul className={styles.mdUl}>{children}</ul>
  ),
  ol: ({ children }: ComponentPropsWithoutRef<"ol">) => (
    <ol className={styles.mdOl}>{children}</ol>
  ),
  li: ({ children }: ComponentPropsWithoutRef<"li">) => (
    <li className={styles.mdLi}>{children}</li>
  ),
  strong: ({ children }: ComponentPropsWithoutRef<"strong">) => (
    <strong className={styles.mdStrong}>{children}</strong>
  ),
  em: ({ children }: ComponentPropsWithoutRef<"em">) => <em>{children}</em>,
  a: ({ href, children }: ComponentPropsWithoutRef<"a">) => {
    const internal = href?.startsWith("#");
    return (
      <a
        href={href}
        className={styles.mdLink}
        {...(internal ? {} : { target: "_blank", rel: "noreferrer" })}
      >
        {children}
      </a>
    );
  },
  code: ({ children }: ComponentPropsWithoutRef<"code">) => (
    <code className={styles.mdCode}>{children}</code>
  ),
  pre: ({ children }: ComponentPropsWithoutRef<"pre">) => (
    <pre className={styles.mdPre}>{children}</pre>
  ),
  h1: ({ children }: ComponentPropsWithoutRef<"h1">) => (
    <p className={styles.mdHeading}>{children}</p>
  ),
  h2: ({ children }: ComponentPropsWithoutRef<"h2">) => (
    <p className={styles.mdHeading}>{children}</p>
  ),
  h3: ({ children }: ComponentPropsWithoutRef<"h3">) => (
    <p className={styles.mdHeading}>{children}</p>
  ),
  blockquote: ({ children }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className={styles.mdQuote}>{children}</blockquote>
  ),
};

function ChatMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className={styles.mdRoot}>
      <Markdown components={markdownComponents}>{markdown}</Markdown>
    </div>
  );
}

function CitationIdLink({ id }: { id: string }) {
  return (
    <a href={`#${id}`} className={styles.mdLink}>
      {id}
    </a>
  );
}

function CitationIdList({ ids }: { ids: string[] }) {
  return (
    <>
      {ids.map((id, index) => (
        <span key={id}>
          {index > 0 ? ", " : null}
          <CitationIdLink id={id} />
        </span>
      ))}
    </>
  );
}

function CitationBlurb({ citations }: { citations: CiteEvidencePayload }) {
  const groups = [
    citations.employers.length
      ? { label: "employers", ids: citations.employers }
      : null,
    citations.roles.length ? { label: "roles", ids: citations.roles } : null,
    citations.projects.length
      ? { label: "projects", ids: citations.projects }
      : null,
  ].filter(Boolean) as Array<{ label: string; ids: string[] }>;

  if (!groups.length) return null;

  return (
    <p className={styles.citeBlurb}>
      Cited:{" "}
      {groups.map((group, index) => (
        <span key={group.label}>
          {index > 0 ? " · " : null}
          {group.label} <CitationIdList ids={group.ids} />
        </span>
      ))}
    </p>
  );
}

function ThinkingMark() {
  return (
    <span className={styles.thinking}>
      <CircleNotch className={styles.spin} weight="bold" aria-hidden />
      Thinking…
    </span>
  );
}

export function ResumeChatDock() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [clearing, setClearing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setCitations, clearCitations } = useResumeHighlights();
  const { messages, setMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: RESUME_CHAT_API,
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const lastMessage = messages.at(-1);
  const lastAssistantHasText =
    lastMessage?.role === "assistant" && Boolean(textFromParts(lastMessage.parts));
  const showStandaloneThinking =
    isLoading && !lastAssistantHasText && lastMessage?.role !== "assistant";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(RESUME_CHAT_API);
      if (!res.ok || cancelled) return;
      const data = await res.json();
      if (!cancelled) setMessages([...data]);
    })();
    return () => {
      cancelled = true;
    };
  }, [setMessages]);

  useEffect(() => {
    if (status !== "ready") return;
    setCitations(citationsFromMessages(messages));
  }, [messages, status, setCitations]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, status, open, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    clearCitations();
    sendMessage({ text: input });
    setInput("");
  };

  const handleClear = async () => {
    if (clearing || isLoading) return;
    setClearing(true);
    try {
      const res = await fetch(RESUME_CHAT_API, { method: "DELETE" });
      if (!res.ok) return;
      setMessages([]);
      setInput("");
      clearCitations();
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className={styles.dock}>
      {open && (
        <div className={styles.panel}>
          <header className={styles.header}>
            <div>
              <p className={styles.title}>Resume chat</p>
              <p className={styles.subtitle}>Session-scoped · jobzeug-agent</p>
            </div>
            <div className={styles.headerActions}>
              <JzButton
                variant="secondary"
                size="small"
                label={clearing ? "Clearing…" : "Clear"}
                disabled={clearing || isLoading}
                showIcon={false}
                onClick={() => void handleClear()}
              />
              <JzButton
                variant="secondary"
                size="small"
                label="Close"
                showIcon={false}
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              />
            </div>
          </header>

          <div ref={scrollRef} className={styles.scroll}>
            <div className={styles.messages}>
              {messages.length === 0 && !isLoading ? (
                <p className={styles.empty}>
                  Ask about this resume, roles, or evidence. Matching sections highlight on the
                  page.
                </p>
              ) : null}
              {messages.map((message, index) => {
                const text = textFromParts(message.parts);
                const isLast = index === messages.length - 1;
                const citations =
                  message.role === "assistant" ? extractCiteEvidence(message.parts) : null;
                const waitingOnTools =
                  message.role === "assistant" && !text && isLoading && isLast;

                if (message.role === "assistant" && !text && !waitingOnTools) {
                  return null;
                }

                return (
                  <div
                    key={message.id}
                    className={
                      message.role === "user" ? styles.bubbleUser : styles.bubbleAssistant
                    }
                  >
                    <p className={styles.role}>{message.role}</p>
                    {message.role === "user" ? (
                      <p className={styles.prewrap}>{text}</p>
                    ) : waitingOnTools ? (
                      <ThinkingMark />
                    ) : (
                      <>
                        <ChatMarkdown markdown={text} />
                        {citations ? <CitationBlurb citations={citations} /> : null}
                      </>
                    )}
                  </div>
                );
              })}
              {showStandaloneThinking ? (
                <div className={styles.bubbleAssistant}>
                  <p className={styles.role}>assistant</p>
                  <ThinkingMark />
                </div>
              ) : null}
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.composer}>
            <input
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the resume…"
              disabled={isLoading}
            />
            <JzButton
              label="Send"
              variant="primary"
              size="small"
              disabled={isLoading}
              showIcon={false}
              onClick={(event: Event) => {
                (event.currentTarget as HTMLElement | null)
                  ?.closest("form")
                  ?.requestSubmit();
              }}
            />
          </form>
        </div>
      )}

      <span className={styles.fabSlot}>
        <JzButton
          variant={open ? "secondary" : "primary"}
          label={open ? "Close chat" : "Chat"}
          showIcon={false}
          onClick={() => setOpen((value) => !value)}
        />
      </span>
    </div>
  );
}
