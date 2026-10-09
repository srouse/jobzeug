"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ComponentPropsWithoutRef, type MouseEvent } from "react";
import Markdown from "react-markdown";
import { JzButton, JzInput, JzText } from "@jobzeug/design-system/react";

import type { ResumeProject } from "@/lib/contentful/resume-model";

import styles from "./answer-stage.module.css";

export function PresentationEditor({
  project,
  onSaved,
  onEditingChange,
  titleEditRequest = 0,
}: {
  project: ResumeProject;
  onSaved: () => Promise<void>;
  onEditingChange?: (editing: boolean) => void;
  titleEditRequest?: number;
}) {
  const presentation = project.presentation;
  const [name, setName] = useState(project.name);
  const [blurb, setBlurb] = useState(presentation?.blurb ?? "");
  const [metricOneValue, setMetricOneValue] = useState(presentation?.metrics[0]?.value ?? "");
  const [metricOneLabel, setMetricOneLabel] = useState(presentation?.metrics[0]?.label ?? "");
  const [metricTwoValue, setMetricTwoValue] = useState(presentation?.metrics[1]?.value ?? "");
  const [metricTwoLabel, setMetricTwoLabel] = useState(presentation?.metrics[1]?.label ?? "");
  const blurbRef = useRef<HTMLTextAreaElement>(null);
  const titleFieldRef = useRef<HTMLLabelElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const seenTitleEdit = useRef(0);
  const openTitleEdit = useRef<() => void>(() => {});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState(project.evidenceId);
  if (projectId !== project.evidenceId) {
    setProjectId(project.evidenceId);
    setEditing(false);
    setName(project.name);
    setBlurb(presentation?.blurb ?? "");
    setMetricOneValue(presentation?.metrics[0]?.value ?? "");
    setMetricOneLabel(presentation?.metrics[0]?.label ?? "");
    setMetricTwoValue(presentation?.metrics[1]?.value ?? "");
    setMetricTwoLabel(presentation?.metrics[1]?.label ?? "");
    setError(null);
  }

  const fillFromPresentation = () => {
    setName(project.name);
    setBlurb(presentation?.blurb ?? "");
    setMetricOneValue(presentation?.metrics[0]?.value ?? "");
    setMetricOneLabel(presentation?.metrics[0]?.label ?? "");
    setMetricTwoValue(presentation?.metrics[1]?.value ?? "");
    setMetricTwoLabel(presentation?.metrics[1]?.label ?? "");
    setError(null);
  };

  const openEditor = () => {
    fillFromPresentation();
    setEditing(true);
    onEditingChange?.(true);
  };

  const cancel = () => {
    fillFromPresentation();
    setEditing(false);
    onEditingChange?.(false);
  };

  openTitleEdit.current = () => {
    fillFromPresentation();
    setEditing(true);
    onEditingChange?.(true);
    let frames = 0;
    const focusTitle = () => {
      const host = titleFieldRef.current?.querySelector("jz-input");
      const input = host?.shadowRoot?.querySelector("input");
      if (input) {
        input.focus();
        return;
      }
      if (frames >= 8) return;
      frames += 1;
      requestAnimationFrame(focusTitle);
    };
    requestAnimationFrame(focusTitle);
  };

  useEffect(() => {
    if (!titleEditRequest || titleEditRequest === seenTitleEdit.current) return;
    seenTitleEdit.current = titleEditRequest;
    openTitleEdit.current();
  }, [titleEditRequest]);

  useLayoutEffect(() => {
    if (!editing) return;
    const node = blurbRef.current;
    if (!node) return;
    node.style.height = "0px";
    const border = node.offsetHeight - node.clientHeight;
    node.style.height = `${node.scrollHeight + border}px`;
  }, [editing, blurb]);

  const formatBlurb = (kind: "bold" | "italic" | "link") => {
    const field = blurbRef.current;
    const start = field?.selectionStart ?? blurb.length;
    const end = field?.selectionEnd ?? blurb.length;
    const selected = blurb.slice(start, end);
    const inner = selected || (kind === "bold" ? "bold" : kind === "italic" ? "italic" : "link");
    const insert =
      kind === "bold"
        ? `**${inner}**`
        : kind === "italic"
          ? `*${inner}*`
          : `[${inner}](https://)`;
    const next = `${blurb.slice(0, start)}${insert}${blurb.slice(end)}`;
    if (next.length > 600) return;
    const selectFrom = start + (kind === "bold" ? 2 : kind === "italic" ? 1 : inner.length + 3);
    const selectTo = kind === "link" ? selectFrom + "https://".length : selectFrom + inner.length;
    setBlurb(next);
    requestAnimationFrame(() => {
      const node = blurbRef.current;
      if (!node) return;
      node.focus();
      node.setSelectionRange(selectFrom, selectTo);
    });
  };

  const uploadVideo = async (file: File | null) => {
    if (!file || uploading || saving) return;
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("video", file);
      const res = await fetch(
        `/api/contentful/presentations/${encodeURIComponent(project.evidenceId)}`,
        { method: "PUT", body },
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? `Upload failed (${res.status})`);
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not replace the video.");
    } finally {
      setUploading(false);
      if (videoRef.current) videoRef.current.value = "";
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/contentful/presentations/${encodeURIComponent(project.evidenceId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            blurb,
            metricOneValue,
            metricOneLabel,
            metricTwoValue,
            metricTwoLabel,
          }),
        },
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? `Save failed (${res.status})`);
      await onSaved();
      setEditing(false);
      onEditingChange?.(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the presentation.");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div
        className={styles.presentationHit}
        role="button"
        tabIndex={0}
        onClick={(event) => {
          if (isLinkClick(event)) return;
          openEditor();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openEditor();
          }
        }}
      >
        {presentation?.blurb ? <SummaryCopy text={presentation.blurb} /> : null}
        {presentation && presentation.metrics.length > 0 ? (
          <div className={styles.metrics}>
            {presentation.metrics.map((metric) => (
              <div
                key={`${metric.value}-${metric.label}`}
                className={styles.metric}
              >
                <JzText variant="body-strong" label={metric.value} />
                <JzText variant="caption" color="muted" label={metric.label} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      <label ref={titleFieldRef} className={styles.titleField}>
        <span className={styles.titleName}>Title</span>
        <JzInput
          value={name}
          onInput={(event: Event) => {
            if (saving || uploading) return;
            setName(hostValue(event));
          }}
        />
      </label>
      <div className={styles.editorLabel}>
        <div className={styles.toolbar}>
          <JzButton
            label="Bold"
            variant="inverse"
            size="small"
            showIcon={false}
            onMouseDown={(event: Event) => event.preventDefault()}
            onClick={() => formatBlurb("bold")}
          />
          <JzButton
            label="Italic"
            variant="inverse"
            size="small"
            showIcon={false}
            onMouseDown={(event: Event) => event.preventDefault()}
            onClick={() => formatBlurb("italic")}
          />
          <JzButton
            label="Link"
            variant="inverse"
            size="small"
            showIcon={false}
            onMouseDown={(event: Event) => event.preventDefault()}
            onClick={() => formatBlurb("link")}
          />
        </div>
        <textarea
          ref={blurbRef}
          className={styles.blurbInput}
          value={blurb}
          maxLength={600}
          rows={1}
          disabled={saving}
          onChange={(event) => setBlurb(event.target.value)}
        />
      </div>
      <div className={styles.metrics}>
        <MetricFields
          value={metricOneValue}
          label={metricOneLabel}
          disabled={saving}
          onValue={setMetricOneValue}
          onLabel={setMetricOneLabel}
        />
        <MetricFields
          value={metricTwoValue}
          label={metricTwoLabel}
          disabled={saving}
          onValue={setMetricTwoValue}
          onLabel={setMetricTwoLabel}
        />
      </div>
      <div className={styles.editorActions}>
        <div className={styles.uploadControl}>
          <div inert>
            <JzButton
              label={uploading ? "Uploading" : "Upload video"}
              variant="inverse"
              size="small"
              showIcon={false}
            />
          </div>
          <input
            ref={videoRef}
            className={styles.videoFile}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
            aria-label={uploading ? "Uploading" : "Upload video"}
            disabled={uploading || saving}
            onChange={(event) => {
              void uploadVideo(event.target.files?.[0] ?? null);
            }}
          />
        </div>
        <span className={styles.editorActionSpacer} />
        <JzButton
          label="Cancel"
          variant="inverse"
          size="small"
          showIcon={false}
          onClick={() => {
            if (!saving && !uploading) cancel();
          }}
        />
        <JzButton
          label={saving ? "Saving" : "Save"}
          variant="primary"
          size="small"
          showIcon={false}
          onClick={() => {
            if (!saving && !uploading) void save();
          }}
        />
      </div>
      {error ? (
        <JzText variant="label" color="error" label={error} role="alert" />
      ) : null}
    </div>
  );
}

function MetricFields({
  value,
  label,
  disabled,
  onValue,
  onLabel,
}: {
  value: string;
  label: string;
  disabled: boolean;
  onValue: (value: string) => void;
  onLabel: (value: string) => void;
}) {
  return (
    <div className={styles.metric}>
      <JzInput
        value={value}
        onInput={(event: Event) => {
          if (disabled) return;
          onValue(hostValue(event));
        }}
      />
      <JzInput
        value={label}
        onInput={(event: Event) => {
          if (disabled) return;
          onLabel(hostValue(event));
        }}
      />
    </div>
  );
}

function SummaryCopy({ text }: { text: string }) {
  return (
    <Markdown
      components={{
        p: ({ children }: ComponentPropsWithoutRef<"p">) => (
          <JzText variant="body-default">{children}</JzText>
        ),
        strong: ({ children }: ComponentPropsWithoutRef<"strong">) => (
          <JzText variant="body-strong">{children}</JzText>
        ),
        em: ({ children }: ComponentPropsWithoutRef<"em">) => <em>{children}</em>,
        a: ({ href, children }: ComponentPropsWithoutRef<"a">) =>
          href?.startsWith("https://") || href?.startsWith("http://") ? (
            <JzText href={href} target="_blank" variant="body-default">
              {children}
            </JzText>
          ) : (
            <span>{children}</span>
          ),
      }}
    >
      {text}
    </Markdown>
  );
}

function hostValue(event: Event): string {
  const host = event.currentTarget as { value?: string } | null;
  return typeof host?.value === "string" ? host.value : "";
}

function isLinkClick(event: MouseEvent): boolean {
  const target = event.target;
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("a, jz-text[href]"));
}

