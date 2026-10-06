"use client";

import {
  TopConnectionList,
  type TopConnectionRow,
} from "../top-projects/top-projects";

export type TopJobLineItem = {
  id: string;
  name: string;
  projects: number;
  tags: number;
};

function countStat(count: number, singular: string, plural: string) {
  const shown = Number.isInteger(count) ? String(count) : count.toFixed(1);
  return `${shown} ${count === 1 ? singular : plural}`;
}

/** Job-line rows with project and tag counts, on the same list as top projects. */
export function TopJobLines({
  lines,
  onSelect,
  label = "TOP JOB ITEMS",
  previewCount,
}: {
  lines: TopJobLineItem[];
  onSelect: (lineId: string) => void;
  label?: string;
  /** Lines after this stay folded until opened. */
  previewCount?: number;
}) {
  const rows: TopConnectionRow[] = lines.map((line) => ({
    id: line.id,
    name: line.name,
    stats: [
      countStat(line.projects, "Project", "Projects"),
      countStat(line.tags, "Tag", "Tags"),
    ],
  }));

  return (
    <TopConnectionList
      label={label}
      rows={rows}
      onSelect={onSelect}
      previewCount={previewCount}
    />
  );
}
