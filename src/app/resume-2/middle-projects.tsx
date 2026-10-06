"use client";

import { useIdleScrollbar } from "@/lib/use-idle-scrollbar";

import { sameProjectId } from "./project-presentation/project-presentation";
import type { SimpleProject } from "./rank-projects";
import styles from "./middle-projects.module.css";

function isSelected(stageProjectId: string | null, projectId: string): boolean {
  return stageProjectId != null && sameProjectId(stageProjectId, projectId);
}

/**
 * Every project, in resume order. The top three for the selected job line
 * are open cards wherever they fall. Everything between them is a thin bar.
 * Opening and closing is a height transition on the same row.
 */
export function MiddleProjects({
  lineSelected,
  topThree,
  allProjects,
  stageProjectId,
  onOpenProject,
}: {
  lineSelected: boolean;
  topThree: readonly SimpleProject[];
  allProjects: readonly SimpleProject[];
  stageProjectId: string | null;
  onOpenProject: (projectId: string) => void;
}) {
  const { scrollProps } = useIdleScrollbar();
  const openIds = new Set(topThree.map((project) => project.id));

  return (
    <div className={styles.middle} data-resume2-scroll {...scrollProps}>
      <ul className={styles.list} aria-label="Projects" data-resume2-list>
        {lineSelected
          ? allProjects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                open={openIds.has(project.id)}
                selected={isSelected(stageProjectId, project.id)}
                onOpenProject={onOpenProject}
              />
            ))
          : null}
      </ul>
    </div>
  );
}

function ProjectRow({
  project,
  open,
  selected,
  onOpenProject,
}: {
  project: SimpleProject;
  open: boolean;
  selected: boolean;
  onOpenProject: (projectId: string) => void;
}) {
  return (
    <li className={styles.slot} data-open={open ? "" : undefined}>
      <button
        type="button"
        className={styles.row}
        data-selected={selected ? "" : undefined}
        data-resume2-card={project.id}
        onClick={() => onOpenProject(project.id)}
      >
        <span className={styles.copy}>
          <span className={styles.employer}>{project.employer}</span>
          <span className={styles.title}>{project.name}</span>
        </span>
      </button>
    </li>
  );
}
