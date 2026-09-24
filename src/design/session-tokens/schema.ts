import { z } from "zod";

import {
  ALLOWED_FONT_FAMILIES,
  type AllowedFontFamily,
} from "./fonts";
import {
  DEFAULT_SESSION_TOKEN_KNOBS,
  type SessionTokenKnobs,
} from "./knobs";

const HEX = /^#([0-9a-fA-F]{6})$/;
const PX = /^\d+(\.\d+)?px$/;

/** sRGB relative luminance 0…1 (WCAG). */
export function relativeLuminance(hex: string): number {
  const raw = hex.replace("#", "");
  const channels = [0, 2, 4].map((i) => {
    const c = parseInt(raw.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

function hexToRgb(hex: string): [number, number, number] {
  const raw = hex.replace("#", "");
  return [
    parseInt(raw.slice(0, 2), 16),
    parseInt(raw.slice(2, 4), 16),
    parseInt(raw.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${clamp(r)}${clamp(g)}${clamp(b)}`;
}

function mixRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    a[0]! * (1 - t) + b[0]! * t,
    a[1]! * (1 - t) + b[1]! * t,
    a[2]! * (1 - t) + b[2]! * t,
  ];
}

/**
 * Keep hue; nudge toward white/black until luminance sits in [minL, maxL].
 * Brand sites often hand us near-black navy — we still apply, just mid-scaled.
 */
export function coerceMidToneHex(
  hex: string,
  minL: number,
  maxL: number,
  fallback: string,
): string {
  const normalized = hex.trim().toLowerCase();
  if (!HEX.test(normalized)) return fallback.toLowerCase();

  let l = relativeLuminance(normalized);
  if (l >= minL && l <= maxL) return normalized;

  const rgb = hexToRgb(normalized);
  const toward: [number, number, number] =
    l < minL ? [255, 255, 255] : [0, 0, 0];

  let best = normalized;
  let bestDist = Infinity;
  for (let step = 1; step <= 40; step++) {
    const t = step / 40;
    const mixed = mixRgb(rgb, toward, t);
    const candidate = rgbToHex(mixed[0]!, mixed[1]!, mixed[2]!);
    const nl = relativeLuminance(candidate);
    if (nl >= minL && nl <= maxL) return candidate;
    const mid = (minL + maxL) / 2;
    const dist = Math.abs(nl - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  return best;
}

function coercePx(
  value: unknown,
  min: number,
  max: number,
  fallback: string,
): string {
  const raw = String(value ?? "").trim();
  const match = raw.match(/^(\d+(?:\.\d+)?)(px)?$/i);
  if (!match) return fallback;
  let n = parseFloat(match[1]!);
  if (!Number.isFinite(n)) return fallback;
  n = Math.min(max, Math.max(min, n));
  return `${Math.round(n * 100) / 100}px`;
}

function coerceTypeScale(value: unknown, fallback: string): string {
  const n = Number(String(value ?? "").trim());
  if (!Number.isFinite(n)) return fallback;
  const clamped = Math.min(1.35, Math.max(0.8, n));
  return String(Math.round(clamped * 1000) / 1000);
}

function coerceWeight(value: unknown, fallback: string): string {
  const n = Number(String(value ?? "").trim());
  if (!Number.isFinite(n)) return fallback;
  const stepped = Math.round(n / 100) * 100;
  const clamped = Math.min(800, Math.max(300, stepped));
  return String(clamped);
}

function coerceFontFamily(value: unknown, fallback: string): AllowedFontFamily {
  const raw = String(value ?? "").trim();
  const exact = ALLOWED_FONT_FAMILIES.find(
    (f) => f.toLowerCase() === raw.toLowerCase(),
  );
  if (exact) return exact;

  const lower = raw.toLowerCase();
  const fuzzy = [...ALLOWED_FONT_FAMILIES]
    .filter(
      (f) =>
        lower.includes(f.toLowerCase()) || f.toLowerCase().includes(lower),
    )
    .sort((a, b) => b.length - a.length)[0];
  if (fuzzy && lower.length >= 3) return fuzzy;

  if (
    /(serif|georgia|times|garamond|merriweather|playfair|lora|baskerville)/.test(
      lower,
    )
  ) {
    return "Merriweather";
  }
  if (/(mono|code|consolas|menlo|courier|jetbrains|fira)/.test(lower)) {
    return "JetBrains Mono";
  }
  if (/(script|hand|cursive|pacifico|dancing)/.test(lower)) {
    return "Caveat";
  }
  if (/(inter|helvetica|arial|sans|geist|roboto|system)/.test(lower)) {
    return lower.includes("geist") ? "Geist" : "Inter";
  }
  return (ALLOWED_FONT_FAMILIES.includes(fallback as AllowedFontFamily)
    ? fallback
    : "Geist") as AllowedFontFamily;
}

/**
 * OpenAI structured-output schema — every property must have a plain JSON Schema `type`.
 * Soft mid-tone / range coercion runs in {@link parseSessionTokenKnobs} after the model returns.
 */
export const designTokensAgentKnobsSchema = z.object({
  primary: z
    .string()
    .regex(HEX)
    .describe("Mid brand primary #RRGGBB (≈400–500 lightness)"),
  secondary: z
    .string()
    .regex(HEX)
    .describe("Mid brand secondary #RRGGBB (≈400–500 lightness)"),
  neutral: z
    .string()
    .regex(HEX)
    .describe("Mid gray #RRGGBB (≈400–500 lightness)"),
  neutralWarmth: z
    .string()
    .regex(HEX)
    .describe("Tint mixed into neutrals #RRGGBB"),
  space: z.string().regex(PX).describe("Base space unit, e.g. 8px (4–20)"),
  fontFamily: z
    .string()
    .min(1)
    .describe(
      "Exact font family from google-fonts.md (e.g. Inter, DM Sans, Playfair Display, JetBrains Mono)",
    ),
  fontSize: z.string().regex(PX).describe("Body size, e.g. 14px (11–20)"),
  typeScale: z
    .string()
    .describe("Global type zoom as a number string, e.g. 1 or 1.05 (0.8–1.35)"),
  weightRegular: z.string().describe("Font weight 300–800 step 100"),
  weightMedium: z.string().describe("Font weight 300–800 step 100"),
  weightStrong: z.string().describe("Font weight 300–800 step 100"),
  weightBold: z.string().describe("Font weight 300–800 step 100"),
});

/** Full agent structured response (LLM-facing). */
export const designTokensAgentOutputSchema = z.object({
  knobs: designTokensAgentKnobsSchema,
  summary: z
    .string()
    .min(1)
    .max(240)
    .describe("One short sentence describing what changed"),
});

export type DesignTokensAgentOutput = z.infer<
  typeof designTokensAgentOutputSchema
>;

const COLOR_BOUNDS: Record<
  "primary" | "secondary" | "neutral" | "neutralWarmth",
  [number, number]
> = {
  primary: [0.12, 0.62],
  secondary: [0.12, 0.62],
  neutral: [0.14, 0.55],
  neutralWarmth: [0.1, 0.75],
};

/**
 * Coerce agent/client knobs into a valid SessionTokenKnobs.
 * Never throws on mid-tone / range issues — clamps or falls back to defaults.
 */
export function parseSessionTokenKnobs(value: unknown): SessionTokenKnobs {
  const d = DEFAULT_SESSION_TOKEN_KNOBS;
  const obj =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const pick = (key: keyof SessionTokenKnobs) =>
    obj[key] !== undefined && obj[key] !== null ? obj[key] : d[key];

  const knobs: SessionTokenKnobs = {
    primary: coerceMidToneHex(
      String(pick("primary")),
      ...COLOR_BOUNDS.primary,
      d.primary,
    ),
    secondary: coerceMidToneHex(
      String(pick("secondary")),
      ...COLOR_BOUNDS.secondary,
      d.secondary,
    ),
    neutral: coerceMidToneHex(
      String(pick("neutral")),
      ...COLOR_BOUNDS.neutral,
      d.neutral,
    ),
    neutralWarmth: coerceMidToneHex(
      String(pick("neutralWarmth")),
      ...COLOR_BOUNDS.neutralWarmth,
      d.neutralWarmth,
    ),
    space: coercePx(pick("space"), 4, 20, d.space),
    fontFamily: coerceFontFamily(pick("fontFamily"), d.fontFamily),
    fontSize: coercePx(pick("fontSize"), 11, 20, d.fontSize),
    typeScale: coerceTypeScale(pick("typeScale"), d.typeScale),
    weightRegular: coerceWeight(pick("weightRegular"), d.weightRegular),
    weightMedium: coerceWeight(pick("weightMedium"), d.weightMedium),
    weightStrong: coerceWeight(pick("weightStrong"), d.weightStrong),
    weightBold: coerceWeight(pick("weightBold"), d.weightBold),
  };

  // Ensure non-decreasing weights without failing the request
  let prev = Number(knobs.weightRegular);
  for (const key of [
    "weightMedium",
    "weightStrong",
    "weightBold",
  ] as const) {
    let n = Number(knobs[key]);
    if (n < prev) n = prev;
    knobs[key] = String(n);
    prev = n;
  }

  return knobs;
}

/** @deprecated Prefer parseSessionTokenKnobs — kept for callers expecting a Zod schema. */
export const sessionTokenKnobsSchema = designTokensAgentKnobsSchema;

export type SessionTokenKnobsParsed = SessionTokenKnobs;

/** Merge partial updates onto defaults, then coerce. */
export function mergeAndParseKnobs(
  current: SessionTokenKnobs,
  patch: unknown,
): SessionTokenKnobs {
  const base = { ...DEFAULT_SESSION_TOKEN_KNOBS, ...current };
  if (!patch || typeof patch !== "object") {
    return parseSessionTokenKnobs(base);
  }
  return parseSessionTokenKnobs({ ...base, ...patch });
}

export { ALLOWED_FONT_FAMILIES } from "./fonts";
