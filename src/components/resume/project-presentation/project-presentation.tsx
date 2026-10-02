"use client";

import { useEffect, useRef } from "react";
import type {
  ResumeProject,
  ResumeViewModel,
} from "@/lib/contentful/resume-model";
import styles from "./project-presentation.module.css";

export function presentedProject(
  resume: ResumeViewModel | null,
  projectId: string | null,
): ResumeProject | null {
  if (!resume || !projectId) return null;
  for (const employer of resume.employers) {
    for (const role of employer.roles) {
      const match = role.projects.find(
        (project) =>
          project.presentation &&
          (project.evidenceId === projectId ||
            `jz-${project.evidenceId}` === projectId),
      );
      if (match) return match;
    }
  }
  return null;
}

export function sameProjectId(a: string, b: string): boolean {
  return a === b || `jz-${a}` === b || a === `jz-${b}`;
}

/** Walkthrough video. Starts from the beginning when it becomes active. */
export function ProjectVideo({
  project,
  active = true,
}: {
  project: ResumeProject;
  active?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = project.presentation?.videoUrl;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;
    if (!active) {
      video.pause();
      return;
    }
    video.currentTime = 0;
    void video.play().catch(() => {
      /* Controls stay available when the browser blocks autoplay. */
    });
  }, [videoUrl, active]);

  if (!videoUrl) return null;

  return (
    <video
      ref={videoRef}
      className={styles.video}
      src={videoUrl}
      controls
      autoPlay
      playsInline
    />
  );
}
