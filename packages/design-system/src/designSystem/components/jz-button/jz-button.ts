import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { JzIconElement } from "../jz-icon/jz-icon.js";

export type JzButtonVariant = "primary" | "inverse" | "dark";
export type JzButtonSize = "default" | "small";

const VARIANTS: readonly JzButtonVariant[] = ["primary", "inverse", "dark"];
const SIZES: readonly JzButtonSize[] = ["default", "small"];

const DEFAULT_ICON = "Info";

const SPINNER_ICON = "Spinner";

/**
 * Button from the jz-button capture. Interaction is native
 * (`:hover`, `:active`, `disabled`). Text is `label` + `showText`.
 * Size drives type (`label` vs `label/sm`) and nested icon size.
 * Style axis is Primary | Inverse | Dark (Secondary removed).
 * No host border — capture has no `border/*` paint.
 * `loading` is code-only (not in Figma).
 */
@customElement("jz-button")
export class JzButtonElement extends LitElement {
  /** Keeps `jz-icon` in this module’s dependency graph (CE registration). */
  static readonly iconElement = JzIconElement;
  static override styles = css`
    :host {
      display: inline-block;
    }

    button {
      appearance: none;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      text-decoration: none;
      gap: var(--jz-semantic-space-gap-sm);
      padding: var(--jz-semantic-space-padding-sm)
        var(--jz-semantic-space-padding-md);
      border-radius: var(--jz-primitive-radius-sm);
    }

    button:disabled {
      cursor: default;
    }

    button:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-border-strong);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }

    :host([size="default"]) button {
      font: var(--jz-semantic-type-label-font);
    }

    :host([size="small"]) button {
      font: var(--jz-semantic-type-label-sm-font);
    }

    :host([variant="primary"]) button {
      background: var(
        --jz-semantic-color-background-control-brand-inverse-primary
      );
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([variant="primary"]) button:hover:not(:disabled) {
      background: var(
        --jz-semantic-color-background-control-brand-inverse-primary-hover
      );
      color: var(--jz-semantic-color-text-inverse-hover);
    }

    :host([variant="primary"]) button:active:not(:disabled) {
      background: var(
        --jz-semantic-color-background-control-brand-inverse-primary-active
      );
      color: var(--jz-semantic-color-text-inverse-active);
    }

    :host([variant="primary"]) button:disabled {
      background: var(
        --jz-semantic-color-background-control-brand-inverse-primary-disabled
      );
      color: var(--jz-semantic-color-text-inverse-disabled);
    }

    :host([variant="inverse"]) button {
      background: var(--jz-semantic-color-background-control-default);
      color: var(--jz-semantic-color-text-default);
    }

    :host([variant="inverse"]) button:hover:not(:disabled) {
      background: var(--jz-semantic-color-background-control-default-hover);
      color: var(--jz-semantic-color-text-default-hover);
    }

    :host([variant="inverse"]) button:active:not(:disabled) {
      background: var(--jz-semantic-color-background-control-default-active);
      color: var(--jz-semantic-color-text-default-active);
    }

    :host([variant="inverse"]) button:disabled {
      background: var(
        --jz-semantic-color-background-control-default-disabled
      );
      color: var(--jz-semantic-color-text-default-disabled);
    }

    :host([variant="dark"]) button {
      background: var(--jz-semantic-color-background-control-inverse-default);
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([variant="dark"]) button:hover:not(:disabled) {
      background: var(--jz-semantic-color-background-control-inverse-hover);
      color: var(--jz-semantic-color-text-inverse-hover);
    }

    :host([variant="dark"]) button:active:not(:disabled) {
      background: var(--jz-semantic-color-background-control-inverse-active);
      color: var(--jz-semantic-color-text-inverse-active);
    }

    :host([variant="dark"]) button:disabled {
      background: var(
        --jz-semantic-color-background-control-inverse-disabled
      );
      color: var(--jz-semantic-color-text-inverse-disabled);
    }
  `;

  @property({ type: String, reflect: true })
  variant: JzButtonVariant = "primary";

  @property({ type: String, reflect: true })
  size: JzButtonSize = "default";

  @property({ type: String })
  label = "Label";

  /** Figma `showtext` — when false, hide the label. */
  @property({ type: Boolean, attribute: "show-text", reflect: true })
  showText = true;

  /** Figma `showicon`. */
  @property({ type: Boolean, attribute: "show-icon", reflect: true })
  showIcon = true;

  /** Phosphor name for nested `jz-icon` (Figma `icon-icon` instance swap). */
  @property({ type: String, reflect: true })
  icon = DEFAULT_ICON;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Code-only — not in Figma. When true, shows a trailing Phosphor Spinner
   * (`jz-icon` with `spin`) to the right of the label.
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  override willUpdate(): void {
    if (!VARIANTS.includes(this.variant)) this.variant = "primary";
    if (!SIZES.includes(this.size)) this.size = "default";
  }

  override render() {
    const iconSize = this.size === "small" ? "small" : "medium";
    const icon = this.showIcon
      ? html`<jz-icon
          inherit-color
          size=${iconSize}
          icon=${this.icon || DEFAULT_ICON}
          ?disabled=${this.disabled}
        ></jz-icon>`
      : nothing;
    const text = this.showText && this.label ? this.label : nothing;
    const spinner = this.loading
      ? html`<jz-icon
          inherit-color
          spin
          size=${iconSize}
          icon=${SPINNER_ICON}
          ?disabled=${this.disabled}
        ></jz-icon>`
      : nothing;
    return html`<button
      type="button"
      ?disabled=${this.disabled}
      aria-busy=${this.loading ? "true" : "false"}
    >
      ${icon}${text}${spinner}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-button": JzButtonElement;
  }
}
