import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

export type JzHighlightBreakpoint = "default" | "mobile";

const BREAKPOINTS: readonly JzHighlightBreakpoint[] = ["default", "mobile"];
const DEFAULT_BREAKPOINT: JzHighlightBreakpoint = "default";

/**
 * Highlight control from the jz-highlight capture.
 * breakpoint → layout; interactive → native hover/active/disabled;
 * isSelected → `selected`. Default body is a 7-col grid (highlight
 * span 4, description span 3). Typography via host type tokens.
 */
@customElement("jz-highlight")
export class JzHighlightElement extends LitElement {
  static override styles = css`
    :host {
      box-sizing: border-box;
      display: block;
      width: 100%;
    }

    button.root {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--jz-semantic-space-gap-md);
      width: 100%;
      margin: 0;
      padding: var(--jz-semantic-space-padding-md);
      border: none;
      border-radius: var(--jz-primitive-radius-md);
      background: transparent;
      text-align: left;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
    }

    :host([breakpoint="mobile"]) button.root {
      gap: var(--jz-semantic-space-gap-sm);
    }

    button.root:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-border-strong);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }

    button.root:hover:not(:disabled) {
      background: var(
        --jz-semantic-color-background-control-brand-primary
      );
    }

    button.root:active:not(:disabled) {
      background: var(
        --jz-semantic-color-background-control-default-active
      );
    }

    button.root:disabled {
      background: var(
        --jz-semantic-color-background-control-default-disabled
      );
      cursor: not-allowed;
    }

    :host([selected]) button.root {
      background: var(
        --jz-semantic-color-background-control-brand-primary
      );
    }

    :host([selected]) button.root:hover:not(:disabled) {
      background: var(
        --jz-semantic-color-background-control-brand-primary-hover
      );
    }

    :host([selected]) button.root:active:not(:disabled) {
      background: var(
        --jz-semantic-color-background-control-brand-primary-active
      );
    }

    :host([selected]) button.root:disabled {
      background: var(
        --jz-semantic-color-background-control-brand-primary-disabled
      );
    }

    .title {
      margin: 0;
      font: var(--jz-semantic-type-caption-font);
      color: var(--jz-semantic-color-text-muted);
    }

    .body {
      box-sizing: border-box;
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: var(--jz-semantic-space-gap-lg);
      width: 100%;
    }

    :host([breakpoint="mobile"]) .body {
      display: flex;
      flex-direction: column;
      gap: var(--jz-semantic-space-gap-md);
    }

    .highlight {
      box-sizing: border-box;
      grid-column: span 4;
      min-width: 0;
      margin: 0;
      font: var(--jz-semantic-type-heading-font);
      color: var(--jz-semantic-color-text-default);
    }

    .description {
      box-sizing: border-box;
      grid-column: span 3;
      min-width: 0;
      margin: 0;
      font: var(--jz-semantic-type-body-regular-font);
      color: var(--jz-semantic-color-text-muted);
    }

    :host([breakpoint="mobile"]) .highlight,
    :host([breakpoint="mobile"]) .description {
      grid-column: auto;
      width: 100%;
    }

    button.root:active:not(:disabled) .highlight {
      color: var(--jz-semantic-color-text-default-active);
    }

    button.root:disabled .title,
    button.root:disabled .highlight,
    button.root:disabled .description {
      color: var(--jz-semantic-color-text-default-disabled);
    }
  `;

  /** Figma breakpoint: Default | mobile. */
  @property({ type: String, reflect: true })
  breakpoint: JzHighlightBreakpoint = DEFAULT_BREAKPOINT;

  /** Figma `isSelected`. */
  @property({ type: Boolean, reflect: true })
  selected = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Figma `title`. Not reflected (avoids HTML tooltip `title`). */
  @property({ type: String })
  title = "title";

  /** Figma `highlight` (primary value text). */
  @property({ type: String, reflect: true })
  highlight = "highlight";

  @property({ type: String, reflect: true })
  description = "description";

  override willUpdate(): void {
    if (!BREAKPOINTS.includes(this.breakpoint)) {
      this.breakpoint = DEFAULT_BREAKPOINT;
    }
  }

  override render() {
    return html`
      <button
        type="button"
        class="root"
        ?disabled=${this.disabled}
        aria-pressed=${this.selected ? "true" : "false"}
      >
        <span class="title">${this.title}</span>
        <div class="body">
          <span class="highlight">${this.highlight}</span>
          <span class="description">${this.description}</span>
        </div>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-highlight": JzHighlightElement;
  }
}
