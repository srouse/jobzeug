"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { JzButton, JzIcon, JzText } from "@jobzeug/design-system/react";

import { ChatMarkdown } from "@/components/chat-markdown";
import { useJobPosting } from "@/components/job-posting";
import { useResumeHighlights } from "@/components/resume-highlight-context";
import { chatRunMetricsFromMessage } from "@/lib/chat-run-metrics";
import { extractCiteEvidence } from "@/lib/extract-cite-evidence";
import {
  emptyCitations,
  formatElapsed,
  formatRunMetricsLabel,
  type EvidenceCluster,
} from "@/lib/evidence-citations";
import { toChatJobPostingPayload } from "@/lib/job-posting/schema";
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

function ThinkingMark() {
  return (
    <span className={styles.thinking}>
      <JzIcon
        icon="CircleNotch"
        weight="regular"
        size="small"
        spin
        aria-hidden
      />
      <JzText variant="caption" color="muted" label="Thinking…" />
    </span>
  );
}

export function ResumeChatDock({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const [clearing, setClearing] = useState(false);
  const [runStartedAt, setRunStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [clusterByMessageId, setClusterByMessageId] = useState<
    Record<string, EvidenceCluster>
  >({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingStartRef = useRef<number | null>(null);
  const { activeCluster, setActiveCluster, clearActiveCluster } =
    useResumeHighlights();
  const { data: jobPosting } = useJobPosting();
  const jobPostingRef = useRef(jobPosting);
  jobPostingRef.current = jobPosting;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: RESUME_CHAT_API,
        body: () => {
          const current = jobPostingRef.current;
          if (!current) return {};
          return { jobPosting: toChatJobPostingPayload(current) };
        },
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
    [],
  );

  const { messages, setMessages, sendMessage, status } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";
  const lastMessage = messages.at(-1);
  const lastAssistantHasText =
    lastMessage?.role === "assistant" && Boolean(textFromParts(lastMessage.parts));
  const showStandaloneThinking =
    isLoading && !lastAssistantHasText && lastMessage?.role !== "assistant";
  const liveElapsedLabel =
    isLoading && runStartedAt != null ? formatElapsed(elapsedMs) : undefined;

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
    if (!isLoading || runStartedAt == null) return;
    const tick = () => setElapsedMs(Date.now() - runStartedAt);
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [isLoading, runStartedAt]);

  useEffect(() => {
    if (status !== "ready") return;
    if (pendingStartRef.current == null) return;

    const lastAssistant = [...messages]
      .reverse()
      .find((message) => message.role === "assistant");
    pendingStartRef.current = null;
    setRunStartedAt(null);

    if (!lastAssistant) return;

    const metrics = chatRunMetricsFromMessage(lastAssistant);
    const citations =
      extractCiteEvidence(lastAssistant.parts) ?? emptyCitations;
    const cluster: EvidenceCluster = {
      id: lastAssistant.id,
      citations,
      createdAt: Date.now(),
      durationMs: metrics?.durationMs ?? 0,
      inputTokens: metrics?.inputTokens,
      outputTokens: metrics?.outputTokens,
      totalTokens: metrics?.totalTokens,
      answerMarkdown: textFromParts(lastAssistant.parts),
    };
    setClusterByMessageId((prev) => ({ ...prev, [lastAssistant.id]: cluster }));
    setActiveCluster(cluster);
  }, [status, messages, setActiveCluster]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, status, open, isLoading, elapsedMs]);

  const selectAssistantCluster = (message: {
    id: string;
    parts?: unknown[];
    metadata?: unknown;
  }) => {
    const answerMarkdown = textFromParts(
      message.parts as Array<{ type: string; text?: string }> | undefined,
    );
    const metrics = chatRunMetricsFromMessage(message);
    const existing = clusterByMessageId[message.id];
    if (existing) {
      const cluster: EvidenceCluster = {
        ...existing,
        answerMarkdown: answerMarkdown || existing.answerMarkdown,
        durationMs: metrics?.durationMs ?? existing.durationMs,
        inputTokens: metrics?.inputTokens ?? existing.inputTokens,
        outputTokens: metrics?.outputTokens ?? existing.outputTokens,
        totalTokens: metrics?.totalTokens ?? existing.totalTokens,
      };
      setClusterByMessageId((prev) => ({ ...prev, [message.id]: cluster }));
      setActiveCluster(cluster);
      return;
    }
    const citations = extractCiteEvidence(message.parts) ?? emptyCitations;
    const cluster: EvidenceCluster = {
      id: message.id,
      citations,
      createdAt: Date.now(),
      durationMs: metrics?.durationMs ?? 0,
      inputTokens: metrics?.inputTokens,
      outputTokens: metrics?.outputTokens,
      totalTokens: metrics?.totalTokens,
      answerMarkdown,
    };
    setClusterByMessageId((prev) => ({ ...prev, [message.id]: cluster }));
    setActiveCluster(cluster);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    clearActiveCluster();
    const startedAt = Date.now();
    pendingStartRef.current = startedAt;
    setRunStartedAt(startedAt);
    setElapsedMs(0);
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
      setClusterByMessageId({});
      pendingStartRef.current = null;
      setRunStartedAt(null);
      setElapsedMs(0);
      clearActiveCluster();
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
              <JzText variant="label" label="Resume chat" className={styles.title} />
              <JzText
                variant="caption"
                color="muted"
                label="Session-scoped · jobzeug-agent"
                className={styles.subtitle}
              />
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
                onClick={() => onOpenChange(false)}
                aria-label="Close chat"
              />
            </div>
          </header>

          <div ref={scrollRef} className={styles.scroll}>
            <div className={styles.messages}>
              {messages.length === 0 && !isLoading ? (
                <JzText
                  variant="caption"
                  color="muted"
                  label="Ask about this resume, roles, or a bound posting. Click an answer to highlight matching sections."
                  className={styles.empty}
                />
              ) : null}
              {messages.map((message, index) => {
                const text = textFromParts(message.parts);
                const isLast = index === messages.length - 1;
                const waitingOnTools =
                  message.role === "assistant" && !text && isLoading && isLast;
                const cluster = clusterByMessageId[message.id];
                const messageMetrics = chatRunMetricsFromMessage(message);
                const metricsLabelSource = cluster?.durationMs
                  ? cluster
                  : messageMetrics;
                const selected = activeCluster?.id === message.id;

                if (message.role === "assistant" && !text && !waitingOnTools) {
                  return null;
                }

                if (message.role === "user") {
                  return (
                    <div key={message.id} className={styles.bubbleUser}>
                      <JzText
                        variant="overline"
                        color="muted"
                        label={message.role}
                        className={styles.role}
                      />
                      <JzText variant="caption" label={text} className={styles.prewrap} />
                    </div>
                  );
                }

                return (
                  <button
                    key={message.id}
                    type="button"
                    className={
                      selected
                        ? `${styles.bubbleAssistant} ${styles.bubbleAssistantSelected}`
                        : styles.bubbleAssistant
                    }
                    aria-pressed={selected}
                    disabled={waitingOnTools}
                    onClick={() => {
                      if (waitingOnTools) return;
                      if (selected) {
                        clearActiveCluster();
                        return;
                      }
                      selectAssistantCluster(message);
                    }}
                  >
                    <div className={styles.roleRow}>
                      <JzText
                        variant="overline"
                        color="muted"
                        label={message.role}
                        className={styles.role}
                      />
                      {waitingOnTools && liveElapsedLabel ? (
                        <JzText
                          variant="caption"
                          color="muted"
                          label={liveElapsedLabel}
                          className={styles.elapsed}
                        />
                      ) : null}
                      {!waitingOnTools &&
                      metricsLabelSource &&
                      metricsLabelSource.durationMs > 0 ? (
                        <JzText
                          variant="caption"
                          color="muted"
                          label={formatRunMetricsLabel(metricsLabelSource)}
                          className={styles.elapsed}
                        />
                      ) : null}
                    </div>
                    {waitingOnTools ? (
                      <ThinkingMark />
                    ) : (
                      <ChatMarkdown markdown={text} />
                    )}
                  </button>
                );
              })}
              {showStandaloneThinking ? (
                <div className={styles.bubbleAssistant}>
                  <div className={styles.roleRow}>
                    <JzText
                      variant="overline"
                      color="muted"
                      label="assistant"
                      className={styles.role}
                    />
                    {liveElapsedLabel ? (
                      <JzText
                        variant="caption"
                        color="muted"
                        label={liveElapsedLabel}
                        className={styles.elapsed}
                      />
                    ) : null}
                  </div>
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
    </div>
  );
}
