import { LitElement as _, html as x, css as y } from "lit";
import { property as k, customElement as w } from "lit/decorators.js";
import { JzTabItemElement as z } from "./jz-tab-item-C8xaAIuT.js";
var E = Object.defineProperty, C = Object.getOwnPropertyDescriptor, v = (e) => {
  throw TypeError(e);
}, f = (e, t, s, i) => {
  for (var a = i > 1 ? void 0 : i ? C(t, s) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (a = (i ? o(t, s, a) : o(a)) || a);
  return i && a && E(t, s, a), a;
}, g = (e, t, s) => t.has(e) || v("Cannot " + s), p = (e, t, s) => (g(e, t, "read from private field"), s ? s.call(e) : t.get(e)), h = (e, t, s) => t.has(e) ? v("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, s), c = (e, t, s) => (g(e, t, "access private method"), s), l, n, m, u, b;
let d = class extends _ {
  constructor() {
    super(...arguments), h(this, n), this.selectedTab = "0", h(this, l, (e) => {
      const s = e.composedPath().find(
        (o) => o instanceof z
      );
      if (!s || s.parentElement !== this) return;
      const a = c(this, n, m).call(this).indexOf(s);
      if (a < 0) return;
      const r = s.value || String(a);
      this.selectedTab !== r && (this.selectedTab = r, this.dispatchEvent(
        new CustomEvent("change", {
          detail: { selectedTab: r, index: a },
          bubbles: !0,
          composed: !0
        })
      ));
    }), h(this, b, () => {
      c(this, n, u).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "tablist"), this.addEventListener("click", p(this, l));
  }
  disconnectedCallback() {
    this.removeEventListener("click", p(this, l)), super.disconnectedCallback();
  }
  updated(e) {
    e.has("selectedTab") && c(this, n, u).call(this);
  }
  render() {
    return x`
      <div class="root">
        <div class="tabs" role="presentation">
          <slot @slotchange=${p(this, b)}></slot>
        </div>
      </div>
    `;
  }
};
l = /* @__PURE__ */ new WeakMap();
n = /* @__PURE__ */ new WeakSet();
m = function() {
  return [
    ...this.querySelectorAll(":scope > jz-tab-item")
  ];
};
u = function() {
  const e = c(this, n, m).call(this);
  for (let t = 0; t < e.length; t++) {
    const s = e[t], i = s.value || String(t);
    s.selected = i === this.selectedTab;
  }
};
b = /* @__PURE__ */ new WeakMap();
d.styles = y`
    :host {
      display: block;
      width: 100%;
    }

    .root {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      width: 100%;
      margin: 0;
      border: none;
      background: var(--jz-semantic-color-background-surface-subtle);
      border-radius: var(--jz-primitive-radius-md);
      padding: var(--jz-semantic-space-padding-xs)
        var(--jz-semantic-space-padding-sm);
    }

    .tabs {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin: 0;
      padding: 0;
      gap: 0;
      border: none;
      background: transparent;
    }

    ::slotted(jz-tab-item) {
      flex: 0 0 auto;
    }
  `;
f([
  k({ type: String, attribute: "selected-tab", reflect: !0 })
], d.prototype, "selectedTab", 2);
d = f([
  w("jz-tab-group")
], d);
export {
  d as JzTabGroupElement
};
//# sourceMappingURL=jz-tab-group-Dt5L0Ksm.js.map
