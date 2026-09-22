import { LitElement as d, nothing as l } from "lit";
import { customElement as c } from "lit/decorators.js";
import { a as m, b, e as p } from "./vanilla-extract-css.browser.esm-D1_fj2nn.js";
b("src/designSystem/components/blue-divider/blue-divider.css.ts", "@jobzeug/design-system");
const u = m({
  display: "block",
  boxSizing: "border-box",
  width: "100%",
  height: "var(--jz-primitive-stroke-width-sm)",
  margin: 0,
  padding: 0,
  border: "none",
  background: "var(--jz-semantic-color-border-default)"
});
p();
var v = Object.getOwnPropertyDescriptor, g = (r, s, a, i) => {
  for (var e = i > 1 ? void 0 : i ? v(s, a) : s, t = r.length - 1, o; t >= 0; t--)
    (o = r[t]) && (e = o(e) || e);
  return e;
};
let n = class extends d {
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add(u), this.hasAttribute("role") || this.setAttribute("role", "separator");
  }
  render() {
    return l;
  }
};
n = g([
  c("jz-divider")
], n);
export {
  n as JzDividerElement
};
//# sourceMappingURL=blue-divider-B9_4f9y2.js.map
