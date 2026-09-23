import { LitElement as u, html as l, nothing as d, css as h } from "lit";
import { property as n, customElement as b } from "lit/decorators.js";
import { JzIconElement as f } from "./jz-icon-B52dtOZo.js";
var z = Object.defineProperty, g = Object.getOwnPropertyDescriptor, a = (i, t, e, c) => {
  for (var o = c > 1 ? void 0 : c ? g(t, e) : t, s = i.length - 1, v; s >= 0; s--)
    (v = i[s]) && (o = (c ? v(t, e, o) : v(o)) || o);
  return c && o && z(t, e, o), o;
};
const j = ["default", "primary", "outline"], m = "default", y = "Title", p = "Info";
let r = class extends u {
  constructor() {
    super(...arguments), this.variant = m, this.label = y, this.showIcon = !0, this.icon = p, this.href = "";
  }
  willUpdate() {
    j.includes(this.variant) || (this.variant = m);
  }
  render() {
    const i = this.showIcon ? l`<jz-icon
          inherit-color
          size="small"
          icon=${this.icon || p}
        ></jz-icon>` : d, t = this.label ? l`<span class="label">${this.label}</span>` : d, e = l`${i}${t}`;
    return this.href ? l`<a class="link" href=${this.href}>${e}</a>` : e;
  }
};
r.iconElement = f;
r.styles = h`
    :host {
      display: inline-flex;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      gap: var(--jz-semantic-space-padding-xs);
      padding: var(--jz-semantic-space-padding-xs)
        var(--jz-semantic-space-padding-sm);
      border-radius: var(--jz-primitive-radius-md);
      border-width: var(--jz-primitive-stroke-width-sm);
      border-style: solid;
      font: var(--jz-semantic-type-overline-font);
      cursor: default;
      user-select: none;
    }

    :host([href]) {
      cursor: pointer;
    }

    a.link {
      display: contents;
      color: inherit;
      text-decoration: none;
    }

    :host([variant="default"]) {
      background: var(--jz-semantic-color-background-control-default);
      border-color: var(--jz-semantic-color-border-default);
      color: var(--jz-semantic-color-text-default);
    }

    :host([href][variant="default"]:hover) {
      background: var(--jz-primitive-color-neutral-500);
      border-color: transparent;
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([href][variant="default"]:active) {
      background: var(--jz-primitive-color-neutral-500);
      border-color: var(--jz-primitive-color-neutral-800);
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([variant="primary"]) {
      background: var(--jz-semantic-color-background-control-brand-primary);
      border-color: var(--jz-primitive-color-primary-900);
      color: var(--jz-semantic-color-text-primary);
    }

    :host([href][variant="primary"]:hover) {
      background: var(
        --jz-semantic-color-background-control-brand-inverse-primary
      );
      border-color: transparent;
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([href][variant="primary"]:active) {
      background: var(
        --jz-semantic-color-background-control-brand-inverse-primary-active
      );
      border-color: var(--jz-primitive-color-primary-700);
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([variant="outline"]) {
      background: var(--jz-semantic-color-background-surface-default);
      border-color: var(--jz-semantic-color-border-strong);
      color: var(--jz-semantic-color-text-muted);
    }

    :host([href][variant="outline"]:hover) {
      /* Figma background/control/elevated maps to emitted control/subtle */
      background: var(--jz-semantic-color-background-control-subtle);
      border-color: var(--jz-semantic-color-border-strong);
      color: var(--jz-semantic-color-text-muted);
    }

    :host([href][variant="outline"]:active) {
      background: var(--jz-semantic-color-background-control-subtle);
      border-color: var(--jz-primitive-color-neutral-300);
      color: var(--jz-semantic-color-text-muted);
    }

    .label {
      margin: 0;
      line-height: inherit;
    }
  `;
a([
  n({ type: String, reflect: !0 })
], r.prototype, "variant", 2);
a([
  n({ type: String })
], r.prototype, "label", 2);
a([
  n({ type: Boolean, attribute: "show-icon", reflect: !0 })
], r.prototype, "showIcon", 2);
a([
  n({ type: String, reflect: !0 })
], r.prototype, "icon", 2);
a([
  n({ type: String, reflect: !0 })
], r.prototype, "href", 2);
r = a([
  b("jz-tag")
], r);
export {
  r as JzTagElement
};
//# sourceMappingURL=jz-tag-E1gR6xfE.js.map
