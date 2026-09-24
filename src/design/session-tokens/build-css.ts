import type { SessionTokenKnobs } from "./knobs";
import {
  DEFAULT_SESSION_TOKEN_KNOBS,
  FIXED_SESSION_COLOR_MIDS,
} from "./knobs";

const SPACE = "var(--jz-session-space)";
const FAMILY = "var(--jz-session-font-family)";
const SIZE = "var(--jz-session-font-size)";
const SCALE = "var(--jz-session-type-scale)";
const W_REG = "var(--jz-session-weight-regular)";
const W_MED = "var(--jz-session-weight-medium)";
const W_STR = "var(--jz-session-weight-strong)";
const W_BLD = "var(--jz-session-weight-bold)";

function colorLadder(family: string, midVar: string): string {
  return `
  --jz-primitive-color-${family}-50: color-mix(in oklab, ${midVar} 28%, black);
  --jz-primitive-color-${family}-100: color-mix(in oklab, ${midVar} 42%, black);
  --jz-primitive-color-${family}-200: color-mix(in oklab, ${midVar} 55%, black);
  --jz-primitive-color-${family}-300: color-mix(in oklab, ${midVar} 72%, black);
  --jz-primitive-color-${family}-400: ${midVar};
  --jz-primitive-color-${family}-500: color-mix(in oklab, ${midVar} 82%, white);
  --jz-primitive-color-${family}-600: color-mix(in oklab, ${midVar} 65%, white);
  --jz-primitive-color-${family}-700: color-mix(in oklab, ${midVar} 48%, white);
  --jz-primitive-color-${family}-800: color-mix(in oklab, ${midVar} 32%, white);
  --jz-primitive-color-${family}-900: color-mix(in oklab, ${midVar} 18%, white);
  --jz-primitive-color-${family}-950: color-mix(in oklab, ${midVar} 10%, white);
`.trim();
}

/**
 * Neutrals must reach true black/white ends (frozen sheet: 50≈#0a0a0a, 950=#ffffff).
 * Chromatic ladders can stop at tinted poles; grays cannot — canvas/text use 950 as white.
 * Mid knob sits at 500 (frozen neutral-500); warmth tints the mid only.
 */
function neutralLadder(): string {
  const mid = "var(--jz-session-neutral-mid)";
  return `
  --jz-session-neutral-mid: color-mix(in oklab, var(--jz-session-neutral) 82%, var(--jz-session-neutral-warmth));

  --jz-primitive-color-neutral-50: color-mix(in oklab, ${mid} 14%, black);
  --jz-primitive-color-neutral-100: color-mix(in oklab, ${mid} 28%, black);
  --jz-primitive-color-neutral-200: color-mix(in oklab, ${mid} 42%, black);
  --jz-primitive-color-neutral-300: color-mix(in oklab, ${mid} 58%, black);
  --jz-primitive-color-neutral-400: color-mix(in oklab, ${mid} 78%, black);
  --jz-primitive-color-neutral-500: ${mid};
  --jz-primitive-color-neutral-600: color-mix(in oklab, ${mid} 72%, white);
  --jz-primitive-color-neutral-700: color-mix(in oklab, ${mid} 48%, white);
  --jz-primitive-color-neutral-800: color-mix(in oklab, ${mid} 28%, white);
  --jz-primitive-color-neutral-900: color-mix(in oklab, ${mid} 12%, white);
  --jz-primitive-color-neutral-950: #ffffff;

  --jz-primitive-color-black: color-mix(in oklab, ${mid} 10%, black);
  --jz-primitive-color-white: #ffffff;
`.trim();
}

function spaceLadder(): string {
  return `
  --jz-primitive-space-025: calc(${SPACE} * 0.25);
  --jz-primitive-space-05: calc(${SPACE} * 0.5);
  --jz-primitive-space-075: calc(${SPACE} * 0.75);
  --jz-primitive-space-1: ${SPACE};
  --jz-primitive-space-2: calc(${SPACE} * 2);
  --jz-primitive-space-3: calc(${SPACE} * 3);
  --jz-primitive-space-4: calc(${SPACE} * 4);
  --jz-primitive-space-5: calc(${SPACE} * 5);
  --jz-primitive-space-6: calc(${SPACE} * 6);
  --jz-primitive-space-7: calc(${SPACE} * 7);
  --jz-primitive-space-8: calc(${SPACE} * 8);
  --jz-primitive-space-9: calc(${SPACE} * 9);
  --jz-primitive-space-10: calc(${SPACE} * 10);
  --jz-primitive-space-11: calc(${SPACE} * 11);
  --jz-primitive-space-12: calc(${SPACE} * 12);

  --jz-semantic-space-gap-2xs: var(--jz-primitive-space-025);
  --jz-semantic-space-gap-xs: var(--jz-primitive-space-05);
  --jz-semantic-space-gap-sm: var(--jz-primitive-space-1);
  --jz-semantic-space-gap-md: var(--jz-primitive-space-2);
  --jz-semantic-space-gap-lg: var(--jz-primitive-space-3);
  --jz-semantic-space-gap-xl: var(--jz-primitive-space-4);
  --jz-semantic-space-gap-2xl: var(--jz-primitive-space-6);
  --jz-semantic-space-gap-3xl: var(--jz-primitive-space-8);

  --jz-semantic-space-padding-2xs: var(--jz-primitive-space-025);
  --jz-semantic-space-padding-xs: var(--jz-primitive-space-05);
  --jz-semantic-space-padding-sm: var(--jz-primitive-space-1);
  --jz-semantic-space-padding-md: var(--jz-primitive-space-2);
  --jz-semantic-space-padding-lg: var(--jz-primitive-space-3);
  --jz-semantic-space-padding-xl: var(--jz-primitive-space-4);
  --jz-semantic-space-padding-2xl: var(--jz-primitive-space-6);

  --jz-semantic-space-icon-sm: var(--jz-primitive-space-2);
  --jz-semantic-space-icon-md: var(--jz-primitive-space-3);
  --jz-semantic-space-icon-lg: var(--jz-primitive-space-4);
`.trim();
}

function sz(ratio: string): string {
  return `calc(${SIZE} * ${SCALE} * ${ratio})`;
}

function typeLadder(): string {
  return `
  --jz-primitive-font-family-sans: ${FAMILY};
  --jz-primitive-font-weight-400: ${W_REG};
  --jz-primitive-font-weight-500: ${W_MED};
  --jz-primitive-font-weight-600: ${W_STR};
  --jz-primitive-font-weight-700: ${W_BLD};
  --jz-primitive-font-size-200: ${sz("0.786")};
  --jz-primitive-font-size-300: ${sz("0.857")};
  --jz-primitive-font-size-400: ${sz("1")};
  --jz-primitive-font-size-500: ${sz("1.143")};
  --jz-primitive-font-size-600: ${sz("1.429")};
  --jz-primitive-font-size-700: ${sz("1.714")};
  --jz-primitive-font-size-800: ${sz("2.143")};
  --jz-primitive-font-size-900: ${sz("2.571")};
  --jz-primitive-font-lineheight-200: ${sz("1")};
  --jz-primitive-font-lineheight-300: ${sz("1.143")};
  --jz-primitive-font-lineheight-400: ${sz("1.429")};
  --jz-primitive-font-lineheight-500: ${sz("1.714")};
  --jz-primitive-font-lineheight-550: ${sz("1.857")};
  --jz-primitive-font-lineheight-600: ${sz("2")};
  --jz-primitive-font-lineheight-700: ${sz("2.286")};
  --jz-primitive-font-lineheight-800: ${sz("2.714")};
  --jz-primitive-font-lineheight-900: ${sz("3.143")};
`.trim();
}

function typeRole(role: string, weight: string, sizeRatio: string): string {
  const size = sz(sizeRatio);
  return `
  --jz-semantic-type-${role}-font-family: ${FAMILY};
  --jz-semantic-type-${role}-font-size: ${size};
  --jz-semantic-type-${role}-font-weight: ${weight};
  --jz-semantic-type-${role}-line-height: normal;
  --jz-semantic-type-${role}-font: ${weight} ${size}/normal ${FAMILY};
`.trim();
}

function typeSemantics(): string {
  return [
    typeRole("overline", W_STR, "0.786"),
    typeRole("caption", W_REG, "0.857"),
    typeRole("label-sm", W_STR, "0.857"),
    typeRole("body-default", W_REG, "1"),
    typeRole("body-regular", W_REG, "1"),
    typeRole("body-strong", W_STR, "1"),
    typeRole("label", W_MED, "1"),
    typeRole("subtitle", W_MED, "1.071"),
    typeRole("heading3", W_MED, "1.143"),
    typeRole("heading2", W_MED, "1.286"),
    typeRole("heading", W_STR, "1.429"),
    typeRole("title", W_BLD, "1.714"),
    typeRole("display", W_BLD, "2.286"),
    typeRole("display-large", W_BLD, "3"),
  ].join("\n");
}

/** Exact semantic→primitive step map from frozen tokens.css (all modes, incl. hovers). */
function lightColorSemantics(): string {
  return `
  --jz-semantic-color-background-canvas-default: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-background-canvas-inverse: var(--jz-primitive-color-neutral-100);
  --jz-semantic-color-background-canvas-subtle: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-background-control-brand-inverse-primary: var(--jz-primitive-color-primary-500);
  --jz-semantic-color-background-control-brand-inverse-primary-active: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-background-control-brand-inverse-primary-disabled: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-background-control-brand-inverse-primary-hover: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-control-brand-inverse-secondary: var(--jz-primitive-color-secondary-500);
  --jz-semantic-color-background-control-brand-inverse-secondary-active: var(--jz-primitive-color-secondary-700);
  --jz-semantic-color-background-control-brand-inverse-secondary-disabled: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-control-brand-inverse-secondary-hover: var(--jz-primitive-color-secondary-600);
  --jz-semantic-color-background-control-brand-inverse-tertiary: var(--jz-primitive-color-tertiary-500);
  --jz-semantic-color-background-control-brand-inverse-tertiary-active: var(--jz-primitive-color-tertiary-700);
  --jz-semantic-color-background-control-brand-inverse-tertiary-disabled: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-control-brand-inverse-tertiary-hover: var(--jz-primitive-color-tertiary-600);
  --jz-semantic-color-background-control-brand-primary: var(--jz-primitive-color-primary-950);
  --jz-semantic-color-background-control-brand-secondary: var(--jz-primitive-color-secondary-950);
  --jz-semantic-color-background-control-brand-tertiary: var(--jz-primitive-color-tertiary-950);
  --jz-semantic-color-background-control-default: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-background-control-default-active: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-background-control-default-disabled: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-background-control-default-hover: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-background-control-feedback-error: var(--jz-primitive-color-feedback-error-950);
  --jz-semantic-color-background-control-feedback-success: var(--jz-primitive-color-feedback-success-950);
  --jz-semantic-color-background-control-feedback-warning: var(--jz-primitive-color-feedback-warning-950);
  --jz-semantic-color-background-control-inverse-active: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-background-control-inverse-default: var(--jz-primitive-color-black);
  --jz-semantic-color-background-control-inverse-disabled: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-background-control-inverse-hover: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-background-control-subtle: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-background-surface-brand-dark-primary: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-background-surface-brand-dark-secondary: var(--jz-primitive-color-secondary-200);
  --jz-semantic-color-background-surface-brand-dark-tertiary: var(--jz-primitive-color-tertiary-200);
  --jz-semantic-color-background-surface-brand-inverse-primary: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-surface-brand-inverse-primary-active: var(--jz-primitive-color-primary-600);
  --jz-semantic-color-background-surface-brand-inverse-primary-disabled: var(--jz-primitive-color-neutral-700);
  --jz-semantic-color-background-surface-brand-inverse-primary-hover: var(--jz-primitive-color-primary-500);
  --jz-semantic-color-background-surface-brand-inverse-secondary: var(--jz-primitive-color-secondary-400);
  --jz-semantic-color-background-surface-brand-inverse-secondary-active: var(--jz-primitive-color-secondary-600);
  --jz-semantic-color-background-surface-brand-inverse-secondary-disabled: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-background-surface-brand-inverse-secondary-hover: var(--jz-primitive-color-secondary-500);
  --jz-semantic-color-background-surface-brand-inverse-tertiary: var(--jz-primitive-color-tertiary-400);
  --jz-semantic-color-background-surface-brand-inverse-tertiary-active: var(--jz-primitive-color-tertiary-600);
  --jz-semantic-color-background-surface-brand-inverse-tertiary-disabled: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-background-surface-brand-inverse-tertiary-hover: var(--jz-primitive-color-tertiary-500);
  --jz-semantic-color-background-surface-brand-primary: var(--jz-primitive-color-primary-900);
  --jz-semantic-color-background-surface-brand-secondary: var(--jz-primitive-color-secondary-900);
  --jz-semantic-color-background-surface-brand-tertiary: var(--jz-primitive-color-tertiary-900);
  --jz-semantic-color-background-surface-default: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-background-surface-default-active: var(--jz-primitive-color-neutral-700);
  --jz-semantic-color-background-surface-default-disabled: var(--jz-primitive-color-neutral-700);
  --jz-semantic-color-background-surface-default-hover: var(--jz-primitive-color-neutral-700);
  --jz-semantic-color-background-surface-feedback-error: var(--jz-primitive-color-feedback-error-900);
  --jz-semantic-color-background-surface-feedback-success: var(--jz-primitive-color-feedback-success-900);
  --jz-semantic-color-background-surface-feedback-warning: var(--jz-primitive-color-feedback-warning-900);
  --jz-semantic-color-background-surface-inverse: var(--jz-primitive-color-neutral-100);
  --jz-semantic-color-background-surface-subtle: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-border-brand: var(--jz-primitive-color-primary-900);
  --jz-semantic-color-border-default: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-border-strong: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-border-subtle: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-brand-primary: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-brand-secondary: var(--jz-primitive-color-secondary-400);
  --jz-semantic-color-brand-tertiary: var(--jz-primitive-color-tertiary-400);
  --jz-semantic-color-focus-ring: var(--jz-primitive-color-primary-500);
  --jz-semantic-color-icon-default: var(--jz-primitive-color-neutral-50);
  --jz-semantic-color-icon-default-active: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-icon-default-disabled: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-icon-default-hover: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-icon-inverse: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-icon-inverse-active: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-icon-inverse-disabled: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-icon-inverse-hover: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-icon-primary: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-icon-secondary: var(--jz-primitive-color-secondary-400);
  --jz-semantic-color-icon-tertiary: var(--jz-primitive-color-tertiary-400);
  --jz-semantic-color-islightmode: fallback-to-display-default;
  --jz-semantic-color-text-default: var(--jz-primitive-color-neutral-50);
  --jz-semantic-color-text-default-active: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-text-default-disabled: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-text-default-hover: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-text-error: var(--jz-primitive-color-feedback-error-400);
  --jz-semantic-color-text-inverse: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-text-inverse-active: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-text-inverse-disabled: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-text-inverse-hover: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-text-muted: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-text-primary: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-text-secondary: var(--jz-primitive-color-secondary-400);
  --jz-semantic-color-text-success: var(--jz-primitive-color-feedback-success-400);
  --jz-semantic-color-text-tertiary: var(--jz-primitive-color-tertiary-400);
  --jz-semantic-color-text-text-primary-active: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-text-text-primary-disabled: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-text-text-primary-hover: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-text-warning: var(--jz-primitive-color-feedback-warning-400);
`.trim();
}

function darkColorSemantics(): string {
  return `
  --jz-semantic-color-background-canvas-default: var(--jz-primitive-color-black);
  --jz-semantic-color-background-canvas-inverse: var(--jz-primitive-color-neutral-50);
  --jz-semantic-color-background-canvas-subtle: var(--jz-primitive-color-black);
  --jz-semantic-color-background-control-brand-inverse-primary: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-background-control-brand-inverse-primary-active: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-background-control-brand-inverse-primary-disabled: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-background-control-brand-inverse-primary-hover: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-background-control-brand-inverse-secondary: var(--jz-primitive-color-secondary-200);
  --jz-semantic-color-background-control-brand-inverse-secondary-active: var(--jz-primitive-color-secondary-400);
  --jz-semantic-color-background-control-brand-inverse-secondary-disabled: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-background-control-brand-inverse-secondary-hover: var(--jz-primitive-color-secondary-300);
  --jz-semantic-color-background-control-brand-inverse-tertiary: var(--jz-primitive-color-tertiary-200);
  --jz-semantic-color-background-control-brand-inverse-tertiary-active: var(--jz-primitive-color-tertiary-400);
  --jz-semantic-color-background-control-brand-inverse-tertiary-disabled: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-background-control-brand-inverse-tertiary-hover: var(--jz-primitive-color-tertiary-300);
  --jz-semantic-color-background-control-brand-primary: var(--jz-primitive-color-primary-100);
  --jz-semantic-color-background-control-brand-secondary: var(--jz-primitive-color-secondary-100);
  --jz-semantic-color-background-control-brand-tertiary: var(--jz-primitive-color-tertiary-100);
  --jz-semantic-color-background-control-default: var(--jz-primitive-color-neutral-100);
  --jz-semantic-color-background-control-default-active: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-background-control-default-disabled: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-control-default-hover: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-background-control-feedback-error: var(--jz-primitive-color-feedback-error-100);
  --jz-semantic-color-background-control-feedback-success: var(--jz-primitive-color-feedback-success-100);
  --jz-semantic-color-background-control-feedback-warning: var(--jz-primitive-color-feedback-warning-100);
  --jz-semantic-color-background-control-inverse-active: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-control-inverse-default: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-control-inverse-disabled: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-background-control-inverse-hover: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-control-subtle: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-background-surface-brand-dark-primary: var(--jz-primitive-color-neutral-100);
  --jz-semantic-color-background-surface-brand-dark-secondary: var(--jz-primitive-color-neutral-100);
  --jz-semantic-color-background-surface-brand-dark-tertiary: var(--jz-primitive-color-neutral-100);
  --jz-semantic-color-background-surface-brand-inverse-primary: var(--jz-primitive-color-primary-100);
  --jz-semantic-color-background-surface-brand-inverse-primary-active: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-background-surface-brand-inverse-primary-disabled: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-surface-brand-inverse-primary-hover: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-background-surface-brand-inverse-secondary: var(--jz-primitive-color-secondary-100);
  --jz-semantic-color-background-surface-brand-inverse-secondary-active: var(--jz-primitive-color-secondary-300);
  --jz-semantic-color-background-surface-brand-inverse-secondary-disabled: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-surface-brand-inverse-secondary-hover: var(--jz-primitive-color-secondary-200);
  --jz-semantic-color-background-surface-brand-inverse-tertiary: var(--jz-primitive-color-tertiary-100);
  --jz-semantic-color-background-surface-brand-inverse-tertiary-active: var(--jz-primitive-color-tertiary-300);
  --jz-semantic-color-background-surface-brand-inverse-tertiary-disabled: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-surface-brand-inverse-tertiary-hover: var(--jz-primitive-color-tertiary-200);
  --jz-semantic-color-background-surface-brand-primary: var(--jz-primitive-color-primary-50);
  --jz-semantic-color-background-surface-brand-secondary: var(--jz-primitive-color-secondary-50);
  --jz-semantic-color-background-surface-brand-tertiary: var(--jz-primitive-color-tertiary-50);
  --jz-semantic-color-background-surface-default: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-background-surface-default-active: var(--jz-primitive-color-neutral-100);
  --jz-semantic-color-background-surface-default-disabled: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-background-surface-default-hover: var(--jz-primitive-color-neutral-50);
  --jz-semantic-color-background-surface-feedback-error: var(--jz-primitive-color-feedback-error-100);
  --jz-semantic-color-background-surface-feedback-success: var(--jz-primitive-color-feedback-success-100);
  --jz-semantic-color-background-surface-feedback-warning: var(--jz-primitive-color-feedback-warning-100);
  --jz-semantic-color-background-surface-inverse: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-background-surface-subtle: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-border-brand: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-border-default: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-border-strong: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-border-subtle: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-brand-primary: var(--jz-primitive-color-primary-600);
  --jz-semantic-color-brand-secondary: var(--jz-primitive-color-secondary-600);
  --jz-semantic-color-brand-tertiary: var(--jz-primitive-color-tertiary-600);
  --jz-semantic-color-focus-ring: var(--jz-primitive-color-primary-600);
  --jz-semantic-color-icon-default: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-icon-default-active: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-icon-default-disabled: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-icon-default-hover: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-icon-inverse: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-icon-inverse-active: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-icon-inverse-disabled: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-icon-inverse-hover: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-icon-primary: var(--jz-primitive-color-primary-800);
  --jz-semantic-color-icon-secondary: var(--jz-primitive-color-secondary-600);
  --jz-semantic-color-icon-tertiary: var(--jz-primitive-color-tertiary-600);
  --jz-semantic-color-islightmode: none;
  --jz-semantic-color-text-default: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-text-default-active: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-text-default-disabled: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-text-default-hover: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-text-error: var(--jz-primitive-color-feedback-error-600);
  --jz-semantic-color-text-inverse: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-text-inverse-active: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-text-inverse-disabled: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-text-inverse-hover: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-text-muted: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-text-primary: var(--jz-primitive-color-primary-800);
  --jz-semantic-color-text-secondary: var(--jz-primitive-color-secondary-600);
  --jz-semantic-color-text-success: var(--jz-primitive-color-feedback-success-600);
  --jz-semantic-color-text-tertiary: var(--jz-primitive-color-tertiary-600);
  --jz-semantic-color-text-text-primary-active: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-text-text-primary-disabled: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-text-text-primary-hover: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-text-warning: var(--jz-primitive-color-feedback-warning-600);
`.trim();
}

function emphasizedColorSemantics(): string {
  return `
  --jz-semantic-color-background-canvas-default: var(--jz-primitive-color-primary-500);
  --jz-semantic-color-background-canvas-inverse: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-background-canvas-subtle: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-control-brand-inverse-primary: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-control-brand-inverse-primary-active: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-background-control-brand-inverse-primary-disabled: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-control-brand-inverse-primary-hover: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-background-control-brand-inverse-secondary: var(--jz-primitive-color-secondary-500);
  --jz-semantic-color-background-control-brand-inverse-secondary-active: var(--jz-primitive-color-secondary-700);
  --jz-semantic-color-background-control-brand-inverse-secondary-disabled: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-control-brand-inverse-secondary-hover: var(--jz-primitive-color-secondary-600);
  --jz-semantic-color-background-control-brand-inverse-tertiary: var(--jz-primitive-color-tertiary-500);
  --jz-semantic-color-background-control-brand-inverse-tertiary-active: var(--jz-primitive-color-tertiary-700);
  --jz-semantic-color-background-control-brand-inverse-tertiary-disabled: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-control-brand-inverse-tertiary-hover: var(--jz-primitive-color-tertiary-600);
  --jz-semantic-color-background-control-brand-primary: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-control-brand-secondary: var(--jz-primitive-color-secondary-100);
  --jz-semantic-color-background-control-brand-tertiary: var(--jz-primitive-color-tertiary-100);
  --jz-semantic-color-background-control-default: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-background-control-default-active: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-background-control-default-disabled: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-control-default-hover: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-background-control-feedback-error: var(--jz-primitive-color-feedback-error-100);
  --jz-semantic-color-background-control-feedback-success: var(--jz-primitive-color-feedback-success-100);
  --jz-semantic-color-background-control-feedback-warning: var(--jz-primitive-color-feedback-warning-100);
  --jz-semantic-color-background-control-inverse-active: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-control-inverse-default: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-control-inverse-disabled: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-control-inverse-hover: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-background-control-subtle: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-surface-brand-dark-primary: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-background-surface-brand-dark-secondary: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-background-surface-brand-dark-tertiary: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-background-surface-brand-inverse-primary: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-background-surface-brand-inverse-primary-active: var(--jz-primitive-color-primary-600);
  --jz-semantic-color-background-surface-brand-inverse-primary-disabled: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-background-surface-brand-inverse-primary-hover: var(--jz-primitive-color-primary-500);
  --jz-semantic-color-background-surface-brand-inverse-secondary: var(--jz-primitive-color-secondary-400);
  --jz-semantic-color-background-surface-brand-inverse-secondary-active: var(--jz-primitive-color-secondary-600);
  --jz-semantic-color-background-surface-brand-inverse-secondary-disabled: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-background-surface-brand-inverse-secondary-hover: var(--jz-primitive-color-secondary-500);
  --jz-semantic-color-background-surface-brand-inverse-tertiary: var(--jz-primitive-color-tertiary-400);
  --jz-semantic-color-background-surface-brand-inverse-tertiary-active: var(--jz-primitive-color-tertiary-600);
  --jz-semantic-color-background-surface-brand-inverse-tertiary-disabled: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-background-surface-brand-inverse-tertiary-hover: var(--jz-primitive-color-tertiary-500);
  --jz-semantic-color-background-surface-brand-primary: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-background-surface-brand-secondary: var(--jz-primitive-color-secondary-50);
  --jz-semantic-color-background-surface-brand-tertiary: var(--jz-primitive-color-tertiary-50);
  --jz-semantic-color-background-surface-default: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-surface-default-active: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-background-surface-default-disabled: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-background-surface-default-hover: var(--jz-primitive-color-primary-100);
  --jz-semantic-color-background-surface-feedback-error: var(--jz-primitive-color-feedback-error-100);
  --jz-semantic-color-background-surface-feedback-success: var(--jz-primitive-color-feedback-success-100);
  --jz-semantic-color-background-surface-feedback-warning: var(--jz-primitive-color-feedback-warning-200);
  --jz-semantic-color-background-surface-inverse: var(--jz-primitive-color-primary-100);
  --jz-semantic-color-background-surface-subtle: var(--jz-primitive-color-primary-100);
  --jz-semantic-color-border-brand: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-border-default: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-border-strong: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-border-subtle: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-brand-primary: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-brand-secondary: var(--jz-primitive-color-secondary-400);
  --jz-semantic-color-brand-tertiary: var(--jz-primitive-color-tertiary-400);
  --jz-semantic-color-focus-ring: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-icon-default: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-icon-default-active: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-icon-default-disabled: var(--jz-primitive-color-primary-600);
  --jz-semantic-color-icon-default-hover: var(--jz-primitive-color-primary-800);
  --jz-semantic-color-icon-inverse: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-icon-inverse-active: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-icon-inverse-disabled: var(--jz-primitive-color-primary-600);
  --jz-semantic-color-icon-inverse-hover: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-icon-primary: var(--jz-primitive-color-primary-900);
  --jz-semantic-color-icon-secondary: var(--jz-primitive-color-secondary-400);
  --jz-semantic-color-icon-tertiary: var(--jz-primitive-color-tertiary-400);
  --jz-semantic-color-islightmode: none;
  --jz-semantic-color-text-default: var(--jz-primitive-color-primary-900);
  --jz-semantic-color-text-default-active: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-text-default-disabled: var(--jz-primitive-color-primary-500);
  --jz-semantic-color-text-default-hover: var(--jz-primitive-color-primary-800);
  --jz-semantic-color-text-error: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-text-inverse: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-text-inverse-active: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-text-inverse-disabled: var(--jz-primitive-color-primary-600);
  --jz-semantic-color-text-inverse-hover: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-text-muted: var(--jz-primitive-color-primary-800);
  --jz-semantic-color-text-primary: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-text-secondary: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-text-success: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-text-tertiary: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-text-text-primary-active: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-text-text-primary-disabled: var(--jz-primitive-color-primary-600);
  --jz-semantic-color-text-text-primary-hover: var(--jz-primitive-color-primary-800);
  --jz-semantic-color-text-warning: var(--jz-primitive-color-primary-700);
`.trim();
}

function subtleColorSemantics(): string {
  return `
  --jz-semantic-color-background-canvas-default: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-background-canvas-inverse: var(--jz-primitive-color-neutral-100);
  --jz-semantic-color-background-canvas-subtle: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-background-control-brand-inverse-primary: var(--jz-primitive-color-primary-600);
  --jz-semantic-color-background-control-brand-inverse-primary-active: var(--jz-primitive-color-primary-400);
  --jz-semantic-color-background-control-brand-inverse-primary-disabled: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-background-control-brand-inverse-primary-hover: var(--jz-primitive-color-primary-500);
  --jz-semantic-color-background-control-brand-inverse-secondary: var(--jz-primitive-color-secondary-600);
  --jz-semantic-color-background-control-brand-inverse-secondary-active: var(--jz-primitive-color-secondary-800);
  --jz-semantic-color-background-control-brand-inverse-secondary-disabled: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-background-control-brand-inverse-secondary-hover: var(--jz-primitive-color-secondary-700);
  --jz-semantic-color-background-control-brand-inverse-tertiary: var(--jz-primitive-color-tertiary-600);
  --jz-semantic-color-background-control-brand-inverse-tertiary-active: var(--jz-primitive-color-tertiary-800);
  --jz-semantic-color-background-control-brand-inverse-tertiary-disabled: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-background-control-brand-inverse-tertiary-hover: var(--jz-primitive-color-tertiary-700);
  --jz-semantic-color-background-control-brand-primary: var(--jz-primitive-color-primary-900);
  --jz-semantic-color-background-control-brand-secondary: var(--jz-primitive-color-secondary-900);
  --jz-semantic-color-background-control-brand-tertiary: var(--jz-primitive-color-tertiary-900);
  --jz-semantic-color-background-control-default: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-background-control-default-active: var(--jz-primitive-color-neutral-700);
  --jz-semantic-color-background-control-default-disabled: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-background-control-default-hover: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-background-control-feedback-error: var(--jz-primitive-color-feedback-error-900);
  --jz-semantic-color-background-control-feedback-success: var(--jz-primitive-color-feedback-success-900);
  --jz-semantic-color-background-control-feedback-warning: var(--jz-primitive-color-feedback-warning-900);
  --jz-semantic-color-background-control-inverse-active: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-control-inverse-default: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-background-control-inverse-disabled: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-background-control-inverse-hover: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-background-control-subtle: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-background-surface-brand-dark-primary: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-background-surface-brand-dark-secondary: var(--jz-primitive-color-secondary-300);
  --jz-semantic-color-background-surface-brand-dark-tertiary: var(--jz-primitive-color-tertiary-300);
  --jz-semantic-color-background-surface-brand-inverse-primary: var(--jz-primitive-color-primary-500);
  --jz-semantic-color-background-surface-brand-inverse-primary-active: var(--jz-primitive-color-primary-700);
  --jz-semantic-color-background-surface-brand-inverse-primary-disabled: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-surface-brand-inverse-primary-hover: var(--jz-primitive-color-primary-600);
  --jz-semantic-color-background-surface-brand-inverse-secondary: var(--jz-primitive-color-secondary-500);
  --jz-semantic-color-background-surface-brand-inverse-secondary-active: var(--jz-primitive-color-secondary-700);
  --jz-semantic-color-background-surface-brand-inverse-secondary-disabled: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-surface-brand-inverse-secondary-hover: var(--jz-primitive-color-secondary-600);
  --jz-semantic-color-background-surface-brand-inverse-tertiary: var(--jz-primitive-color-tertiary-500);
  --jz-semantic-color-background-surface-brand-inverse-tertiary-active: var(--jz-primitive-color-tertiary-700);
  --jz-semantic-color-background-surface-brand-inverse-tertiary-disabled: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-surface-brand-inverse-tertiary-hover: var(--jz-primitive-color-tertiary-600);
  --jz-semantic-color-background-surface-brand-primary: var(--jz-primitive-color-primary-800);
  --jz-semantic-color-background-surface-brand-secondary: var(--jz-primitive-color-secondary-800);
  --jz-semantic-color-background-surface-brand-tertiary: var(--jz-primitive-color-tertiary-800);
  --jz-semantic-color-background-surface-default: var(--jz-primitive-color-neutral-700);
  --jz-semantic-color-background-surface-default-active: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-background-surface-default-disabled: var(--jz-primitive-color-neutral-400);
  --jz-semantic-color-background-surface-default-hover: var(--jz-primitive-color-neutral-700);
  --jz-semantic-color-background-surface-feedback-error: var(--jz-primitive-color-feedback-error-800);
  --jz-semantic-color-background-surface-feedback-success: var(--jz-primitive-color-feedback-success-800);
  --jz-semantic-color-background-surface-feedback-warning: var(--jz-primitive-color-feedback-warning-800);
  --jz-semantic-color-background-surface-inverse: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-background-surface-subtle: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-border-brand: var(--jz-primitive-color-neutral-800);
  --jz-semantic-color-border-default: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-border-strong: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-border-subtle: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-brand-primary: var(--jz-primitive-color-primary-500);
  --jz-semantic-color-brand-secondary: var(--jz-primitive-color-secondary-500);
  --jz-semantic-color-brand-tertiary: var(--jz-primitive-color-tertiary-500);
  --jz-semantic-color-focus-ring: var(--jz-primitive-color-primary-500);
  --jz-semantic-color-icon-default: var(--jz-primitive-color-neutral-100);
  --jz-semantic-color-icon-default-active: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-icon-default-disabled: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-icon-default-hover: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-icon-inverse: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-icon-inverse-active: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-icon-inverse-disabled: var(--jz-primitive-color-neutral-700);
  --jz-semantic-color-icon-inverse-hover: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-icon-primary: var(--jz-primitive-color-primary-500);
  --jz-semantic-color-icon-secondary: var(--jz-primitive-color-secondary-500);
  --jz-semantic-color-icon-tertiary: var(--jz-primitive-color-tertiary-500);
  --jz-semantic-color-islightmode: none;
  --jz-semantic-color-text-default: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-text-default-active: var(--jz-primitive-color-neutral-300);
  --jz-semantic-color-text-default-disabled: var(--jz-primitive-color-neutral-600);
  --jz-semantic-color-text-default-hover: var(--jz-primitive-color-neutral-200);
  --jz-semantic-color-text-error: var(--jz-primitive-color-feedback-error-500);
  --jz-semantic-color-text-inverse: var(--jz-primitive-color-neutral-950);
  --jz-semantic-color-text-inverse-active: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-text-inverse-disabled: var(--jz-primitive-color-neutral-700);
  --jz-semantic-color-text-inverse-hover: var(--jz-primitive-color-neutral-900);
  --jz-semantic-color-text-muted: var(--jz-primitive-color-neutral-500);
  --jz-semantic-color-text-primary: var(--jz-primitive-color-primary-500);
  --jz-semantic-color-text-secondary: var(--jz-primitive-color-secondary-600);
  --jz-semantic-color-text-success: var(--jz-primitive-color-feedback-success-600);
  --jz-semantic-color-text-tertiary: var(--jz-primitive-color-tertiary-600);
  --jz-semantic-color-text-text-primary-active: var(--jz-primitive-color-primary-300);
  --jz-semantic-color-text-text-primary-disabled: var(--jz-primitive-color-primary-600);
  --jz-semantic-color-text-text-primary-hover: var(--jz-primitive-color-primary-200);
  --jz-semantic-color-text-warning: var(--jz-primitive-color-feedback-warning-600);
`.trim();
}

/** Non-color semantics that are mode-stable in the frozen sheet. */
function staticSemantics(): string {
  return `
  --jz-semantic-layer-negative: -1;
  --jz-semantic-layer-base: 0;
  --jz-semantic-layer-default: 1;
  --jz-semantic-layer-dropdown: 10;
  --jz-semantic-layer-header: 10;
  --jz-semantic-layer-modal: 100;
  --jz-semantic-layer-modalcontent: 101;
  --jz-semantic-layer-notification: 110;
  --jz-semantic-layer-tooltip: 120;
  --jz-semantic-sizing-heroheight: 480px;
  --jz-semantic-sizing-maxpagewidth: 1440px;
  --jz-semantic-sizing-sectionheight: 320px;
`.trim();
}

function pick(
  knobs: SessionTokenKnobs,
  key: keyof SessionTokenKnobs,
): string {
  const value = knobs[key]?.trim();
  return value || DEFAULT_SESSION_TOKEN_KNOBS[key];
}

/**
 * Full override sheet: knobs → primitive ladders → every semantic color/type/space
 * (including hover/active/disabled), plus mode blocks. Same --jz-* names as frozen DS.
 */
export function buildSessionTokensCss(
  knobs: SessionTokenKnobs = DEFAULT_SESSION_TOKEN_KNOBS,
): string {
  const k = {
    primary: pick(knobs, "primary"),
    secondary: pick(knobs, "secondary"),
    neutral: pick(knobs, "neutral"),
    neutralWarmth: pick(knobs, "neutralWarmth"),
    space: pick(knobs, "space"),
    fontFamily: pick(knobs, "fontFamily"),
    fontSize: pick(knobs, "fontSize"),
    typeScale: pick(knobs, "typeScale"),
    weightRegular: pick(knobs, "weightRegular"),
    weightMedium: pick(knobs, "weightMedium"),
    weightStrong: pick(knobs, "weightStrong"),
    weightBold: pick(knobs, "weightBold"),
  };

  const fixed = FIXED_SESSION_COLOR_MIDS;

  return `/* jobzeug session design tokens — Design tab override (full flood) */
/* Frozen packages/design-system tokens.css stays loaded; this sheet wins when injected. */

:root {
  /* === SESSION KNOBS (manipulate these — agent surface) === */
  --jz-session-primary: ${k.primary};
  --jz-session-secondary: ${k.secondary};
  --jz-session-neutral: ${k.neutral};
  --jz-session-neutral-warmth: ${k.neutralWarmth};
  --jz-session-space: ${k.space};
  --jz-session-font-family: ${k.fontFamily}, sans-serif;
  --jz-session-font-size: ${k.fontSize};
  --jz-session-type-scale: ${k.typeScale};
  --jz-session-weight-regular: ${k.weightRegular};
  --jz-session-weight-medium: ${k.weightMedium};
  --jz-session-weight-strong: ${k.weightStrong};
  --jz-session-weight-bold: ${k.weightBold};

  /* === FIXED (not knobs — frozen DS mids) === */
  --jz-session-tertiary: ${fixed.tertiary};
  --jz-session-error: ${fixed.error};
  --jz-session-success: ${fixed.success};
  --jz-session-warning: ${fixed.warning};

  /* === DERIVED --jz-* (do not hand-edit) === */
  ${colorLadder("primary", "var(--jz-session-primary)")}
  ${colorLadder("secondary", "var(--jz-session-secondary)")}
  ${colorLadder("tertiary", "var(--jz-session-tertiary)")}
  ${neutralLadder()}
  ${colorLadder("feedback-error", "var(--jz-session-error)")}
  ${colorLadder("feedback-success", "var(--jz-session-success)")}
  ${colorLadder("feedback-warning", "var(--jz-session-warning)")}

  ${spaceLadder()}
  ${typeLadder()}
  ${typeSemantics()}
  ${lightColorSemantics()}
  ${staticSemantics()}
}

body {
  font-family: var(--jz-session-font-family);
}

[data-mode="dark"] {
  ${darkColorSemantics()}
}

[data-mode="emphasized"] {
  ${emphasizedColorSemantics()}
}

[data-mode="subtle"] {
  ${subtleColorSemantics()}
}
`;
}
