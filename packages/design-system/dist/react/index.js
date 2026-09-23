"use client";
import n, { forwardRef as z, useState as J, useEffect as C, createElement as g } from "react";
function a(e, t) {
  let o = null, c = null;
  const m = z(function(p, u) {
    const [l, i] = J(
      () => o
    );
    return C(() => {
      if (o) {
        i(() => o);
        return;
      }
      c ?? (c = e().then((r) => (o = r, r)));
      let s = !1;
      return c.then((r) => {
        s || i(() => r);
      }), () => {
        s = !0;
      };
    }, []), l ? g(l, { ...p, ref: u }) : null;
  });
  return m.displayName = t, m;
}
const d = a(async () => {
  const [{ createComponent: e }, { JzButtonElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-button-CL1AIyhq.js")
  ]);
  return e({
    tagName: "jz-button",
    elementClass: t,
    react: n,
    events: {
      onClick: "click"
    }
  });
}, "JzButton"), y = a(async () => {
  const [{ createComponent: e }, { JzDividerElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-divider-DYZQvkmI.js")
  ]);
  return e({
    tagName: "jz-divider",
    elementClass: t,
    react: n
  });
}, "JzDivider"), b = a(async () => {
  const [{ createComponent: e }, { JzIconElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-icon-B52dtOZo.js")
  ]);
  return e({
    tagName: "jz-icon",
    elementClass: t,
    react: n
  });
}, "JzIcon"), E = a(async () => {
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
}, "JzTabGroup"), w = a(async () => {
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
}, "JzTabItem"), N = a(async () => {
  const [{ createComponent: e }, { JzTagElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-tag-E1gR6xfE.js")
  ]);
  return e({
    tagName: "jz-tag",
    elementClass: t,
    react: n
  });
}, "JzTag"), j = a(async () => {
  const [{ createComponent: e }, { JzTextElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../jz-text-BKEibjj6.js")
  ]);
  return e({
    tagName: "jz-text",
    elementClass: t,
    react: n
  });
}, "JzText");
export {
  d as JzButton,
  y as JzDivider,
  b as JzIcon,
  E as JzTabGroup,
  w as JzTabItem,
  N as JzTag,
  j as JzText
};
//# sourceMappingURL=index.js.map
