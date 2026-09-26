import { LitElement, css, nothing } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Horizontal rule from the jz-divider capture (single default state).
 * No props — fill is `border/default`, height is stroke `sm`.
 */
@customElement("jz-divider")
export class JzDividerElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: var(--jz-primitive-stroke-width-sm);
      margin: 0;
      padding: 0;
      border: none;
      background: var(--jz-semantic-color-border-default);
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "separator");
    }
  }

  override render() {
    return nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-divider": JzDividerElement;
  }
}
