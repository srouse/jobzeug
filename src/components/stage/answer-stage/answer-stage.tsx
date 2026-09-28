"use client";

import { useState } from "react";

import { useResumeChat, useResumeHighlights } from "@/components/resume";
import { formatRunMetricsLabel } from "@/lib/evidence-citations";
import {
  RESUME_CONTEXT_ONLY_PROMPT,
  composeAskMessage,
} from "@/lib/resume-default-prompts";
import type { AnswerSection } from "@/lib/themed-answer";

import { AnswerStageBody } from "./answer-stage-body";
import { AnswerStageFooter } from "./answer-stage-footer";
import { ConnectionHub } from "./connection-hub";
import { StageTools } from "./stage-tools";
import styles from "./answer-stage.module.css";
import type { ResumeViewModel } from "@/lib/contentful/resume-model";

/** Question, answer, and composer. Off until that area comes back. */
const SHOW_STAGE_ANSWER = false;

/**
 * Fixed center stage: body (question + answer) and optional pre-ask composer.
 */
export function AnswerStage({
  hidden = false,
  resume = null,
  onViewProject,
  onOpenDesign,
}: {
  hidden?: boolean;
  /** Already-loaded resume — used to label cited projects (no extra fetch). */
  resume?: ResumeViewModel | null;
  onViewProject: (projectId: string) => void;
  onOpenDesign?: () => void;
}) {
  const [input, setInput] = useState("");
  const {
    activeCluster,
    focusedSectionId,
    setFocusedSectionId,
    focusAnswer,
    pageBindingsVisible,
    setPageBindingsVisible,
    askContextItems,
    removeAskContext,
  } = useResumeHighlights();
  const {
    ask,
    isLoading,
    sessionLoading,
    liveElapsedLabel,
    clearing,
    clearSession,
  } = useResumeChat();

  const markdown = activeCluster?.answerMarkdown?.trim() ?? "";
  const sections: AnswerSection[] = (activeCluster?.sections ?? []).map(
    (section) => ({
      id: section.id,
      title: section.title,
      highlight: section.highlight ?? section.title,
      markdown: section.markdown,
      citations: section.citations,
    }),
  );
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
  /** Composer only before the first themed answer of this turn. */
  const showComposer = !activeCluster && !isLoading && !sessionLoading;

  const handleClear = () => {
    setInput("");
    void clearSession();
  };

  const submitResumeQuestion = (questionText: string) => {
    if (busy) return;
    const nextQuestion =
      questionText.trim() ||
      (askContextItems.length > 0 ? RESUME_CONTEXT_ONLY_PROMPT : "");
    const composed = composeAskMessage(nextQuestion, askContextItems);
    if (!composed.trim()) return;
    ask(composed);
    setInput("");
  };

  const handleResumeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && askContextItems.length === 0) return;
    submitResumeQuestion(input);
  };

  const canSubmitResume =
    !busy && (Boolean(input.trim()) || askContextItems.length > 0);

  return (
    <div
      className={styles.stage}
      aria-live="polite"
      hidden={hidden || undefined}
      inert={hidden || undefined}
    >
      <article
        className={styles.card}
        data-answer-stage-card
        data-answer-off={SHOW_STAGE_ANSWER ? undefined : ""}
      >
        <StageTools onOpenDesign={onOpenDesign} />
        <ConnectionHub resume={resume} onViewProject={onViewProject} />
        {SHOW_STAGE_ANSWER ? (
        <div className={styles.answer}>
          <AnswerStageBody
          showLoading={showLoading}
          sessionLoading={sessionLoading}
          liveElapsedLabel={liveElapsedLabel}
          isLoading={isLoading}
          hasSections={hasSections}
          sections={sections}
          clusterId={activeCluster?.id}
          focusedSectionId={focusedSectionId}
          markdown={markdown}
          question={question}
          metricsLabel={metricsLabel}
          busy={busy}
          resume={resume}
          pageBindingsVisible={pageBindingsVisible}
          onTogglePageBindings={() =>
            setPageBindingsVisible(!pageBindingsVisible)
          }
          onClear={handleClear}
          onOpenSection={(id) => {
            const next = id || null;
            setFocusedSectionId(next);
            if (next) focusAnswer();
          }}
          onPrompt={submitResumeQuestion}
        />

          <AnswerStageFooter
          showComposer={showComposer}
          askContextItems={askContextItems}
          onRemoveContext={removeAskContext}
          input={input}
          onInputChange={setInput}
          onResumeSubmit={handleResumeSubmit}
          canSubmitResume={canSubmitResume}
          busy={busy}
          />
        </div>
        ) : null}
      </article>
    </div>
  );
}
