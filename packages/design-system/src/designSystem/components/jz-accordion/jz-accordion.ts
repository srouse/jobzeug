import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { JzAccordionItemElement } from "../jz-accordion-item/jz-accordion-item.js";

/**
 * Accordion from the jz-accordion capture. Layout shell only — compose
 * `jz-accordion-item` children. `openItem` matches a child `value`, or its
 * index as a string (`"0"`, `"1"`, …). At most one item is open.
 */
@customElement("jz-accordion")
export class JzAccordionElement extends LitElement {
  /** Keeps `jz-accordion-item` in this module’s dependency graph. */
  static readonly itemElement = JzAccordionItemElement;

  static override styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      width: 100%;
    }

    .root {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      width: 100%;
      margin: 0;
      padding: 0;
      gap: 0;
      border: none;
      background: transparent;
    }

    ::slotted(jz-accordion-item) {
      display: block;
      width: 100%;
    }
  `;

  /**
   * Open item key: a child `value`, or index string (`"0"`, `"1"`, …).
   * Empty string means none open. Capture sample opened the first item (`"0"`).
   */
  @property({ type: String, attribute: "open-item", reflect: true })
  openItem = "0";

  #onToggle = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const path = event.composedPath();
    const item = path.find(
      (node): node is JzAccordionItemElement =>
        node instanceof JzAccordionItemElement,
    );
    if (!item || item.parentElement !== this) return;

    const items = this.#items();
    const index = items.indexOf(item);
    if (index < 0) return;

    // Container owns open state — item must not self-apply show-content.
    event.preventDefault();

    const key = item.value || String(index);
    const wantOpen = Boolean(event.detail?.open);
    const next = wantOpen ? key : this.openItem === key ? "" : this.openItem;
    if (this.openItem === next) {
      this.#syncOpen();
      return;
    }
    this.openItem = next;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          openItem: next,
          index: next === "" ? -1 : index,
        },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("toggle", this.#onToggle);
  }

  override disconnectedCallback() {
    this.removeEventListener("toggle", this.#onToggle);
    super.disconnectedCallback();
  }

  protected override firstUpdated() {
    this.#syncOpen();
  }

  protected override updated(changed: PropertyValues) {
    if (changed.has("openItem")) {
      this.#syncOpen();
    }
  }

  #items(): JzAccordionItemElement[] {
    return [
      ...this.querySelectorAll<JzAccordionItemElement>(
        ":scope > jz-accordion-item",
      ),
    ];
  }

  #syncOpen() {
    const items = this.#items();
    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      const key = item.value || String(i);
      item.showContent = key === this.openItem && this.openItem !== "";
    }
  }

  #onSlotChange = () => {
    this.#syncOpen();
  };

  override render() {
    return html`
      <div class="root">
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-accordion": JzAccordionElement;
  }
}
