import { LitElement as f, nothing as g, html as j } from "lit";
import { property as n, customElement as h } from "lit/decorators.js";
import { classMap as y } from "lit/directives/class-map.js";
import { s as z, a as k, b as x, e as w } from "./vanilla-extract-css.browser.esm-D1_fj2nn.js";
x("src/designSystem/components/blue-button/blue-button.css.ts", "@jobzeug/design-system");
const m = "var(--jz-primitive-stroke-width-md)", S = {
  gap: "var(--jz-semantic-space-gap-sm)",
  padding: "var(--jz-semantic-space-padding-sm) var(--jz-semantic-space-padding-md)",
  borderRadius: "var(--jz-primitive-radius-full)"
};
function b(t) {
  return {
    borderWidth: m,
    borderStyle: "solid",
    borderColor: t
  };
}
const _ = k({
  ...S,
  appearance: "none",
  boxSizing: "border-box",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  margin: 0,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  textDecoration: "none",
  selectors: {
    "&:disabled": {
      cursor: "default"
    },
    "&:focus-visible": {
      outline: `${m} solid var(--jz-semantic-color-border-strong)`,
      outlineOffset: m
    }
  }
}), d = z({
  default: {
    font: "var(--jz-semantic-type-label-font)"
  },
  small: {
    font: "var(--jz-semantic-type-label-sm-font)"
  }
}), l = "&:hover:not(:disabled)", i = "&:active:not(:disabled)", p = z({
  primary: {
    background: "var(--jz-semantic-color-background-control-brand-inverse-primary)",
    color: "var(--jz-semantic-color-text-inverse)",
    selectors: {
      [l]: {
        background: "var(--jz-semantic-color-background-control-brand-inverse-primary-hover)",
        color: "var(--jz-semantic-color-text-inverse-hover)"
      },
      [i]: {
        background: "var(--jz-semantic-color-background-control-brand-inverse-primary-active)",
        color: "var(--jz-semantic-color-text-inverse-active)"
      },
      "&:disabled": {
        background: "var(--jz-semantic-color-background-control-brand-inverse-primary-disabled)",
        color: "var(--jz-semantic-color-text-inverse-disabled)"
      }
    }
  },
  secondary: {
    ...b("var(--jz-semantic-color-border-strong)"),
    color: "var(--jz-semantic-color-text-muted)",
    selectors: {
      [l]: {
        color: "var(--jz-semantic-color-text-default-hover)"
      },
      [i]: {
        color: "var(--jz-semantic-color-text-default-active)"
      },
      "&:disabled": {
        background: "var(--jz-semantic-color-background-control-default-disabled)",
        color: "var(--jz-semantic-color-text-default-disabled)"
      }
    }
  },
  inverse: {
    background: "var(--jz-semantic-color-background-control-default)",
    color: "var(--jz-semantic-color-text-default)",
    selectors: {
      [l]: {
        background: "var(--jz-semantic-color-background-control-default-hover)",
        color: "var(--jz-semantic-color-text-default-hover)"
      },
      [i]: {
        background: "var(--jz-semantic-color-background-control-default-active)",
        color: "var(--jz-semantic-color-text-default-active)"
      },
      "&:disabled": {
        background: "var(--jz-semantic-color-background-control-default-disabled)",
        color: "var(--jz-semantic-color-text-default-disabled)"
      }
    }
  },
  dark: {
    background: "var(--jz-semantic-color-background-control-inverse-default)",
    color: "var(--jz-semantic-color-text-inverse)",
    selectors: {
      [l]: {
        background: "var(--jz-semantic-color-background-control-inverse-hover)",
        color: "var(--jz-semantic-color-text-inverse-hover)"
      },
      [i]: {
        ...b("var(--jz-semantic-color-border-default)"),
        background: "var(--jz-semantic-color-background-control-inverse-active)",
        color: "var(--jz-semantic-color-text-inverse-active)"
      },
      [`&${d.default}:disabled`]: {
        ...b("var(--jz-semantic-color-border-default)"),
        background: "var(--jz-semantic-color-background-control-inverse-disabled)",
        color: "var(--jz-semantic-color-text-inverse-disabled)"
      },
      [`&${d.small}:disabled`]: {
        background: "var(--jz-semantic-color-background-control-inverse-disabled)",
        color: "var(--jz-semantic-color-text-inverse-disabled)"
      }
    }
  }
});
w();
var $ = Object.defineProperty, B = Object.getOwnPropertyDescriptor, o = (t, a, c, s) => {
  for (var r = s > 1 ? void 0 : s ? B(a, c) : a, v = t.length - 1, u; v >= 0; v--)
    (u = t[v]) && (r = (s ? u(a, c, r) : u(r)) || r);
  return s && r && $(a, c, r), r;
};
let e = class extends f {
  constructor() {
    super(...arguments), this.variant = "primary", this.size = "default", this.label = "Label", this.showText = !0, this.showIcon = !0, this.disabled = !1;
  }
  createRenderRoot() {
    return this;
  }
  render() {
    const t = p[this.variant] ?? p.primary, a = d[this.size] ?? d.default, c = this.showText && this.label ? this.label : g;
    return j`<button
      class=${y({ [_]: !0, [t]: !0, [a]: !0 })}
      type="button"
      ?disabled=${this.disabled}
    >
      ${c}
    </button>`;
  }
};
o([
  n({ type: String, reflect: !0 })
], e.prototype, "variant", 2);
o([
  n({ type: String, reflect: !0 })
], e.prototype, "size", 2);
o([
  n({ type: String })
], e.prototype, "label", 2);
o([
  n({ type: Boolean, attribute: "show-text", reflect: !0 })
], e.prototype, "showText", 2);
o([
  n({ type: Boolean, attribute: "show-icon", reflect: !0 })
], e.prototype, "showIcon", 2);
o([
  n({ type: Boolean, reflect: !0 })
], e.prototype, "disabled", 2);
e = o([
  h("jz-button")
], e);
export {
  e as JzButtonElement
};
//# sourceMappingURL=blue-button-BftMW4Np.js.map
