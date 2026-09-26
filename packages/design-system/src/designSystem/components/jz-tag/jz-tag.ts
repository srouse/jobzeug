import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { JzIconElement } from "../jz-icon/jz-icon.js";

export type JzTagVariant = "default" | "primary" | "outline";

const VARIANTS: readonly JzTagVariant[] = ["default", "primary", "outline"];

const DEFAULT_VARIANT: JzTagVariant = "default";
const DEFAULT_LABEL = "Title";
const DEFAULT_ICON = "Info";

/**
 * Tag from the jz-tag capture. Style → `variant`. Figma `title` → `label`.
 * Hover / active chrome only when `href` is set (link / interactive tag).
 * Nested `jz-icon` is Size Small with `inheritColor`.
 */
@customElement("jz-tag")
export class JzTagElement extends LitElement {
  /** Keeps `jz-icon` in this module’s dependency graph (CE registration). */
  static readonly iconElement = JzIconElement;
  static override styles = css`
    :host {
      display: inline-flex;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      gap: var(--jz-semantic-space-padding-xs);
      padding: var(--jz-semantic-space-padding-xs)
        var(--jz-semantic-space-padding-sm);
      border-radius: var(--jz-primitive-radius-md);
      border-width: var(--jz-primitive-stroke-width-sm);
      border-style: solid;
      font: var(--jz-semantic-type-overline-font);
      cursor: default;
      user-select: none;
    }

    :host([href]) {
      cursor: pointer;
    }

    a.link {
      display: contents;
      color: inherit;
      text-decoration: none;
    }

    :host([variant="default"]) {
      background: var(--jz-semantic-color-background-control-default);
      border-color: var(--jz-semantic-color-border-default);
      color: var(--jz-semantic-color-text-default);
    }

    :host([href][variant="default"]:hover) {
      background: var(--jz-primitive-color-neutral-500);
      border-color: transparent;
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([href][variant="default"]:active) {
      background: var(--jz-primitive-color-neutral-500);
      border-color: var(--jz-primitive-color-neutral-800);
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([variant="primary"]) {
      background: var(--jz-semantic-color-background-control-brand-primary);
      border-color: var(--jz-primitive-color-primary-900);
      color: var(--jz-semantic-color-text-primary);
    }

    :host([href][variant="primary"]:hover) {
      background: var(
        --jz-semantic-color-background-control-brand-inverse-primary
      );
      border-color: transparent;
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([href][variant="primary"]:active) {
      background: var(
        --jz-semantic-color-background-control-brand-inverse-primary-active
      );
      border-color: var(--jz-primitive-color-primary-700);
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([variant="outline"]) {
      background: var(--jz-semantic-color-background-surface-default);
      border-color: var(--jz-semantic-color-border-strong);
      color: var(--jz-semantic-color-text-muted);
    }

    :host([href][variant="outline"]:hover) {
      /* Figma background/control/elevated maps to emitted control/subtle */
      background: var(--jz-semantic-color-background-control-subtle);
      border-color: var(--jz-semantic-color-border-strong);
      color: var(--jz-semantic-color-text-muted);
    }

    :host([href][variant="outline"]:active) {
      background: var(--jz-semantic-color-background-control-subtle);
      border-color: var(--jz-primitive-color-neutral-300);
      color: var(--jz-semantic-color-text-muted);
    }

    .label {
      margin: 0;
      line-height: inherit;
    }
  `;

  @property({ type: String, reflect: true })
  variant: JzTagVariant = DEFAULT_VARIANT;

  /** Figma `title` — visible text (not the HTML tooltip attribute). */
  @property({ type: String })
  label = DEFAULT_LABEL;

  /** Figma `show-icon`. */
  @property({ type: Boolean, attribute: "show-icon", reflect: true })
  showIcon = true;

  /** Phosphor name for the nested `jz-icon` (code-only; Figma instance swap). */
  @property({ type: String, reflect: true })
  icon = DEFAULT_ICON;

  /**
   * When set, the tag is a link: hover/active chrome applies and content is
   * wrapped in an anchor. Omit for a static (non-interactive) tag.
   * Empty string does **not** reflect (avoids `href=""` matching `:host([href])`).
   */
  @property({
    type: String,
    reflect: true,
    converter: {
      fromAttribute: (value: string | null) => value ?? "",
      toAttribute: (value: string) => (value ? value : null),
    },
  })
  href = "";

  override willUpdate(): void {
    if (!VARIANTS.includes(this.variant)) this.variant = DEFAULT_VARIANT;
  }

  override render() {
    const icon = this.showIcon
      ? html`<jz-icon
          inherit-color
          size="small"
          icon=${this.icon || DEFAULT_ICON}
        ></jz-icon>`
      : nothing;
    const text = this.label
      ? html`<span class="label">${this.label}</span>`
      : nothing;
    const content = html`${icon}${text}`;

    if (this.href) {
      return html`<a class="link" href=${this.href}>${content}</a>`;
    }
    return content;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-tag": JzTagElement;
  }
}
