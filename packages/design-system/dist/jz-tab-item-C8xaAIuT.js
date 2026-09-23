import { LitElement as d, html as p, css as b } from "lit";
import { property as s, customElement as u } from "lit/decorators.js";
var f = Object.defineProperty, m = Object.getOwnPropertyDescriptor, r = (c, o, i, a) => {
  for (var e = a > 1 ? void 0 : a ? m(o, i) : o, l = c.length - 1, n; l >= 0; l--)
    (n = c[l]) && (e = (a ? n(o, i, e) : n(e)) || e);
  return a && e && f(o, i, e), e;
};
let t = class extends d {
  constructor() {
    super(...arguments), this.label = "label", this.href = "", this.value = "", this.selected = !1;
  }
  render() {
    return this.href ? p`<a
        class="tab"
        href=${this.href}
        role="tab"
        aria-selected=${this.selected ? "true" : "false"}
      >
        ${this.label}
      </a>` : p`<button
      class="tab"
      type="button"
      role="tab"
      aria-selected=${this.selected ? "true" : "false"}
    >
      ${this.label}
    </button>`;
  }
};
t.styles = b`
    :host {
      display: inline-block;
    }

    .tab {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      border: none;
      background: transparent;
      box-shadow: none;
      border-radius: var(--jz-primitive-radius-md);
      padding: var(--jz-semantic-space-padding-xs)
        var(--jz-semantic-space-padding-sm);
      font: var(--jz-semantic-type-body-regular-font);
      color: var(--jz-semantic-color-text-default);
      cursor: pointer;
      text-decoration: none;
    }

    .tab:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-border-strong);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }

    :host([selected]) .tab {
      background: var(--jz-semantic-color-background-control-default);
      box-shadow: var(--jz-primitive-effect-elevation-low);
    }
  `;
r([
  s({ type: String })
], t.prototype, "label", 2);
r([
  s({ type: String, reflect: !0 })
], t.prototype, "href", 2);
r([
  s({ type: String, reflect: !0 })
], t.prototype, "value", 2);
r([
  s({ type: Boolean, reflect: !0 })
], t.prototype, "selected", 2);
t = r([
  u("jz-tab-item")
], t);
export {
  t as JzTabItemElement
};
//# sourceMappingURL=jz-tab-item-C8xaAIuT.js.map
