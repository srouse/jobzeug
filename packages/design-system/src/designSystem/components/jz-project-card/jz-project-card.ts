import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { JzIconElement } from "../jz-icon/jz-icon.js";

/**
 * Project card from the jz-project-card capture (single default state).
 * Text props map 1:1 from Figma TEXT properties. Nested ArrowRight → jz-icon.
 */
@customElement("jz-project-card")
export class JzProjectCardElement extends LitElement {
  /** Keeps `jz-icon` in this module’s dependency graph (CE registration). */
  static readonly deps = [JzIconElement];

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--jz-primitive-space-1);
      width: 100%;
      height: 100%;
      margin: 0;
      padding: var(--jz-semantic-space-padding-lg);
      border: var(--jz-primitive-stroke-width-sm) solid
        var(--jz-semantic-color-border-subtle);
      border-radius: var(--jz-primitive-radius-xl);
      background: var(--jz-semantic-color-background-surface-default);
    }

    .supertitle,
    .title,
    .description,
    .cta-label {
      margin: 0;
      min-width: 0;
      max-width: 100%;
    }

    .supertitle {
      font: var(--jz-semantic-type-caption-font);
      color: var(--jz-semantic-color-text-muted);
      text-transform: uppercase;
    }

    .title {
      font: var(--jz-semantic-type-heading3-font);
      color: var(--jz-semantic-color-text-default);
    }

    .description {
      font: var(--jz-semantic-type-body-regular-font);
      color: var(--jz-semantic-color-text-muted);
    }

    .footer {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--jz-semantic-space-gap-md);
      width: 100%;
      min-width: 0;
      margin-top: auto;
    }

    .divider {
      box-sizing: border-box;
      display: block;
      width: 100%;
      height: 0;
      margin: 0;
      padding: 0;
      border: none;
      border-top: var(--jz-primitive-stroke-width-sm) solid
        var(--jz-semantic-color-border-subtle);
    }

    .cta {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--jz-primitive-space-1);
      width: 100%;
      min-width: 0;
    }

    .cta-label {
      font: var(--jz-semantic-type-label-font);
      color: var(--jz-semantic-color-text-default);
    }
  `;

  /** Figma `supertitle`. */
  @property({ type: String, reflect: true })
  supertitle = "supertitle";

  /** Figma `title`. Not reflected (avoids HTML tooltip `title`). */
  @property({ type: String })
  title = "title";

  /** Figma `description`. */
  @property({ type: String, reflect: true })
  description = "description";

  /** Figma `call to action`. */
  @property({ type: String, attribute: "call-to-action", reflect: true })
  callToAction = "call to action";

  override render() {
    return html`
      <p class="supertitle">${this.supertitle}</p>
      <p class="title">${this.title}</p>
      <p class="description">${this.description}</p>
      <div class="footer">
        <hr class="divider" />
        <div class="cta">
          <span class="cta-label">${this.callToAction}</span>
          <jz-icon icon="ArrowRight" size="small" color="default"></jz-icon>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-project-card": JzProjectCardElement;
  }
}
