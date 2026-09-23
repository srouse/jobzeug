"use client";

import { JzText } from "@jobzeug/design-system/react";
import type {
  ResumeEmployerGroup,
  ResumeProject,
  ResumeViewModel,
} from "@/lib/contentful/resume-model";
import { useResumeHighlights } from "@/components/resume-highlight-context";
import styles from "./resume-document.module.css";

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ") || undefined;
}

function CitedTitle({
  active,
  variant,
  level = 0,
  color,
  label,
}: {
  active: boolean;
  variant: string;
  level?: number;
  color?: string;
  label: string;
}) {
  return (
    <JzText
      level={level}
      variant={variant}
      color={active ? "primary" : color}
      label={label}
    />
  );
}

export function ResumeDocument({ resume }: { resume: ResumeViewModel }) {
  const { highlightedIds } = useResumeHighlights();

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
          variant="label"
          label={resume.name}
          className={styles.name}
        />
      </header>

      <div className={styles.docBody} data-evidence-scroll>
        <div className={styles.stack}>
          {resume.employers.map((employer: ResumeEmployerGroup, employerIndex) => {
            const employerCited = highlightedIds.has(employer.evidenceId);

            return (
              <section
                key={employer.evidenceId}
                className={
                  employerIndex > 0 ? styles.employerSpaceRoomy : undefined
                }
              >
                {/* Title row only — not the whole employer section */}
                <div
                  id={employer.evidenceId}
                  data-evidence-id={employer.evidenceId}
                  className={classNames(
                    styles.employerHead,
                    employerCited && styles.cited,
                  )}
                >
                  <CitedTitle
                    active={employerCited}
                    level={2}
                    variant="body-strong"
                    label={employer.name}
                  />
                </div>

                <div className={styles.roles}>
                  {employer.roles.map((role, roleIndex) => {
                    const roleCited = highlightedIds.has(role.roleId);

                    return (
                      <div
                        key={role.roleId}
                        className={
                          roleIndex > 0 ? styles.roleSpaceRoomy : undefined
                        }
                      >
                        {/* Title row (title + date) — not projects below */}
                        <div
                          id={role.roleId}
                          data-evidence-id={role.roleId}
                          className={classNames(
                            styles.roleHead,
                            roleCited && styles.cited,
                          )}
                        >
                          <CitedTitle
                            active={roleCited}
                            level={3}
                            variant="label"
                            label={role.title}
                          />
                          <JzText
                            variant="caption"
                            color="muted"
                            label={role.dateLabel}
                          />
                        </div>

                        <ProjectLine
                          projects={role.projects}
                          highlightedIds={highlightedIds}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function ProjectLine({
  projects,
  highlightedIds,
}: {
  projects: ResumeProject[];
  highlightedIds: Set<string>;
}) {
  if (projects.length === 0) return null;

  return (
    <div className={styles.projects}>
      <JzText
        variant="overline"
        color="muted"
        label="Projects"
        className={styles.projectsLabel}
      />
      <div className={styles.projectStack}>
        {projects.map((project) => {
          const cited = highlightedIds.has(project.evidenceId);
          return (
            <div
              key={project.evidenceId}
              id={project.evidenceId}
              data-evidence-id={project.evidenceId}
              className={classNames(styles.projectName, cited && styles.cited)}
            >
              <CitedTitle
                active={cited}
                variant="caption"
                color="muted"
                label={project.name}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
