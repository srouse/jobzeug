import { style, styleVariants } from "@vanilla-extract/css";

const stroke = "var(--jz-primitive-stroke-width-md)";

/** Shared host frame — padding/gap/radius identical for Default and Small. */
const frame = {
  gap: "var(--jz-semantic-space-gap-sm)",
  padding:
    "var(--jz-semantic-space-padding-sm) var(--jz-semantic-space-padding-md)",
  borderRadius: "var(--jz-primitive-radius-full)",
};

function strokeBorder(color: string) {
  return {
    borderWidth: stroke,
    borderStyle: "solid" as const,
    borderColor: color,
  };
}

export const root = style({
  ...frame,
  appearance: "none",
  boxSizing: "border-box",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  margin: 0,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  textDecoration: "none",
  selectors: {
    "&:disabled": {
      cursor: "default",
    },
    "&:focus-visible": {
      outline: `${stroke} solid var(--jz-semantic-color-border-strong)`,
      outlineOffset: stroke,
    },
  },
});

/**
 * Size → host type (`label` vs `label/sm`) + Dark+Disabled border compound.
 * Nested icon Size Medium vs Small — AGENTS.md.
 */
export const sizes = styleVariants({
  default: {
    font: "var(--jz-semantic-type-label-font)",
  },
  small: {
    font: "var(--jz-semantic-type-label-sm-font)",
  },
});

const hover = "&:hover:not(:disabled)";
const pressed = "&:active:not(:disabled)";

export const variants = styleVariants({
  primary: {
    background:
      "var(--jz-semantic-color-background-control-brand-inverse-primary)",
    color: "var(--jz-semantic-color-text-inverse)",
    selectors: {
      [hover]: {
        background:
          "var(--jz-semantic-color-background-control-brand-inverse-primary-hover)",
        color: "var(--jz-semantic-color-text-inverse-hover)",
      },
      [pressed]: {
        background:
          "var(--jz-semantic-color-background-control-brand-inverse-primary-active)",
        color: "var(--jz-semantic-color-text-inverse-active)",
      },
      "&:disabled": {
        background:
          "var(--jz-semantic-color-background-control-brand-inverse-primary-disabled)",
        color: "var(--jz-semantic-color-text-inverse-disabled)",
      },
    },
  },
  secondary: {
    ...strokeBorder("var(--jz-semantic-color-border-strong)"),
    color: "var(--jz-semantic-color-text-muted)",
    selectors: {
      [hover]: {
        color: "var(--jz-semantic-color-text-default-hover)",
      },
      [pressed]: {
        color: "var(--jz-semantic-color-text-default-active)",
      },
      "&:disabled": {
        background:
          "var(--jz-semantic-color-background-control-default-disabled)",
        color: "var(--jz-semantic-color-text-default-disabled)",
      },
    },
  },
  inverse: {
    background: "var(--jz-semantic-color-background-control-default)",
    color: "var(--jz-semantic-color-text-default)",
    selectors: {
      [hover]: {
        background:
          "var(--jz-semantic-color-background-control-default-hover)",
        color: "var(--jz-semantic-color-text-default-hover)",
      },
      [pressed]: {
        background:
          "var(--jz-semantic-color-background-control-default-active)",
        color: "var(--jz-semantic-color-text-default-active)",
      },
      "&:disabled": {
        background:
          "var(--jz-semantic-color-background-control-default-disabled)",
        color: "var(--jz-semantic-color-text-default-disabled)",
      },
    },
  },
  dark: {
    background: "var(--jz-semantic-color-background-control-inverse-default)",
    color: "var(--jz-semantic-color-text-inverse)",
    selectors: {
      [hover]: {
        background:
          "var(--jz-semantic-color-background-control-inverse-hover)",
        color: "var(--jz-semantic-color-text-inverse-hover)",
      },
      [pressed]: {
        ...strokeBorder("var(--jz-semantic-color-border-default)"),
        background:
          "var(--jz-semantic-color-background-control-inverse-active)",
        color: "var(--jz-semantic-color-text-inverse-active)",
      },
      [`&${sizes.default}:disabled`]: {
        ...strokeBorder("var(--jz-semantic-color-border-default)"),
        background:
          "var(--jz-semantic-color-background-control-inverse-disabled)",
        color: "var(--jz-semantic-color-text-inverse-disabled)",
      },
      [`&${sizes.small}:disabled`]: {
        background:
          "var(--jz-semantic-color-background-control-inverse-disabled)",
        color: "var(--jz-semantic-color-text-inverse-disabled)",
      },
    },
  },
});
