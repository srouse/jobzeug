import { LitElement as x, html as C, css as I } from "lit";
import { property as k, customElement as z } from "lit/decorators.js";
import { JzAccordionItemElement as g } from "./jz-accordion-item-DVACjinn.js";
var O = Object.defineProperty, S = Object.getOwnPropertyDescriptor, E = (t) => {
  throw TypeError(t);
}, b = (t, e, n, i) => {
  for (var o = i > 1 ? void 0 : i ? S(e, n) : e, r = t.length - 1, p; r >= 0; r--)
    (p = t[r]) && (o = (i ? p(e, n, o) : p(o)) || o);
  return i && o && O(e, n, o), o;
}, w = (t, e, n) => e.has(t) || E("Cannot " + n), m = (t, e, n) => (w(t, e, "read from private field"), n ? n.call(t) : e.get(t)), f = (t, e, n) => e.has(t) ? E("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), a = (t, e, n) => (w(t, e, "access private method"), n), d, s, v, c, u;
let l = class extends x {
  constructor() {
    super(...arguments), f(this, s), this.openItem = "0", f(this, d, (t) => {
      var _;
      if (!(t instanceof CustomEvent)) return;
      const n = t.composedPath().find(
        (y) => y instanceof g
      );
      if (!n || n.parentElement !== this) return;
      const o = a(this, s, v).call(this).indexOf(n);
      if (o < 0) return;
      t.preventDefault();
      const r = n.value || String(o), h = !!((_ = t.detail) != null && _.open) ? r : this.openItem === r ? "" : this.openItem;
      if (this.openItem === h) {
        a(this, s, c).call(this);
        return;
      }
      this.openItem = h, this.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            openItem: h,
            index: h === "" ? -1 : o
          },
          bubbles: !0,
          composed: !0
        })
      );
    }), f(this, u, () => {
      a(this, s, c).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("toggle", m(this, d));
  }
  disconnectedCallback() {
    this.removeEventListener("toggle", m(this, d)), super.disconnectedCallback();
  }
  firstUpdated() {
    a(this, s, c).call(this);
  }
  updated(t) {
    t.has("openItem") && a(this, s, c).call(this);
  }
  render() {
    return C`
      <div class="root">
        <slot @slotchange=${m(this, u)}></slot>
      </div>
    `;
  }
};
d = /* @__PURE__ */ new WeakMap();
s = /* @__PURE__ */ new WeakSet();
v = function() {
  return [
    ...this.querySelectorAll(
      ":scope > jz-accordion-item"
    )
  ];
};
c = function() {
  const t = a(this, s, v).call(this);
  for (let e = 0; e < t.length; e++) {
    const n = t[e], i = n.value || String(e);
    n.showContent = i === this.openItem && this.openItem !== "";
  }
};
u = /* @__PURE__ */ new WeakMap();
l.itemElement = g;
l.styles = I`
    :host {
      display: block;
      box-sizing: border-box;
      width: 100%;
    }

    .root {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      width: 100%;
      margin: 0;
      padding: 0;
      gap: 0;
      border: none;
      background: transparent;
    }

    ::slotted(jz-accordion-item) {
      display: block;
      width: 100%;
    }
  `;
b([
  k({ type: String, attribute: "open-item", reflect: !0 })
], l.prototype, "openItem", 2);
l = b([
  z("jz-accordion")
], l);
export {
  l as JzAccordionElement
};
//# sourceMappingURL=jz-accordion-BUohjdWl.js.map
