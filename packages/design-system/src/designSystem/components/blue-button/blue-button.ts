import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { root, sizes, variants } from "./blue-button.css.js";

export type JzButtonVariant = keyof typeof variants;
export type JzButtonSize = keyof typeof sizes;

/**
 * Button from the blue-button capture. Interaction is native
 * (`:hover`, `:active`, `disabled`). Text is `label` + `showText`.
 * Size drives type (`label` vs `label/sm`), nested icon (AGENTS.md),
 * and Dark+Disabled border.
 */
@customElement("jz-button")
export class JzButtonElement extends LitElement {
  @property({ type: String, reflect: true })
  variant: JzButtonVariant = "primary";

  @property({ type: String, reflect: true })
  size: JzButtonSize = "default";

  @property({ type: String })
  label = "Label";

  /** Figma `showtext` — when false, hide the label. */
  @property({ type: Boolean, attribute: "show-text", reflect: true })
  showText = true;

  /**
   * Figma `showicon`. No host chrome until `blue-icon` is composed
   * (see AGENTS.md).
   */
  @property({ type: Boolean, attribute: "show-icon", reflect: true })
  showIcon = true;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  override createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  override render() {
    const variant = variants[this.variant] ?? variants.primary;
    const size = sizes[this.size] ?? sizes.default;
    const text = this.showText && this.label ? this.label : nothing;
    return html`<button
      class=${classMap({ [root]: true, [variant]: true, [size]: true })}
      type="button"
      ?disabled=${this.disabled}
    >
      ${text}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-button": JzButtonElement;
  }
}
