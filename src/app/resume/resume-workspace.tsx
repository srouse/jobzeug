"use client";

import { useCallback, useEffect, useState } from "react";
import type { ResumeViewModel } from "@/lib/contentful/resume-model";
import {
  JobPostingPanel,
  JobPostingProvider,
} from "@/components/job-posting";
import { EvidenceConnectors } from "@/components/evidence-connectors";
import { EvidenceFocusScroll } from "@/components/evidence-focus-scroll";
import { ResumeAnswerStage } from "@/components/resume-answer-stage";
import { ResumeChatProvider } from "@/components/resume-chat-context";
import { ResumeChatDock } from "@/components/resume-chat-dock";
import { ResumeDocument } from "@/components/resume-document";
import { ResumeHighlightProvider } from "@/components/resume-highlight-context";
import { ResumePlayToolbar } from "@/components/resume-play-toolbar";
import styles from "./resume.module.css";

const ENTRY_ID_RE = /^[\w-]+$/;

export function normalizeRouteEntryId(
  raw: string | null | undefined,
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return ENTRY_ID_RE.test(trimmed) ? trimmed : null;
}

/** Parse `/resume` or `/resume/{entryId}` from a pathname. */
export function entryIdFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/resume(?:\/([^/]+))?\/?$/);
  if (!match) return null;
  return normalizeRouteEntryId(match[1] ?? null);
}

function ResumePageBody() {
  const [resume, setResume] = useState<ResumeViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

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
        <div className={`${styles.inner} ${styles.innerBound}`}>
          <div className={styles.resumeColumn}>
            <ResumeDocument
              resume={resume}
              loading={loading}
              error={error}
            />
          </div>
          <JobPostingPanel />
        </div>
      </div>
      <EvidenceConnectors />
      <EvidenceFocusScroll />
      <ResumeAnswerStage />
      <ResumePlayToolbar
        chatOpen={chatOpen}
        onToggleChat={() => setChatOpen((value) => !value)}
      />
      <ResumeChatDock open={chatOpen} onOpenChange={setChatOpen} />
    </main>
  );
}

/**
 * Single client shell for `/resume` and `/resume/[entryId]`.
 * Entry id is owned in React state; URL updates via history.pushState so
 * Next does not remount this tree (no resume reload flash).
 */
export function ResumeWorkspace({
  initialEntryId,
}: {
  initialEntryId: string | null;
}) {
  const [entryId, setEntryId] = useState<string | null>(() =>
    normalizeRouteEntryId(initialEntryId),
  );

  useEffect(() => {
    setEntryId(normalizeRouteEntryId(initialEntryId));
  }, [initialEntryId]);

  useEffect(() => {
    const onPopState = () => {
      setEntryId(entryIdFromPathname(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateEntryId = useCallback((next: string | null) => {
    const resolved = normalizeRouteEntryId(next);
    const url = resolved ? `/resume/${resolved}` : "/resume";
    window.history.pushState(null, "", url);
    setEntryId(resolved);
  }, []);

  return (
    <ResumeHighlightProvider>
      <JobPostingProvider entryId={entryId} navigateEntryId={navigateEntryId}>
        <ResumeChatProvider>
          <ResumePageBody />
        </ResumeChatProvider>
      </JobPostingProvider>
    </ResumeHighlightProvider>
  );
}
