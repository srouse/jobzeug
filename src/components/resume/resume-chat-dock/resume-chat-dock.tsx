"use client";

import { useEffect, useRef, useState } from "react";
import { JzButton, JzIcon, JzText } from "@jobzeug/design-system/react";

import { ChatMarkdown } from "@/components/stage";
import { chatRunMetricsFromMessage } from "@/lib/chat-run-metrics";
import { formatRunMetricsLabel } from "@/lib/evidence-citations";
import { textFromParts, useResumeChat } from "../resume-chat-context";
import { useResumeHighlights } from "../resume-highlight-context";
import styles from "./resume-chat-dock.module.css";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeCluster, clearActiveCluster } = useResumeHighlights();
  const {
    messages,
    isLoading,
    clearing,
    liveElapsedLabel,
    clusterByMessageId,
    ask,
    clearSession,
    selectAssistantCluster,
  } = useResumeChat();

  const lastMessage = messages.at(-1);
  const lastAssistantHasText =
    lastMessage?.role === "assistant" &&
    Boolean(textFromParts(lastMessage.parts));
  const showStandaloneThinking =
    isLoading && !lastAssistantHasText && lastMessage?.role !== "assistant";

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open, isLoading, liveElapsedLabel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    ask(input);
    setInput("");
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
                label="Session-scoped · themed outline + writers"
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
                onClick={() => void clearSession()}
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
