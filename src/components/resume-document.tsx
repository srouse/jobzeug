"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { BookmarkSimple } from "@phosphor-icons/react";
import type {
  ResumeEmployerGroup,
  ResumeProject,
  ResumeRole,
  ResumeViewModel,
} from "@/lib/contentful/resume-model";
import { useResumeHighlights } from "@/components/resume-highlight-context";
import styles from "./resume-document.module.css";

function CitedTitle({
  active,
  weightClass,
  children,
}: {
  active: boolean;
  weightClass?: string;
  children: ReactNode;
}) {
  return (
    <span className={active ? styles.cited : undefined}>
      {active && (
        <BookmarkSimple className={styles.citedIcon} weight="fill" aria-hidden />
      )}
      <span className={weightClass}>{children}</span>
    </span>
  );
}

const STUB_HEIGHT_PX = 14;
const COLLAPSE_MS = 500;

function OverlayCollapse({
  open,
  stub,
  className = "",
  children,
}: {
  open: boolean;
  stub: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${styles.overlay} ${className}`.trim()}
      style={open ? undefined : { minHeight: STUB_HEIGHT_PX }}
    >
      <div
        className={`${styles.stubLayer} ${open ? styles.stubHidden : styles.stubVisible}`}
        style={{ height: STUB_HEIGHT_PX }}
        aria-hidden={open}
      >
        {stub}
      </div>
      <div
        className={`${styles.collapse} ${open ? styles.collapseOpen : styles.collapseClosed}`}
      >
        <div className={styles.collapseClip}>
          <div
            className={`${styles.collapseBody} ${
              open ? styles.collapseBodyOpen : styles.collapseBodyClosed
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function StubBar({ grow }: { grow?: boolean }) {
  return (
    <div
      className={grow ? styles.stubBarGrow : styles.stubBarFull}
      aria-hidden
    />
  );
}

function EmployerStub({ name }: { name: string }) {
  return (
    <div className={styles.employerStub}>
      <span className={styles.employerStubLabel}>{name}</span>
      <StubBar grow />
    </div>
  );
}

function RoleStub({ title }: { title: string }) {
  return (
    <div className={styles.employerStub}>
      <span className={styles.employerStubLabel}>{title}</span>
      <StubBar grow />
    </div>
  );
}

function LineStub() {
  return <StubBar />;
}

function roleOnPath(role: ResumeRole, highlightedIds: Set<string>) {
  if (highlightedIds.has(role.roleId)) return true;
  return role.projects.some((project) => highlightedIds.has(project.evidenceId));
}

function employerOnPath(employer: ResumeEmployerGroup, highlightedIds: Set<string>) {
  if (highlightedIds.has(employer.evidenceId)) return true;
  return employer.roles.some((role) => roleOnPath(role, highlightedIds));
}

function stackSpacing(
  index: number,
  expanded: boolean,
  prevExpanded: boolean | undefined,
  tight: string,
  roomy: string,
) {
  if (index === 0) return "";
  if (!expanded && prevExpanded === false) return tight;
  return roomy;
}

export function ResumeDocument({ resume }: { resume: ResumeViewModel }) {
  const { highlightedIds, highlightMode } = useResumeHighlights();
  const lastScrollKey = useRef<string>("");
  const hasCitations = highlightedIds.size > 0;
  const rollup = highlightMode === "rollup" && hasCitations;

  useEffect(() => {
    const ids = [...highlightedIds];
    if (ids.length === 0) {
      lastScrollKey.current = "";
      return;
    }
    const key = ids.slice().sort().join(",");
    if (key === lastScrollKey.current) return;
    lastScrollKey.current = key;

    // Wait for collapse/expand to settle so hash jumps don't fight the animation.
    const timer = window.setTimeout(() => {
      const first = ids.find((id) => document.getElementById(id));
      if (!first) return;
      document.getElementById(first)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, COLLAPSE_MS + 50);

    return () => window.clearTimeout(timer);
  }, [highlightedIds]);

  return (
    <article className={styles.article}>
      <header className={styles.docHeader}>
        <h1 className={styles.name}>{resume.name}</h1>
        <p className={styles.sectionLabel}>Experience</p>
      </header>

      <div className={styles.stack}>
        {resume.employers.map((employer, employerIndex) => {
          const employerCited = highlightedIds.has(employer.evidenceId);
          const employerExpanded = !rollup || employerOnPath(employer, highlightedIds);
          const prevEmployer = resume.employers[employerIndex - 1];
          const prevEmployerExpanded =
            prevEmployer === undefined
              ? undefined
              : !rollup || employerOnPath(prevEmployer, highlightedIds);

          return (
            <section
              key={employer.evidenceId}
              id={employer.evidenceId}
              data-evidence-id={employer.evidenceId}
              className={stackSpacing(
                employerIndex,
                employerExpanded,
                prevEmployerExpanded,
                styles.employerSpaceTight,
                styles.employerSpaceRoomy,
              )}
            >
              <OverlayCollapse
                open={employerExpanded}
                stub={<EmployerStub name={employer.name} />}
              >
                <div className={styles.employerHead}>
                  <h2 className={styles.employerTitle}>
                    <CitedTitle active={employerCited} weightClass={styles.weightSemibold}>
                      {employer.name}
                    </CitedTitle>
                  </h2>
                  {employer.descriptor && (
                    <p className={styles.employerDesc}>{employer.descriptor}</p>
                  )}
                </div>

                <div className={styles.roles}>
                  {employer.roles.map((role, roleIndex) => {
                    const roleCited = highlightedIds.has(role.roleId);
                    const roleExpanded = !rollup || roleOnPath(role, highlightedIds);
                    const prevRole = employer.roles[roleIndex - 1];
                    const prevRoleExpanded =
                      prevRole === undefined
                        ? undefined
                        : !rollup || roleOnPath(prevRole, highlightedIds);

                    return (
                      <OverlayCollapse
                        key={role.roleId}
                        open={roleExpanded}
                        stub={<RoleStub title={role.title} />}
                        className={stackSpacing(
                          roleIndex,
                          roleExpanded,
                          prevRoleExpanded,
                          styles.roleSpaceTight,
                          styles.roleSpaceRoomy,
                        )}
                      >
                        <div id={role.roleId} data-evidence-id={role.roleId}>
                          <div className={styles.roleHead}>
                            <h3 className={styles.roleTitle}>
                              <CitedTitle active={roleCited} weightClass={styles.weightMedium}>
                                {role.title}
                              </CitedTitle>
                            </h3>
                            <p className={styles.roleDate}>{role.dateLabel}</p>
                          </div>

                          {role.summary && (
                            <p className={styles.roleBody}>{role.summary}</p>
                          )}

                          {role.highlights.length > 0 && (
                            <ul className={styles.highlights}>
                              {role.highlights.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          )}

                          {role.projects.length > 0 && (
                            <div className={styles.projects}>
                              <p className={styles.projectsLabel}>Projects</p>
                              <ul className={styles.projectList}>
                                {role.projects.map((project) => (
                                  <ProjectRow
                                    key={project.evidenceId}
                                    project={project}
                                    cited={highlightedIds.has(project.evidenceId)}
                                    rollup={rollup}
                                  />
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </OverlayCollapse>
                    );
                  })}
                </div>
              </OverlayCollapse>
            </section>
          );
        })}
      </div>
    </article>
  );
}

function ProjectRow({
  project,
  cited,
  rollup,
}: {
  project: ResumeProject;
  cited: boolean;
  rollup: boolean;
}) {
  const expanded = !rollup || cited;

  return (
    <li id={project.evidenceId} data-evidence-id={project.evidenceId}>
      <OverlayCollapse open={expanded} stub={<LineStub />}>
        <span className={styles.projectName}>
          <CitedTitle active={cited}>{project.name}</CitedTitle>
        </span>
      </OverlayCollapse>
    </li>
  );
}
