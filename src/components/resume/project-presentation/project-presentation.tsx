"use client";

import { useEffect, useRef } from "react";
import { Modal } from "@/components/modal";
import type { ResumeProject } from "@/lib/contentful/resume-model";
import styles from "./project-presentation.module.css";

export function ProjectPresentationModal({
  project,
  onClose,
}: {
  project: ResumeProject | null;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const presentation = project?.presentation;
  const open = Boolean(project && presentation);

  useEffect(() => {
    if (!open) return;
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => {
      /* Controls stay available when the browser blocks autoplay. */
    });
  }, [open, presentation?.videoUrl]);

  if (!project || !presentation) return null;

  return (
    <Modal
      open={open}
      onOpenChange={(next) => { if (!next) onClose(); }}
      title={project.name}
      fit
      fill
    >
      <video
        ref={videoRef}
        className={styles.video}
        src={presentation.videoUrl}
        controls
        autoPlay
        playsInline
      />
    </Modal>
  );
}
