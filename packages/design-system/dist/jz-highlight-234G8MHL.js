import { LitElement as p, html as b, css as g } from "lit";
import { property as r, customElement as u } from "lit/decorators.js";
var m = Object.defineProperty, h = Object.getOwnPropertyDescriptor, e = (d, i, n, a) => {
  for (var o = a > 1 ? void 0 : a ? h(i, n) : i, s = d.length - 1, l; s >= 0; s--)
    (l = d[s]) && (o = (a ? l(i, n, o) : l(o)) || o);
  return a && o && m(i, n, o), o;
};
const v = ["default", "mobile"], c = "default";
let t = class extends p {
  constructor() {
    super(...arguments), this.breakpoint = c, this.selected = !1, this.disabled = !1, this.title = "title", this.highlight = "highlight", this.description = "description";
  }
  willUpdate() {
    v.includes(this.breakpoint) || (this.breakpoint = c);
  }
  render() {
    return b`
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
};
t.styles = g`
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
e([
  r({ type: String, reflect: !0 })
], t.prototype, "breakpoint", 2);
e([
  r({ type: Boolean, reflect: !0 })
], t.prototype, "selected", 2);
e([
  r({ type: Boolean, reflect: !0 })
], t.prototype, "disabled", 2);
e([
  r({ type: String })
], t.prototype, "title", 2);
e([
  r({ type: String, reflect: !0 })
], t.prototype, "highlight", 2);
e([
  r({ type: String, reflect: !0 })
], t.prototype, "description", 2);
t = e([
  u("jz-highlight")
], t);
export {
  t as JzHighlightElement
};
//# sourceMappingURL=jz-highlight-234G8MHL.js.map
