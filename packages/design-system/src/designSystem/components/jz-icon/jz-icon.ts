import { LitElement, css, html, unsafeCSS, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import phosphorCss from "./assets/Phosphor.css?inline";
import phosphorFillCss from "./assets/PhosphorFill.css?inline";
import { ensureStyle } from "./ensureStyle.js";
import { iconToKebab } from "./iconToKebab.js";

/* @font-face must live on document; glyph rules are also adopted in shadow
 * so composed icons (inside button/tag) still paint. */
ensureStyle("jz-phosphor", phosphorCss);
ensureStyle("jz-phosphor-fill", phosphorFillCss);

export type JzIconColor = "default" | "inverse" | "primary";
export type JzIconSize = "small" | "medium" | "large";
export type JzIconWeight = "regular" | "fill";

const COLORS: readonly JzIconColor[] = ["default", "inverse", "primary"];
const SIZES: readonly JzIconSize[] = ["small", "medium", "large"];

const DEFAULT_COLOR: JzIconColor = "default";
const DEFAULT_SIZE: JzIconSize = "large";
const DEFAULT_ICON = "Info";
const DEFAULT_WEIGHT: JzIconWeight = "regular";

/**
 * Phosphor webfont icon. Color and size map to Figma axes; `icon` is any
 * Phosphor name (PascalCase or kebab). `weight`, `disabled`, `spin`, and
 * `inheritColor` are code-only. Glyph is a shadow span with Phosphor classes
 * (document CSS does not pierce parent shadows when this icon is composed).
 */
@customElement("jz-icon")
export class JzIconElement extends LitElement {
  static override styles = [
    unsafeCSS(phosphorCss),
    unsafeCSS(phosphorFillCss),
    css`
      :host {
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        line-height: 1;
      }

      .glyph {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: inherit;
        line-height: 1;
        color: inherit;
      }

      :host([size="small"]) {
        font-size: var(--jz-semantic-space-icon-sm);
        width: var(--jz-semantic-space-icon-sm);
        height: var(--jz-semantic-space-icon-sm);
        min-width: var(--jz-semantic-space-icon-sm);
        min-height: var(--jz-semantic-space-icon-sm);
      }

      :host([size="medium"]) {
        font-size: var(--jz-semantic-space-icon-md);
        width: var(--jz-semantic-space-icon-md);
        height: var(--jz-semantic-space-icon-md);
        min-width: var(--jz-semantic-space-icon-md);
        min-height: var(--jz-semantic-space-icon-md);
      }

      :host([size="large"]) {
        font-size: var(--jz-semantic-space-icon-lg);
        width: var(--jz-semantic-space-icon-lg);
        height: var(--jz-semantic-space-icon-lg);
        min-width: var(--jz-semantic-space-icon-lg);
        min-height: var(--jz-semantic-space-icon-lg);
      }

      :host([color="default"]:not([disabled]):not([inherit-color])) {
        color: var(--jz-semantic-color-icon-default);
      }

      :host([color="inverse"]:not([disabled]):not([inherit-color])) {
        color: var(--jz-semantic-color-icon-inverse);
      }

      :host([color="primary"]:not([disabled]):not([inherit-color])) {
        color: var(--jz-semantic-color-icon-primary);
      }

      :host([disabled][color="default"]:not([inherit-color])),
      :host([disabled][color="primary"]:not([inherit-color])) {
        color: var(--jz-semantic-color-icon-default-disabled);
      }

      :host([disabled][color="inverse"]:not([inherit-color])) {
        color: var(--jz-semantic-color-icon-inverse-disabled);
      }

      /* Compose inside parents that set color on chrome (button, tag). */
      :host([inherit-color]) {
        color: inherit;
      }

      @keyframes jz-icon-spin {
        to {
          transform: rotate(360deg);
        }
      }

      :host([spin]) {
        overflow: hidden;
      }

      :host([spin]) .glyph::before {
        display: inline-block;
        transform-origin: center;
        animation: jz-icon-spin 1s linear infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        :host([spin]) .glyph::before {
          animation: none;
        }
      }
    `,
  ];

  @property({ type: String, reflect: true })
  color: JzIconColor = DEFAULT_COLOR;

  @property({ type: String, reflect: true })
  size: JzIconSize = DEFAULT_SIZE;

  /** Phosphor icon PascalCase or kebab-case (e.g. `Info`, `magnifying-glass`). */
  @property({ type: String, reflect: true })
  icon = DEFAULT_ICON;

  /** Phosphor glyph weight (code-only; not on Figma contract). */
  @property({ type: String, reflect: true })
  weight: JzIconWeight = DEFAULT_WEIGHT;

  /** When true, use disabled semantic icon colors (code-only). */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * When true, continuously rotate the Phosphor glyph (`::before` only).
   * Host layout box is unchanged (code-only).
   */
  @property({ type: Boolean, reflect: true })
  spin = false;

  /**
   * When true, use color: inherit so a parent (button/tag) can drive the
   * glyph from its text color (code-only; composition).
   */
  @property({ type: Boolean, attribute: "inherit-color", reflect: true })
  inheritColor = false;

  #applied = new Set<string>();

  override willUpdate(): void {
    if (!COLORS.includes(this.color)) this.color = DEFAULT_COLOR;
    if (!SIZES.includes(this.size)) this.size = DEFAULT_SIZE;
    if (this.weight !== "fill") this.weight = DEFAULT_WEIGHT;
  }

  override render() {
    return html`<span class="glyph"></span>`;
  }

  protected override updated(_changedProperties: PropertyValues): void {
    this.syncGlyphClasses();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute("aria-hidden")) {
      this.setAttribute("aria-hidden", "true");
    }
  }

  /** Phosphor webfont classes on the shadow glyph (shadow-local CSS). */
  private syncGlyphClasses(): void {
    const el = this.renderRoot.querySelector(".glyph");
    if (!(el instanceof HTMLElement)) return;

    const weight = this.weight === "fill" ? "fill" : "regular";
    const kebab = this.icon ? iconToKebab(this.icon) : "";
    const glyphClass = kebab ? `ph-${kebab}` : "";

    const next = [
      "glyph",
      "ph",
      ...(weight === "fill" ? ["ph-fill"] : []),
      ...(glyphClass ? [glyphClass] : []),
    ];

    for (const cls of this.#applied) {
      if (!next.includes(cls)) el.classList.remove(cls);
    }
    for (const cls of next) {
      el.classList.add(cls);
    }
    this.#applied = new Set(next);

    this.dataset.color = this.color;
    this.dataset.size = this.size;
    this.dataset.weight = weight;
    if (kebab) this.dataset.icon = kebab;
    else delete this.dataset.icon;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-icon": JzIconElement;
  }
}
