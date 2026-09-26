import { LitElement, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html, unsafeStatic } from "lit/static-html.js";

export type JzTextLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type JzTextVariant =
  | "display-large"
  | "display"
  | "title"
  | "heading"
  | "heading2"
  | "heading3"
  | "subtitle"
  | "body-default"
  | "body-regular"
  | "body-strong"
  | "label"
  | "label-sm"
  | "caption"
  | "overline";

export type JzTextWeight = "400" | "500" | "600" | "700";

export type JzTextColor =
  | "default"
  | "muted"
  | "primary"
  | "secondary"
  | "tertiary"
  | "inverse"
  | "error"
  | "success"
  | "warning";

const VARIANTS: readonly JzTextVariant[] = [
  "display-large",
  "display",
  "title",
  "heading",
  "heading2",
  "heading3",
  "subtitle",
  "body-default",
  "body-regular",
  "body-strong",
  "label",
  "label-sm",
  "caption",
  "overline",
];

const WEIGHTS: readonly JzTextWeight[] = ["400", "500", "600", "700"];

const COLORS: readonly JzTextColor[] = [
  "default",
  "muted",
  "primary",
  "secondary",
  "tertiary",
  "inverse",
  "error",
  "success",
  "warning",
];

const DEFAULT_VARIANT: JzTextVariant = "body-regular";
const DEFAULT_COLOR: JzTextColor = "default";

const LEVEL_TAGS = {
  0: "span",
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

/**
 * Token-only typography primitive (no Figma capture). Recipes are
 * `semantic.type`; optional `weight` / `color` override from primitives
 * and semantic text colors. `level` picks the semantic tag; `label` is
 * slot fallback; light-DOM children project through `<slot>`.
 * Opt-in `interactive` / `disabled` use control background + text tokens.
 */
@customElement("jz-text")
export class JzTextElement extends LitElement {
  static override styles = css`
    /* level 0 → span: sit in-line; headings take a block box */
    :host {
      display: inline;
      margin: 0;
    }

    :host([level="1"]),
    :host([level="2"]),
    :host([level="3"]),
    :host([level="4"]),
    :host([level="5"]),
    :host([level="6"]) {
      display: block;
    }

    .text {
      display: inline;
      margin: 0;
    }

    :host([level="1"]) .text,
    :host([level="2"]) .text,
    :host([level="3"]) .text,
    :host([level="4"]) .text,
    :host([level="5"]) .text,
    :host([level="6"]) .text {
      display: block;
    }

    :host([variant="display-large"]) .text {
      font-family: var(--jz-semantic-type-display-large-font-family);
      font-size: var(--jz-semantic-type-display-large-font-size);
      font-weight: var(--jz-semantic-type-display-large-font-weight);
      line-height: var(--jz-semantic-type-display-large-line-height);
    }

    :host([variant="display"]) .text {
      font-family: var(--jz-semantic-type-display-font-family);
      font-size: var(--jz-semantic-type-display-font-size);
      font-weight: var(--jz-semantic-type-display-font-weight);
      line-height: var(--jz-semantic-type-display-line-height);
    }

    :host([variant="title"]) .text {
      font-family: var(--jz-semantic-type-title-font-family);
      font-size: var(--jz-semantic-type-title-font-size);
      font-weight: var(--jz-semantic-type-title-font-weight);
      line-height: var(--jz-semantic-type-title-line-height);
    }

    :host([variant="heading"]) .text {
      font-family: var(--jz-semantic-type-heading-font-family);
      font-size: var(--jz-semantic-type-heading-font-size);
      font-weight: var(--jz-semantic-type-heading-font-weight);
      line-height: var(--jz-semantic-type-heading-line-height);
    }

    :host([variant="heading2"]) .text {
      font-family: var(--jz-semantic-type-heading2-font-family);
      font-size: var(--jz-semantic-type-heading2-font-size);
      font-weight: var(--jz-semantic-type-heading2-font-weight);
      line-height: var(--jz-semantic-type-heading2-line-height);
    }

    :host([variant="heading3"]) .text {
      font-family: var(--jz-semantic-type-heading3-font-family);
      font-size: var(--jz-semantic-type-heading3-font-size);
      font-weight: var(--jz-semantic-type-heading3-font-weight);
      line-height: var(--jz-semantic-type-heading3-line-height);
    }

    :host([variant="subtitle"]) .text {
      font-family: var(--jz-semantic-type-subtitle-font-family);
      font-size: var(--jz-semantic-type-subtitle-font-size);
      font-weight: var(--jz-semantic-type-subtitle-font-weight);
      line-height: var(--jz-semantic-type-subtitle-line-height);
    }

    :host([variant="body-default"]) .text {
      font-family: var(--jz-semantic-type-body-default-font-family);
      font-size: var(--jz-semantic-type-body-default-font-size);
      font-weight: var(--jz-semantic-type-body-default-font-weight);
      line-height: var(--jz-semantic-type-body-default-line-height);
    }

    :host([variant="body-regular"]) .text {
      font-family: var(--jz-semantic-type-body-regular-font-family);
      font-size: var(--jz-semantic-type-body-regular-font-size);
      font-weight: var(--jz-semantic-type-body-regular-font-weight);
      line-height: var(--jz-semantic-type-body-regular-line-height);
    }

    :host([variant="body-strong"]) .text {
      font-family: var(--jz-semantic-type-body-strong-font-family);
      font-size: var(--jz-semantic-type-body-strong-font-size);
      font-weight: var(--jz-semantic-type-body-strong-font-weight);
      line-height: var(--jz-semantic-type-body-strong-line-height);
    }

    :host([variant="label"]) .text {
      font-family: var(--jz-semantic-type-label-font-family);
      font-size: var(--jz-semantic-type-label-font-size);
      font-weight: var(--jz-semantic-type-label-font-weight);
      line-height: var(--jz-semantic-type-label-line-height);
    }

    :host([variant="label-sm"]) .text {
      font-family: var(--jz-semantic-type-label-sm-font-family);
      font-size: var(--jz-semantic-type-label-sm-font-size);
      font-weight: var(--jz-semantic-type-label-sm-font-weight);
      line-height: var(--jz-semantic-type-label-sm-line-height);
    }

    :host([variant="caption"]) .text {
      font-family: var(--jz-semantic-type-caption-font-family);
      font-size: var(--jz-semantic-type-caption-font-size);
      font-weight: var(--jz-semantic-type-caption-font-weight);
      line-height: var(--jz-semantic-type-caption-line-height);
    }

    :host([variant="overline"]) .text {
      font-family: var(--jz-semantic-type-overline-font-family);
      font-size: var(--jz-semantic-type-overline-font-size);
      font-weight: var(--jz-semantic-type-overline-font-weight);
      line-height: var(--jz-semantic-type-overline-line-height);
    }

    :host([weight="400"]) .text {
      font-weight: var(--jz-primitive-font-weight-400);
    }

    :host([weight="500"]) .text {
      font-weight: var(--jz-primitive-font-weight-500);
    }

    :host([weight="600"]) .text {
      font-weight: var(--jz-primitive-font-weight-600);
    }

    :host([weight="700"]) .text {
      font-weight: var(--jz-primitive-font-weight-700);
    }

    :host([color="default"]) .text {
      color: var(--jz-semantic-color-text-default);
    }

    :host([color="muted"]) .text {
      color: var(--jz-semantic-color-text-muted);
    }

    :host([color="primary"]) .text {
      color: var(--jz-semantic-color-text-primary);
    }

    :host([color="secondary"]) .text {
      color: var(--jz-semantic-color-text-secondary);
    }

    :host([color="tertiary"]) .text {
      color: var(--jz-semantic-color-text-tertiary);
    }

    :host([color="inverse"]) .text {
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([color="error"]) .text {
      color: var(--jz-semantic-color-text-error);
    }

    :host([color="success"]) .text {
      color: var(--jz-semantic-color-text-success);
    }

    :host([color="warning"]) .text {
      color: var(--jz-semantic-color-text-warning);
    }

    :host([interactive]:not([disabled])) {
      cursor: pointer;
    }

    :host([interactive]:not([disabled]):hover) {
      background: var(--jz-semantic-color-background-control-default-hover);
    }

    :host([disabled]) {
      cursor: not-allowed;
      background: var(
        --jz-semantic-color-background-control-default-disabled
      );
    }

    :host([disabled]) .text {
      color: var(--jz-semantic-color-text-default-disabled);
    }
  `;

  @property({ type: String, reflect: true })
  variant: JzTextVariant = DEFAULT_VARIANT;

  /** Unset keeps the recipe’s stock weight. */
  @property({ type: String, reflect: true })
  weight: JzTextWeight | "" = "";

  @property({ type: String, reflect: true })
  color: JzTextColor = DEFAULT_COLOR;

  /**
   * Semantic tag: `0` → `span`, `1`–`6` → `h1`–`h6`.
   * Reflected as attribute for CSS / debugging.
   */
  @property({ type: Number, reflect: true })
  level: JzTextLevel = 0;

  /** Slot fallback when there are no light-DOM children. */
  @property({ type: String })
  label = "";

  /** Opt-in control mode: pointer + control-default-hover background. */
  @property({ type: Boolean, reflect: true })
  interactive = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  #onKeyDown = (event: KeyboardEvent) => {
    if (!this.interactive || this.disabled) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    this.click();
  };

  #onClickCapture = (event: Event) => {
    if (!this.disabled) return;
    event.stopImmediatePropagation();
    event.preventDefault();
  };

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this.#onKeyDown);
    this.addEventListener("click", this.#onClickCapture, true);
  }

  override disconnectedCallback() {
    this.removeEventListener("keydown", this.#onKeyDown);
    this.removeEventListener("click", this.#onClickCapture, true);
    super.disconnectedCallback();
  }

  override willUpdate(): void {
    if (!VARIANTS.includes(this.variant)) this.variant = DEFAULT_VARIANT;
    if (!COLORS.includes(this.color)) this.color = DEFAULT_COLOR;
    if (this.weight && !WEIGHTS.includes(this.weight as JzTextWeight)) {
      this.weight = "";
    }
    const n = Number(this.level);
    if (!Number.isInteger(n) || n < 0 || n > 6) this.level = 0;
    else this.level = n as JzTextLevel;
  }

  override updated(): void {
    if (this.interactive && !this.disabled) {
      this.setAttribute("role", "button");
      this.tabIndex = 0;
      this.removeAttribute("aria-disabled");
      return;
    }
    if (this.disabled) {
      if (this.interactive) this.setAttribute("role", "button");
      else this.removeAttribute("role");
      this.tabIndex = -1;
      this.setAttribute("aria-disabled", "true");
      return;
    }
    this.removeAttribute("role");
    this.removeAttribute("tabindex");
    this.removeAttribute("aria-disabled");
  }

  override render() {
    const tagName = LEVEL_TAGS[this.level] ?? LEVEL_TAGS[0];
    const tag = unsafeStatic(tagName);
    const fallback = this.label ? this.label : nothing;
    return html`<${tag} class="text"><slot>${fallback}</slot></${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-text": JzTextElement;
  }
}
