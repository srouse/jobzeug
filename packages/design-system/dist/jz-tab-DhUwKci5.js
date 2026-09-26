import { LitElement as b, html as p, css as u } from "lit";
import { property as r, customElement as m } from "lit/decorators.js";
var v = Object.defineProperty, h = Object.getOwnPropertyDescriptor, o = (d, a, l, i) => {
  for (var t = i > 1 ? void 0 : i ? h(a, l) : a, n = d.length - 1, s; n >= 0; n--)
    (s = d[n]) && (t = (i ? s(a, l, t) : s(t)) || t);
  return i && t && v(a, l, t), t;
};
const g = ["bottom", "top"], c = "bottom";
let e = class extends b {
  constructor() {
    super(...arguments), this.direction = c, this.selected = !1, this.disabled = !1, this.label = "label", this.value = "";
  }
  willUpdate() {
    g.includes(this.direction) || (this.direction = c);
  }
  render() {
    return p`
      <button
        type="button"
        class="root"
        role="tab"
        ?disabled=${this.disabled}
        aria-selected=${this.selected ? "true" : "false"}
      >
        <span class="label">${this.label}</span>
        <span class="bar" aria-hidden="true"></span>
      </button>
    `;
  }
};
e.styles = u`
    :host {
      box-sizing: border-box;
      display: inline-flex;
      flex: 0 0 auto;
    }

    button.root {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: max-content;
      margin: 0;
      padding: 0;
      border: none;
      background: var(--jz-semantic-color-background-control-default);
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
    }

    :host([direction="top"]) button.root {
      flex-direction: column-reverse;
    }

    button.root:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-border-strong);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }

    button.root:disabled {
      cursor: not-allowed;
    }

    .label {
      box-sizing: border-box;
      display: block;
      margin: 0;
      padding: var(--jz-semantic-space-padding-md)
        var(--jz-semantic-space-padding-lg);
      font: var(--jz-semantic-type-body-regular-font);
      color: var(--jz-semantic-color-text-default);
      white-space: nowrap;
    }

    /* Selected: shrink padding on the bar side by bar thickness (16 − 4). */
    :host([selected]) .label {
      padding-bottom: calc(
        var(--jz-semantic-space-padding-md) -
          var(--jz-primitive-stroke-width-lg)
      );
    }

    :host([selected][direction="top"]) .label {
      padding-top: calc(
        var(--jz-semantic-space-padding-md) -
          var(--jz-primitive-stroke-width-lg)
      );
      padding-bottom: var(--jz-semantic-space-padding-md);
    }

    .bar {
      display: none;
      box-sizing: border-box;
      width: 100%;
      height: var(--jz-primitive-stroke-width-lg);
      margin: 0;
      padding: 0;
      border: none;
      background: var(--jz-semantic-color-border-brand-strong);
    }

    :host([selected]) .bar {
      display: block;
    }

    button.root:hover:not(:disabled) .label {
      color: var(--jz-semantic-color-text-default-hover);
    }

    :host([selected]) button.root:hover:not(:disabled) .label {
      color: var(--jz-semantic-color-text-default);
    }

    button.root:active:not(:disabled) .label {
      color: var(--jz-semantic-color-text-default-hover);
    }

    :host([selected]) button.root:active:not(:disabled) .label {
      color: var(--jz-semantic-color-text-default);
    }

    button.root:disabled .label {
      color: var(--jz-semantic-color-text-default-disabled);
    }

    :host([selected]) button.root:disabled .bar {
      background: var(--jz-semantic-color-text-default-disabled);
    }
  `;
o([
  r({ type: String, reflect: !0 })
], e.prototype, "direction", 2);
o([
  r({ type: Boolean, reflect: !0 })
], e.prototype, "selected", 2);
o([
  r({ type: Boolean, reflect: !0 })
], e.prototype, "disabled", 2);
o([
  r({ type: String, reflect: !0 })
], e.prototype, "label", 2);
o([
  r({ type: String, reflect: !0 })
], e.prototype, "value", 2);
e = o([
  m("jz-tab")
], e);
export {
  e as JzTabElement
};
//# sourceMappingURL=jz-tab-DhUwKci5.js.map
