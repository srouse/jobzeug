import { LitElement as u, html as d, nothing as v, css as m } from "lit";
import { property as e, customElement as h } from "lit/decorators.js";
import { JzIconElement as p } from "./jz-icon-B52dtOZo.js";
var z = Object.defineProperty, j = Object.getOwnPropertyDescriptor, o = (i, a, n, s) => {
  for (var r = s > 1 ? void 0 : s ? j(a, n) : a, c = i.length - 1, l; c >= 0; c--)
    (l = i[c]) && (r = (s ? l(a, n, r) : l(r)) || r);
  return s && r && z(a, n, r), r;
};
const f = [
  "primary",
  "secondary",
  "inverse",
  "dark"
], g = ["default", "small"], b = "Info";
let t = class extends u {
  constructor() {
    super(...arguments), this.variant = "primary", this.size = "default", this.label = "Label", this.showText = !0, this.showIcon = !0, this.icon = b, this.disabled = !1;
  }
  willUpdate() {
    f.includes(this.variant) || (this.variant = "primary"), g.includes(this.size) || (this.size = "default");
  }
  render() {
    const i = this.size === "small" ? "small" : "medium", a = this.showIcon ? d`<jz-icon
          inherit-color
          size=${i}
          icon=${this.icon || b}
          ?disabled=${this.disabled}
        ></jz-icon>` : v, n = this.showText && this.label ? this.label : v;
    return d`<button type="button" ?disabled=${this.disabled}>
      ${a}${n}
    </button>`;
  }
};
t.iconElement = p;
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
      border-radius: var(--jz-primitive-radius-lg);
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

    :host([variant="secondary"]) button {
      border-width: var(--jz-primitive-stroke-width-md);
      border-style: solid;
      border-color: var(--jz-semantic-color-border-strong);
      color: var(--jz-semantic-color-text-muted);
    }

    :host([variant="secondary"]) button:hover:not(:disabled) {
      color: var(--jz-semantic-color-text-default-hover);
    }

    :host([variant="secondary"]) button:active:not(:disabled) {
      color: var(--jz-semantic-color-text-default-active);
    }

    :host([variant="secondary"]) button:disabled {
      background: var(
        --jz-semantic-color-background-control-default-disabled
      );
      color: var(--jz-semantic-color-text-default-disabled);
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
      border-width: var(--jz-primitive-stroke-width-md);
      border-style: solid;
      border-color: var(--jz-semantic-color-border-default);
      background: var(--jz-semantic-color-background-control-inverse-active);
      color: var(--jz-semantic-color-text-inverse-active);
    }

    :host([variant="dark"][size="default"]) button:disabled {
      border-width: var(--jz-primitive-stroke-width-md);
      border-style: solid;
      border-color: var(--jz-semantic-color-border-default);
      background: var(
        --jz-semantic-color-background-control-inverse-disabled
      );
      color: var(--jz-semantic-color-text-inverse-disabled);
    }

    :host([variant="dark"][size="small"]) button:disabled {
      background: var(
        --jz-semantic-color-background-control-inverse-disabled
      );
      color: var(--jz-semantic-color-text-inverse-disabled);
    }
  `;
o([
  e({ type: String, reflect: !0 })
], t.prototype, "variant", 2);
o([
  e({ type: String, reflect: !0 })
], t.prototype, "size", 2);
o([
  e({ type: String })
], t.prototype, "label", 2);
o([
  e({ type: Boolean, attribute: "show-text", reflect: !0 })
], t.prototype, "showText", 2);
o([
  e({ type: Boolean, attribute: "show-icon", reflect: !0 })
], t.prototype, "showIcon", 2);
o([
  e({ type: String, reflect: !0 })
], t.prototype, "icon", 2);
o([
  e({ type: Boolean, reflect: !0 })
], t.prototype, "disabled", 2);
t = o([
  h("jz-button")
], t);
export {
  t as JzButtonElement
};
//# sourceMappingURL=jz-button-CL1AIyhq.js.map
