"use client";

import type { CSSProperties, ReactNode } from "react";
import { JzText } from "@jobzeug/design-system/react";
import { CAREER_TIMELINE_ENABLED } from "./enabled";
import {
  careerTimelineScale,
  type CareerTimelineEmployer,
  type CareerTimelineSelection,
} from "./scale";
import styles from "./career-timeline.module.css";

function YearLabel({
  year,
  className,
  style,
}: {
  year: number;
  className: string;
  style?: CSSProperties;
}) {
  return (
    <span className={className} style={style}>
      <JzText variant="caption" color="muted" label={String(year)} />
    </span>
  );
}

export function CareerTimeline({
  employers,
  selectedProjects = [],
  children,
}: {
  employers?: readonly CareerTimelineEmployer[];
  /** Projects in the current selection, with highlight strength. */
  selectedProjects?: readonly CareerTimelineSelection[];
  children: ReactNode;
}) {
  if (!CAREER_TIMELINE_ENABLED) return children;

  const scale = careerTimelineScale(employers ?? [], new Date(), selectedProjects);
  const top = scale?.labels.find((label) => label.edge === "top");
  const bottom = scale?.labels.find((label) => label.edge === "bottom");
  const middle = scale?.labels.filter((label) => label.edge === "middle") ?? [];

  return (
    <div className={styles.sheet}>
      <aside className={styles.column} aria-label="Career timeline">
        {top ? <YearLabel year={top.year} className={styles.edgeLabel} /> : null}
        <div className={styles.track}>
          {middle.map((label) => (
            <YearLabel
              key={label.year}
              year={label.year}
              className={styles.yearLabel}
              style={{ top: `${label.offset * 100}%` }}
            />
          ))}
          <span className={styles.notch} style={{ top: 0 }} aria-hidden />
          {(scale?.segments ?? []).map((segment) => (
            <span
              key={segment.roleId}
              className={styles.notch}
              style={{ top: `${(segment.top + segment.height) * 100}%` }}
              title={segment.tooltip}
              aria-label={segment.tooltip}
            />
          ))}
          {(scale?.marks ?? []).map((mark) => (
            <span
              key={mark.projectId}
              className={styles.mark}
              data-selected={mark.selected ?? undefined}
              style={{ top: `${mark.offset * 100}%` }}
              title={mark.name}
              aria-label={mark.name}
            >
              <span className={styles.dot} aria-hidden />
              {mark.selected ? (
                <span
                  className={styles.ball}
                  data-strength={mark.selected}
                  aria-hidden
                />
              ) : null}
            </span>
          ))}
        </div>
        {bottom ? <YearLabel year={bottom.year} className={styles.edgeLabel} /> : null}
      </aside>
      <div className={styles.page}>{children}</div>
    </div>
  );
}
