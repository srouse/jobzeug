"use client";

import { ChatMarkdown } from "@/components/chat-markdown";
import { useResumeHighlights } from "@/components/resume-highlight-context";
import { formatRunMetricsLabel } from "@/lib/evidence-citations";
import { JzText } from "@jobzeug/design-system/react";

import styles from "./resume-answer-stage.module.css";

/**
 * Fixed center overlay for the selected assistant answer.
 * Spans the center gutter and overlaps each column by --answer-overlap.
 */
export function ResumeAnswerStage() {
  const { activeCluster } = useResumeHighlights();
  const markdown = activeCluster?.answerMarkdown?.trim() ?? "";
  if (!markdown) return null;

  const durationLabel =
    activeCluster && activeCluster.durationMs > 0
      ? formatRunMetricsLabel(activeCluster)
      : null;

  return (
    <div className={styles.stage} aria-live="polite">
      <article className={styles.card} data-answer-stage-card>
        <ChatMarkdown markdown={markdown} />
        {durationLabel ? (
          <JzText
            variant="caption"
            color="muted"
            label={durationLabel}
            className={styles.duration}
          />
        ) : null}
      </article>
    </div>
  );
}
