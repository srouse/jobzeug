"use client";

import { useEffect, useState } from "react";
import { JzButton, JzIcon, JzText } from "@jobzeug/design-system/react";
import { useJobPosting } from "@/components/job-posting";
import styles from "./resume-play-toolbar.module.css";

type ColorMode = "light" | "dark" | "subtle" | "emphasized";

const colorModes: { id: ColorMode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "subtle", label: "Subtle" },
  { id: "emphasized", label: "Emphasized" },
];

function applyBodyColorMode(mode: ColorMode) {
  if (typeof document === "undefined") return;
  if (mode === "light") {
    document.body.removeAttribute("data-mode");
  } else {
    document.body.setAttribute("data-mode", mode);
  }
}

export function ResumePlayToolbar({
  chatOpen,
  onToggleChat,
}: {
  chatOpen: boolean;
  onToggleChat: () => void;
}) {
  const { data, busy, status, error, bind, unbind } = useJobPosting();

  const [url, setUrl] = useState("");
  const [colorMode, setColorMode] = useState<ColorMode>("light");

  useEffect(() => {
    applyBodyColorMode(colorMode);
    return () => {
      document.body.removeAttribute("data-mode");
    };
  }, [colorMode]);

  const bindUrl = async () => {
    const trimmed = url.trim();
    if (!trimmed || busy) return;
    try {
      await bind(trimmed);
    } catch {
      // error surfaced via context
    }
  };

  const clearPosting = async () => {
    if (busy) return;
    try {
      await unbind();
    } catch {
      // error surfaced via context
    }
  };

  return (
    <footer className={styles.root} aria-label="Resume tools">
      <div className={styles.tools}>
        <div className={styles.modeField}>
          <label htmlFor="resume-color-mode" className={styles.modeLabel}>
            <JzText variant="label-sm" color="muted" label="Mode" />
          </label>
          <select
            id="resume-color-mode"
            className={styles.modeSelect}
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value as ColorMode)}
          >
            {colorModes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.divider} aria-hidden />

        <div className={styles.jobPosting} aria-label="Job posting bind">
          <input
            className={styles.urlInput}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Job listing URL"
            disabled={busy}
            onKeyDown={(e) => {
              if (e.key === "Enter") void bindUrl();
            }}
          />
          <JzButton
            variant="primary"
            size="small"
            label={busy ? "Working…" : "Bind"}
            showIcon={false}
            disabled={busy || !url.trim()}
            onClick={() => void bindUrl()}
          />
          {data && !busy ? (
            <JzButton
              variant="secondary"
              size="small"
              label="Unbind"
              showIcon={false}
              disabled={busy}
              onClick={() => void clearPosting()}
            />
          ) : null}
          {busy && status ? (
            <p className={styles.jobStatus} role="status" aria-live="polite">
              <JzIcon
                icon="CircleNotch"
                weight="regular"
                size="small"
                spin
                aria-hidden
              />
              <JzText variant="body-strong" color="secondary" label={status} />
            </p>
          ) : null}
          {data && !busy ? (
            <p className={styles.boundMeta} title={data.entryId}>
              <JzText
                variant="body-strong"
                label={`${data.company ? `${data.company} — ` : ""}${data.title}`}
                className={styles.boundTitle}
              />
              <JzText
                variant="caption"
                color="muted"
                label={data.entryId}
                className={styles.entryId}
              />
            </p>
          ) : null}
          {error ? (
            <JzText
              variant="caption"
              color="error"
              label={error}
              title={error}
              className={styles.jobError}
            />
          ) : null}
        </div>
      </div>

      <div className={styles.chatSlot}>
        <JzButton
          variant={chatOpen ? "secondary" : "primary"}
          size="small"
          label={chatOpen ? "Close chat" : "Chat"}
          showIcon={false}
          onClick={onToggleChat}
          aria-pressed={chatOpen}
        />
      </div>
    </footer>
  );
}
