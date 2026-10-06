"use client";

import { useMemo, type ReactNode } from "react";
import { JzIcon, JzIconButton, JzText } from "@jobzeug/design-system/react";
import type {
  ResumeEmployerGroup,
  ResumeProject,
  ResumeRole,
  ResumeViewModel,
} from "@/lib/contentful/resume-model";
import { EvidencePageHeader } from "@/components/evidence-page-header";
import { AttachGutterRow } from "@/components/attach-gutter-row";
import { CareerTimeline } from "../career-timeline/career-timeline";
import { CAREER_TIMELINE_ENABLED } from "../career-timeline/enabled";
import { useIdleScrollbar } from "@/lib/use-idle-scrollbar";
import { useResumeHighlights } from "../resume-highlight-context";
import { useActiveConnectionTarget } from "../use-connection-target";
import { sameProjectId } from "../project-presentation/project-presentation";
import type { ConnectionStrength } from "@/lib/connection-targets";
import styles from "./resume-document.module.css";

const DEFAULT_NAME = "Scott Rouse";
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

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ") || undefined;
}

function CitedTitle({
  variant,
  level = 0,
  weight,
  color,
  label,
  className,
  children,
}: {
  variant: string;
  level?: number;
  weight?: "200" | "400" | "500" | "600" | "700";
  color?: string;
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <JzText
      level={level}
      variant={variant}
      weight={weight}
      color={color}
      label={label}
      className={className}
    >
      {children}
    </JzText>
  );
}

function EvidenceShell({
  id,
  skeleton,
  strength = null,
  headClass,
  interactive,
  pressed,
  onActivate,
  activateLabel = "Select",
  fitBarsOff = false,
  children,
}: {
  id: string;
  skeleton: boolean;
  strength?: ConnectionStrength | null;
  headClass: string;
  interactive?: boolean;
  pressed?: boolean;
  onActivate?: () => void;
  activateLabel?: string;
  fitBarsOff?: boolean;
  children: ReactNode;
}) {
  const canActivate = Boolean(interactive && onActivate && !skeleton);
  return (
    <div
      className={classNames(styles.shell, skeleton && styles.isSkeleton)}
      data-skeleton={skeleton || undefined}
    >
      <div className={styles.inner}>
        <AttachGutterRow
          checked={pressed}
          washed={Boolean(pressed || strength)}
          onToggle={canActivate ? onActivate : undefined}
          label={activateLabel}
          contentId={id}
          fitBarsOff={fitBarsOff}
          contentClassName={classNames(
            styles.content,
            headClass,
            pressed && styles.subject,
            !pressed && strength === "primary" && styles.cited,
            !pressed && strength === "secondary" && styles.dimmed,
          )}
        >
          {children}
        </AttachGutterRow>
      </div>
    </div>
  );
}

export function ResumeDocument({
  resume,
  loading = false,
  error = null,
}: {
  resume: ResumeViewModel | null;
  loading?: boolean;
  error?: string | null;
}) {
  const {
    density,
    lineFocus,
    stageProjectId,
    selectLine,
    timelineVisible,
    setTimelineVisible,
  } = useResumeHighlights();
  const connection = useActiveConnectionTarget();
  const strengthById = useMemo(() => {
    const map = new Map<string, ConnectionStrength>();
    for (const endpoint of connection?.ids ?? []) {
      map.set(endpoint.id, endpoint.strength);
    }
    return map;
  }, [connection]);
  const referenceIds = useMemo(() => {
    const ids = new Set<string>();
    for (const endpoint of connection?.ids ?? []) {
      if (endpoint.role === "reference") ids.add(endpoint.id);
    }
    return ids;
  }, [connection]);
  const selectedProjects = useMemo(() => {
    const projects: Array<{ id: string; strength: "primary" | "secondary" }> = [];
    for (const endpoint of connection?.ids ?? []) {
      if (endpoint.role === "subject" || endpoint.role === "reference") {
        projects.push({ id: endpoint.id, strength: endpoint.strength });
      }
    }
    return projects;
  }, [connection]);
  const { ref: scrollRef, scrolling } = useIdleScrollbar();
  const name = resume?.name ?? DEFAULT_NAME;

  const hideUnselectedObjects =
    density === "rolled" &&
    lineFocus?.kind === "jobLine" &&
    referenceIds.size > 0;

  return (
    <article className={styles.article}>
      <EvidencePageHeader
        actions={
          CAREER_TIMELINE_ENABLED ? (
            <JzIconButton
              label={
                timelineVisible ? "Hide career timeline" : "Show career timeline"
              }
              icon="Clock"
              title={timelineVisible ? "Hide timeline" : "Show timeline"}
              aria-pressed={timelineVisible}
              onClick={() => setTimelineVisible(!timelineVisible)}
            />
          ) : null
        }
      >
        <JzText
          variant="overline"
          color="muted"
          label="Resume"
          className={styles.eyebrow}
        />
        <JzText
          level={1}
          variant="heading"
          label={name}
          className={styles.name}
        />
      </EvidencePageHeader>

      <CareerTimeline
        employers={resume?.employers}
        selectedProjects={selectedProjects}
        open={timelineVisible}
      >
      <div
        ref={scrollRef}
        className={styles.docBody}
        data-evidence-scroll
        data-scrolling={scrolling || undefined}
      >
        {loading ? (
          <div className={styles.bodyStatus} role="status" aria-live="polite">
            <JzIcon
              icon="CircleNotch"
              weight="regular"
              size="small"
              spin
              aria-hidden
            />
            <JzText variant="caption" color="muted" label="Loading" />
          </div>
        ) : error ? (
          <JzText
            variant="label"
            color="error"
            label={error}
            className={styles.bodyError}
          />
        ) : resume ? (
          <div
            className={styles.stack}
          >
            {resume.employers.map(
              (employer: ResumeEmployerGroup, employerIndex) => {
                const employerStrength = strengthById.get(employer.evidenceId) ?? null;
                const dateLabel = companyDateLabel(employer.roles);

                return (
                  <section
                    key={employer.evidenceId}
                    className={
                      employerIndex > 0
                        ? styles.employerSpaceRoomy
                        : undefined
                    }
                  >
                    <EvidenceShell
                      id={employer.evidenceId}
                      skeleton={false}
                      strength={employerStrength}
                      headClass={styles.employerHead}
                    >
                      <div className={styles.employerTitleRow}>
                        <CitedTitle
                          level={2}
                          variant="body-regular"
                          color="muted"
                          label={employer.name}
                          className={styles.employerTitle}
                        />
                        {dateLabel ? (
                          <JzText
                            variant="caption"
                            color="muted"
                            label={dateLabel}
                          />
                        ) : null}
                      </div>
                    </EvidenceShell>
                    <ProjectLine
                      projects={companyProjects(employer.roles)}
                      strengthById={strengthById}
                      referenceIds={referenceIds}
                      hideUnselectedObjects={hideUnselectedObjects}
                      stageProjectId={stageProjectId}
                      onSelect={(project) =>
                        selectLine({
                          kind: "project",
                          id: project.evidenceId,
                        })
                      }
                    />
                  </section>
                );
              },
            )}
          </div>
        ) : null}
      </div>
      </CareerTimeline>
    </article>
  );
}

function ProjectLine({
  projects,
  strengthById,
  referenceIds,
  hideUnselectedObjects,
  stageProjectId,
  onSelect,
}: {
  projects: ResumeProject[];
  strengthById: Map<string, ConnectionStrength>;
  referenceIds: Set<string>;
  hideUnselectedObjects: boolean;
  stageProjectId: string | null;
  onSelect: (project: ResumeProject) => void;
}) {
  const visible = hideUnselectedObjects
    ? projects.filter((project) => referenceIds.has(project.evidenceId))
    : projects;
  if (visible.length === 0) return null;

  return (
    <div className={styles.projects}>
      <div className={styles.projectStack}>
        {visible.map((project) => {
          const strength = strengthById.get(project.evidenceId) ?? null;
          const selected =
            stageProjectId != null &&
            sameProjectId(stageProjectId, project.evidenceId);
          return (
            <EvidenceShell
              key={project.evidenceId}
              id={project.evidenceId}
              skeleton={false}
              strength={strength}
              headClass={styles.projectName}
              interactive
              pressed={selected}
              onActivate={() => onSelect(project)}
              activateLabel="Select project"
            >
              <CitedTitle
                level={3}
                variant="heading3"
                weight="400"
                className={styles.projectNameText}
              >
                <span className={styles.projectNameLine}>
                  <span className={styles.projectNameClip}>{project.name}</span>
                  {project.presentation?.videoUrl ? (
                    <span
                      className={styles.videoMark}
                      title="Video"
                      role="img"
                      aria-label="Has a video"
                    />
                  ) : null}
                </span>
              </CitedTitle>
            </EvidenceShell>
          );
        })}
      </div>
    </div>
  );
}
