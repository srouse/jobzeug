"use client";

import { useEffect, useState } from "react";
import type { ResumeViewModel } from "@/lib/contentful/resume-model";
import {
  JobPostingPanel,
  JobPostingProvider,
  useJobPosting,
} from "@/components/job-posting";
import { EvidenceConnectors } from "@/components/evidence-connectors";
import { ResumeAnswerStage } from "@/components/resume-answer-stage";
import { ResumeChatDock } from "@/components/resume-chat-dock";
import { ResumeDocument } from "@/components/resume-document";
import { ResumeHighlightProvider } from "@/components/resume-highlight-context";
import { ResumePlayToolbar } from "@/components/resume-play-toolbar";
import { JzIcon, JzText } from "@jobzeug/design-system/react";
import styles from "./resume.module.css";

function ResumePageBody() {
  const [resume, setResume] = useState<ResumeViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const { data: jobPosting, busy } = useJobPosting();
  const bound = Boolean(jobPosting) || busy;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/resume");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
        if (!cancelled) setResume(data as ResumeViewModel);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load resume");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // App shell: lock document scroll and drop the reserved scrollbar gutter.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevGutter = html.style.scrollbarGutter;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.scrollbarGutter = "auto";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.scrollbarGutter = prevGutter;
    };
  }, []);

  return (
    <main className={styles.root}>
      <div className={styles.workspace}>
        <div
          className={
            bound ? `${styles.inner} ${styles.innerBound}` : styles.inner
          }
        >
          <div className={styles.resumeColumn}>
            {loading && (
              <div
                className={styles.loading}
                role="status"
                aria-live="polite"
              >
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
                  label="Loading resume…"
                />
              </div>
            )}
            {error && (
              <JzText
                variant="label"
                color="error"
                label={error}
                className={styles.error}
              />
            )}
            {resume && <ResumeDocument resume={resume} />}
          </div>
          <JobPostingPanel />
        </div>
      </div>
      <EvidenceConnectors />
      <ResumeAnswerStage />
      <ResumePlayToolbar
        chatOpen={chatOpen}
        onToggleChat={() => setChatOpen((value) => !value)}
      />
      <ResumeChatDock open={chatOpen} onOpenChange={setChatOpen} />
    </main>
  );
}

export default function ResumePage() {
  return (
    <ResumeHighlightProvider>
      <JobPostingProvider>
        <ResumePageBody />
      </JobPostingProvider>
    </ResumeHighlightProvider>
  );
}
