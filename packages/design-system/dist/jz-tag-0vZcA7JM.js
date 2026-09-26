import { LitElement as p, html as l, nothing as d, css as h } from "lit";
import { property as i, customElement as b } from "lit/decorators.js";
import { JzIconElement as f } from "./jz-icon-B52dtOZo.js";
var z = Object.defineProperty, g = Object.getOwnPropertyDescriptor, n = (r, e, a, c) => {
  for (var o = c > 1 ? void 0 : c ? g(e, a) : e, s = r.length - 1, v; s >= 0; s--)
    (v = r[s]) && (o = (c ? v(e, a, o) : v(o)) || o);
  return c && o && z(e, a, o), o;
};
const j = ["default", "primary", "outline"], m = "default", y = "Title", u = "Info";
let t = class extends p {
  constructor() {
    super(...arguments), this.variant = m, this.label = y, this.showIcon = !0, this.icon = u, this.href = "";
  }
  willUpdate() {
    j.includes(this.variant) || (this.variant = m);
  }
  render() {
    const r = this.showIcon ? l`<jz-icon
          inherit-color
          size="small"
          icon=${this.icon || u}
        ></jz-icon>` : d, e = this.label ? l`<span class="label">${this.label}</span>` : d, a = l`${r}${e}`;
    return this.href ? l`<a class="link" href=${this.href}>${a}</a>` : a;
  }
};
t.iconElement = f;
t.styles = h`
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
n([
  i({ type: String, reflect: !0 })
], t.prototype, "variant", 2);
n([
  i({ type: String })
], t.prototype, "label", 2);
n([
  i({ type: Boolean, attribute: "show-icon", reflect: !0 })
], t.prototype, "showIcon", 2);
n([
  i({ type: String, reflect: !0 })
], t.prototype, "icon", 2);
n([
  i({
    type: String,
    reflect: !0,
    converter: {
      fromAttribute: (r) => r ?? "",
      toAttribute: (r) => r || null
    }
  })
], t.prototype, "href", 2);
t = n([
  b("jz-tag")
], t);
export {
  t as JzTagElement
};
//# sourceMappingURL=jz-tag-0vZcA7JM.js.map
