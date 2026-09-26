import { LitElement as C, html as T, css as x } from "lit";
import { property as m, customElement as k } from "lit/decorators.js";
import { JzTabElement as g } from "./jz-tab-DhUwKci5.js";
var w = Object.defineProperty, S = Object.getOwnPropertyDescriptor, y = (t) => {
  throw TypeError(t);
}, f = (t, e, s, r) => {
  for (var i = r > 1 ? void 0 : r ? S(e, s) : e, a = t.length - 1, c; a >= 0; a--)
    (c = t[a]) && (i = (r ? c(e, s, i) : c(i)) || i);
  return r && i && w(e, s, i), i;
}, E = (t, e, s) => e.has(t) || y("Cannot " + s), h = (t, e, s) => (E(t, e, "read from private field"), s ? s.call(t) : e.get(t)), p = (t, e, s) => e.has(t) ? y("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), l = (t, e, s) => (E(t, e, "access private method"), s), d, n, v, b, u;
const z = ["bottom", "top"], _ = "bottom";
let o = class extends C {
  constructor() {
    super(...arguments), p(this, n), this.direction = _, this.selectedTab = "0", p(this, d, (t) => {
      const s = t.composedPath().find(
        (c) => c instanceof g
      );
      if (!s || s.parentElement !== this || s.disabled) return;
      const i = l(this, n, v).call(this).indexOf(s);
      if (i < 0) return;
      const a = s.value || String(i);
      this.selectedTab !== a && (this.selectedTab = a, this.dispatchEvent(
        new CustomEvent("change", {
          detail: { selectedTab: a, index: i },
          bubbles: !0,
          composed: !0
        })
      ));
    }), p(this, u, () => {
      l(this, n, b).call(this);
    });
  }
  willUpdate() {
    z.includes(this.direction) || (this.direction = _);
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "tablist"), this.addEventListener("click", h(this, d));
  }
  disconnectedCallback() {
    this.removeEventListener("click", h(this, d)), super.disconnectedCallback();
  }
  updated(t) {
    (t.has("selectedTab") || t.has("direction")) && l(this, n, b).call(this);
  }
  render() {
    return T`
      <div class="tabs" role="presentation">
        <slot @slotchange=${h(this, u)}></slot>
      </div>
    `;
  }
};
d = /* @__PURE__ */ new WeakMap();
n = /* @__PURE__ */ new WeakSet();
v = function() {
  return [...this.querySelectorAll(":scope > jz-tab")];
};
b = function() {
  const t = l(this, n, v).call(this);
  for (let e = 0; e < t.length; e++) {
    const s = t[e];
    s.direction = this.direction;
    const r = s.value || String(e);
    s.selected = r === this.selectedTab;
  }
};
u = /* @__PURE__ */ new WeakMap();
o.deps = [g];
o.styles = x`
    :host {
      box-sizing: border-box;
      display: block;
      width: 100%;
    }

    .tabs {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      margin: 0;
      padding: 0;
      gap: 0;
      border: none;
      background: transparent;
    }

    ::slotted(jz-tab) {
      flex: 0 0 auto;
    }
  `;
f([
  m({ type: String, reflect: !0 })
], o.prototype, "direction", 2);
f([
  m({ type: String, attribute: "selected-tab", reflect: !0 })
], o.prototype, "selectedTab", 2);
o = f([
  k("jz-tab-group")
], o);
export {
  o as JzTabGroupElement
};
//# sourceMappingURL=jz-tab-group-DsofkUfD.js.map
