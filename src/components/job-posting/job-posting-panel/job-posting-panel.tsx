"use client";

import { useState, type ReactNode } from "react";
import { JzButton, JzIcon, JzIconButton, JzTag, JzText } from "@jobzeug/design-system/react";
import type { JobPostingPanelData } from "@/lib/job-posting/schema";
import { EvidencePageHeader } from "@/components/evidence-page-header";
import { AttachGutterRow } from "@/components/attach-gutter-row";
import { Modal } from "@/components/modal";
import { useResumeChat, useResumeHighlights } from "@/components/resume";
import { useIdleScrollbar } from "@/lib/use-idle-scrollbar";
import { useJobPosting } from "../job-posting-context";
import styles from "./job-posting-panel.module.css";

const SECTION_ORDER = [
  { id: "description" as const, label: "Description" },
  { id: "responsibility" as const, label: "Responsibilities" },
  { id: "required" as const, label: "Required" },
  { id: "preferred" as const, label: "Preferred" },
];

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ") || undefined;
}

function DetailsBody({
  data,
  onOpenFull,
}: {
  data: JobPostingPanelData;
  onOpenFull: () => void;
}) {
  const {
    highlightedIds,
    focusedIds,
    density,
    askContextItems,
    toggleAskContext,
  } = useResumeHighlights();
  const { canAttachContext } = useResumeChat();
  const attachedIds = new Set(askContextItems.map((item) => item.id));
  const rollActive = density === "rolled" && focusedIds.size > 0;
  const summaryId = `${data.entryId}-summary`;
  const summaryActivate = canAttachContext
    ? () =>
        toggleAskContext({
          id: summaryId,
          source: "job",
          text: data.summary ?? "",
        })
    : undefined;
  const metaItems: Array<{ label: string; value: string }> = [];
  if (data.location) metaItems.push({ label: "Location", value: data.location });
  if (data.seniority) metaItems.push({ label: "Seniority", value: data.seniority });
  if (data.employmentType) {
    metaItems.push({ label: "Type", value: data.employmentType });
  }
  if (data.yearsExperienceMin != null) {
    metaItems.push({
      label: "Years",
      value: `${data.yearsExperienceMin}+`,
    });
  }

  return (
    <div
      className={
        rollActive ? `${styles.details} ${styles.detailsRolled}` : styles.details
      }
    >
      {/* Meta / notes / summary / full-posting → one skeleton when rolled. */}
      <div
        className={classNames(
          styles.shell,
          rollActive && styles.isSkeleton,
        )}
        data-skeleton={rollActive || undefined}
      >
        <div className={styles.inner}>
          <div
            className={classNames(
              styles.content,
              canAttachContext && styles.attachGutterIndent,
            )}
          >
            {metaItems.length > 0 ? (
              <ul className={styles.meta}>
                {metaItems.map((item) => (
                  <li key={item.label} className={styles.metaItem}>
                    <JzText
                      variant="overline"
                      color="muted"
                      label={item.label}
                      className={styles.metaLabel}
                    />
                    <JzText
                      variant="label"
                      label={item.value}
                      className={styles.metaValue}
                    />
                  </li>
                ))}
              </ul>
            ) : null}

            {(data.yearsExperienceNote ||
              data.travelNote ||
              data.compensationNote) && (
              <div className={styles.notes}>
                {data.yearsExperienceNote ? (
                  <JzText
                    variant="caption"
                    color="muted"
                    label={data.yearsExperienceNote}
                    className={styles.note}
                  />
                ) : null}
                {data.travelNote ? (
                  <JzText
                    variant="caption"
                    color="muted"
                    label={data.travelNote}
                    className={styles.note}
                  />
                ) : null}
                {data.compensationNote ? (
                  <JzText
                    variant="caption"
                    color="muted"
                    label={data.compensationNote}
                    className={styles.note}
                  />
                ) : null}
              </div>
            )}
          </div>

            {data.summary ? (
              <AttachGutterRow
                gutter={canAttachContext}
                checked={attachedIds.has(summaryId)}
                onToggle={summaryActivate}
                label="Add summary to question context"
                contentId={summaryId}
                contentClassName={styles.summary}
              >
                <JzText
                  variant="body-default"
                  label={data.summary}
                  color={attachedIds.has(summaryId) ? "primary" : undefined}
                />
              </AttachGutterRow>
            ) : null}

            <div
              className={classNames(
                styles.fullPostingRow,
                canAttachContext && styles.attachGutterIndent,
              )}
            >
              <JzButton
                variant="secondary"
                size="small"
                label="Full posting"
                showIcon={false}
                onClick={onOpenFull}
              />
              {data.sourceUrl ? (
                <a
                  className={styles.sourceUrl}
                  href={data.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={data.sourceUrl}
                >
                  {data.sourceUrl}
                </a>
              ) : null}
            </div>
        </div>
      </div>

      {SECTION_ORDER.map(({ id, label }) => {
        const lines = data.lines.filter((line) => line.section === id);
        if (!lines.length) return null;
        const sectionFocused = lines.some((line) =>
          focusedIds.has(line.entryId),
        );
        const sectionSkeleton = rollActive && !sectionFocused;
        return (
          <section key={id} className={styles.section}>
            <div
              className={classNames(
                styles.shell,
                sectionSkeleton && styles.isSkeleton,
              )}
            >
              <div className={styles.inner}>
                <div
                  className={classNames(
                    styles.content,
                    styles.sectionLabelIndent,
                    canAttachContext && styles.attachGutterIndent,
                  )}
                >
                  <JzText
                    level={3}
                    variant="overline"
                    color="muted"
                    label={label}
                    className={styles.sectionLabel}
                  />
                </div>
              </div>
            </div>
            <ul className={styles.lines}>
              {lines.map((line) => {
                const focused = focusedIds.has(line.entryId);
                const skeleton = rollActive && !focused;
                const attached = attachedIds.has(line.entryId);
                const interactive = canAttachContext;
                const onActivate = canAttachContext
                  ? () =>
                      toggleAskContext({
                        id: line.entryId,
                        source: "job",
                        text: line.text,
                      })
                  : undefined;
                return (
                  <li
                    key={line.entryId}
                    className={classNames(
                      styles.shell,
                      skeleton && styles.isSkeleton,
                    )}
                    data-skeleton={skeleton || undefined}
                  >
                    <div className={styles.inner}>
                      <AttachGutterRow
                        gutter={canAttachContext}
                        checked={attached}
                        onToggle={
                          interactive && !skeleton ? onActivate : undefined
                        }
                        label="Add line to question context"
                        contentId={line.entryId}
                        contentClassName={classNames(
                          styles.content,
                          styles.line,
                          focused && styles.lineCited,
                        )}
                      >
                        <JzText
                          variant="caption"
                          color={focused || attached ? "primary" : "muted"}
                          label={line.theme}
                          className={styles.theme}
                        />
                        <JzText
                          variant="body-regular"
                          color={
                            focused || attached ? "primary" : undefined
                          }
                          label={line.text}
                          className={styles.lineText}
                        />
                      </AttachGutterRow>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section className={styles.section}>
        <div
          className={classNames(
            styles.sectionLabelIndent,
            canAttachContext && styles.attachGutterIndent,
          )}
        >
          <JzText
            level={3}
            variant="overline"
            color="muted"
            label="Tools"
            className={styles.sectionLabel}
          />
        </div>
        <ul
          className={classNames(
            styles.tools,
            canAttachContext && styles.attachGutterIndent,
          )}
        >
          {data.tools.map((tool) => (
            <li key={tool.entryId} className={styles.tool}>
              <JzTag
                variant="primary"
                label={`${tool.name} · ${tool.context}`}
              />
            </li>
          ))}
          <li className={styles.tool}>
            <JzTag
              variant="primary"
              label={data.entryId}
              title={data.sourceUrl}
            />
          </li>
        </ul>
      </section>
    </div>
  );
}

function LoadingState() {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <JzIcon
        icon="CircleNotch"
        weight="regular"
        size="small"
        spin
        aria-hidden
      />
      <JzText variant="caption" color="muted" label="Loading job posting" />
    </div>
  );
}

function UnboundBindForm() {
  const { busy, error, bind } = useJobPosting();
  const [url, setUrl] = useState("");
  const [entryId, setEntryId] = useState("");

  const bindUrl = async () => {
    const trimmed = url.trim();
    if (!trimmed || busy) return;
    try {
      await bind({ url: trimmed });
    } catch {
      // error surfaced via context
    }
  };

  const bindEntry = async () => {
    const trimmed = entryId.trim();
    if (!trimmed || busy) return;
    try {
      await bind({ entryId: trimmed });
    } catch {
      // error surfaced via context
    }
  };

  return (
    <div className={styles.bindForm}>
      <JzText
        variant="body-default"
        color="secondary"
        label="Paste a job listing URL to ingest it, or bind an existing Contentful entry id."
        className={styles.bindLead}
      />
      <div className={styles.bindRow}>
        <input
          className={styles.urlInput}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Job listing URL"
          disabled={busy}
          aria-label="Job listing URL"
          onKeyDown={(e) => {
            if (e.key === "Enter") void bindUrl();
          }}
        />
        <JzButton
          variant="primary"
          size="small"
          label="Bind"
          showIcon={false}
          disabled={busy || !url.trim()}
          onClick={() => void bindUrl()}
        />
      </div>
      <div className={styles.bindRow}>
        <input
          className={styles.urlInput}
          type="text"
          value={entryId}
          onChange={(e) => setEntryId(e.target.value)}
          placeholder="Contentful entry id"
          disabled={busy}
          aria-label="Contentful entry id"
          onKeyDown={(e) => {
            if (e.key === "Enter") void bindEntry();
          }}
        />
        <JzButton
          variant="secondary"
          size="small"
          label="Load"
          showIcon={false}
          disabled={busy || !entryId.trim()}
          onClick={() => void bindEntry()}
        />
      </div>
      {error ? (
        <JzText
          variant="caption"
          color="error"
          label={error}
          title={error}
          className={styles.bindError}
        />
      ) : null}
    </div>
  );
}

function BoundPanel({ data }: { data: JobPostingPanelData }) {
  const { busy, unbind } = useJobPosting();
  const { canAttachContext } = useResumeChat();
  const { ref: scrollRef, scrolling } = useIdleScrollbar();
  const [fullOpen, setFullOpen] = useState(false);
  const modalTitle = data.company
    ? `${data.company} — ${data.title}`
    : data.title;

  const clearPosting = async () => {
    if (busy) return;
    try {
      await unbind();
    } catch {
      // error surfaced via context
    }
  };

  return (
    <>
      <EvidencePageHeader
        actions={
          <JzIconButton
            label="Unbind"
            icon="X"
            disabled={busy}
            onClick={() => void clearPosting()}
          />
        }
      >
        <JzText
          variant="overline"
          color="muted"
          label={data.company?.trim() || "Job posting"}
          className={styles.eyebrow}
        />
        <JzText
          level={2}
          variant="title"
          title={data.title}
          className={styles.title}
        >
          <span className={styles.titleText}>{data.title}</span>
        </JzText>
      </EvidencePageHeader>
      <div
        ref={scrollRef}
        className={styles.body}
        data-evidence-scroll
        data-attach-gutter={canAttachContext || undefined}
        data-scrolling={scrolling || undefined}
      >
        <DetailsBody data={data} onOpenFull={() => setFullOpen(true)} />
      </div>
      <Modal open={fullOpen} onOpenChange={setFullOpen} title={modalTitle}>
        <pre className={styles.fullText}>
          {data.fullText?.trim() || "No full listing text available."}
        </pre>
      </Modal>
    </>
  );
}

function PanelChrome({ children }: { children: ReactNode }) {
  const { ref: scrollRef, scrolling } = useIdleScrollbar();
  return (
    <>
      <EvidencePageHeader>
        <JzText
          variant="overline"
          color="muted"
          label="Job posting"
          className={styles.eyebrow}
        />
        <JzText
          level={2}
          variant="title"
          label="No posting bound"
          className={styles.title}
        />
      </EvidencePageHeader>
      <div
        ref={scrollRef}
        className={styles.body}
        data-scrolling={scrolling || undefined}
      >
        {children}
      </div>
    </>
  );
}

/** Persistent right-column Job Posting sheet: unbound bind form, busy, or bound details. */
export function JobPostingPanel() {
  const { data, busy, loading } = useJobPosting();

  return (
    <aside className={styles.panel} aria-label="Job posting">
      {data ? (
        <BoundPanel data={data} />
      ) : busy || loading ? (
        <PanelChrome>
          <LoadingState />
        </PanelChrome>
      ) : (
        <PanelChrome>
          <UnboundBindForm />
        </PanelChrome>
      )}
    </aside>
  );
}
