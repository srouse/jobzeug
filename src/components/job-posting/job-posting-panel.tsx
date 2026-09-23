"use client";

import { useState } from "react";
import { JzButton, JzIcon, JzTag, JzText } from "@jobzeug/design-system/react";
import type { JobPostingPanelData } from "@/lib/job-posting/schema";
import { Modal } from "@/components/modal";
import { useResumeHighlights } from "@/components/resume-highlight-context";
import { useJobPosting } from "./job-posting-context";
import styles from "./job-posting-panel.module.css";

const SECTION_ORDER = [
  { id: "responsibility" as const, label: "Responsibilities" },
  { id: "required" as const, label: "Required" },
  { id: "preferred" as const, label: "Preferred" },
];

function DetailsBody({ data }: { data: JobPostingPanelData }) {
  const { highlightedIds } = useResumeHighlights();
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
    <>
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

      {data.summary ? (
        <JzText
          variant="body-default"
          label={data.summary}
          className={styles.summary}
        />
      ) : null}

      {SECTION_ORDER.map(({ id, label }) => {
        const lines = data.lines.filter((line) => line.section === id);
        if (!lines.length) return null;
        return (
          <section key={id} className={styles.section}>
            <JzText
              level={3}
              variant="overline"
              color="muted"
              label={label}
              className={styles.sectionLabel}
            />
            <ul className={styles.lines}>
              {lines.map((line) => {
                const cited = highlightedIds.has(line.entryId);
                return (
                  <li
                    key={line.entryId}
                    id={line.entryId}
                    data-evidence-id={line.entryId}
                    className={
                      cited ? `${styles.line} ${styles.lineCited}` : styles.line
                    }
                  >
                    <JzText
                      variant="caption"
                      color={cited ? "primary" : "muted"}
                      label={line.theme}
                      className={styles.theme}
                    />
                    <JzText
                      variant="body-regular"
                      color={cited ? "primary" : undefined}
                      label={line.text}
                      className={styles.lineText}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section className={styles.section}>
        <JzText
          level={3}
          variant="overline"
          color="muted"
          label="Tools"
          className={styles.sectionLabel}
        />
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
    </>
  );
}

function ProcessingState({
  status,
  pendingUrl,
}: {
  status: string | null;
  pendingUrl: string | null;
}) {
  return (
    <div className={styles.processing} role="status" aria-live="polite">
      <JzIcon
        icon="CircleNotch"
        weight="regular"
        size="small"
        spin
        aria-hidden
      />
      <JzText
        variant="title"
        label={status ?? "Processing listing…"}
        className={styles.processingTitle}
      />
      {pendingUrl ? (
        <JzText
          variant="caption"
          color="muted"
          label={pendingUrl}
          title={pendingUrl}
          className={styles.processingUrl}
        />
      ) : null}
      <JzText
        variant="caption"
        color="muted"
        label="Scrape → structure → Contentful. This can take a bit."
        className={styles.processingHint}
      />
    </div>
  );
}

function BoundPanel({ data }: { data: JobPostingPanelData }) {
  const [fullOpen, setFullOpen] = useState(false);
  const modalTitle = data.company
    ? `${data.company} — ${data.title}`
    : data.title;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <JzText
            variant="overline"
            color="muted"
            label="Job posting"
            className={styles.eyebrow}
          />
          <div className={styles.titleRow}>
            <JzText
              level={2}
              variant="label"
              label={data.title}
              className={styles.title}
            />
            {data.company ? (
              <JzText
                variant="label"
                color="muted"
                label={`· ${data.company}`}
                className={styles.company}
              />
            ) : null}
          </div>
        </div>
        <div className={styles.headerActions}>
          <JzButton
            variant="secondary"
            size="small"
            label="Full posting"
            showIcon={false}
            onClick={() => setFullOpen(true)}
          />
        </div>
      </header>
      <div className={styles.body} data-evidence-scroll>
        <DetailsBody data={data} />
      </div>
      <Modal open={fullOpen} onOpenChange={setFullOpen} title={modalTitle}>
        <pre className={styles.fullText}>
          {data.fullText?.trim() || "No full listing text available."}
        </pre>
      </Modal>
    </>
  );
}

/** Bound Job Posting sheet, or a processing placeholder while ingest runs. */
export function JobPostingPanel() {
  const { data, busy, status, pendingUrl } = useJobPosting();

  if (busy && !data) {
    return (
      <aside className={styles.panel} aria-label="Job posting">
        <JzText
          variant="overline"
          color="muted"
          label="Job posting"
          className={styles.eyebrow}
        />
        <ProcessingState status={status} pendingUrl={pendingUrl} />
      </aside>
    );
  }

  if (!data) return null;

  return (
    <aside className={styles.panel} aria-label="Job posting">
      <BoundPanel data={data} />
    </aside>
  );
}
