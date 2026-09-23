import { LitElement as l, nothing as d, css as c } from "lit";
import { customElement as b } from "lit/decorators.js";
var m = Object.getOwnPropertyDescriptor, p = (o, i, a, s) => {
  for (var e = s > 1 ? void 0 : s ? m(i, a) : i, r = o.length - 1, n; r >= 0; r--)
    (n = o[r]) && (e = n(e) || e);
  return e;
};
let t = class extends l {
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "separator");
  }
  render() {
    return d;
  }
};
t.styles = c`
    :host {
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: var(--jz-primitive-stroke-width-sm);
      margin: 0;
      padding: 0;
      border: none;
      background: var(--jz-semantic-color-border-default);
    }
  `;
t = p([
  b("jz-divider")
], t);
export {
  t as JzDividerElement
};
//# sourceMappingURL=jz-divider-DYZQvkmI.js.map
