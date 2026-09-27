"use client";

import { useEffect, useRef } from "react";
import { JzText } from "@jobzeug/design-system/react";
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
      wide
      fit
    >
      <div className={styles.stage}>
        <div className={styles.copy}>
          <JzText variant="body-default" label={presentation.blurb} className={styles.blurb} />
          <div className={styles.metrics}>
            {presentation.metrics.map((metric, index) => (
              <div key={`${metric.label}-${index}`} className={styles.metric}>
                <JzText level={3} variant="title" label={metric.value} />
                <JzText variant="overline" color="muted" label={metric.label} />
              </div>
            ))}
          </div>
        </div>
        <video
          ref={videoRef}
          className={styles.video}
          src={presentation.videoUrl}
          controls
          autoPlay
          playsInline
        />
      </div>
    </Modal>
  );
}
