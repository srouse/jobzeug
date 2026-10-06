"use client";

import { useState } from "react";
import { JzText } from "@jobzeug/design-system/react";

import styles from "./top-projects.module.css";

export type TopProjectItem = {
  id: string;
  name: string;
  required: number;
  preferred: number;
  /** Unweighted score. */
  score?: number;
  /** Score after recency. */
  weighted?: number;
};

export type TopConnectionRow = {
  id: string;
  name: string;
  stats: readonly [string, string];
  score?: number;
  weighted?: number;
};

function formatRankScore(value: number) {
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(2).replace(/0$/, "");
}

function formatScoreLabel(raw: number, weighted?: number) {
  const shown = formatRankScore(raw);
  if (weighted == null) return shown;
  return `${shown} · age-adjusted ${formatRankScore(weighted)}`;
}

function ConnectionRows({
  rows,
  onSelect,
}: {
  rows: readonly TopConnectionRow[];
  onSelect: (id: string) => void;
}) {
  return (
    <ul className={styles.list}>
      {rows.map((row) => (
        <li key={row.id}>
          <button
            type="button"
            className={styles.row}
            onClick={() => onSelect(row.id)}
          >
            <JzText
              variant="body-default"
              label={row.name}
              className={styles.name}
            />
            <span className={styles.trailing}>
              <span className={styles.stats}>
                <JzText
                  variant="label-sm"
                  weight="300"
                  color="tertiary"
                  label={row.stats[0]}
                />
                <JzText
                  variant="label-sm"
                  weight="300"
                  color="tertiary"
                  label={row.stats[1]}
                />
              </span>
              {row.score != null ? (
                <JzText
                  variant="label-sm"
                  weight="300"
                  color="tertiary"
                  label={formatScoreLabel(row.score, row.weighted)}
                  className={styles.score}
                />
              ) : null}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Shared title-and-rows shell. Project and job-line lists both render through this. */
export function TopConnectionList({
  label,
  rows,
  onSelect,
  previewCount,
}: {
  label: string;
  rows: readonly TopConnectionRow[];
  onSelect: (id: string) => void;
  /** Rows after this stay folded until opened. Omit to show every row. */
  previewCount?: number;
}) {
  const [open, setOpen] = useState(false);
  if (rows.length === 0) return null;

  const limit = previewCount ?? rows.length;
  const preview = rows.slice(0, limit);
  const rest = rows.slice(limit);
  const folded = rest.length > 0;

  return (
    <div className={styles.root}>
      <JzText
        variant="overline"
        color="muted"
        label={label}
        className={styles.title}
      />
      {preview.length > 0 ? (
        <ConnectionRows rows={preview} onSelect={onSelect} />
      ) : null}
      {folded ? (
        <div className={styles.more} data-open={open ? "" : undefined}>
          <div className={styles.moreInner}>
            <ConnectionRows rows={rest} onSelect={onSelect} />
          </div>
        </div>
      ) : null}
      {folded ? (
        <span className={styles.fold}>
          <button
            type="button"
            className={styles.foldControl}
            onClick={() => setOpen(true)}
          >
            <JzText
              variant="label-sm"
              weight="300"
              color="tertiary"
              label={
                open
                  ? `${rows.length} total`
                  : `${rows.length} total - more`
              }
            />
          </button>
          {open ? (
            <button
              type="button"
              className={styles.foldControl}
              onClick={() => setOpen(false)}
            >
              <JzText
                variant="label-sm"
                weight="300"
                color="tertiary"
                label="Less"
              />
            </button>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}

/** Project rows with required and preferred hit counts. */
export function TopProjects({
  projects,
  onSelect,
  label = "TOP PROJECTS",
  previewCount,
}: {
  projects: TopProjectItem[];
  onSelect: (projectId: string) => void;
  label?: string;
  /** Projects after this stay folded until opened. */
  previewCount?: number;
}) {
  return (
    <TopConnectionList
      label={label}
      onSelect={onSelect}
      previewCount={previewCount}
      rows={projects.map((project) => ({
        id: project.id,
        name: project.name,
        stats: [
          `${project.required} Required`,
          `${project.preferred} Preferred`,
        ],
        score: project.score,
        weighted: project.weighted,
      }))}
    />
  );
}
