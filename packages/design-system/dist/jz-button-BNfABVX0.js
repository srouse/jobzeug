import { LitElement as u, html as d, nothing as v, css as m } from "lit";
import { property as o, customElement as p } from "lit/decorators.js";
import { JzIconElement as h } from "./jz-icon-B52dtOZo.js";
var z = Object.defineProperty, f = Object.getOwnPropertyDescriptor, e = (i, a, s, n) => {
  for (var r = n > 1 ? void 0 : n ? f(a, s) : a, c = i.length - 1, l; c >= 0; c--)
    (l = i[c]) && (r = (n ? l(a, s, r) : l(r)) || r);
  return n && r && z(a, s, r), r;
};
const g = ["primary", "inverse", "dark"], j = ["default", "small"], b = "Info", y = "Spinner";
let t = class extends u {
  constructor() {
    super(...arguments), this.variant = "primary", this.size = "default", this.label = "Label", this.showText = !0, this.showIcon = !0, this.icon = b, this.disabled = !1, this.loading = !1;
  }
  willUpdate() {
    g.includes(this.variant) || (this.variant = "primary"), j.includes(this.size) || (this.size = "default");
  }
  render() {
    const i = this.size === "small" ? "small" : "medium", a = this.showIcon ? d`<jz-icon
          inherit-color
          size=${i}
          icon=${this.icon || b}
          ?disabled=${this.disabled}
        ></jz-icon>` : v, s = this.showText && this.label ? this.label : v, n = this.loading ? d`<jz-icon
          inherit-color
          spin
          size=${i}
          icon=${y}
          ?disabled=${this.disabled}
        ></jz-icon>` : v;
    return d`<button
      type="button"
      ?disabled=${this.disabled}
      aria-busy=${this.loading ? "true" : "false"}
    >
      ${a}${s}${n}
    </button>`;
  }
};
t.iconElement = h;
t.styles = m`
    :host {
      display: inline-block;
    }

    button {
      appearance: none;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      text-decoration: none;
      gap: var(--jz-semantic-space-gap-sm);
      padding: var(--jz-semantic-space-padding-sm)
        var(--jz-semantic-space-padding-md);
      border-radius: var(--jz-primitive-radius-sm);
    }

    button:disabled {
      cursor: default;
    }

    button:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-border-strong);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }

    :host([size="default"]) button {
      font: var(--jz-semantic-type-label-font);
    }

    :host([size="small"]) button {
      font: var(--jz-semantic-type-label-sm-font);
    }

    :host([variant="primary"]) button {
      background: var(
        --jz-semantic-color-background-control-brand-inverse-primary
      );
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([variant="primary"]) button:hover:not(:disabled) {
      background: var(
        --jz-semantic-color-background-control-brand-inverse-primary-hover
      );
      color: var(--jz-semantic-color-text-inverse-hover);
    }

    :host([variant="primary"]) button:active:not(:disabled) {
      background: var(
        --jz-semantic-color-background-control-brand-inverse-primary-active
      );
      color: var(--jz-semantic-color-text-inverse-active);
    }

    :host([variant="primary"]) button:disabled {
      background: var(
        --jz-semantic-color-background-control-brand-inverse-primary-disabled
      );
      color: var(--jz-semantic-color-text-inverse-disabled);
    }

    :host([variant="inverse"]) button {
      background: var(--jz-semantic-color-background-control-default);
      color: var(--jz-semantic-color-text-default);
    }

    :host([variant="inverse"]) button:hover:not(:disabled) {
      background: var(--jz-semantic-color-background-control-default-hover);
      color: var(--jz-semantic-color-text-default-hover);
    }

    :host([variant="inverse"]) button:active:not(:disabled) {
      background: var(--jz-semantic-color-background-control-default-active);
      color: var(--jz-semantic-color-text-default-active);
    }

    :host([variant="inverse"]) button:disabled {
      background: var(
        --jz-semantic-color-background-control-default-disabled
      );
      color: var(--jz-semantic-color-text-default-disabled);
    }

    :host([variant="dark"]) button {
      background: var(--jz-semantic-color-background-control-inverse-default);
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([variant="dark"]) button:hover:not(:disabled) {
      background: var(--jz-semantic-color-background-control-inverse-hover);
      color: var(--jz-semantic-color-text-inverse-hover);
    }

    :host([variant="dark"]) button:active:not(:disabled) {
      background: var(--jz-semantic-color-background-control-inverse-active);
      color: var(--jz-semantic-color-text-inverse-active);
    }

    :host([variant="dark"]) button:disabled {
      background: var(
        --jz-semantic-color-background-control-inverse-disabled
      );
      color: var(--jz-semantic-color-text-inverse-disabled);
    }
  `;
e([
  o({ type: String, reflect: !0 })
], t.prototype, "variant", 2);
e([
  o({ type: String, reflect: !0 })
], t.prototype, "size", 2);
e([
  o({ type: String })
], t.prototype, "label", 2);
e([
  o({ type: Boolean, attribute: "show-text", reflect: !0 })
], t.prototype, "showText", 2);
e([
  o({ type: Boolean, attribute: "show-icon", reflect: !0 })
], t.prototype, "showIcon", 2);
e([
  o({ type: String, reflect: !0 })
], t.prototype, "icon", 2);
e([
  o({ type: Boolean, reflect: !0 })
], t.prototype, "disabled", 2);
e([
  o({ type: Boolean, reflect: !0 })
], t.prototype, "loading", 2);
t = e([
  p("jz-button")
], t);
export {
  t as JzButtonElement
};
//# sourceMappingURL=jz-button-BNfABVX0.js.map
