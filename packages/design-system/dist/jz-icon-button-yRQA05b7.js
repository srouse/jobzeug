import { LitElement as p, nothing as u, html as m, css as f } from "lit";
import { property as s, customElement as h } from "lit/decorators.js";
import { JzIconElement as v } from "./jz-icon-B52dtOZo.js";
var z = Object.defineProperty, g = Object.getOwnPropertyDescriptor, o = (i, r, l, n) => {
  for (var t = n > 1 ? void 0 : n ? g(r, l) : r, a = i.length - 1, c; a >= 0; a--)
    (c = i[a]) && (t = (n ? c(r, l, t) : c(t)) || t);
  return n && t && z(r, l, t), t;
};
const y = ["medium", "small"], d = "small", b = "Flashlight";
let e = class extends p {
  constructor() {
    super(...arguments), this.size = d, this.icon = b, this.label = "", this.disabled = !1;
  }
  willUpdate() {
    y.includes(this.size) || (this.size = d);
  }
  render() {
    const i = this.size;
    return m`<button
      type="button"
      ?disabled=${this.disabled}
      aria-label=${this.label || u}
    >
      <jz-icon
        size=${i}
        color="default"
        icon=${this.icon || b}
        ?disabled=${this.disabled}
      ></jz-icon>
    </button>`;
  }
};
e.iconElement = v;
e.styles = f`
    :host {
      display: inline-flex;
      box-sizing: border-box;
      vertical-align: middle;
    }

    button {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: var(--jz-semantic-space-padding-sm);
      border: none;
      border-radius: var(--jz-primitive-radius-sm);
      background: transparent;
      color: inherit;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
    }

    button:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-border-strong);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }

    button:hover:not(:disabled) {
      background: var(
        --jz-semantic-color-background-control-default-hover
      );
    }

    button:active:not(:disabled) {
      background: var(
        --jz-semantic-color-background-control-default-active
      );
    }

    button:disabled {
      cursor: not-allowed;
    }
  `;
o([
  s({ type: String, reflect: !0 })
], e.prototype, "size", 2);
o([
  s({ type: String, reflect: !0 })
], e.prototype, "icon", 2);
o([
  s({ type: String })
], e.prototype, "label", 2);
o([
  s({ type: Boolean, reflect: !0 })
], e.prototype, "disabled", 2);
e = o([
  h("jz-icon-button")
], e);
export {
  e as JzIconButtonElement
};
//# sourceMappingURL=jz-icon-button-yRQA05b7.js.map
