"use client";

import Link from "next/link";
import { JzText } from "@jobzeug/design-system/react";

import type { JobListRow } from "./load";

import styles from "./jobs.module.css";

function fitLabel(kind: string, value: number | null): string {
  return value == null ? `${kind} —` : `${kind} ${value}%`;
}

export function JobsList({ postings }: { postings: JobListRow[] }) {
  return (
    <main className={styles.root}>
      <JzText variant="heading" level={1} label="Job postings" />
      {postings.length === 0 ? (
        <JzText
          variant="body-default"
          color="muted"
          label="No published job postings."
        />
      ) : (
        <ul className={styles.list}>
          {postings.map((posting) => (
            <li key={posting.entryId} className={styles.row}>
              <div className={styles.identity}>
                <JzText variant="label" label={posting.title} />
                <JzText variant="caption" color="muted" label={posting.company} />
              </div>
              <JzText
                variant="caption"
                color="muted"
                label={`${fitLabel("Project", posting.projectFit)} · ${fitLabel("Line", posting.lineFit)}`}
              />
              <div className={styles.links}>
                <Link
                  href={`/resume/${encodeURIComponent(posting.entryId)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <JzText variant="label" label="Resume" />
                </Link>
                <Link
                  href={`/analytics?jobPostingEntryId=${encodeURIComponent(posting.entryId)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <JzText variant="label" label="Analytics" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
