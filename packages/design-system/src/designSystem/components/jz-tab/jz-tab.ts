import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

export type JzTabDirection = "bottom" | "top";

const DIRECTIONS: readonly JzTabDirection[] = ["bottom", "top"];
const DEFAULT_DIRECTION: JzTabDirection = "bottom";

/**
 * Tab from the jz-tab capture. Interactive → native :hover/:active/disabled;
 * selected → indicator bar; direction → bar top or bottom.
 */
@customElement("jz-tab")
export class JzTabElement extends LitElement {
  static override styles = css`
    :host {
      box-sizing: border-box;
      display: inline-flex;
      flex: 0 0 auto;
    }

    button.root {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: max-content;
      margin: 0;
      padding: 0;
      border: none;
      background: var(--jz-semantic-color-background-control-default);
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
    }

    :host([direction="top"]) button.root {
      flex-direction: column-reverse;
    }

    button.root:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-border-strong);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }

    button.root:disabled {
      cursor: not-allowed;
    }

    .label {
      box-sizing: border-box;
      display: block;
      margin: 0;
      padding: var(--jz-semantic-space-padding-md)
        var(--jz-semantic-space-padding-lg);
      font: var(--jz-semantic-type-body-regular-font);
      color: var(--jz-semantic-color-text-default);
      white-space: nowrap;
    }

    /* Selected: shrink padding on the bar side by bar thickness (16 − 4). */
    :host([selected]) .label {
      padding-bottom: calc(
        var(--jz-semantic-space-padding-md) -
          var(--jz-primitive-stroke-width-lg)
      );
    }

    :host([selected][direction="top"]) .label {
      padding-top: calc(
        var(--jz-semantic-space-padding-md) -
          var(--jz-primitive-stroke-width-lg)
      );
      padding-bottom: var(--jz-semantic-space-padding-md);
    }

    .bar {
      display: none;
      box-sizing: border-box;
      width: 100%;
      height: var(--jz-primitive-stroke-width-lg);
      margin: 0;
      padding: 0;
      border: none;
      background: var(--jz-semantic-color-border-brand-strong);
    }

    :host([selected]) .bar {
      display: block;
    }

    button.root:hover:not(:disabled) .label {
      color: var(--jz-semantic-color-text-default-hover);
    }

    :host([selected]) button.root:hover:not(:disabled) .label {
      color: var(--jz-semantic-color-text-default);
    }

    button.root:active:not(:disabled) .label {
      color: var(--jz-semantic-color-text-default-hover);
    }

    :host([selected]) button.root:active:not(:disabled) .label {
      color: var(--jz-semantic-color-text-default);
    }

    button.root:disabled .label {
      color: var(--jz-semantic-color-text-default-disabled);
    }

    :host([selected]) button.root:disabled .bar {
      background: var(--jz-semantic-color-text-default-disabled);
    }
  `;

  /** Figma `direction`: bottom | top — selected-bar edge. */
  @property({ type: String, reflect: true })
  direction: JzTabDirection = DEFAULT_DIRECTION;

  /** Figma `selected`. */
  @property({ type: Boolean, reflect: true })
  selected = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Figma `label`. */
  @property({ type: String, reflect: true })
  label = "label";

  /**
   * Selection key for `jz-tab-group` (code-only; not on Figma contract).
   * Falls back to child index when empty.
   */
  @property({ type: String, reflect: true })
  value = "";

  override willUpdate(): void {
    if (!DIRECTIONS.includes(this.direction)) {
      this.direction = DEFAULT_DIRECTION;
    }
  }

  override render() {
    return html`
      <button
        type="button"
        class="root"
        role="tab"
        ?disabled=${this.disabled}
        aria-selected=${this.selected ? "true" : "false"}
      >
        <span class="label">${this.label}</span>
        <span class="bar" aria-hidden="true"></span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-tab": JzTabElement;
  }
}
