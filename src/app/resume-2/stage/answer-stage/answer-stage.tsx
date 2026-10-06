"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { useResumeHighlights } from "../../highlight-context";
import {
  presentedProject,
  sameProjectId,
} from "../../project-presentation/project-presentation";

import { ConnectionHub } from "./connection-hub";
import { StageTools } from "./stage-tools";
import styles from "./answer-stage.module.css";
import type { ResumeViewModel } from "@/lib/contentful/resume-model";

const PRESENT_MS = 700;

function writeBox(node: HTMLElement, rect: DOMRect) {
  node.style.top = `${rect.top}px`;
  node.style.left = `${rect.left}px`;
  node.style.width = `${rect.width}px`;
  node.style.height = `${rect.height}px`;
}

function writeModal(node: HTMLElement) {
  node.style.top = "0px";
  node.style.left = "var(--present-gap, 2.5rem)";
  node.style.width = "calc(100% - var(--present-gap, 2.5rem))";
  node.style.height = "100%";
}

function pin(node: HTMLElement, rect: DOMRect) {
  node.style.transition = "none";
  node.style.position = "fixed";
  node.style.right = "auto";
  node.style.bottom = "auto";
  node.style.margin = "0";
  writeBox(node, rect);
}

function release(node: HTMLElement) {
  node.style.transition = "";
  node.style.position = "";
  node.style.top = "";
  node.style.left = "";
  node.style.right = "";
  node.style.bottom = "";
  node.style.width = "";
  node.style.height = "";
  node.style.margin = "";
}

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
  canEdit = false,
  onPresentationSaved,
}: {
  resume?: ResumeViewModel | null;
  /** Project whose walkthrough video is open. Null is the text stage. */
  presentationId?: string | null;
  onClosePresentation?: () => void;
  onViewProject: (projectId: string) => void;
  onOpenDesign?: () => void;
  canEdit?: boolean;
  onPresentationSaved?: () => Promise<void>;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const { stageProjectId } = useResumeHighlights();
  const presentation = presentedProject(resume, presentationId ?? null);
  const presenting = Boolean(
    presentation?.presentation?.videoUrl &&
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
    const timeout = window.setTimeout(() => setEase(false), PRESENT_MS);
    return () => window.clearTimeout(timeout);
  }, [presenting, ease]);

  useLayoutEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const wide = window.matchMedia("(min-width: 900px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!wide) {
      release(node);
      return;
    }

    if (presenting) {
      const rect = node.getBoundingClientRect();
      pin(node, rect);
      if (reduce) {
        node.style.transition = "";
        writeModal(node);
        return;
      }
      const frame = window.requestAnimationFrame(() => {
        node.style.transition = "";
        writeModal(node);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    if (!ease) {
      release(node);
      return;
    }

    const dock = node.parentElement?.getBoundingClientRect();
    if (!dock || dock.width <= 0 || reduce) {
      release(node);
      return;
    }
    node.style.transition = "";
    writeBox(node, dock);
    const done = (event: TransitionEvent) => {
      if (event.target !== node || event.propertyName !== "width") return;
      release(node);
    };
    node.addEventListener("transitionend", done);
    return () => node.removeEventListener("transitionend", done);
  }, [presenting, ease]);

  return (
    <div
      ref={stageRef}
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
          canEdit={canEdit}
          onPresentationSaved={onPresentationSaved}
        />
      </article>
    </div>
  );
}
