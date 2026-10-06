import { LitElement as rt, nothing as b, css as at } from "lit";
import { property as m, customElement as lt } from "lit/decorators.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, W = (s) => s, M = j.trustedTypes, V = M ? M.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, tt = "$lit$", u = `lit$${Math.random().toFixed(9).slice(2)}$`, et = "?" + u, ht = `<${et}>`, _ = document, I = () => _.createComment(""), w = (s) => s === null || typeof s != "object" && typeof s != "function", U = Array.isArray, ct = (s) => U(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", D = `[ 	
\f\r]`, x = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, B = /-->/g, F = />/g, $ = RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), G = /'/g, Z = /"/g, it = /^(?:script|style|textarea|title)$/i, ft = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), dt = ft(1), H = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), J = /* @__PURE__ */ new WeakMap(), A = _.createTreeWalker(_, 129);
function st(s, t) {
  if (!U(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return V !== void 0 ? V.createHTML(t) : t;
}
const pt = (s, t) => {
  const e = s.length - 1, n = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = x;
  for (let c = 0; c < e; c++) {
    const a = s[c];
    let l, f, h = -1, g = 0;
    for (; g < a.length && (o.lastIndex = g, f = o.exec(a), f !== null); ) g = o.lastIndex, o === x ? f[1] === "!--" ? o = B : f[1] !== void 0 ? o = F : f[2] !== void 0 ? (it.test(f[2]) && (i = RegExp("</" + f[2], "g")), o = $) : f[3] !== void 0 && (o = $) : o === $ ? f[0] === ">" ? (o = i ?? x, h = -1) : f[1] === void 0 ? h = -2 : (h = o.lastIndex - f[2].length, l = f[1], o = f[3] === void 0 ? $ : f[3] === '"' ? Z : G) : o === Z || o === G ? o = $ : o === B || o === F ? o = x : (o = $, i = void 0);
    const y = o === $ && s[c + 1].startsWith("/>") ? " " : "";
    r += o === x ? a + ht : h >= 0 ? (n.push(l), a.slice(0, h) + tt + a.slice(h) + u + y) : a + u + (h === -2 ? c : y);
  }
  return [st(s, r + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class N {
  constructor({ strings: t, _$litType$: e }, n) {
    let i;
    this.parts = [];
    let r = 0, o = 0;
    const c = t.length - 1, a = this.parts, [l, f] = pt(t, e);
    if (this.el = N.createElement(l, n), A.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = A.nextNode()) !== null && a.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(tt)) {
          const g = f[o++], y = i.getAttribute(h).split(u), k = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: r, name: k[2], strings: y, ctor: k[1] === "." ? gt : k[1] === "?" ? mt : k[1] === "@" ? yt : O }), i.removeAttribute(h);
        } else h.startsWith(u) && (a.push({ type: 6, index: r }), i.removeAttribute(h));
        if (it.test(i.tagName)) {
          const h = i.textContent.split(u), g = h.length - 1;
          if (g > 0) {
            i.textContent = M ? M.emptyScript : "";
            for (let y = 0; y < g; y++) i.append(h[y], I()), A.nextNode(), a.push({ type: 2, index: ++r });
            i.append(h[g], I());
          }
        }
      } else if (i.nodeType === 8) if (i.data === et) a.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(u, h + 1)) !== -1; ) a.push({ type: 7, index: r }), h += u.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const n = _.createElement("template");
    return n.innerHTML = t, n;
  }
}
function z(s, t, e = s, n) {
  var o, c;
  if (t === H) return t;
  let i = n !== void 0 ? (o = e._$Co) == null ? void 0 : o[n] : e._$Cl;
  const r = w(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== r && ((c = i == null ? void 0 : i._$AO) == null || c.call(i, !1), r === void 0 ? i = void 0 : (i = new r(s), i._$AT(s, e, n)), n !== void 0 ? (e._$Co ?? (e._$Co = []))[n] = i : e._$Cl = i), i !== void 0 && (t = z(s, i._$AS(s, t.values), i, n)), t;
}
class vt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: n } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? _).importNode(e, !0);
    A.currentNode = i;
    let r = A.nextNode(), o = 0, c = 0, a = n[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let l;
        a.type === 2 ? l = new L(r, r.nextSibling, this, t) : a.type === 1 ? l = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (l = new ut(r, this, t)), this._$AV.push(l), a = n[++c];
      }
      o !== (a == null ? void 0 : a.index) && (r = A.nextNode(), o++);
    }
    return A.currentNode = _, i;
  }
  p(t) {
    let e = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, e), e += n.strings.length - 2) : n._$AI(t[e])), e++;
  }
}
class L {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, n, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = n, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = z(this, t, e), w(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== H && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ct(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && w(this._$AH) ? this._$AA.nextSibling.data = t : this.T(_.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: n } = t, i = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = N.createElement(st(n.h, n.h[0]), this.options)), n);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === i) this._$AH.p(e);
    else {
      const o = new vt(i, this), c = o.u(this.options);
      o.p(e), this.T(c), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = J.get(t.strings);
    return e === void 0 && J.set(t.strings, e = new N(t)), e;
  }
  k(t) {
    U(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let n, i = 0;
    for (const r of t) i === e.length ? e.push(n = new L(this.O(I()), this.O(I()), this, this.options)) : n = e[i], n._$AI(r), i++;
    i < e.length && (this._$AR(n && n._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = W(t).nextSibling;
      W(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class O {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, n, i, r) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = r, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = d;
  }
  _$AI(t, e = this, n, i) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = z(this, t, e, 0), o = !w(t) || t !== this._$AH && t !== H, o && (this._$AH = t);
    else {
      const c = t;
      let a, l;
      for (t = r[0], a = 0; a < r.length - 1; a++) l = z(this, c[n + a], e, a), l === H && (l = this._$AH[a]), o || (o = !w(l) || l !== this._$AH[a]), l === d ? t = d : t !== d && (t += (l ?? "") + r[a + 1]), this._$AH[a] = l;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class gt extends O {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class mt extends O {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class yt extends O {
  constructor(t, e, n, i, r) {
    super(t, e, n, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = z(this, t, e, 0) ?? d) === H) return;
    const n = this._$AH, i = t === d && n !== d || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, r = t !== d && (n === d || i);
    i && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ut {
  constructor(t, e, n) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    z(this, t);
  }
}
const R = j.litHtmlPolyfillSupport;
R == null || R(N, L), (j.litHtmlVersions ?? (j.litHtmlVersions = [])).push("3.3.3");
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = Symbol.for(""), $t = (s) => {
  if ((s == null ? void 0 : s.r) === nt) return s == null ? void 0 : s._$litStatic$;
}, K = (s) => ({ _$litStatic$: s, r: nt }), q = /* @__PURE__ */ new Map(), At = (s) => (t, ...e) => {
  const n = e.length;
  let i, r;
  const o = [], c = [];
  let a, l = 0, f = !1;
  for (; l < n; ) {
    for (a = t[l]; l < n && (r = e[l], (i = $t(r)) !== void 0); ) a += i + t[++l], f = !0;
    l !== n && c.push(r), o.push(a), l++;
  }
  if (l === n && o.push(t[n]), f) {
    const h = o.join("$$lit$$");
    (t = q.get(h)) === void 0 && (o.raw = o, q.set(h, t = o)), e = c;
  }
  return s(t, ...e);
}, C = At(dt);
var _t = Object.defineProperty, bt = Object.getOwnPropertyDescriptor, ot = (s) => {
  throw TypeError(s);
}, v = (s, t, e, n) => {
  for (var i = n > 1 ? void 0 : n ? bt(t, e) : t, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (i = (n ? o(t, e, i) : o(i)) || i);
  return n && i && _t(t, e, i), i;
}, zt = (s, t, e) => t.has(s) || ot("Cannot " + e), T = (s, t, e) => (zt(s, t, "read from private field"), e ? e.call(s) : t.get(s)), Q = (s, t, e) => t.has(s) ? ot("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, e), E, S;
const xt = [
  "display-large",
  "display",
  "title",
  "heading",
  "heading2",
  "heading3",
  "subtitle",
  "body-default",
  "body-regular",
  "body-strong",
  "label",
  "label-sm",
  "caption",
  "overline"
], jt = [
  "200",
  "300",
  "400",
  "500",
  "600",
  "700"
], wt = [
  "default",
  "muted",
  "primary",
  "secondary",
  "tertiary",
  "inverse",
  "error",
  "success",
  "warning"
], X = "body-regular", Y = "default", P = {
  0: "span",
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6"
};
let p = class extends rt {
  constructor() {
    super(...arguments), this.variant = X, this.weight = "", this.color = Y, this.level = 0, this.label = "", this.interactive = !1, this.disabled = !1, this.href = "", this.target = "", Q(this, E, (s) => {
      !this.interactive || this.disabled || s.key !== "Enter" && s.key !== " " || (s.preventDefault(), this.click());
    }), Q(this, S, (s) => {
      this.disabled && (s.stopImmediatePropagation(), s.preventDefault());
    });
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("keydown", T(this, E)), this.addEventListener("click", T(this, S), !0);
  }
  disconnectedCallback() {
    this.removeEventListener("keydown", T(this, E)), this.removeEventListener("click", T(this, S), !0), super.disconnectedCallback();
  }
  willUpdate() {
    xt.includes(this.variant) || (this.variant = X), wt.includes(this.color) || (this.color = Y), this.weight && !jt.includes(this.weight) && (this.weight = "");
    const s = Number(this.level);
    !Number.isInteger(s) || s < 0 || s > 6 ? this.level = 0 : this.level = s, this.href ? this.setAttribute("href", this.href) : this.removeAttribute("href");
  }
  updated() {
    if (this.href) {
      this.removeAttribute("role"), this.removeAttribute("tabindex"), this.removeAttribute("aria-disabled");
      return;
    }
    if (this.interactive && !this.disabled) {
      this.setAttribute("role", "button"), this.tabIndex = 0, this.removeAttribute("aria-disabled");
      return;
    }
    if (this.disabled) {
      this.interactive ? this.setAttribute("role", "button") : this.removeAttribute("role"), this.tabIndex = -1, this.setAttribute("aria-disabled", "true");
      return;
    }
    this.removeAttribute("role"), this.removeAttribute("tabindex"), this.removeAttribute("aria-disabled");
  }
  render() {
    const s = this.label ? this.label : b, t = C`<slot>${s}</slot>`;
    if (this.href) {
      const n = C`<a
        class=${this.level === 0 ? "text link" : "link"}
        href=${this.disabled ? b : this.href}
        target=${this.target || b}
        rel=${this.target === "_blank" ? "noopener noreferrer" : b}
        aria-disabled=${this.disabled ? "true" : b}
        tabindex=${this.disabled ? "-1" : b}
      >${t}</a>`;
      if (this.level === 0) return n;
      const i = K(P[this.level]);
      return C`<${i} class="text">${n}</${i}>`;
    }
    const e = K(P[this.level] ?? P[0]);
    return C`<${e} class="text">${t}</${e}>`;
  }
};
E = /* @__PURE__ */ new WeakMap();
S = /* @__PURE__ */ new WeakMap();
p.styles = at`
    /* level 0 → span: sit in-line; headings take a block box */
    :host {
      display: inline;
      margin: 0;
    }

    :host([level="1"]),
    :host([level="2"]),
    :host([level="3"]),
    :host([level="4"]),
    :host([level="5"]),
    :host([level="6"]) {
      display: block;
    }

    .text {
      display: inline;
      margin: 0;
    }

    :host([level="1"]) .text,
    :host([level="2"]) .text,
    :host([level="3"]) .text,
    :host([level="4"]) .text,
    :host([level="5"]) .text,
    :host([level="6"]) .text {
      display: block;
    }

    :host([variant="display-large"]) .text {
      font-family: var(--jz-semantic-type-display-large-font-family);
      font-size: var(--jz-semantic-type-display-large-font-size);
      font-weight: var(--jz-semantic-type-display-large-font-weight);
      line-height: var(--jz-semantic-type-display-large-line-height);
    }

    :host([variant="display"]) .text {
      font-family: var(--jz-semantic-type-display-font-family);
      font-size: var(--jz-semantic-type-display-font-size);
      font-weight: var(--jz-semantic-type-display-font-weight);
      line-height: var(--jz-semantic-type-display-line-height);
    }

    :host([variant="title"]) .text {
      font-family: var(--jz-semantic-type-title-font-family);
      font-size: var(--jz-semantic-type-title-font-size);
      font-weight: var(--jz-semantic-type-title-font-weight);
      line-height: var(--jz-semantic-type-title-line-height);
    }

    :host([variant="heading"]) .text {
      font-family: var(--jz-semantic-type-heading-font-family);
      font-size: var(--jz-semantic-type-heading-font-size);
      font-weight: var(--jz-semantic-type-heading-font-weight);
      line-height: var(--jz-semantic-type-heading-line-height);
    }

    :host([variant="heading2"]) .text {
      font-family: var(--jz-semantic-type-heading2-font-family);
      font-size: var(--jz-semantic-type-heading2-font-size);
      font-weight: var(--jz-semantic-type-heading2-font-weight);
      line-height: var(--jz-semantic-type-heading2-line-height);
    }

    :host([variant="heading3"]) .text {
      font-family: var(--jz-semantic-type-heading3-font-family);
      font-size: var(--jz-semantic-type-heading3-font-size);
      font-weight: var(--jz-semantic-type-heading3-font-weight);
      line-height: var(--jz-semantic-type-heading3-line-height);
    }

    :host([variant="subtitle"]) .text {
      font-family: var(--jz-semantic-type-subtitle-font-family);
      font-size: var(--jz-semantic-type-subtitle-font-size);
      font-weight: var(--jz-semantic-type-subtitle-font-weight);
      line-height: var(--jz-semantic-type-subtitle-line-height);
    }

    :host([variant="body-default"]) .text {
      font-family: var(--jz-semantic-type-body-default-font-family);
      font-size: var(--jz-semantic-type-body-default-font-size);
      font-weight: var(--jz-semantic-type-body-default-font-weight);
      line-height: var(--jz-semantic-type-body-default-line-height);
    }

    :host([variant="body-regular"]) .text {
      font-family: var(--jz-semantic-type-body-regular-font-family);
      font-size: var(--jz-semantic-type-body-regular-font-size);
      font-weight: var(--jz-semantic-type-body-regular-font-weight);
      line-height: var(--jz-semantic-type-body-regular-line-height);
    }

    :host([variant="body-strong"]) .text {
      font-family: var(--jz-semantic-type-body-strong-font-family);
      font-size: var(--jz-semantic-type-body-strong-font-size);
      font-weight: var(--jz-semantic-type-body-strong-font-weight);
      line-height: var(--jz-semantic-type-body-strong-line-height);
    }

    :host([variant="label"]) .text {
      font-family: var(--jz-semantic-type-label-font-family);
      font-size: var(--jz-semantic-type-label-font-size);
      font-weight: var(--jz-semantic-type-label-font-weight);
      line-height: var(--jz-semantic-type-label-line-height);
    }

    :host([variant="label-sm"]) .text {
      font-family: var(--jz-semantic-type-label-sm-font-family);
      font-size: var(--jz-semantic-type-label-sm-font-size);
      font-weight: var(--jz-semantic-type-label-sm-font-weight);
      line-height: var(--jz-semantic-type-label-sm-line-height);
    }

    :host([variant="caption"]) .text {
      font-family: var(--jz-semantic-type-caption-font-family);
      font-size: var(--jz-semantic-type-caption-font-size);
      font-weight: var(--jz-semantic-type-caption-font-weight);
      line-height: var(--jz-semantic-type-caption-line-height);
    }

    :host([variant="overline"]) .text {
      font-family: var(--jz-semantic-type-overline-font-family);
      font-size: var(--jz-semantic-type-overline-font-size);
      font-weight: var(--jz-semantic-type-overline-font-weight);
      line-height: var(--jz-semantic-type-overline-line-height);
    }

    :host([weight="200"]) .text {
      font-weight: var(--jz-primitive-font-weight-200);
    }

    :host([weight="300"]) .text {
      font-weight: var(--jz-primitive-font-weight-300);
    }

    :host([weight="400"]) .text {
      font-weight: var(--jz-primitive-font-weight-400);
    }

    :host([weight="500"]) .text {
      font-weight: var(--jz-primitive-font-weight-500);
    }

    :host([weight="600"]) .text {
      font-weight: var(--jz-primitive-font-weight-600);
    }

    :host([weight="700"]) .text {
      font-weight: var(--jz-primitive-font-weight-700);
    }

    :host([color="default"]) .text {
      color: var(--jz-semantic-color-text-default);
    }

    :host([color="muted"]) .text {
      color: var(--jz-semantic-color-text-muted);
    }

    :host([color="primary"]) .text {
      color: var(--jz-semantic-color-text-primary);
    }

    :host([color="secondary"]) .text {
      color: var(--jz-semantic-color-text-secondary);
    }

    :host([color="tertiary"]) .text {
      color: var(--jz-semantic-color-text-tertiary);
    }

    :host([color="inverse"]) .text {
      color: var(--jz-semantic-color-text-inverse);
    }

    :host([color="error"]) .text {
      color: var(--jz-semantic-color-text-error);
    }

    :host([color="success"]) .text {
      color: var(--jz-semantic-color-text-success);
    }

    :host([color="warning"]) .text {
      color: var(--jz-semantic-color-text-warning);
    }

    :host([interactive]:not([disabled])) {
      cursor: pointer;
    }

    :host([interactive]:not([disabled]):hover) {
      background: var(--jz-semantic-color-background-control-default-hover);
    }

    :host([disabled]) {
      cursor: not-allowed;
      background: var(
        --jz-semantic-color-background-control-default-disabled
      );
    }

    :host([disabled]) .text {
      color: var(--jz-semantic-color-text-default-disabled);
    }

    /* href → real anchor. Default color is primary; no underline. */
    :host([href]) a {
      text-decoration: none;
      cursor: pointer;
    }

    :host([href]) a:not(.text) {
      color: inherit;
    }

    :host([href][color="default"]) a {
      color: var(--jz-semantic-color-text-primary);
    }

    :host([href][color="default"]) a:hover {
      color: var(--jz-semantic-color-text-text-primary-hover);
    }

    :host([href]) a:focus-visible {
      outline: var(--jz-primitive-stroke-width-md) solid
        var(--jz-semantic-color-focus-ring);
      outline-offset: var(--jz-primitive-stroke-width-md);
    }
  `;
v([
  m({ type: String, reflect: !0 })
], p.prototype, "variant", 2);
v([
  m({ type: String, reflect: !0 })
], p.prototype, "weight", 2);
v([
  m({ type: String, reflect: !0 })
], p.prototype, "color", 2);
v([
  m({ type: Number, reflect: !0 })
], p.prototype, "level", 2);
v([
  m({ type: String })
], p.prototype, "label", 2);
v([
  m({ type: Boolean, reflect: !0 })
], p.prototype, "interactive", 2);
v([
  m({ type: Boolean, reflect: !0 })
], p.prototype, "disabled", 2);
v([
  m({ type: String })
], p.prototype, "href", 2);
v([
  m({ type: String })
], p.prototype, "target", 2);
p = v([
  lt("jz-text")
], p);
export {
  p as JzTextElement
};
//# sourceMappingURL=jz-text-BmsGZJXT.js.map
