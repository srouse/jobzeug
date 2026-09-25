"use client";

import { useCallback, useEffect, useState } from "react";
import type { ResumeViewModel } from "@/lib/contentful/resume-model";
import {
  JobPostingPanel,
  JobPostingProvider,
} from "@/components/job-posting";
import {
  EvidenceConnectors,
  LAYOUT_MEDIUM_MIN_PX,
  LAYOUT_WIDE_MIN_PX,
  ResumeChatDock,
  ResumeChatProvider,
  ResumeDocument,
  ResumeHighlightProvider,
  useResumeHighlights,
  type EvidencePage,
} from "@/components/resume";
import { AnswerStage, DesignModal, DesignSessionProvider } from "@/components/stage";
import { JzButton } from "@jobzeug/design-system/react";
import styles from "./resume.module.css";

const ENTRY_ID_RE = /^[\w-]+$/;

const MOBILE_TABS: Array<{ id: EvidencePage; label: string }> = [
  { id: "resume", label: "Resume" },
  { id: "stage", label: "Answer" },
  { id: "job", label: "Job posting" },
];

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
  const { evidencePage, setEvidencePage } = useResumeHighlights();
  const [resume, setResume] = useState<ResumeViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);
  const [wide, setWide] = useState(true);
  const [mobile, setMobile] = useState(false);

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

  useEffect(() => {
    const wideMq = window.matchMedia(`(min-width: ${LAYOUT_WIDE_MIN_PX}px)`);
    const mobileMq = window.matchMedia(
      `(max-width: ${LAYOUT_MEDIUM_MIN_PX - 1}px)`,
    );
    const sync = () => {
      setWide(wideMq.matches);
      setMobile(mobileMq.matches);
    };
    sync();
    wideMq.addEventListener("change", sync);
    mobileMq.addEventListener("change", sync);
    return () => {
      wideMq.removeEventListener("change", sync);
      mobileMq.removeEventListener("change", sync);
    };
  }, []);

  // Medium left-rail only knows resume|job — leave stage if we leave mobile.
  useEffect(() => {
    if (!mobile && evidencePage === "stage") {
      setEvidencePage("resume");
    }
  }, [mobile, evidencePage, setEvidencePage]);

  const resumeActive = wide || evidencePage === "resume";
  const jobActive = wide || evidencePage === "job";
  const stageVisible = !mobile || evidencePage === "stage";
  const pagesVisible = !mobile || evidencePage !== "stage";

  const selectPage = (page: EvidencePage) => {
    setEvidencePage(page);
  };

  return (
    <main
      className={styles.root}
      data-mobile-view={mobile ? evidencePage : undefined}
    >
      <div className={styles.workspace}>
        <div className={`${styles.inner} ${styles.innerBound}`}>
          <div
            className={styles.leftRail}
            hidden={!pagesVisible ? true : undefined}
            inert={!pagesVisible ? true : undefined}
          >
            <div className={styles.paneHost}>
              <div
                className={`${styles.pagePane} ${styles.pagePaneResume}`}
                data-evidence-pane="resume"
                data-evidence-pane-active={resumeActive ? "" : undefined}
                hidden={!resumeActive ? true : undefined}
                inert={!resumeActive ? true : undefined}
              >
                <ResumeDocument
                  resume={resume}
                  loading={loading}
                  error={error}
                  onOpenDesign={() => setDesignOpen(true)}
                />
              </div>
              <div
                className={`${styles.pagePane} ${styles.pagePaneJob}`}
                data-evidence-pane="job"
                data-evidence-pane-active={jobActive ? "" : undefined}
                hidden={!jobActive ? true : undefined}
                inert={!jobActive ? true : undefined}
              >
                <JobPostingPanel />
              </div>
            </div>
            <nav className={styles.pageTabs} aria-label="Evidence pages">
              <button
                type="button"
                className={
                  evidencePage === "resume"
                    ? `${styles.pageTab} ${styles.pageTabSelected}`
                    : styles.pageTab
                }
                aria-pressed={evidencePage === "resume"}
                onClick={() => selectPage("resume")}
              >
                Resume
              </button>
              <button
                type="button"
                className={
                  evidencePage === "job"
                    ? `${styles.pageTab} ${styles.pageTabSelected}`
                    : styles.pageTab
                }
                aria-pressed={evidencePage === "job"}
                onClick={() => selectPage("job")}
              >
                Job posting
              </button>
            </nav>
          </div>
        </div>
      </div>
      <EvidenceConnectors />
      <AnswerStage hidden={!stageVisible} />
      <nav className={styles.mobileTabBar} aria-label="Views">
        {MOBILE_TABS.map((tab) => {
          const selected = evidencePage === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={
                selected
                  ? `${styles.pageTab} ${styles.pageTabSelected}`
                  : styles.pageTab
              }
              aria-pressed={selected}
              onClick={() => selectPage(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
      <DesignModal open={designOpen} onOpenChange={setDesignOpen} />
      <JzButton
        variant={chatOpen ? "secondary" : "primary"}
        size="small"
        label={chatOpen ? "Close chat" : "Chat"}
        showIcon={false}
        className={styles.chatFab}
        onClick={() => setChatOpen((value) => !value)}
        aria-pressed={chatOpen}
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
          <DesignSessionProvider>
            <ResumePageBody />
          </DesignSessionProvider>
        </ResumeChatProvider>
      </JobPostingProvider>
    </ResumeHighlightProvider>
  );
}
