"use client";

import { useLayoutEffect, useState } from "react";
import { JzIcon, JzText } from "@jobzeug/design-system/react";
import type {
  ResumeEmployerGroup,
  ResumeProject,
  ResumeRole,
} from "@/lib/contentful/resume-model";
import { useIdleScrollbar } from "@/lib/use-idle-scrollbar";

import { sameProjectId } from "./project-presentation/project-presentation";
import type { SimpleProject } from "./rank-projects";
import { useWatchedProjects } from "./watched-projects";
import styles from "./middle-projects.module.css";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type RowProject = {
  id: string;
  name: string;
  employer: string;
  hasVideo: boolean;
};

type ProjectGroup = {
  id: string;
  name: string;
  dateLabel: string;
  projects: RowProject[];
};

function formatMonthYear(iso: string): string {
  const [year, month] = iso.split("-");
  const label = MONTHS[Number(month) - 1];
  if (!label || !year) return "";
  return `${label} ${year}`;
}

/** Earliest role start through the latest end. An open role ends at Present. */
function companyDateLabel(roles: readonly ResumeRole[]): string {
  if (roles.length === 0) return "";
  let earliest = roles[0].startDate;
  let latestEnd: string | null = null;
  let open = false;
  for (const role of roles) {
    if (role.startDate < earliest) earliest = role.startDate;
    if (!role.endDate) open = true;
    else if (!latestEnd || role.endDate > latestEnd) latestEnd = role.endDate;
  }
  const start = formatMonthYear(earliest);
  if (!start) return "";
  if (open) return `${start} – Present`;
  const end = latestEnd ? formatMonthYear(latestEnd) : "";
  return end ? `${start} – ${end}` : start;
}

/** Newest role first, then that role's project order. Each project once. */
function companyProjects(roles: readonly ResumeRole[]): ResumeProject[] {
  const seen = new Set<string>();
  const projects: ResumeProject[] = [];
  for (const role of roles) {
    for (const project of role.projects) {
      if (seen.has(project.evidenceId)) continue;
      seen.add(project.evidenceId);
      projects.push(project);
    }
  }
  return projects;
}

function groupsFromEmployers(
  employers: readonly ResumeEmployerGroup[],
): ProjectGroup[] {
  return employers
    .map((employer) => ({
      id: employer.evidenceId,
      name: employer.name,
      dateLabel: companyDateLabel(employer.roles),
      projects: companyProjects(employer.roles).map((project) => ({
        id: project.evidenceId,
        name: project.name,
        employer: employer.name,
        hasVideo: Boolean(project.presentation?.videoUrl),
      })),
    }))
    .filter((group) => group.projects.length > 0);
}

function isSelected(stageProjectId: string | null, projectId: string): boolean {
  return stageProjectId != null && sameProjectId(stageProjectId, projectId);
}

function isConnected(
  topThree: readonly SimpleProject[],
  projectId: string,
): boolean {
  return topThree.some((project) => sameProjectId(project.id, projectId));
}

/**
 * Every project, in resume order.
 * Compact rows sit under employer headers until the job posting is open
 * and a job line is selected. Then the top three open into cards and the
 * rest collapse to thin bars. Closing the posting, or clearing the line,
 * returns the compact list. The line stays selected while the posting is
 * closed, so opening it again can animate back.
 */
export function MiddleProjects({
  matched,
  topThree,
  employers,
  stageProjectId,
  onOpenProject,
}: {
  matched: boolean;
  topThree: readonly SimpleProject[];
  employers: readonly ResumeEmployerGroup[];
  stageProjectId: string | null;
  onOpenProject: (projectId: string | null) => void;
}) {
  const { scrollProps } = useIdleScrollbar();
  const { isWatched } = useWatchedProjects();
  const groups = groupsFromEmployers(employers);
  const [shownMatched, setShownMatched] = useState(matched);
  if (matched && !shownMatched) {
    setShownMatched(true);
  }
  const compact = !shownMatched;

  useLayoutEffect(() => {
    if (matched || !shownMatched) return;

    const el = document.querySelector<HTMLElement>("[data-resume2-scroll]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || el.scrollTop <= 1 || reduce) {
      if (el && reduce) el.scrollTop = 0;
      const frame = window.requestAnimationFrame(() => setShownMatched(false));
      return () => window.cancelAnimationFrame(frame);
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener("scrollend", finish);
      window.clearTimeout(timer);
      setShownMatched(false);
    };
    el.addEventListener("scrollend", finish);
    const timer = window.setTimeout(finish, 800);
    el.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      done = true;
      el.removeEventListener("scrollend", finish);
      window.clearTimeout(timer);
      el.scrollTo({ top: el.scrollTop, behavior: "instant" });
    };
  }, [matched, shownMatched]);

  return (
    <div
      className={styles.middle}
      data-browse={compact ? "" : undefined}
      data-match={shownMatched ? "" : undefined}
      data-resume2-scroll
      {...scrollProps}
    >
      <div className={styles.list} role="list" aria-label="Projects" data-resume2-list>
        {groups.map((group) => (
          <div key={group.id} className={styles.group} data-resume2-group="">
            <div
              className={styles.employer}
              aria-hidden={compact ? undefined : true}
            >
              <div className={styles.employerInner}>
                <div className={styles.employerText} data-resume2-employer="">
                  <JzText
                    variant="body-regular"
                    color="muted"
                    label={group.name}
                  />
                  {group.dateLabel ? (
                    <JzText
                      variant="caption"
                      color="muted"
                      label={group.dateLabel}
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <div className={styles.projectList}>
              {group.projects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  compact={compact}
                  interactive
                  open={shownMatched && isConnected(topThree, project.id)}
                  selected={isSelected(stageProjectId, project.id)}
                  connected={isConnected(topThree, project.id)}
                  watched={isWatched(project.id)}
                  onOpenProject={onOpenProject}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectRow({
  project,
  compact,
  interactive,
  open,
  selected,
  connected,
  watched,
  onOpenProject,
}: {
  project: RowProject;
  compact: boolean;
  interactive: boolean;
  open: boolean;
  selected: boolean;
  connected: boolean;
  watched: boolean;
  onOpenProject: (projectId: string | null) => void;
}) {
  return (
    <div
      className={styles.slot}
      role="listitem"
      aria-hidden={interactive ? undefined : true}
      data-open={open ? "" : undefined}
    >
      <button
        type="button"
        className={styles.row}
        data-selected={selected ? "" : undefined}
        data-connected={connected ? "" : undefined}
        data-watched={watched ? "" : undefined}
        data-resume2-card={project.id}
        aria-pressed={selected}
        disabled={!interactive}
        onClick={() => onOpenProject(selected ? null : project.id)}
      >
        <span className={styles.copy} aria-hidden={compact || undefined}>
          <span className={styles.employerName}>{project.employer}</span>
          <span className={styles.title}>{project.name}</span>
        </span>
        <span className={styles.listLine} aria-hidden={compact ? undefined : true}>
          <span className={styles.listTitle}>{project.name}</span>
          {project.hasVideo ? (
            <span
              className={styles.videoMark}
              title="Video"
              role="img"
              aria-label="Has a video"
            />
          ) : null}
        </span>
        {watched ? (
          <span
            className={styles.seen}
            role="img"
            aria-label="Watched"
            aria-hidden={!compact && !open ? true : undefined}
          >
            <JzIcon icon="Check" size="small" aria-hidden />
          </span>
        ) : null}
      </button>
    </div>
  );
}
