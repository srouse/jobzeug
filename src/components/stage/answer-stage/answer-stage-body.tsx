"use client";

import { JzIcon, JzIconButton, JzText } from "@jobzeug/design-system/react";

import { RESUME_DEFAULT_PROMPTS } from "@/lib/resume-default-prompts";
import type { AnswerSection } from "@/lib/themed-answer";
import { useIdleScrollbar } from "@/lib/use-idle-scrollbar";
import {
  AnswerHighlights,
  markdownToPlain,
} from "../answer-highlights";
import { ChatMarkdown } from "../chat-markdown";

import styles from "./answer-stage.module.css";

export function AnswerStageBody({
  showLoading,
  sessionLoading,
  liveElapsedLabel,
  isLoading,
  hasSections,
  sections,
  clusterId,
  focusedSectionId,
  markdown,
  question,
  metricsLabel,
  busy,
  onClear,
  onOpenSection,
  onPrompt,
}: {
  showLoading: boolean;
  sessionLoading: boolean;
  liveElapsedLabel: string | null | undefined;
  isLoading: boolean;
  hasSections: boolean;
  sections: AnswerSection[];
  clusterId: string | undefined;
  focusedSectionId: string | null;
  markdown: string;
  question: string;
  metricsLabel: string | null;
  busy: boolean;
  onClear: () => void;
  onOpenSection: (id: string) => void;
  onPrompt: (prompt: string) => void;
}) {
  const { ref: scrollRef, scrolling } = useIdleScrollbar();

  return (
    <div
      ref={scrollRef}
      className={styles.body}
      data-scrolling={scrolling || undefined}
    >
      <div className={styles.stack}>
        <div className={styles.strip}>
          {question ? (
            <JzText
              level={2}
              variant="heading2"
              color="primary"
              label={question}
              className={styles.stripQuestion}
            />
          ) : (
            <span className={styles.stripSpacer} />
          )}
          {metricsLabel ? (
            <JzText
              variant="caption"
              color="muted"
              label={metricsLabel}
              className={styles.stripMetrics}
            />
          ) : null}
          <JzIconButton
            label="Clear session"
            icon="X"
            disabled={sessionLoading}
            className={styles.stripClear}
            onClick={onClear}
          />
        </div>

        {showLoading ? (
          <div className={styles.loading} role="status" aria-live="polite">
            <JzIcon
              icon="CircleNotch"
              weight="regular"
              size="small"
              spin
              aria-hidden
            />
            <JzText
              variant="body"
              color="muted"
              label={
                sessionLoading
                  ? "Loading"
                  : liveElapsedLabel
                    ? `Loading · ${liveElapsedLabel}`
                    : "Loading"
              }
            />
          </div>
        ) : hasSections ? (
          <AnswerHighlights
            resetKey={clusterId}
            selectedId={focusedSectionId}
            onSelectedIdChange={(id) => onOpenSection(id || "")}
            items={sections.map((section) => ({
              id: section.id,
              title: section.title,
              highlight: section.highlight || section.title,
              description: section.markdown.trim()
                ? markdownToPlain(section.markdown)
                : isLoading
                  ? liveElapsedLabel
                    ? `Writing · ${liveElapsedLabel}`
                    : "Writing…"
                  : "No paragraph yet",
            }))}
          />
        ) : markdown ? (
          <ChatMarkdown markdown={markdown} />
        ) : (
          <div className={styles.promptPanel} aria-label="Suggested prompts">
            {RESUME_DEFAULT_PROMPTS.map((prompt) => (
              <JzText
                key={prompt}
                variant="body"
                color="primary"
                label={prompt}
                interactive={!busy}
                onClick={busy ? undefined : () => onPrompt(prompt)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
