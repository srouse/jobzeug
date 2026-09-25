"use client";

import { useEffect, useState, type ReactNode } from "react";
import { JzIcon, JzIconButton, JzText } from "@jobzeug/design-system/react";
import type {
  ResumeEmployerGroup,
  ResumeProject,
  ResumeViewModel,
} from "@/lib/contentful/resume-model";
import { EvidencePageHeader } from "@/components/evidence-page-header";
import { AttachGutterRow } from "@/components/attach-gutter-row";
import { useIdleScrollbar } from "@/lib/use-idle-scrollbar";
import { useResumeChat } from "../resume-chat-context";
import { useResumeHighlights } from "../resume-highlight-context";
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
  color,
  label,
  className,
  selected,
}: {
  active: boolean;
  dimmed?: boolean;
  variant: string;
  level?: number;
  color?: string;
  label: string;
  className?: string;
  selected?: boolean;
}) {
  return (
    <JzText
      level={level}
      variant={variant}
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
  focused,
  headClass,
  gutter,
  interactive,
  pressed,
  onActivate,
  children,
}: {
  id: string;
  skeleton: boolean;
  cited?: boolean;
  focused: boolean;
  headClass: string;
  /** Prompt stage: reserve left page-pad column for checkbox. */
  gutter?: boolean;
  /** Ask-context attach. */
  interactive?: boolean;
  pressed?: boolean;
  onActivate?: () => void;
  children: ReactNode;
}) {
  const canActivate = Boolean(interactive && onActivate && !skeleton);
  const showGutter = Boolean(gutter);
  return (
    <div
      className={classNames(styles.shell, skeleton && styles.isSkeleton)}
      data-skeleton={skeleton || undefined}
    >
      <div className={styles.inner}>
        <AttachGutterRow
          gutter={showGutter}
          checked={pressed}
          onToggle={canActivate ? onActivate : undefined}
          label="Add to question context"
          contentId={id}
          contentClassName={classNames(
            styles.content,
            headClass,
            focused && styles.cited,
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
  onOpenDesign,
}: {
  resume: ResumeViewModel | null;
  loading?: boolean;
  error?: string | null;
  onOpenDesign?: () => void;
}) {
  const {
    highlightedIds,
    focusedIds,
    density,
    setDensity,
    askContextItems,
    toggleAskContext,
  } = useResumeHighlights();
  const { canAttachContext } = useResumeChat();
  const { ref: scrollRef, scrolling } = useIdleScrollbar();
  const [colorMode, setColorMode] = useState<ColorMode>("light");
  const name = resume?.name ?? DEFAULT_NAME;
  const rollActive = density === "rolled" && focusedIds.size > 0;
  const attachedIds = new Set(askContextItems.map((item) => item.id));
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

  const toggleDensity = () => {
    setDensity(density === "rolled" ? "full" : "rolled");
  };

  const evidenceActivate = (evidenceId: string, attach: () => void) => {
    if (!canAttachContext) {
      return {
        interactive: false as const,
        onActivate: undefined,
        pressed: false,
      };
    }
    return {
      interactive: true as const,
      onActivate: attach,
      pressed: attachedIds.has(evidenceId),
    };
  };

  return (
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
                  ? "Density: rolled up. Click for full."
                  : "Density: full. Click to roll up."
              }
              icon={density === "rolled" ? "EyeClosed" : "Eye"}
              title={density === "rolled" ? "Rolled up" : "Full"}
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
        data-attach-gutter={canAttachContext || undefined}
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
            className={classNames(
              styles.stack,
              rollActive && styles.stackRolled,
            )}
          >
            {resume.employers.map(
              (employer: ResumeEmployerGroup, employerIndex) => {
                const employerCited = highlightedIds.has(employer.evidenceId);
                const employerFocused = focusedIds.has(employer.evidenceId);
                const employerSkeleton = rollActive && !employerFocused;
                const employerAttached = attachedIds.has(employer.evidenceId);
                const employerActivate = evidenceActivate(
                  employer.evidenceId,
                  () =>
                    toggleAskContext({
                      id: employer.evidenceId,
                      source: "resume",
                      text: employer.name,
                    }),
                );

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
                      skeleton={employerSkeleton}
                      cited={employerCited}
                      focused={employerFocused}
                      headClass={styles.employerHead}
                      gutter={canAttachContext}
                      interactive={employerActivate.interactive}
                      pressed={employerActivate.pressed}
                      onActivate={employerActivate.onActivate}
                    >
                      <div className={styles.employerTitleRow}>
                        <CitedTitle
                          active={employerFocused}
                          level={2}
                          variant="heading"
                          label={employer.name}
                          className={styles.employerTitle}
                          selected={employerAttached}
                        />
                      </div>
                    </EvidenceShell>

                    <div className={styles.roles}>
                      {employer.roles.map((role, roleIndex) => {
                        const roleCited = highlightedIds.has(role.roleId);
                        const roleFocused = focusedIds.has(role.roleId);
                        const roleSkeleton = rollActive && !roleFocused;
                        const roleAttached = attachedIds.has(role.roleId);
                        const roleActivate = evidenceActivate(
                          role.roleId,
                          () =>
                            toggleAskContext({
                              id: role.roleId,
                              source: "resume",
                              text: role.title,
                            }),
                        );

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
                              skeleton={roleSkeleton}
                              cited={roleCited}
                              focused={roleFocused}
                              headClass={styles.roleBlock}
                              gutter={canAttachContext}
                              interactive={roleActivate.interactive}
                              pressed={roleActivate.pressed}
                              onActivate={roleActivate.onActivate}
                            >
                              <div className={styles.roleHead}>
                                <CitedTitle
                                  active={roleFocused}
                                  level={3}
                                  variant="subtitle"
                                  label={role.title}
                                  selected={roleAttached}
                                />
                                <JzText
                                  variant="caption"
                                  color={roleFocused ? "primary" : "muted"}
                                  label={role.dateLabel}
                                />
                              </div>
                              {roleFocused &&
                              (role.summary || role.highlights.length > 0) ? (
                                <div className={styles.roleDetails}>
                                  {role.summary ? (
                                    <JzText
                                      variant="body-regular"
                                      color={
                                        roleFocused ? "primary" : "default"
                                      }
                                      label={role.summary}
                                    />
                                  ) : null}
                                  {role.highlights.length > 0 ? (
                                    <ul className={styles.roleHighlights}>
                                      {role.highlights.map((highlight) => (
                                        <li
                                          key={highlight}
                                          className={styles.roleHighlight}
                                        >
                                          <JzText
                                            variant="caption"
                                            color={
                                              roleFocused
                                                ? "primary"
                                                : "muted"
                                            }
                                            label={highlight}
                                          />
                                        </li>
                                      ))}
                                    </ul>
                                  ) : null}
                                </div>
                              ) : null}
                            </EvidenceShell>

                            <ProjectLine
                              projects={role.projects}
                              highlightedIds={highlightedIds}
                              focusedIds={focusedIds}
                              rollActive={rollActive}
                              canAttachContext={canAttachContext}
                              attachedIds={attachedIds}
                              toggleAskContext={toggleAskContext}
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
  );
}

function ProjectLine({
  projects,
  highlightedIds,
  focusedIds,
  rollActive,
  canAttachContext,
  attachedIds,
  toggleAskContext,
}: {
  projects: ResumeProject[];
  highlightedIds: Set<string>;
  focusedIds: Set<string>;
  rollActive: boolean;
  canAttachContext: boolean;
  attachedIds: Set<string>;
  toggleAskContext: ReturnType<
    typeof useResumeHighlights
  >["toggleAskContext"];
}) {
  if (projects.length === 0) return null;

  return (
    <div className={styles.projects}>
      {!rollActive ? (
        <div
          className={classNames(
            styles.projectsLabel,
            canAttachContext && styles.attachGutterIndent,
          )}
        >
          <JzText variant="overline" color="muted" label="Projects" />
        </div>
      ) : null}
      <div className={styles.projectStack}>
        {projects.map((project) => {
          const cited = highlightedIds.has(project.evidenceId);
          const focused = focusedIds.has(project.evidenceId);
          const skeleton = rollActive && !focused;
          const attached = attachedIds.has(project.evidenceId);
          const interactive = canAttachContext;
          const onActivate = canAttachContext
            ? () =>
                toggleAskContext({
                  id: project.evidenceId,
                  source: "resume",
                  text: project.name,
                })
            : undefined;
          return (
            <EvidenceShell
              key={project.evidenceId}
              id={project.evidenceId}
              skeleton={skeleton}
              cited={cited}
              focused={focused}
              headClass={styles.projectName}
              gutter={canAttachContext}
              interactive={interactive}
              pressed={attached}
              onActivate={onActivate}
            >
              <CitedTitle
                active={focused}
                level={4}
                variant="label"
                color="muted"
                label={project.name}
                selected={attached}
              />
              {focused && project.summary ? (
                <JzText
                  variant="caption"
                  color="primary"
                  label={project.summary}
                  className={styles.projectSummary}
                />
              ) : null}
            </EvidenceShell>
          );
        })}
      </div>
    </div>
  );
}
