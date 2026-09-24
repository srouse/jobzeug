import { LitElement as m, nothing as c, html as n, css as v } from "lit";
import { property as r, customElement as f } from "lit/decorators.js";
import { JzIconElement as w } from "./jz-icon-B52dtOZo.js";
var g = Object.defineProperty, y = Object.getOwnPropertyDescriptor, u = (t) => {
  throw TypeError(t);
}, i = (t, e, s, l) => {
  for (var a = l > 1 ? void 0 : l ? y(e, s) : e, d = t.length - 1, p; d >= 0; d--)
    (p = t[d]) && (a = (l ? p(e, s, a) : p(a)) || a);
  return l && a && g(e, s, a), a;
}, z = (t, e, s) => e.has(t) || u("Cannot " + s), x = (t, e, s) => e.has(t) ? u("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), _ = (t, e, s) => (z(t, e, "access private method"), s), h, b;
const j = "Accordion title", E = "Description", S = "Subtitle", C = "CaretDown";
let o = class extends m {
  constructor() {
    super(...arguments), x(this, h), this.title = j, this.description = E, this.subtitle = S, this.showContent = !1, this.showSubtitle = !0, this.showSlot = !0, this.value = "", this.disabled = !1;
  }
  render() {
    const t = this.showContent;
    return n`
      <button
        class="base"
        type="button"
        ?disabled=${this.disabled}
        aria-expanded=${t ? "true" : "false"}
        @click=${_(this, h, b)}
      >
        <span class="title">${this.title}</span>
        <jz-icon
          size="small"
          color="default"
          icon=${C}
        ></jz-icon>
      </button>
      ${t ? n`<div class="expanded">
            ${this.showSubtitle && this.subtitle ? n`<p class="subtitle">${this.subtitle}</p>` : c}
            ${this.description ? n`<p class="description">${this.description}</p>` : c}
            ${this.showSlot ? n`<div class="slot"><slot></slot></div>` : c}
          </div>` : c}
    `;
  }
};
h = /* @__PURE__ */ new WeakSet();
b = function() {
  if (this.disabled) return;
  const t = !this.showContent, e = new CustomEvent("toggle", {
    detail: { open: t },
    bubbles: !0,
    composed: !0,
    cancelable: !0
  });
  this.dispatchEvent(e), e.defaultPrevented || (this.showContent = t);
};
o.iconElement = w;
o.styles = v`
    :host {
      display: block;
      box-sizing: border-box;
      width: 100%;
    }

    .base {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      margin: 0;
      padding: var(--jz-semantic-space-padding-md) 0;
      border: none;
      border-top: var(--jz-primitive-stroke-width-sm) solid
        var(--jz-semantic-color-border-subtle);
      background: transparent;
      font: var(--jz-semantic-type-subtitle-font);
      color: var(--jz-semantic-color-text-default);
      text-align: left;
      cursor: pointer;
    }

    .base:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-border-strong);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }

    .base:hover:not(:disabled) {
      color: var(--jz-semantic-color-text-default-hover);
    }

    .base:active:not(:disabled) {
      color: var(--jz-semantic-color-text-default-active);
    }

    .base:disabled {
      color: var(--jz-semantic-color-text-default-disabled);
      cursor: not-allowed;
    }

    .title {
      flex: 1 1 auto;
      min-width: 0;
      margin: 0;
    }

    .expanded {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--jz-semantic-space-gap-sm);
      padding: var(--jz-semantic-space-padding-xs) 0
        var(--jz-semantic-space-padding-md);
      color: var(--jz-semantic-color-text-default);
    }

    .subtitle,
    .description {
      margin: 0;
    }

    .slot {
      display: flex;
      flex-direction: row;
      gap: var(--jz-semantic-space-gap-md);
      width: 100%;
    }
  `;
i([
  r({ type: String })
], o.prototype, "title", 2);
i([
  r({ type: String })
], o.prototype, "description", 2);
i([
  r({ type: String })
], o.prototype, "subtitle", 2);
i([
  r({ type: Boolean, attribute: "show-content", reflect: !0 })
], o.prototype, "showContent", 2);
i([
  r({ type: Boolean, attribute: "show-subtitle", reflect: !0 })
], o.prototype, "showSubtitle", 2);
i([
  r({ type: Boolean, attribute: "show-slot", reflect: !0 })
], o.prototype, "showSlot", 2);
i([
  r({ type: String, reflect: !0 })
], o.prototype, "value", 2);
i([
  r({ type: Boolean, reflect: !0 })
], o.prototype, "disabled", 2);
o = i([
  f("jz-accordion-item")
], o);
export {
  o as JzAccordionItemElement
};
//# sourceMappingURL=jz-accordion-item-DVACjinn.js.map
