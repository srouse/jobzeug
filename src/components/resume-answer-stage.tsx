"use client";

import { useState } from "react";
import { JzButton, JzIcon, JzText } from "@jobzeug/design-system/react";

import { AnswerAccordion } from "@/components/answer-accordion";
import { ChatMarkdown } from "@/components/chat-markdown";
import {
  DesignSessionProvider,
  useDesignComposerSubmit,
  useDesignSession,
} from "@/components/design-session-context";
import { DesignTabPanel } from "@/components/design-tab-panel";
import { useResumeChat } from "@/components/resume-chat-context";
import { useResumeHighlights } from "@/components/resume-highlight-context";
import { formatRunMetricsLabel } from "@/lib/evidence-citations";

import styles from "./resume-answer-stage.module.css";

type AnswerStageTab = "resume" | "design" | "app";

const STAGE_TABS: Array<{ id: AnswerStageTab; label: string }> = [
  { id: "resume", label: "Resume" },
  { id: "design", label: "Design" },
  { id: "app", label: "App" },
];

/**
 * Fixed center stage with Resume / Design / App tabs.
 * Resume is the live Q&A surface; Design hosts session token overrides; App is a placeholder.
 */
export function ResumeAnswerStage() {
  return (
    <DesignSessionProvider>
      <ResumeAnswerStageInner />
    </DesignSessionProvider>
  );
}

function ResumeAnswerStageInner() {
  const [tab, setTab] = useState<AnswerStageTab>("resume");
  const [input, setInput] = useState("");
  const { activeCluster, setFocusedSectionId, focusedIds } =
    useResumeHighlights();
  const { ask, isLoading, sessionLoading, liveElapsedLabel, clearing, clearSession } =
    useResumeChat();
  const design = useDesignSession();
  const handleDesignSubmit = useDesignComposerSubmit();

  const markdown = activeCluster?.answerMarkdown?.trim() ?? "";
  const sections = activeCluster?.sections ?? [];
  const question = activeCluster?.question?.trim() ?? "";
  const metricsLabel =
    isLoading && liveElapsedLabel
      ? liveElapsedLabel
      : activeCluster && activeCluster.durationMs > 0
        ? formatRunMetricsLabel(activeCluster)
        : null;
  const showLoading = sessionLoading || (isLoading && sections.length === 0);
  const busy = sessionLoading || isLoading || clearing;
  const hasSections = sections.length > 0;
  const isResume = tab === "resume";
  const isDesign = tab === "design";
  const showSideAccent = isResume && focusedIds.size > 0;
  const showComposer = isResume || isDesign;

  const handleClear = () => {
    if (busy) return;
    setInput("");
    void clearSession();
  };

  const handleResumeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || busy || !isResume) return;
    ask(input);
    setInput("");
  };

  return (
    <div className={styles.stage} aria-live="polite">
      <article className={styles.card} data-answer-stage-card>
        <header className={styles.header} data-answer-stage-header>
          {isResume && question ? (
            <JzText
              variant="label"
              color="primary"
              title={question}
              className={styles.question}
            >
              <span className={styles.questionText}>{question}</span>
            </JzText>
          ) : (
            <JzText
              variant="label"
              color="muted"
              label={
                tab === "design"
                  ? "Design"
                  : tab === "app"
                    ? "App"
                    : "Resume"
              }
              className={styles.question}
            />
          )}
          {isResume && metricsLabel ? (
            <JzText
              variant="caption"
              color="muted"
              label={metricsLabel}
              className={styles.metrics}
            />
          ) : null}
          <JzButton
            variant="inverse"
            size="small"
            label="Clear session"
            icon="X"
            showText={false}
            showIcon
            disabled={busy}
            aria-label="Clear session"
            className={styles.clearButton}
            onClick={handleClear}
          />
        </header>

        <div
          className={
            showSideAccent
              ? `${styles.body} ${styles.sideAccent}`
              : styles.body
          }
          role="tabpanel"
          id={`answer-stage-panel-${tab}`}
          aria-labelledby={`answer-stage-tab-${tab}`}
        >
          {isResume ? (
            showLoading ? (
              <div className={styles.loading} role="status" aria-live="polite">
                <JzIcon
                  icon="CircleNotch"
                  weight="regular"
                  size="small"
                  spin
                  aria-hidden
                />
                <JzText
                  variant="caption"
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
              <div className={styles.answer}>
                <AnswerAccordion
                  resetKey={activeCluster?.id}
                  onOpenItemChange={(id) => {
                    setFocusedSectionId(id || null);
                  }}
                  items={sections.map((section) => ({
                    id: section.id,
                    title: section.title,
                    body: section.markdown.trim() ? (
                      <ChatMarkdown markdown={section.markdown} />
                    ) : isLoading ? (
                      <JzText
                        variant="caption"
                        color="muted"
                        label={
                          liveElapsedLabel
                            ? `Writing · ${liveElapsedLabel}`
                            : "Writing…"
                        }
                      />
                    ) : (
                      <JzText
                        variant="caption"
                        color="muted"
                        label="No paragraph yet"
                      />
                    ),
                  }))}
                />
              </div>
            ) : markdown ? (
              <div className={styles.answer}>
                <ChatMarkdown markdown={markdown} />
              </div>
            ) : (
              <JzText
                variant="label"
                color="muted"
                label="Ask about the resume"
                className={styles.placeholder}
              />
            )
          ) : isDesign ? (
            <DesignTabPanel />
          ) : (
            <div className={styles.blankPanel}>
              <JzText
                variant="label"
                color="muted"
                label="App — coming soon"
                className={styles.placeholder}
              />
            </div>
          )}
        </div>

        {showComposer ? (
          <div
            className={
              showSideAccent
                ? `${styles.composerBar} ${styles.sideAccent}`
                : styles.composerBar
            }
          >
            {isResume ? (
              <form onSubmit={handleResumeSubmit} className={styles.composer}>
                <input
                  className={styles.input}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question…"
                  disabled={busy}
                  aria-label="Question"
                />
                <JzButton
                  label="Answer"
                  variant="primary"
                  size="small"
                  disabled={busy || !input.trim()}
                  showIcon={false}
                  onClick={(event: Event) => {
                    (event.currentTarget as HTMLElement | null)
                      ?.closest("form")
                      ?.requestSubmit();
                  }}
                />
              </form>
            ) : (
              <form onSubmit={handleDesignSubmit} className={styles.composer}>
                <input
                  className={styles.input}
                  value={design.input}
                  onChange={(e) => design.setInput(e.target.value)}
                  placeholder="e.g. Colder grays, violet primary, slightly tighter type…"
                  disabled={design.busy}
                  aria-label="Design instruction"
                />
                <JzButton
                  label={design.busy ? "Updating…" : "Update"}
                  variant="primary"
                  size="small"
                  disabled={design.busy || !design.input.trim()}
                  showIcon={false}
                  onClick={(event: Event) => {
                    (event.currentTarget as HTMLElement | null)
                      ?.closest("form")
                      ?.requestSubmit();
                  }}
                />
              </form>
            )}
          </div>
        ) : null}

        <nav
          className={styles.tabBar}
          data-answer-stage-footer
          role="tablist"
          aria-label="Answer stage"
        >
          {STAGE_TABS.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`answer-stage-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`answer-stage-panel-${item.id}`}
                className={
                  selected ? `${styles.tab} ${styles.tabSelected}` : styles.tab
                }
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </article>
    </div>
  );
}
