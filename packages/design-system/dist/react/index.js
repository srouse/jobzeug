"use client";
import n, { forwardRef as u, useState as C, useEffect as J, createElement as g } from "react";
function o(t, e) {
  let a = null, c = null;
  const i = u(function(p, z) {
    const [m, l] = C(
      () => a
    );
    return J(() => {
      if (a) {
        l(() => a);
        return;
      }
      c ?? (c = t().then((r) => (a = r, r)));
      let s = !1;
      return c.then((r) => {
        s || l(() => r);
      }), () => {
        s = !0;
      };
    }, []), m ? g(m, { ...p, ref: z }) : null;
  });
  return i.displayName = e, i;
}
const j = o(async () => {
  const [{ createComponent: t }, { JzAccordionElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-accordion-BUohjdWl.js")
  ]);
  return t({
    tagName: "jz-accordion",
    elementClass: e,
    react: n,
    events: {
      onChange: "change"
    }
  });
}, "JzAccordion"), y = o(async () => {
  const [{ createComponent: t }, { JzAccordionItemElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-accordion-item-DVACjinn.js")
  ]);
  return t({
    tagName: "jz-accordion-item",
    elementClass: e,
    react: n,
    events: {
      onToggle: "toggle"
    }
  });
}, "JzAccordionItem"), P = o(async () => {
  const [{ createComponent: t }, { JzButtonElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-button-BNfABVX0.js")
  ]);
  return t({
    tagName: "jz-button",
    elementClass: e,
    react: n,
    events: {
      onClick: "click"
    }
  });
}, "JzButton"), E = o(async () => {
  const [{ createComponent: t }, { JzDividerElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-divider-DYZQvkmI.js")
  ]);
  return t({
    tagName: "jz-divider",
    elementClass: e,
    react: n
  });
}, "JzDivider"), w = o(async () => {
  const [{ createComponent: t }, { JzHighlightElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-highlight-234G8MHL.js")
  ]);
  return t({
    tagName: "jz-highlight",
    elementClass: e,
    react: n,
    events: {
      onClick: "click"
    }
  });
}, "JzHighlight"), N = o(async () => {
  const [{ createComponent: t }, { JzIconElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-icon-B52dtOZo.js")
  ]);
  return t({
    tagName: "jz-icon",
    elementClass: e,
    react: n
  });
}, "JzIcon"), v = o(async () => {
  const [{ createComponent: t }, { JzIconButtonElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-icon-button-yRQA05b7.js")
  ]);
  return t({
    tagName: "jz-icon-button",
    elementClass: e,
    react: n,
    events: {
      onClick: "click"
    }
  });
}, "JzIconButton"), I = o(async () => {
  const [{ createComponent: t }, { JzInputElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-input-6sCOI1rg.js")
  ]);
  return t({
    tagName: "jz-input",
    elementClass: e,
    react: n,
    events: {
      onChange: "change",
      onInput: "input"
    }
  });
}, "JzInput"), T = o(async () => {
  const [{ createComponent: t }, { JzProjectCardElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-project-card-BGy0G-wl.js")
  ]);
  return t({
    tagName: "jz-project-card",
    elementClass: e,
    react: n
  });
}, "JzProjectCard"), f = o(async () => {
  const [{ createComponent: t }, { JzTabElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-tab-DhUwKci5.js")
  ]);
  return t({
    tagName: "jz-tab",
    elementClass: e,
    react: n,
    events: {
      onClick: "click"
    }
  });
}, "JzTab"), b = o(async () => {
  const [{ createComponent: t }, { JzTabGroupElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-tab-group-DsofkUfD.js")
  ]);
  return t({
    tagName: "jz-tab-group",
    elementClass: e,
    react: n,
    events: {
      onChange: "change"
    }
  });
}, "JzTabGroup"), k = o(async () => {
  const [{ createComponent: t }, { JzTagElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-tag-0vZcA7JM.js")
  ]);
  return t({
    tagName: "jz-tag",
    elementClass: e,
    react: n
  });
}, "JzTag"), A = o(async () => {
  const [{ createComponent: t }, { JzTextElement: e }] = await Promise.all([
    import("@lit/react"),
    import("../jz-text-6aPdAKc6.js")
  ]);
  return t({
    tagName: "jz-text",
    elementClass: e,
    react: n,
    events: {
      onClick: "click"
    }
  });
}, "JzText");
export {
  j as JzAccordion,
  y as JzAccordionItem,
  P as JzButton,
  E as JzDivider,
  w as JzHighlight,
  N as JzIcon,
  v as JzIconButton,
  I as JzInput,
  T as JzProjectCard,
  f as JzTab,
  b as JzTabGroup,
  k as JzTag,
  A as JzText
};
//# sourceMappingURL=index.js.map
