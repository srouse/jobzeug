"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { JzIcon, JzIconButton, JzText } from "@jobzeug/design-system/react";
import type {
  ResumeEmployerGroup,
  ResumeProject,
  ResumeViewModel,
} from "@/lib/contentful/resume-model";
import { EvidencePageHeader } from "@/components/evidence-page-header";
import { AttachGutterRow } from "@/components/attach-gutter-row";
import { ProjectPresentationModal } from "../project-presentation/project-presentation";
import { useIdleScrollbar } from "@/lib/use-idle-scrollbar";
import {
  useResumeHighlights,
  type LineFocus,
} from "../resume-highlight-context";
import { useActiveConnectionTarget } from "../use-connection-target";
import type { ConnectionStrength } from "@/lib/connection-targets";
import styles from "./resume-document.module.css";

const DEFAULT_NAME = "Scott Rouse";

type ColorMode = "light" | "dark" | "subtle" | "emphasized";

const COLOR_MODES: {
  id: ColorMode;
  label: string;
  icon: string;
}[] = [
  { id: "light", label: "Light", icon: "Sun" },
  { id: "dark", label: "Dark", icon: "Moon" },
  { id: "subtle", label: "Subtle", icon: "DropHalf" },
  { id: "emphasized", label: "Emphasized", icon: "Lightning" },
];

function applyBodyColorMode(mode: ColorMode) {
  if (typeof document === "undefined") return;
  if (mode === "light") {
    document.body.removeAttribute("data-mode");
  } else {
    document.body.setAttribute("data-mode", mode);
  }
}

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ") || undefined;
}

function CitedTitle({
  active,
  dimmed = false,
  variant,
  level = 0,
  weight,
  color,
  label,
  className,
  selected,
}: {
  active: boolean;
  dimmed?: boolean;
  variant: string;
  level?: number;
  weight?: "200" | "400" | "500" | "600" | "700";
  color?: string;
  label: string;
  className?: string;
  selected?: boolean;
}) {
  return (
    <JzText
      level={level}
      variant={variant}
      weight={weight}
      color={
        selected || active ? "primary" : dimmed ? "muted" : color
      }
      label={label}
      className={className}
    />
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
          onToggle={canActivate ? onActivate : undefined}
          label={activateLabel}
          contentId={id}
          contentClassName={classNames(
            styles.content,
            headClass,
            strength === "primary" && styles.cited,
            strength === "secondary" && styles.dimmed,
          )}
        >
          {children}
        </AttachGutterRow>
      </div>
    </div>
  );
}

function presentedProject(
  resume: ResumeViewModel | null,
  projectId: string | null,
): ResumeProject | null {
  if (!resume || !projectId) return null;
  for (const employer of resume.employers) {
    for (const role of employer.roles) {
      const match = role.projects.find(
        (project) =>
          project.presentation &&
          (project.evidenceId === projectId ||
            `jz-${project.evidenceId}` === projectId),
      );
      if (match) return match;
    }
  }
  return null;
}

export function ResumeDocument({
  resume,
  loading = false,
  error = null,
  projectId,
  onProjectIdChange,
  onOpenDesign,
}: {
  resume: ResumeViewModel | null;
  loading?: boolean;
  error?: string | null;
  projectId: string | null;
  onProjectIdChange: (projectId: string | null) => void;
  onOpenDesign?: () => void;
}) {
  const { density, setDensity, lineFocus, selectLine } = useResumeHighlights();
  const connection = useActiveConnectionTarget();
  const strengthById = useMemo(() => {
    const map = new Map<string, ConnectionStrength>();
    for (const endpoint of connection?.ids ?? []) {
      map.set(endpoint.id, endpoint.strength);
    }
    return map;
  }, [connection]);
  const { ref: scrollRef, scrolling } = useIdleScrollbar();
  const [colorMode, setColorMode] = useState<ColorMode>("light");
  const playing = presentedProject(resume, projectId);
  const name = resume?.name ?? DEFAULT_NAME;
  const modeMeta =
    COLOR_MODES.find((mode) => mode.id === colorMode) ?? COLOR_MODES[0];

  useEffect(() => {
    applyBodyColorMode(colorMode);
    return () => {
      document.body.removeAttribute("data-mode");
    };
  }, [colorMode]);

  const cycleColorMode = () => {
    const index = COLOR_MODES.findIndex((mode) => mode.id === colorMode);
    const next = COLOR_MODES[(index + 1) % COLOR_MODES.length];
    setColorMode(next.id);
  };

  const linkedOnly = density === "rolled" && strengthById.size > 0;
  const toggleDensity = () => {
    setDensity(density === "rolled" ? "full" : "rolled");
  };

  return (
    <>
    <article className={styles.article}>
      <EvidencePageHeader
        actions={
          <>
            <JzIconButton
              label={`Color mode: ${modeMeta.label}. Click to cycle.`}
              icon={modeMeta.icon}
              title={`Mode: ${modeMeta.label}`}
              onClick={cycleColorMode}
            />
            <JzIconButton
              label={
                density === "rolled"
                  ? "Linked only. Click to show unlinked."
                  : "Showing unlinked. Click to hide them."
              }
              icon={density === "rolled" ? "EyeClosed" : "Eye"}
              title={density === "rolled" ? "Linked only" : "Showing all"}
              aria-pressed={density === "rolled"}
              onClick={toggleDensity}
            />
            {onOpenDesign ? (
              <JzIconButton
                label="Open design"
                icon="Palette"
                title="Design"
                onClick={onOpenDesign}
              />
            ) : null}
          </>
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
          variant="title"
          label={name}
          className={styles.name}
        />
      </EvidencePageHeader>

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
                          active={employerStrength === "primary"}
                          dimmed={employerStrength === "secondary"}
                          level={2}
                          variant="heading2"
                          weight="200"
                          label={employer.name}
                          className={styles.employerTitle}
                          selected={false}
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
                                  active={roleStrength === "primary"}
                                  dimmed={roleStrength === "secondary"}
                                  level={3}
                                  variant="heading3"
                                  label={role.title}
                                  selected={false}
                                />
                                <JzText
                                  variant="caption"
                                  color={
                                    roleStrength === "primary"
                                      ? "primary"
                                      : "muted"
                                  }
                                  label={role.dateLabel}
                                />
                              </div>
                            </EvidenceShell>

                            <ProjectLine
                              projects={role.projects}
                              strengthById={strengthById}
                              hideUnlinked={linkedOnly}
                              lineFocus={lineFocus}
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
    </article>
    <ProjectPresentationModal
      project={playing}
      onClose={() => onProjectIdChange(null)}
    />
    </>
  );
}

function ProjectLine({
  projects,
  strengthById,
  hideUnlinked,
  lineFocus,
  onSelect,
}: {
  projects: ResumeProject[];
  strengthById: Map<string, ConnectionStrength>;
  hideUnlinked: boolean;
  lineFocus: LineFocus | null;
  onSelect: (project: ResumeProject) => void;
}) {
  const visible = hideUnlinked
    ? projects.filter((project) => strengthById.has(project.evidenceId))
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
              onActivate={() => onSelect(project)}
              activateLabel="Select project"
            >
              <div className={styles.projectBody}>
                <div className={styles.projectTitleRow}>
                  <JzIcon
                    icon="Circle"
                    weight="fill"
                    size="small"
                    inheritColor
                    aria-hidden
                    className={classNames(
                      styles.projectBullet,
                      strength === "primary" && styles.projectBulletFocused,
                      strength === "secondary" && styles.projectBulletSecondary,
                    )}
                  />
                  <CitedTitle
                    active={strength === "primary"}
                    dimmed={strength === "secondary"}
                    level={4}
                    variant="label"
                    color="muted"
                    label={project.name}
                    selected={selected}
                  />
                </div>
              </div>
            </EvidenceShell>
          );
        })}
      </div>
    </div>
  );
}
