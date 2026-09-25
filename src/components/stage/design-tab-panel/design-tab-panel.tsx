"use client";

import { useState } from "react";
import { JzButton, JzText } from "@jobzeug/design-system/react";

import { useDesignSession } from "../design-session-context";
import {
  ALLOWED_FONT_FAMILIES,
  DEFAULT_SESSION_TOKEN_KNOBS,
  type SessionTokenKnobs,
} from "@/design/session-tokens";

import styles from "./design-tab-panel.module.css";

function knobsAreDefault(knobs: SessionTokenKnobs): boolean {
  return (Object.keys(DEFAULT_SESSION_TOKEN_KNOBS) as Array<
    keyof SessionTokenKnobs
  >).every((key) => knobs[key] === DEFAULT_SESSION_TOKEN_KNOBS[key]);
}

function isKnobOverridden(
  knobs: SessionTokenKnobs,
  key: keyof SessionTokenKnobs,
): boolean {
  const current = knobs[key];
  const baseline = DEFAULT_SESSION_TOKEN_KNOBS[key];
  if (current.startsWith("#") && baseline.startsWith("#")) {
    return current.toLowerCase() !== baseline.toLowerCase();
  }
  return current !== baseline;
}

function fieldClass(
  base: string,
  overridden: boolean,
): string {
  return overridden ? `${base} ${styles.fieldOverridden}` : base;
}

const COLOR_FIELDS: Array<{
  key: keyof SessionTokenKnobs;
  label: string;
}> = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "neutral", label: "Neutral" },
  { key: "neutralWarmth", label: "Neutral warmth" },
];

const WEIGHTS = ["300", "400", "500", "600", "700", "800"] as const;

function parsePx(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Design knobs + agent summary + apply/remove/reset.
 * Composer lives in DesignModal.
 */
export function DesignTabPanel() {
  const {
    knobs,
    applied,
    busy,
    summary,
    brandUrl,
    error,
    input,
    patchKnobs,
    reapply,
    remove,
    reset,
  } = useDesignSession();

  const [hexDrafts, setHexDrafts] = useState<Partial<Record<string, string>>>(
    {},
  );

  const canReset =
    applied ||
    Boolean(summary) ||
    Boolean(error) ||
    Boolean(brandUrl) ||
    Boolean(input.trim()) ||
    !knobsAreDefault(knobs);

  const colorOverridden = COLOR_FIELDS.some(({ key }) =>
    isKnobOverridden(knobs, key),
  );
  const spaceOverridden = isKnobOverridden(knobs, "space");
  const typeKeys: Array<keyof SessionTokenKnobs> = [
    "fontFamily",
    "fontSize",
    "typeScale",
    "weightRegular",
    "weightMedium",
    "weightStrong",
    "weightBold",
  ];
  const typeOverridden = typeKeys.some((key) => isKnobOverridden(knobs, key));

  return (
    <div className={styles.panel}>
      <JzText
        variant="label"
        color="muted"
        label="Session tokens"
        className={styles.title}
      />
      <JzText
        variant="caption"
        color="muted"
        label="Edit knobs below to inject the override live, or describe a look in the footer for the design agent. Highlighted fields differ from frozen defaults."
        className={styles.lead}
      />

      <section
        className={fieldClass(styles.section, colorOverridden)}
        aria-label="Colors"
      >
        <div className={styles.sectionHead}>
          <JzText
            variant="label-sm"
            color="muted"
            label="Colors (mid swatches)"
            className={styles.sectionTitle}
          />
          {colorOverridden ? (
            <span className={styles.overrideBadge}>Changed</span>
          ) : null}
        </div>
        <div className={styles.colorGrid}>
          {COLOR_FIELDS.map(({ key, label }) => {
            const hex = knobs[key];
            const overridden = isKnobOverridden(knobs, key);
            return (
              <label
                key={key}
                className={fieldClass(styles.colorField, overridden)}
                title={
                  overridden
                    ? `Overridden (default ${DEFAULT_SESSION_TOKEN_KNOBS[key]})`
                    : undefined
                }
              >
                <span className={styles.fieldLabel}>
                  {label}
                  {overridden ? (
                    <span className={styles.overrideDot} aria-hidden />
                  ) : null}
                </span>
                <span className={styles.colorControls}>
                  <input
                    type="color"
                    className={styles.colorSwatch}
                    value={hex}
                    disabled={busy}
                    aria-label={`${label} color${overridden ? " (overridden)" : ""}`}
                    onChange={(e) => {
                      setHexDrafts((drafts) => {
                        const next = { ...drafts };
                        delete next[key];
                        return next;
                      });
                      patchKnobs({ [key]: e.target.value });
                    }}
                  />
                  <input
                    type="text"
                    className={styles.hexInput}
                    value={hexDrafts[key] ?? hex}
                    disabled={busy}
                    spellCheck={false}
                    aria-label={`${label} hex`}
                    onChange={(e) => {
                      const next = e.target.value.trim();
                      setHexDrafts((drafts) => ({ ...drafts, [key]: next }));
                      if (/^#[0-9a-fA-F]{6}$/.test(next)) {
                        patchKnobs({ [key]: next.toLowerCase() });
                        setHexDrafts((drafts) => {
                          const cleared = { ...drafts };
                          delete cleared[key];
                          return cleared;
                        });
                      }
                    }}
                    onBlur={() => {
                      setHexDrafts((drafts) => {
                        const cleared = { ...drafts };
                        delete cleared[key];
                        return cleared;
                      });
                    }}
                  />
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <section
        className={fieldClass(styles.section, spaceOverridden)}
        aria-label="Space"
      >
        <div className={styles.sectionHead}>
          <JzText
            variant="label-sm"
            color="muted"
            label="Space"
            className={styles.sectionTitle}
          />
          {spaceOverridden ? (
            <span className={styles.overrideBadge}>Changed</span>
          ) : null}
        </div>
        <label
          className={fieldClass(styles.field, spaceOverridden)}
          title={
            spaceOverridden
              ? `Overridden (default ${DEFAULT_SESSION_TOKEN_KNOBS.space})`
              : undefined
          }
        >
          <span className={styles.fieldLabel}>
            Base unit (px)
            {spaceOverridden ? (
              <span className={styles.overrideDot} aria-hidden />
            ) : null}
          </span>
          <input
            type="number"
            className={styles.numberInput}
            min={4}
            max={20}
            step={1}
            value={parsePx(knobs.space)}
            disabled={busy}
            onChange={(e) =>
              patchKnobs({ space: `${e.target.value || "8"}px` })
            }
          />
        </label>
      </section>

      <section
        className={fieldClass(styles.section, typeOverridden)}
        aria-label="Typography"
      >
        <div className={styles.sectionHead}>
          <JzText
            variant="label-sm"
            color="muted"
            label="Typography"
            className={styles.sectionTitle}
          />
          {typeOverridden ? (
            <span className={styles.overrideBadge}>Changed</span>
          ) : null}
        </div>
        <label
          className={fieldClass(
            styles.field,
            isKnobOverridden(knobs, "fontFamily"),
          )}
          title={
            isKnobOverridden(knobs, "fontFamily")
              ? `Overridden (default ${DEFAULT_SESSION_TOKEN_KNOBS.fontFamily})`
              : undefined
          }
        >
          <span className={styles.fieldLabel}>
            Font family
            {isKnobOverridden(knobs, "fontFamily") ? (
              <span className={styles.overrideDot} aria-hidden />
            ) : null}
          </span>
          <select
            className={styles.select}
            value={knobs.fontFamily}
            disabled={busy}
            onChange={(e) => patchKnobs({ fontFamily: e.target.value })}
          >
            {ALLOWED_FONT_FAMILIES.map((family) => (
              <option key={family} value={family}>
                {family}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.fieldRow}>
          <label
            className={fieldClass(
              styles.field,
              isKnobOverridden(knobs, "fontSize"),
            )}
            title={
              isKnobOverridden(knobs, "fontSize")
                ? `Overridden (default ${DEFAULT_SESSION_TOKEN_KNOBS.fontSize})`
                : undefined
            }
          >
            <span className={styles.fieldLabel}>
              Font size (px)
              {isKnobOverridden(knobs, "fontSize") ? (
                <span className={styles.overrideDot} aria-hidden />
              ) : null}
            </span>
            <input
              type="number"
              className={styles.numberInput}
              min={11}
              max={20}
              step={1}
              value={parsePx(knobs.fontSize)}
              disabled={busy}
              onChange={(e) =>
                patchKnobs({ fontSize: `${e.target.value || "14"}px` })
              }
            />
          </label>
          <label
            className={fieldClass(
              styles.field,
              isKnobOverridden(knobs, "typeScale"),
            )}
            title={
              isKnobOverridden(knobs, "typeScale")
                ? `Overridden (default ${DEFAULT_SESSION_TOKEN_KNOBS.typeScale})`
                : undefined
            }
          >
            <span className={styles.fieldLabel}>
              Type scale
              {isKnobOverridden(knobs, "typeScale") ? (
                <span className={styles.overrideDot} aria-hidden />
              ) : null}
            </span>
            <input
              type="number"
              className={styles.numberInput}
              min={0.8}
              max={1.35}
              step={0.05}
              value={Number(knobs.typeScale) || 1}
              disabled={busy}
              onChange={(e) =>
                patchKnobs({ typeScale: e.target.value || "1" })
              }
            />
          </label>
        </div>
        <div className={styles.fieldRow}>
          {(
            [
              ["weightRegular", "Regular"],
              ["weightMedium", "Medium"],
              ["weightStrong", "Strong"],
              ["weightBold", "Bold"],
            ] as const
          ).map(([key, label]) => {
            const overridden = isKnobOverridden(knobs, key);
            return (
              <label
                key={key}
                className={fieldClass(styles.field, overridden)}
                title={
                  overridden
                    ? `Overridden (default ${DEFAULT_SESSION_TOKEN_KNOBS[key]})`
                    : undefined
                }
              >
                <span className={styles.fieldLabel}>
                  {label}
                  {overridden ? (
                    <span className={styles.overrideDot} aria-hidden />
                  ) : null}
                </span>
                <select
                  className={styles.select}
                  value={knobs[key]}
                  disabled={busy}
                  onChange={(e) => patchKnobs({ [key]: e.target.value })}
                >
                  {WEIGHTS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>
      </section>

      {busy ? (
        <JzText
          variant="caption"
          color="muted"
          label="Updating…"
          className={styles.status}
        />
      ) : null}

      {summary ? (
        <div className={styles.summaryBlock} aria-live="polite">
          <JzText
            variant="label-sm"
            color="muted"
            label="Last update"
            className={styles.summaryLabel}
          />
          <JzText
            variant="body-regular"
            color="default"
            label={summary}
            className={styles.summaryText}
          />
          {brandUrl ? (
            <a
              className={styles.brandLink}
              href={brandUrl}
              target="_blank"
              rel="noreferrer"
            >
              {brandUrl}
            </a>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <JzText
          variant="caption"
          color="error"
          label={error}
          className={styles.status}
        />
      ) : null}

      {!busy && !summary && !error ? (
        <JzText
          variant="caption"
          color="muted"
          label={
            applied
              ? "Override active."
              : "Using frozen design-system tokens until you edit or Update."
          }
          className={styles.status}
        />
      ) : null}

      <div className={styles.actions}>
        <JzButton
          variant="inverse"
          size="small"
          label="Re-apply knobs"
          disabled={busy}
          onClick={reapply}
        />
        <JzButton
          variant="inverse"
          size="small"
          label="Remove override"
          disabled={busy || !applied}
          onClick={remove}
        />
        <JzButton
          variant="inverse"
          size="small"
          label="Reset"
          disabled={busy || !canReset}
          onClick={reset}
        />
      </div>
    </div>
  );
}
