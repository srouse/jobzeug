"use client";

import { JzButton, JzIconButton, JzText } from "@jobzeug/design-system/react";
import { useJobPosting } from "@/components/job-posting";
import { useResumeHighlights } from "@/components/resume";
import type {
  ResumeProject,
  ResumeViewModel,
} from "@/lib/contentful/resume-model";

import styles from "./answer-stage.module.css";

const SECTION_LABELS: Record<string, string> = {
  description: "Description",
  responsibility: "Responsibilities",
  required: "Required",
  preferred: "Preferred",
};

const IDLE_COPY = "Select a project or a job line.";

function findProject(
  resume: ResumeViewModel | null,
  projectId: string,
): ResumeProject | null {
  if (!resume) return null;
  for (const employer of resume.employers) {
    for (const role of employer.roles) {
      const match = role.projects.find(
        (project) => project.evidenceId === projectId,
      );
      if (match) return match;
    }
  }
  return null;
}

/**
 * Top of the stage. A project or job-line focus fills it.
 * Otherwise one line of copy, and the lines are not aimed here.
 */
export function ConnectionHub({
  resume,
  onViewProject,
}: {
  resume: ResumeViewModel | null;
  onViewProject: (projectId: string) => void;
}) {
  const { lineFocus } = useResumeHighlights();
  const { data } = useJobPosting();

  if (lineFocus?.kind === "project") {
    const project = findProject(resume, lineFocus.id);
    return (
      <div className={styles.hub}>
        <JzText
          level={2}
          variant="heading2"
          label={project?.name ?? "Project"}
        />
        {project?.summary ? (
          <JzText variant="body-default" label={project.summary} />
        ) : null}
        {project && (project.presentation || project.contentfulUrl) ? (
          <div className={styles.hubActions}>
            {project.presentation ? (
              <JzButton
                label="View more"
                variant="secondary"
                size="small"
                showIcon={false}
                onClick={() => onViewProject(project.evidenceId)}
              />
            ) : null}
            {project.contentfulUrl ? (
              <JzIconButton
                label={`Open ${project.name} in Contentful`}
                icon="ArrowSquareOut"
                title="Contentful"
                onClick={() => {
                  window.open(project.contentfulUrl, "jobzeug-contentful");
                }}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  if (lineFocus?.kind === "jobLine") {
    const line = data?.lines.find((item) => item.entryId === lineFocus.id);
    const sectionLabel = line
      ? (SECTION_LABELS[line.section] ?? line.section)
      : "Job line";
    return (
      <div className={styles.hub}>
        <JzText level={2} variant="heading2" label={sectionLabel} />
        {line?.text ? (
          <JzText variant="body-default" label={line.text} />
        ) : null}
        {line?.contentfulUrl ? (
          <div className={styles.hubActions}>
            <JzIconButton
              label="Open job line in Contentful"
              icon="ArrowSquareOut"
              title="Contentful"
              onClick={() => {
                window.open(line.contentfulUrl, "jobzeug-contentful");
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.hub}>
      <JzText variant="body-default" color="muted" label={IDLE_COPY} />
    </div>
  );
}
