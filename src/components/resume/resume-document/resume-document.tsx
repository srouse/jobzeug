"use client";

import { useMemo, type ReactNode } from "react";
import { JzIcon, JzIconButton, JzText } from "@jobzeug/design-system/react";
import { useJobPosting } from "@/components/job-posting";
import { FitMeter } from "@/components/fit-meter/fit-meter";
import { projectFitBars, type FitBar } from "@/lib/matching/home-coverage";
import type {
  ResumeEmployerGroup,
  ResumeProject,
  ResumeViewModel,
} from "@/lib/contentful/resume-model";
import { EvidencePageHeader } from "@/components/evidence-page-header";
import { AttachGutterRow } from "@/components/attach-gutter-row";
import { CareerTimeline } from "../career-timeline/career-timeline";
import { CAREER_TIMELINE_ENABLED } from "../career-timeline/enabled";
import { useIdleScrollbar } from "@/lib/use-idle-scrollbar";
import {
  useResumeHighlights,
  type LineFocus,
} from "../resume-highlight-context";
import { useActiveConnectionTarget } from "../use-connection-target";
import type { ConnectionStrength } from "@/lib/connection-targets";
import styles from "./resume-document.module.css";

const DEFAULT_NAME = "Scott Rouse";

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
    selectLine,
    fitBarsVisible,
    timelineVisible,
    setTimelineVisible,
  } = useResumeHighlights();
  const { data: posting } = useJobPosting();
  const projectBars = useMemo(() => {
    const ids: string[] = [];
    if (resume) {
      for (const employer of resume.employers) {
        for (const role of employer.roles) {
          for (const project of role.projects) {
            ids.push(project.evidenceId);
          }
        }
      }
    }
    const lineCount = (posting?.lines ?? []).filter(
      (line) => line.matchingRequirement?.scope === "project",
    ).length;
    return projectFitBars(ids, posting?.matchGraph?.edges ?? [], lineCount);
  }, [resume, posting]);
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
                          variant="heading3"
                          weight="200"
                          label={employer.name}
                          className={styles.employerTitle}
                        />
                      </div>
                    </EvidenceShell>

                    <div className={styles.roles}>
                      {employer.roles.map((role, roleIndex) => {
                        const roleStrength = strengthById.get(role.roleId) ?? null;

                        return (
                          <div
                            key={role.roleId}
                            className={
                              roleIndex > 0
                                ? styles.roleSpaceRoomy
                                : undefined
                            }
                          >
                            <EvidenceShell
                              id={role.roleId}
                              skeleton={false}
                              strength={roleStrength}
                              headClass={styles.roleBlock}
                            >
                              <div className={styles.roleHead}>
                                <CitedTitle
                                  level={3}
                                  variant="heading3"
                                  label={role.title}
                                />
                                <JzText
                                  variant="caption"
                                  color="muted"
                                  label={role.dateLabel}
                                />
                              </div>
                            </EvidenceShell>

                            <ProjectLine
                              projects={role.projects}
                              strengthById={strengthById}
                              referenceIds={referenceIds}
                              hideUnselectedObjects={hideUnselectedObjects}
                              lineFocus={lineFocus}
                              projectBars={projectBars}
                              fitBarsVisible={fitBarsVisible}
                              onSelect={(project) =>
                                selectLine({
                                  kind: "project",
                                  id: project.evidenceId,
                                })
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
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
  lineFocus,
  projectBars,
  fitBarsVisible,
  onSelect,
}: {
  projects: ResumeProject[];
  strengthById: Map<string, ConnectionStrength>;
  referenceIds: Set<string>;
  hideUnselectedObjects: boolean;
  lineFocus: LineFocus | null;
  projectBars: Map<string, FitBar>;
  fitBarsVisible: boolean;
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
            lineFocus?.kind === "project" &&
            lineFocus.id === project.evidenceId;
          return (
            <EvidenceShell
              key={project.evidenceId}
              id={project.evidenceId}
              skeleton={false}
              strength={strength}
              headClass={styles.projectName}
              interactive
              pressed={selected}
              fitBarsOff={!fitBarsVisible}
              onActivate={() => onSelect(project)}
              activateLabel="Select project"
            >
              <div className={styles.projectBody}>
                <div className={styles.projectTitle}>
                  <span className={styles.projectNameLine}>
                    <span className={styles.projectMark} aria-hidden />
                    <CitedTitle
                      level={4}
                      variant="label"
                      weight="400"
                      color="muted"
                      className={styles.projectNameText}
                    >
                      <span className={styles.projectNameClip}>{project.name}</span>
                    </CitedTitle>
                    {project.presentation ? (
                      <span
                        className={styles.videoMark}
                        role="img"
                        aria-label="Video"
                      />
                    ) : null}
                  </span>
                  {fitBarsVisible ? (
                    <span className={styles.projectMeter}>
                      <FitMeter
                        width={projectBars.get(project.evidenceId)?.width ?? 0}
                        tone={projectBars.get(project.evidenceId)?.tone ?? null}
                      />
                    </span>
                  ) : null}
                </div>
              </div>
            </EvidenceShell>
          );
        })}
      </div>
    </div>
  );
}
