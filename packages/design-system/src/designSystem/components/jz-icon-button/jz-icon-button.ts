import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { JzIconElement, type JzIconSize } from "../jz-icon/jz-icon.js";

export type JzIconButtonSize = "medium" | "small";

const SIZES: readonly JzIconButtonSize[] = ["medium", "small"];
const DEFAULT_SIZE: JzIconButtonSize = "small";
const DEFAULT_ICON = "Flashlight";

/**
 * Icon-only button from the jz-icon-button capture. Size → nested
 * `jz-icon` size (Medium / Small). Interactive → native hover / active /
 * disabled. Host chrome: padding/sm + radius/sm (same both sizes).
 */
@customElement("jz-icon-button")
export class JzIconButtonElement extends LitElement {
  /** Keeps `jz-icon` in this module’s dependency graph (CE registration). */
  static readonly iconElement = JzIconElement;

  static override styles = css`
    :host {
      display: inline-flex;
      box-sizing: border-box;
      vertical-align: middle;
    }

    button {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: var(--jz-semantic-space-padding-sm);
      border: none;
      border-radius: var(--jz-primitive-radius-sm);
      background: transparent;
      color: inherit;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
    }

    button:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-border-strong);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }

    button:hover:not(:disabled) {
      background: var(
        --jz-semantic-color-background-control-default-hover
      );
    }

    button:active:not(:disabled) {
      background: var(
        --jz-semantic-color-background-control-default-active
      );
    }

    button:disabled {
      cursor: not-allowed;
    }
  `;

  /** Figma Size: Small (default) | Medium — drives nested icon size only. */
  @property({ type: String, reflect: true })
  size: JzIconButtonSize = DEFAULT_SIZE;

  /** Phosphor name for nested `jz-icon` (Figma instance swap). */
  @property({ type: String, reflect: true })
  icon = DEFAULT_ICON;

  /** Accessible name (no visible text in the capture). */
  @property({ type: String })
  label = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  override willUpdate(): void {
    if (!SIZES.includes(this.size)) this.size = DEFAULT_SIZE;
  }

  override render() {
    const iconSize: JzIconSize = this.size;
    return html`<button
      type="button"
      ?disabled=${this.disabled}
      aria-label=${this.label || nothing}
    >
      <jz-icon
        size=${iconSize}
        color="default"
        icon=${this.icon || DEFAULT_ICON}
        ?disabled=${this.disabled}
      ></jz-icon>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-icon-button": JzIconButtonElement;
  }
}
