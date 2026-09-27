"use client";

import { useMemo, useState, type ReactNode } from "react";
import { JzButton, JzIcon, JzIconButton, JzInput, JzTag, JzText } from "@jobzeug/design-system/react";
import type { JobPostingPanelData } from "@/lib/job-posting/schema";
import { EvidencePageHeader } from "@/components/evidence-page-header";
import { AttachGutterRow } from "@/components/attach-gutter-row";
import { Modal } from "@/components/modal";
import { PostingMarkdown } from "../posting-markdown/posting-markdown";
import { useResumeChat, useResumeHighlights } from "@/components/resume";
import { useActiveConnectionTarget } from "@/components/resume/use-connection-target";
import type { ConnectionStrength } from "@/lib/connection-targets";
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
  const { askContextItems, toggleAskContext, lineFocus, selectLine, density } =
    useResumeHighlights();
  const connection = useActiveConnectionTarget();
  const strengthById = useMemo(() => {
    const map = new Map<string, ConnectionStrength>();
    for (const endpoint of connection?.ids ?? []) {
      map.set(endpoint.id, endpoint.strength);
    }
    return map;
  }, [connection]);
  const hideUnlinked = density === "rolled" && strengthById.size > 0;
  const { canAttachContext } = useResumeChat();
  const attachedIds = new Set(askContextItems.map((item) => item.id));
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
    <div className={styles.details}>
      <div className={styles.shell}>
        <div className={styles.inner}>
          <div className={styles.content}>
            {metaItems.length > 0 ? (
              <ul className={styles.meta}>
                {metaItems.map((item) => (
                  <li key={item.label} className={styles.metaItem}>
                    <JzText
                      variant="overline"
                      weight="300"
                      color="muted"
                      label={item.label}
                      className={styles.metaLabel}
                    />
                    <JzText
                      variant="label"
                      weight="300"
                      color="muted"
                      title={item.value}
                      className={styles.metaValue}
                    >
                      <span className={styles.metaValueText}>{item.value}</span>
                    </JzText>
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

            <div className={styles.fullPostingRow}>
              <JzIconButton
                label="Full posting"
                icon="book-open-text"
                title="Full posting"
                onClick={onOpenFull}
              />
              {data.sourceUrl ? (
                <JzButton
                  variant="secondary"
                  size="small"
                  label="Posting"
                  icon="ArrowSquareOut"
                  title={data.sourceUrl}
                  onClick={() => {
                    window.open(data.sourceUrl, "_blank", "noopener,noreferrer");
                  }}
                />
              ) : null}
            </div>
        </div>
      </div>

      {SECTION_ORDER.map(({ id, label }) => {
        const lines = data.lines.filter(
          (line) =>
            line.section === id &&
            (!hideUnlinked || strengthById.has(line.entryId)),
        );
        if (!lines.length) return null;
        return (
          <section key={id} className={styles.section}>
            <div className={styles.shell}>
              <div className={styles.inner}>
                <div
                  className={classNames(
                    styles.content,
                    styles.sectionLabelIndent,
                  )}
                >
                  <JzText
                    level={2}
                    variant="heading2"
                    weight="200"
                    label={label}
                    className={styles.sectionLabel}
                  />
                </div>
              </div>
            </div>
            <ul className={styles.lines}>
              {lines.map((line) => {
                const strength = strengthById.get(line.entryId) ?? null;
                const selected =
                  lineFocus?.kind === "jobLine" &&
                  lineFocus.id === line.entryId;
                return (
                  <li key={line.entryId} className={styles.shell}>
                    <div className={styles.inner}>
                      <AttachGutterRow
                        checked={selected}
                        onToggle={() =>
                          selectLine({ kind: "jobLine", id: line.entryId })
                        }
                        label="Select job line"
                        contentId={line.entryId}
                        contentClassName={classNames(
                          styles.content,
                          styles.line,
                          strength === "primary" && styles.lineCited,
                          strength === "secondary" && styles.lineDimmed,
                        )}
                      >
                        <JzText
                          variant="caption"
                          color={strength === "primary" ? "primary" : "muted"}
                          label={line.theme}
                          className={styles.theme}
                        />
                        <JzText
                          variant="body-regular"
                          color={
                            strength === "primary"
                              ? "primary"
                              : strength === "secondary"
                                ? "muted"
                                : undefined
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
        <div className={styles.sectionLabelIndent}>
          <JzText
            level={2}
            variant="heading2"
            weight="200"
            label="Tools"
            className={styles.sectionLabel}
          />
        </div>
        <ul className={styles.tools}>
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
      <div className={styles.bindRow}>
        <JzInput
          className={styles.urlInput}
          value={url}
          aria-label="Job listing URL"
          onInput={(event: Event) => {
            if (busy) return;
            const host = event.currentTarget as HTMLElement & {
              value?: string;
            };
            setUrl(typeof host.value === "string" ? host.value : "");
          }}
          onKeyDown={(e: KeyboardEvent) => {
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
        <JzInput
          className={styles.urlInput}
          value={entryId}
          aria-label="Contentful entry id"
          onInput={(event: Event) => {
            if (busy) return;
            const host = event.currentTarget as HTMLElement & {
              value?: string;
            };
            setEntryId(typeof host.value === "string" ? host.value : "");
          }}
          onKeyDown={(e: KeyboardEvent) => {
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
        data-scrolling={scrolling || undefined}
      >
        <DetailsBody data={data} onOpenFull={() => setFullOpen(true)} />
      </div>
      <Modal open={fullOpen} onOpenChange={setFullOpen} title={modalTitle}>
        {data.fullText?.trim() ? (
          <PostingMarkdown markdown={data.fullText} />
        ) : (
          <JzText
            variant="body-default"
            color="muted"
            label="No full listing text available."
          />
        )}
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
