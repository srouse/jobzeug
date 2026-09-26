import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { JzIconElement } from "../jz-icon/jz-icon.js";

const DEFAULT_TITLE = "Accordion title";
const DEFAULT_DESCRIPTION = "Description";
const DEFAULT_SUBTITLE = "Subtitle";
const DEFAULT_ICON = "CaretDown";

/**
 * Accordion item from the jz-accordion-item capture. Interactive → native
 * hover / active / disabled (title color only). Expanded panel gated by
 * `show-content`. Nested chevron is composed `jz-icon`.
 */
@customElement("jz-accordion-item")
export class JzAccordionItemElement extends LitElement {
  /** Keeps `jz-icon` in this module’s dependency graph (CE registration). */
  static readonly iconElement = JzIconElement;

  static override styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      width: 100%;
    }

    .base {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      margin: 0;
      padding: var(--jz-semantic-space-padding-md) 0;
      border: none;
      border-top: var(--jz-primitive-stroke-width-sm) solid
        var(--jz-semantic-color-border-subtle);
      background: transparent;
      font: var(--jz-semantic-type-subtitle-font);
      color: var(--jz-semantic-color-text-default);
      text-align: left;
      cursor: pointer;
    }

    .base:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-border-strong);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }

    .base:hover:not(:disabled) {
      color: var(--jz-semantic-color-text-default-hover);
    }

    .base:active:not(:disabled) {
      color: var(--jz-semantic-color-text-default-active);
    }

    .base:disabled {
      color: var(--jz-semantic-color-text-default-disabled);
      cursor: not-allowed;
    }

    .title {
      flex: 1 1 auto;
      min-width: 0;
      margin: 0;
    }

    .expanded {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--jz-semantic-space-gap-sm);
      padding: var(--jz-semantic-space-padding-xs) 0
        var(--jz-semantic-space-padding-md);
      color: var(--jz-semantic-color-text-default);
    }

    .subtitle,
    .description {
      margin: 0;
    }

    .slot {
      display: flex;
      flex-direction: row;
      gap: var(--jz-semantic-space-gap-md);
      width: 100%;
    }
  `;

  /** Figma `Title`. Not reflected (avoids HTML tooltip `title`). */
  @property({ type: String })
  title = DEFAULT_TITLE;

  @property({ type: String })
  description = DEFAULT_DESCRIPTION;

  @property({ type: String })
  subtitle = DEFAULT_SUBTITLE;

  /** Figma `Show Content` — reveals the Expanded panel. */
  @property({ type: Boolean, attribute: "show-content", reflect: true })
  showContent = false;

  /** Figma `Show Subtitle`. */
  @property({ type: Boolean, attribute: "show-subtitle", reflect: true })
  showSubtitle = true;

  /** Figma `Show slot`. */
  @property({ type: Boolean, attribute: "show-slot", reflect: true })
  showSlot = true;

  /**
   * Selection key for `jz-accordion` `open-item`. Falls back to index.
   * Code-only (not in the item capture).
   */
  @property({ type: String, reflect: true })
  value = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  #onHeaderClick(): void {
    if (this.disabled) return;
    const next = !this.showContent;
    const event = new CustomEvent("toggle", {
      detail: { open: next },
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this.dispatchEvent(event);
    // Standalone: apply locally. Inside `jz-accordion`, parent preventDefaults
    // and drives `show-content` via `open-item`.
    if (!event.defaultPrevented) {
      this.showContent = next;
    }
  }

  override render() {
    const open = this.showContent;
    return html`
      <button
        class="base"
        type="button"
        ?disabled=${this.disabled}
        aria-expanded=${open ? "true" : "false"}
        @click=${this.#onHeaderClick}
      >
        <span class="title">${this.title}</span>
        <jz-icon
          size="small"
          color="default"
          icon=${DEFAULT_ICON}
        ></jz-icon>
      </button>
      ${open
        ? html`<div class="expanded">
            ${this.showSubtitle && this.subtitle
              ? html`<p class="subtitle">${this.subtitle}</p>`
              : nothing}
            ${this.description
              ? html`<p class="description">${this.description}</p>`
              : nothing}
            ${this.showSlot
              ? html`<div class="slot"><slot></slot></div>`
              : nothing}
          </div>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-accordion-item": JzAccordionItemElement;
  }
}
