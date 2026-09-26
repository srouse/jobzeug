import { LitElement as p, html as d, css as m } from "lit";
import { property as a, customElement as u } from "lit/decorators.js";
import { JzIconElement as f } from "./jz-icon-B52dtOZo.js";
var v = Object.defineProperty, b = Object.getOwnPropertyDescriptor, r = (n, i, s, o) => {
  for (var e = o > 1 ? void 0 : o ? b(i, s) : i, l = n.length - 1, c; l >= 0; l--)
    (c = n[l]) && (e = (o ? c(i, s, e) : c(e)) || e);
  return o && e && v(i, s, e), e;
};
let t = class extends p {
  constructor() {
    super(...arguments), this.supertitle = "supertitle", this.title = "title", this.description = "description", this.callToAction = "call to action";
  }
  render() {
    return d`
      <p class="supertitle">${this.supertitle}</p>
      <p class="title">${this.title}</p>
      <p class="description">${this.description}</p>
      <div class="footer">
        <hr class="divider" />
        <div class="cta">
          <span class="cta-label">${this.callToAction}</span>
          <jz-icon icon="ArrowRight" size="small" color="default"></jz-icon>
        </div>
      </div>
    `;
  }
};
t.deps = [f];
t.styles = m`
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--jz-primitive-space-1);
      width: 100%;
      height: 100%;
      margin: 0;
      padding: var(--jz-semantic-space-padding-lg);
      border: var(--jz-primitive-stroke-width-sm) solid
        var(--jz-semantic-color-border-subtle);
      border-radius: var(--jz-primitive-radius-xl);
      background: var(--jz-semantic-color-background-surface-default);
    }

    .supertitle,
    .title,
    .description,
    .cta-label {
      margin: 0;
      min-width: 0;
      max-width: 100%;
    }

    .supertitle {
      font: var(--jz-semantic-type-caption-font);
      color: var(--jz-semantic-color-text-muted);
      text-transform: uppercase;
    }

    .title {
      font: var(--jz-semantic-type-heading3-font);
      color: var(--jz-semantic-color-text-default);
    }

    .description {
      font: var(--jz-semantic-type-body-regular-font);
      color: var(--jz-semantic-color-text-muted);
    }

    .footer {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--jz-semantic-space-gap-md);
      width: 100%;
      min-width: 0;
      margin-top: auto;
    }

    .divider {
      box-sizing: border-box;
      display: block;
      width: 100%;
      height: 0;
      margin: 0;
      padding: 0;
      border: none;
      border-top: var(--jz-primitive-stroke-width-sm) solid
        var(--jz-semantic-color-border-subtle);
    }

    .cta {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--jz-primitive-space-1);
      width: 100%;
      min-width: 0;
    }

    .cta-label {
      font: var(--jz-semantic-type-label-font);
      color: var(--jz-semantic-color-text-default);
    }
  `;
r([
  a({ type: String, reflect: !0 })
], t.prototype, "supertitle", 2);
r([
  a({ type: String })
], t.prototype, "title", 2);
r([
  a({ type: String, reflect: !0 })
], t.prototype, "description", 2);
r([
  a({ type: String, attribute: "call-to-action", reflect: !0 })
], t.prototype, "callToAction", 2);
t = r([
  u("jz-project-card")
], t);
export {
  t as JzProjectCardElement
};
//# sourceMappingURL=jz-project-card-BGy0G-wl.js.map
