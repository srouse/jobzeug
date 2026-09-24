"use client";
import n, { forwardRef as u, useState as J, useEffect as C, createElement as g } from "react";
function o(e, t) {
  let a = null, c = null;
  const m = u(function(p, z) {
    const [i, l] = J(
      () => a
    );
    return C(() => {
      if (a) {
        l(() => a);
        return;
      }
      c ?? (c = e().then((r) => (a = r, r)));
      let s = !1;
      return c.then((r) => {
        s || l(() => r);
      }), () => {
        s = !0;
      };
    }, []), i ? g(i, { ...p, ref: z }) : null;
  });
  return m.displayName = t, m;
}
const T = o(async () => {
  const [{ createComponent: e }, { JzAccordionElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-accordion-BUohjdWl.js")
  ]);
  return e({
    tagName: "jz-accordion",
    elementClass: t,
    react: n,
    events: {
      onChange: "change"
    }
  });
}, "JzAccordion"), f = o(async () => {
  const [{ createComponent: e }, { JzAccordionItemElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-accordion-item-DVACjinn.js")
  ]);
  return e({
    tagName: "jz-accordion-item",
    elementClass: t,
    react: n,
    events: {
      onToggle: "toggle"
    }
  });
}, "JzAccordionItem"), E = o(async () => {
  const [{ createComponent: e }, { JzButtonElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-button-DjpAGgKV.js")
  ]);
  return e({
    tagName: "jz-button",
    elementClass: t,
    react: n,
    events: {
      onClick: "click"
    }
  });
}, "JzButton"), w = o(async () => {
  const [{ createComponent: e }, { JzDividerElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-divider-DYZQvkmI.js")
  ]);
  return e({
    tagName: "jz-divider",
    elementClass: t,
    react: n
  });
}, "JzDivider"), N = o(async () => {
  const [{ createComponent: e }, { JzIconElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-icon-B52dtOZo.js")
  ]);
  return e({
    tagName: "jz-icon",
    elementClass: t,
    react: n
  });
}, "JzIcon"), b = o(async () => {
  const [{ createComponent: e }, { JzTabGroupElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-tab-group-Dt5L0Ksm.js")
  ]);
  return e({
    tagName: "jz-tab-group",
    elementClass: t,
    react: n,
    events: {
      onChange: "change"
    }
  });
}, "JzTabGroup"), j = o(async () => {
  const [{ createComponent: e }, { JzTabItemElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-tab-item-C8xaAIuT.js")
  ]);
  return e({
    tagName: "jz-tab-item",
    elementClass: t,
    react: n,
    events: {
      onClick: "click"
    }
  });
}, "JzTabItem"), v = o(async () => {
  const [{ createComponent: e }, { JzTagElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-tag-E1gR6xfE.js")
  ]);
  return e({
    tagName: "jz-tag",
    elementClass: t,
    react: n
  });
}, "JzTag"), I = o(async () => {
  const [{ createComponent: e }, { JzTextElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-text-DkXaIL3Z.js")
  ]);
  return e({
    tagName: "jz-text",
    elementClass: t,
    react: n
  });
}, "JzText");
export {
  T as JzAccordion,
  f as JzAccordionItem,
  E as JzButton,
  w as JzDivider,
  N as JzIcon,
  b as JzTabGroup,
  j as JzTabItem,
  v as JzTag,
  I as JzText
};
//# sourceMappingURL=index.js.map
