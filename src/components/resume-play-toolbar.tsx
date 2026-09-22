"use client";

import { JzButton } from "@jobzeug/design-system/react";
import {
  useResumeHighlights,
  type ResumeHighlightMode,
} from "@/components/resume-highlight-context";
import styles from "./resume-play-toolbar.module.css";

const modes: { id: ResumeHighlightMode; label: string }[] = [
  { id: "titles", label: "Titles" },
  { id: "rollup", label: "Rollup" },
];

export function ResumePlayToolbar() {
  const { highlightMode, setHighlightMode, clearCitations, highlightedIds } =
    useResumeHighlights();
  const hasCitations = highlightedIds.size > 0;

  return (
    <div className={styles.root}>
      <div className={styles.group} role="group" aria-label="Resume highlight mode">
        {modes.map((mode) => {
          const active = highlightMode === mode.id;
          return (
            <JzButton
              key={mode.id}
              variant={active ? "primary" : "secondary"}
              size="small"
              label={mode.label}
              showIcon={false}
              aria-pressed={active}
              onClick={() => setHighlightMode(mode.id)}
            />
          );
        })}
      </div>
      <JzButton
        variant="secondary"
        size="default"
        label="Clear"
        disabled={!hasCitations}
        showIcon={false}
        onClick={() => {
          if (hasCitations) clearCitations();
        }}
      />
    </div>
  );
}
