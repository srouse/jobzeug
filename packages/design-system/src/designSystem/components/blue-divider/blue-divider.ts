import { LitElement, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { root } from "./blue-divider.css.js";

/**
 * Horizontal rule from the blue-divider capture (single default state).
 * No props — fill is `border/default`, height is stroke `sm`.
 */
@customElement("jz-divider")
export class JzDividerElement extends LitElement {
  override createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.classList.add(root);
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
