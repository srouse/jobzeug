"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JzButton, JzIconButton, JzText } from "@jobzeug/design-system/react";

import type { JobListRow } from "./load";

import styles from "./jobs.module.css";

function totalLabel(value: number | null): string {
  return value == null ? "—" : String(value);
}

export function JobsList({ postings }: { postings: JobListRow[] }) {
  const router = useRouter();
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const visible = postings.filter((posting) => !removed.has(posting.entryId));

  async function deletePosting(posting: JobListRow) {
    const confirmed = window.confirm(
      `Are you sure? This deletes ${posting.company} — ${posting.title} and its job lines and tools.`,
    );
    if (!confirmed) return;

    setPendingId(posting.entryId);
    setErrors((current) => {
      const next = { ...current };
      delete next[posting.entryId];
      return next;
    });
    try {
      const res = await fetch("/api/job-posting", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: posting.entryId }),
      });
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        throw new Error(body?.error || "Failed to delete job posting");
      }
      setRemoved((current) => new Set(current).add(posting.entryId));
      router.refresh();
    } catch (error) {
      setErrors((current) => ({
        ...current,
        [posting.entryId]:
          error instanceof Error ? error.message : "Failed to delete job posting",
      }));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <main className={styles.root}>
      <JzText variant="heading" level={1} label="Job postings" />
      {visible.length === 0 ? (
        <JzText
          variant="body-default"
          color="muted"
          label="No published job postings."
        />
      ) : (
        <ul className={styles.list}>
          {visible.map((posting) => (
            <li key={posting.entryId} className={styles.row}>
              <Link
                className={styles.rowLink}
                href={`/resume/${encodeURIComponent(posting.entryId)}`}
              >
                <span className={styles.identity}>
                  <JzText variant="label" label={posting.title} />
                  <JzText variant="caption" color="muted" label={posting.company} />
                </span>
                <span className={styles.total}>
                  <JzText variant="body-strong" label={totalLabel(posting.total)} />
                </span>
              </Link>
              <div className={styles.links}>
                <JzButton
                  variant="inverse"
                  size="small"
                  showIcon={false}
                  label="Analytics"
                  onClick={() => {
                    window.open(
                      `/analytics?jobPostingEntryId=${encodeURIComponent(posting.entryId)}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                />
                {posting.contentfulUrl ? (
                  <JzButton
                    variant="inverse"
                    size="small"
                    showIcon={false}
                    label="Contentful"
                    onClick={() => {
                      window.open(posting.contentfulUrl, "_blank", "noopener,noreferrer");
                    }}
                  />
                ) : null}
                <JzIconButton
                  label="Delete"
                  icon="X"
                  title="Delete"
                  disabled={pendingId === posting.entryId}
                  onClick={() => void deletePosting(posting)}
                />
              </div>
              {errors[posting.entryId] ? (
                <JzText
                  className={styles.error}
                  variant="caption"
                  color="error"
                  label={errors[posting.entryId]}
                />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
