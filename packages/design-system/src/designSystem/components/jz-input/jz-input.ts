import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Text input from the jz-input capture (single default state).
 * Figma TEXT `value` → `value` property on a native input.
 */
@customElement("jz-input")
export class JzInputElement extends LitElement {
  static override styles = css`
    :host {
      box-sizing: border-box;
      display: block;
      width: 100%;
    }

    input {
      box-sizing: border-box;
      display: block;
      width: 100%;
      margin: 0;
      padding: var(--jz-semantic-space-padding-sm);
      border: var(--jz-primitive-stroke-width-sm) solid
        var(--jz-semantic-color-border-subtle);
      border-radius: var(--jz-primitive-radius-sm);
      background: var(--jz-semantic-color-background-control-default);
      font: var(--jz-semantic-type-body-default-font);
      color: var(--jz-semantic-color-text-default);
      appearance: none;
      -webkit-appearance: none;
    }

    input:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-border-strong);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }
  `;

  /** Figma `value`. */
  @property({ type: String })
  value = "value";

  #onInput = (event: Event) => {
    const el = event.target;
    if (!(el instanceof HTMLInputElement)) return;
    this.value = el.value;
    this.dispatchEvent(
      new Event("input", { bubbles: true, composed: true }),
    );
  };

  #onChange = () => {
    this.dispatchEvent(
      new Event("change", { bubbles: true, composed: true }),
    );
  };

  override render() {
    return html`
      <input
        type="text"
        .value=${this.value}
        @input=${this.#onInput}
        @change=${this.#onChange}
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-input": JzInputElement;
  }
}
