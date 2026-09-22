"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ResumeViewModel } from "@/lib/contentful/resume-model";
import { ResumeChatDock } from "@/components/resume-chat-dock";
import { ResumeDocument } from "@/components/resume-document";
import { ResumeHighlightProvider } from "@/components/resume-highlight-context";
import { ResumePlayToolbar } from "@/components/resume-play-toolbar";
import styles from "./resume.module.css";

export default function ResumePage() {
  const [resume, setResume] = useState<ResumeViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <ResumeHighlightProvider>
      <main className={styles.root}>
        <div className={styles.inner}>
          <div className={styles.nav}>
            <Link href="/" className={styles.back}>
              ← Jobzeug
            </Link>
            <span className={styles.source}>Contentful Delivery</span>
          </div>

          {loading && <p className={styles.loading}>Loading resume…</p>}
          {error && <p className={styles.error}>{error}</p>}

          {resume && <ResumeDocument resume={resume} />}
        </div>
        <ResumePlayToolbar />
        <ResumeChatDock />
      </main>
    </ResumeHighlightProvider>
  );
}
