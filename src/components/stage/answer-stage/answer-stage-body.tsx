"use client";

import { JzButton, JzIcon, JzIconButton, JzText } from "@jobzeug/design-system/react";

import { useJobPosting } from "@/components/job-posting";
import { RESUME_DEFAULT_PROMPTS } from "@/lib/resume-default-prompts";
import type { AnswerSection } from "@/lib/themed-answer";
import { useIdleScrollbar } from "@/lib/use-idle-scrollbar";
import {
  AnswerHighlights,
  markdownToPlain,
} from "../answer-highlights";
import { AnswerProjectCards, citedProjectsFromSection } from "../answer-project-cards";
import { ChatMarkdown } from "../chat-markdown";

import styles from "./answer-stage.module.css";
import type { ResumeViewModel } from "@/lib/contentful/resume-model";

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
  resume,
  pageBindingsVisible,
  onTogglePageBindings,
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
  resume: ResumeViewModel | null;
  pageBindingsVisible: boolean;
  onTogglePageBindings: () => void;
  onClear: () => void;
  onOpenSection: (id: string) => void;
  onPrompt: (prompt: string) => void;
}) {
  const { ref: scrollRef, scrolling } = useIdleScrollbar();
  const { data: jobPosting } = useJobPosting();

  const runMatchDebug = async () => {
    const entryId = jobPosting?.entryId;
    if (!entryId) {
      console.log("[job-match] no posting bound");
      return;
    }
    try {
      const res = await fetch(
        `/api/job-posting/match?entryId=${encodeURIComponent(entryId)}`,
      );
      const json = await res.json();
      console.log("[job-match]", res.status, json);
    } catch (error) {
      console.error("[job-match] failed", error);
    }
  };

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
          <div className={styles.stripActions}>
            <JzButton
              label="Match"
              variant="ghost"
              size="small"
              showIcon={false}
              title={
                jobPosting?.entryId
                  ? "Log job match scores to console"
                  : "Bind a posting first"
              }
              onClick={() => {
                void runMatchDebug();
              }}
            />
            {hasSections || markdown ? (
              <JzIconButton
                label={
                  pageBindingsVisible
                    ? "Hide page bindings"
                    : "Show page bindings"
                }
                icon={
                  pageBindingsVisible ? "LinkSimple" : "LinkSimpleBreak"
                }
                title={
                  pageBindingsVisible
                    ? "Bound to pages"
                    : "Unbound from pages"
                }
                aria-pressed={pageBindingsVisible}
                onClick={onTogglePageBindings}
              />
            ) : null}
            <JzIconButton
              label="Clear session"
              icon="X"
              disabled={sessionLoading}
              onClick={onClear}
            />
          </div>
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
            renderBelow={(item) => {
              const section = sections.find((s) => s.id === item.id);
              if (!section) return null;
              const cards = citedProjectsFromSection(section, resume, 2);
              if (!cards.length) return null;
              return (
                <AnswerProjectCards
                  cards={cards}
                  onSelectSection={onOpenSection}
                />
              );
            }}
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
