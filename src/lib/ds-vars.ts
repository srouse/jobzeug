/**
 * Token `var(--jz-…)` references for vanilla-extract, matching
 * `packages/design-system/dist/designSystem/tokens.vars.ts` /
 * `@jobzeug/design-system/tokens.css`.
 *
 * Keep keys aligned with the design-system `vars` map. The package is
 * excluded from the app tsconfig, so we mirror the strings we need here.
 */
export const vars = {
  "primitive.radius.full": "var(--jz-primitive-radius-full)",
  "primitive.radius.sm": "var(--jz-primitive-radius-sm)",
  "semantic.color.background.control.default":
    "var(--jz-semantic-color-background-control-default)",
  "semantic.color.background.surface.default":
    "var(--jz-semantic-color-background-surface-default)",
  "semantic.color.border.default": "var(--jz-semantic-color-border-default)",
  "semantic.color.border.subtle": "var(--jz-semantic-color-border-subtle)",
  "semantic.color.text.default": "var(--jz-semantic-color-text-default)",
  "semantic.color.text.error": "var(--jz-semantic-color-text-error)",
  "semantic.color.text.muted": "var(--jz-semantic-color-text-muted)",
  "semantic.color.text.secondary": "var(--jz-semantic-color-text-secondary)",
  "semantic.layer.header": "var(--jz-semantic-layer-header)",
  "semantic.space.gap.2xs": "var(--jz-semantic-space-gap-2xs)",
  "semantic.space.gap.md": "var(--jz-semantic-space-gap-md)",
  "semantic.space.gap.sm": "var(--jz-semantic-space-gap-sm)",
  "semantic.space.gap.xs": "var(--jz-semantic-space-gap-xs)",
  "semantic.space.padding.2xs": "var(--jz-semantic-space-padding-2xs)",
  "semantic.space.padding.md": "var(--jz-semantic-space-padding-md)",
  "semantic.space.padding.sm": "var(--jz-semantic-space-padding-sm)",
  "semantic.type.body.default.fontFamily":
    "var(--jz-semantic-type-body-default-font-family)",
  "semantic.type.body.strong.fontWeight":
    "var(--jz-semantic-type-body-strong-font-weight)",
  "semantic.type.caption.fontSize": "var(--jz-semantic-type-caption-font-size)",
  "semantic.type.caption.lineHeight":
    "var(--jz-semantic-type-caption-line-height)",
  "semantic.type.label.sm.fontSize":
    "var(--jz-semantic-type-label-sm-font-size)",
  "semantic.type.label.sm.lineHeight":
    "var(--jz-semantic-type-label-sm-line-height)",
} as const;

export type VarsPath = keyof typeof vars;
