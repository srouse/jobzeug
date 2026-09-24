"use client";

import type { ReactNode } from "react";
import { JzIcon, JzText } from "@jobzeug/design-system/react";
import type {
  ResumeEmployerGroup,
  ResumeProject,
  ResumeViewModel,
} from "@/lib/contentful/resume-model";
import { useResumeHighlights } from "@/components/resume-highlight-context";
import styles from "./resume-document.module.css";

const DEFAULT_NAME = "Scott Rouse";

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ") || undefined;
}

function CitedTitle({
  active,
  dimmed = false,
  variant,
  level = 0,
  color,
  label,
  className,
}: {
  active: boolean;
  dimmed?: boolean;
  variant: string;
  level?: number;
  color?: string;
  label: string;
  className?: string;
}) {
  return (
    <JzText
      level={level}
      variant={variant}
      color={active ? "primary" : dimmed ? "muted" : color}
      label={label}
      className={className}
    />
  );
}

function EvidenceShell({
  id,
  skeleton,
  cited,
  focused,
  headClass,
  children,
}: {
  id: string;
  skeleton: boolean;
  cited: boolean;
  focused: boolean;
  headClass: string;
  children: ReactNode;
}) {
  return (
    <div
      className={classNames(styles.shell, skeleton && styles.isSkeleton)}
      data-skeleton={skeleton || undefined}
    >
      <div className={styles.inner}>
        <div
          id={id}
          data-evidence-id={id}
          className={classNames(
            styles.content,
            headClass,
            cited && focused && styles.cited,
            cited && !focused && styles.dimmed,
          )}
        >
          {children}
        </div>
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
  const { highlightedIds, focusedIds, density } = useResumeHighlights();
  const name = resume?.name ?? DEFAULT_NAME;
  const rollActive = density === "rolled" && highlightedIds.size > 0;

  return (
    <article className={styles.article}>
      <header className={styles.docHeader}>
        <JzText
          variant="overline"
          color="muted"
          label="Resume"
          className={styles.eyebrow}
        />
        <JzText
          level={1}
          variant="title"
          label={name}
          className={styles.name}
        />
      </header>

      <div className={styles.docBody} data-evidence-scroll>
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
            className={classNames(
              styles.stack,
              rollActive && styles.stackRolled,
            )}
          >
            {resume.employers.map((employer: ResumeEmployerGroup, employerIndex) => {
              const employerCited = highlightedIds.has(employer.evidenceId);
              const employerFocused = focusedIds.has(employer.evidenceId);
              const employerSkeleton = rollActive && !employerCited;

              return (
                <section
                  key={employer.evidenceId}
                  className={
                    employerIndex > 0 ? styles.employerSpaceRoomy : undefined
                  }
                >
                  <EvidenceShell
                    id={employer.evidenceId}
                    skeleton={employerSkeleton}
                    cited={employerCited}
                    focused={employerFocused}
                    headClass={styles.employerHead}
                  >
                    <div className={styles.employerTitleRow}>
                      <CitedTitle
                        active={employerFocused}
                        dimmed={employerCited && !employerFocused}
                        level={2}
                        variant="heading"
                        label={employer.name}
                        className={styles.employerTitle}
                      />
                    </div>
                  </EvidenceShell>

                  <div className={styles.roles}>
                    {employer.roles.map((role, roleIndex) => {
                      const roleCited = highlightedIds.has(role.roleId);
                      const roleFocused = focusedIds.has(role.roleId);
                      const roleSkeleton = rollActive && !roleCited;

                      return (
                        <div
                          key={role.roleId}
                          className={
                            roleIndex > 0 ? styles.roleSpaceRoomy : undefined
                          }
                        >
                          <EvidenceShell
                            id={role.roleId}
                            skeleton={roleSkeleton}
                            cited={roleCited}
                            focused={roleFocused}
                            headClass={styles.roleHead}
                          >
                            <CitedTitle
                              active={roleFocused}
                              dimmed={roleCited && !roleFocused}
                              level={3}
                              variant="subtitle"
                              label={role.title}
                            />
                            <JzText
                              variant="caption"
                              color={
                                roleFocused
                                  ? "primary"
                                  : roleCited
                                    ? "muted"
                                    : "muted"
                              }
                              label={role.dateLabel}
                            />
                          </EvidenceShell>

                          <ProjectLine
                            projects={role.projects}
                            highlightedIds={highlightedIds}
                            focusedIds={focusedIds}
                            rollActive={rollActive}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ProjectLine({
  projects,
  highlightedIds,
  focusedIds,
  rollActive,
}: {
  projects: ResumeProject[];
  highlightedIds: Set<string>;
  focusedIds: Set<string>;
  rollActive: boolean;
}) {
  if (projects.length === 0) return null;

  return (
    <div className={styles.projects}>
      {!rollActive ? (
        <div className={styles.projectsLabel}>
          <JzText variant="overline" color="muted" label="Projects" />
        </div>
      ) : null}
      <div className={styles.projectStack}>
        {projects.map((project) => {
          const cited = highlightedIds.has(project.evidenceId);
          const focused = focusedIds.has(project.evidenceId);
          const skeleton = rollActive && !cited;
          return (
            <EvidenceShell
              key={project.evidenceId}
              id={project.evidenceId}
              skeleton={skeleton}
              cited={cited}
              focused={focused}
              headClass={styles.projectName}
            >
              <CitedTitle
                active={focused}
                dimmed={cited && !focused}
                level={4}
                variant="label"
                color="muted"
                label={project.name}
              />
            </EvidenceShell>
          );
        })}
      </div>
    </div>
  );
}
