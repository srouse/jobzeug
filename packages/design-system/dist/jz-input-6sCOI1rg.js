import { LitElement as h, html as m, css as f } from "lit";
import { property as b, customElement as _ } from "lit/decorators.js";
var g = Object.defineProperty, z = Object.getOwnPropertyDescriptor, u = (t) => {
  throw TypeError(t);
}, v = (t, e, r, n) => {
  for (var a = n > 1 ? void 0 : n ? z(e, r) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (a = (n ? s(e, r, a) : s(a)) || a);
  return n && a && g(e, r, a), a;
}, w = (t, e, r) => e.has(t) || u("Cannot " + r), c = (t, e, r) => (w(t, e, "read from private field"), r ? r.call(t) : e.get(t)), d = (t, e, r) => e.has(t) ? u("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), p, l;
let i = class extends h {
  constructor() {
    super(...arguments), this.value = "value", d(this, p, (t) => {
      const e = t.target;
      e instanceof HTMLInputElement && (this.value = e.value, this.dispatchEvent(
        new Event("input", { bubbles: !0, composed: !0 })
      ));
    }), d(this, l, () => {
      this.dispatchEvent(
        new Event("change", { bubbles: !0, composed: !0 })
      );
    });
  }
  render() {
    return m`
      <input
        type="text"
        .value=${this.value}
        @input=${c(this, p)}
        @change=${c(this, l)}
      />
    `;
  }
};
p = /* @__PURE__ */ new WeakMap();
l = /* @__PURE__ */ new WeakMap();
i.styles = f`
    :host {
      box-sizing: border-box;
      display: block;
      width: 100%;
    }

    input {
      box-sizing: border-box;
      display: block;
      width: 100%;
      margin: 0;
      padding: var(--jz-semantic-space-padding-sm);
      border: var(--jz-primitive-stroke-width-sm) solid
        var(--jz-semantic-color-border-subtle);
      border-radius: var(--jz-primitive-radius-sm);
      background: var(--jz-semantic-color-background-control-default);
      font: var(--jz-semantic-type-body-default-font);
      color: var(--jz-semantic-color-text-default);
      appearance: none;
      -webkit-appearance: none;
    }

    input:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-border-strong);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }
  `;
v([
  b({ type: String })
], i.prototype, "value", 2);
i = v([
  _("jz-input")
], i);
export {
  i as JzInputElement
};
//# sourceMappingURL=jz-input-6sCOI1rg.js.map
