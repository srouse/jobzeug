"use client";

import { useEffect, useState } from "react";

import { useResumeHighlights } from "../../highlight-context";
import {
  presentedProject,
  sameProjectId,
} from "../../project-presentation/project-presentation";

import { ConnectionHub } from "./connection-hub";
import { StageTools } from "./stage-tools";
import styles from "./answer-stage.module.css";
import type { ResumeViewModel } from "@/lib/contentful/resume-model";

/**
 * Selected project. Sits in the wide column under the resume header.
 * The ask composer stays off.
 */
export function AnswerStage({
  resume = null,
  presentationId = null,
  onClosePresentation,
  onViewProject,
  onOpenDesign,
}: {
  resume?: ResumeViewModel | null;
  /** Project whose walkthrough video is open. Null is the text stage. */
  presentationId?: string | null;
  onClosePresentation?: () => void;
  onViewProject: (projectId: string) => void;
  onOpenDesign?: () => void;
}) {
  const { stageProjectId } = useResumeHighlights();
  const presentation = presentedProject(resume, presentationId ?? null);
  const presenting = Boolean(
    presentation &&
      onClosePresentation &&
      stageProjectId != null &&
      sameProjectId(stageProjectId, presentation.evidenceId),
  );
  const [ease, setEase] = useState(presenting);
  const [easePresenting, setEasePresenting] = useState(presenting);
  if (presenting !== easePresenting) {
    setEasePresenting(presenting);
    if (presenting) setEase(true);
  }

  useEffect(() => {
    if (!presenting || !onClosePresentation) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClosePresentation();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [presenting, onClosePresentation]);

  useEffect(() => {
    if (presenting || !ease) return;
    const timeout = window.setTimeout(() => setEase(false), 700);
    return () => window.clearTimeout(timeout);
  }, [presenting, ease]);

  return (
    <div
      className={styles.stage}
      aria-live="polite"
      data-presenting={presenting ? "" : undefined}
      data-ease={ease ? "" : undefined}
    >
      <button
        type="button"
        className={styles.scrim}
        aria-label="Close video"
        aria-hidden={presenting ? undefined : true}
        inert={presenting ? undefined : true}
        tabIndex={presenting ? 0 : -1}
        onClick={onClosePresentation}
      />
      <article
        className={styles.card}
        data-answer-stage-card
        data-answer-off=""
      >
        <StageTools onOpenDesign={onOpenDesign} />
        <ConnectionHub
          resume={resume}
          onViewProject={onViewProject}
          presentationId={presenting ? presentationId : null}
          onClosePresentation={onClosePresentation}
        />
      </article>
    </div>
  );
}
