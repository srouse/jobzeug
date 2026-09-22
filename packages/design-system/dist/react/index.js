"use client";
import m, { forwardRef as f, useState as z, useEffect as d, createElement as C } from "react";
function s(e, t) {
  let n = null, o = null;
  const a = f(function(u, p) {
    const [i, l] = z(
      () => n
    );
    return d(() => {
      if (n) {
        l(() => n);
        return;
      }
      o ?? (o = e().then((r) => (n = r, r)));
      let c = !1;
      return o.then((r) => {
        c || l(() => r);
      }), () => {
        c = !0;
      };
    }, []), i ? C(i, { ...u, ref: p }) : null;
  });
  return a.displayName = t, a;
}
const v = s(async () => {
  const [{ createComponent: e }, { JzButtonElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../blue-button-BftMW4Np.js")
  ]);
  return e({
    tagName: "jz-button",
    elementClass: t,
    react: m,
    events: {
      onClick: "click"
    }
  });
}, "JzButton"), L = s(async () => {
  const [{ createComponent: e }, { JzDividerElement: t }] = await Promise.all([
    import("@lit/react"),
    import("../blue-divider-B9_4f9y2.js")
  ]);
  return e({
    tagName: "jz-divider",
    elementClass: t,
    react: m
  });
}, "JzDivider");
export {
  v as JzButton,
  L as JzDivider
};
//# sourceMappingURL=index.js.map
