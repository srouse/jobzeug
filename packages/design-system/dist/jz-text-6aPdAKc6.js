import { LitElement as st, nothing as nt, css as ot } from "lit";
import { property as _, customElement as at } from "lit/decorators.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis, D = (s) => s, S = x.trustedTypes, P = S ? S.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Q = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, X = "?" + y, rt = `<${X}>`, A = document, k = () => A.createComment(""), j = (s) => s === null || typeof s != "object" && typeof s != "function", R = Array.isArray, lt = (s) => R(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", L = `[ 	
\f\r]`, b = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, U = /-->/g, W = />/g, u = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), V = /'/g, B = /"/g, Y = /^(?:script|style|textarea|title)$/i, ht = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), ct = ht(1), w = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), F = /* @__PURE__ */ new WeakMap(), $ = A.createTreeWalker(A, 129);
function tt(s, t) {
  if (!R(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return P !== void 0 ? P.createHTML(t) : t;
}
const dt = (s, t) => {
  const e = s.length - 1, n = [];
  let i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = b;
  for (let c = 0; c < e; c++) {
    const r = s[c];
    let l, d, h = -1, v = 0;
    for (; v < r.length && (o.lastIndex = v, d = o.exec(r), d !== null); ) v = o.lastIndex, o === b ? d[1] === "!--" ? o = U : d[1] !== void 0 ? o = W : d[2] !== void 0 ? (Y.test(d[2]) && (i = RegExp("</" + d[2], "g")), o = u) : d[3] !== void 0 && (o = u) : o === u ? d[0] === ">" ? (o = i ?? b, h = -1) : d[1] === void 0 ? h = -2 : (h = o.lastIndex - d[2].length, l = d[1], o = d[3] === void 0 ? u : d[3] === '"' ? B : V) : o === B || o === V ? o = u : o === U || o === W ? o = b : (o = u, i = void 0);
    const g = o === u && s[c + 1].startsWith("/>") ? " " : "";
    a += o === b ? r + rt : h >= 0 ? (n.push(l), r.slice(0, h) + Q + r.slice(h) + y + g) : r + y + (h === -2 ? c : g);
  }
  return [tt(s, a + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class H {
  constructor({ strings: t, _$litType$: e }, n) {
    let i;
    this.parts = [];
    let a = 0, o = 0;
    const c = t.length - 1, r = this.parts, [l, d] = dt(t, e);
    if (this.el = H.createElement(l, n), $.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = $.nextNode()) !== null && r.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(Q)) {
          const v = d[o++], g = i.getAttribute(h).split(y), N = /([.?@])?(.*)/.exec(v);
          r.push({ type: 1, index: a, name: N[2], strings: g, ctor: N[1] === "." ? ft : N[1] === "?" ? vt : N[1] === "@" ? gt : I }), i.removeAttribute(h);
        } else h.startsWith(y) && (r.push({ type: 6, index: a }), i.removeAttribute(h));
        if (Y.test(i.tagName)) {
          const h = i.textContent.split(y), v = h.length - 1;
          if (v > 0) {
            i.textContent = S ? S.emptyScript : "";
            for (let g = 0; g < v; g++) i.append(h[g], k()), $.nextNode(), r.push({ type: 2, index: ++a });
            i.append(h[v], k());
          }
        }
      } else if (i.nodeType === 8) if (i.data === X) r.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(y, h + 1)) !== -1; ) r.push({ type: 7, index: a }), h += y.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const n = A.createElement("template");
    return n.innerHTML = t, n;
  }
}
function z(s, t, e = s, n) {
  var o, c;
  if (t === w) return t;
  let i = n !== void 0 ? (o = e._$Co) == null ? void 0 : o[n] : e._$Cl;
  const a = j(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== a && ((c = i == null ? void 0 : i._$AO) == null || c.call(i, !1), a === void 0 ? i = void 0 : (i = new a(s), i._$AT(s, e, n)), n !== void 0 ? (e._$Co ?? (e._$Co = []))[n] = i : e._$Cl = i), i !== void 0 && (t = z(s, i._$AS(s, t.values), i, n)), t;
}
class pt {
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
    const { el: { content: e }, parts: n } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? A).importNode(e, !0);
    $.currentNode = i;
    let a = $.nextNode(), o = 0, c = 0, r = n[0];
    for (; r !== void 0; ) {
      if (o === r.index) {
        let l;
        r.type === 2 ? l = new M(a, a.nextSibling, this, t) : r.type === 1 ? l = new r.ctor(a, r.name, r.strings, this, t) : r.type === 6 && (l = new yt(a, this, t)), this._$AV.push(l), r = n[++c];
      }
      o !== (r == null ? void 0 : r.index) && (a = $.nextNode(), o++);
    }
    return $.currentNode = A, i;
  }
  p(t) {
    let e = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, e), e += n.strings.length - 2) : n._$AI(t[e])), e++;
  }
}
class M {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, n, i) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = n, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    t = z(this, t, e), j(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : lt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && j(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var a;
    const { values: e, _$litType$: n } = t, i = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = H.createElement(tt(n.h, n.h[0]), this.options)), n);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === i) this._$AH.p(e);
    else {
      const o = new pt(i, this), c = o.u(this.options);
      o.p(e), this.T(c), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = F.get(t.strings);
    return e === void 0 && F.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    R(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let n, i = 0;
    for (const a of t) i === e.length ? e.push(n = new M(this.O(k()), this.O(k()), this, this.options)) : n = e[i], n._$AI(a), i++;
    i < e.length && (this._$AR(n && n._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = D(t).nextSibling;
      D(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, n, i, a) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = a, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = p;
  }
  _$AI(t, e = this, n, i) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) t = z(this, t, e, 0), o = !j(t) || t !== this._$AH && t !== w, o && (this._$AH = t);
    else {
      const c = t;
      let r, l;
      for (t = a[0], r = 0; r < a.length - 1; r++) l = z(this, c[n + r], e, r), l === w && (l = this._$AH[r]), o || (o = !j(l) || l !== this._$AH[r]), l === p ? t = p : t !== p && (t += (l ?? "") + a[r + 1]), this._$AH[r] = l;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ft extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class vt extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class gt extends I {
  constructor(t, e, n, i, a) {
    super(t, e, n, i, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = z(this, t, e, 0) ?? p) === w) return;
    const n = this._$AH, i = t === p && n !== p || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, a = t !== p && (n === p || i);
    i && this.element.removeEventListener(this.name, this, n), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class yt {
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
const O = x.litHtmlPolyfillSupport;
O == null || O(H, M), (x.litHtmlVersions ?? (x.litHtmlVersions = [])).push("3.3.3");
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const et = Symbol.for(""), mt = (s) => {
  if ((s == null ? void 0 : s.r) === et) return s == null ? void 0 : s._$litStatic$;
}, ut = (s) => ({ _$litStatic$: s, r: et }), G = /* @__PURE__ */ new Map(), $t = (s) => (t, ...e) => {
  const n = e.length;
  let i, a;
  const o = [], c = [];
  let r, l = 0, d = !1;
  for (; l < n; ) {
    for (r = t[l]; l < n && (a = e[l], (i = mt(a)) !== void 0); ) r += i + t[++l], d = !0;
    l !== n && c.push(a), o.push(r), l++;
  }
  if (l === n && o.push(t[n]), d) {
    const h = o.join("$$lit$$");
    (t = G.get(h)) === void 0 && (o.raw = o, G.set(h, t = o)), e = c;
  }
  return s(t, ...e);
}, At = $t(ct);
var _t = Object.defineProperty, zt = Object.getOwnPropertyDescriptor, it = (s) => {
  throw TypeError(s);
}, m = (s, t, e, n) => {
  for (var i = n > 1 ? void 0 : n ? zt(t, e) : t, a = s.length - 1, o; a >= 0; a--)
    (o = s[a]) && (i = (n ? o(t, e, i) : o(i)) || i);
  return n && i && _t(t, e, i), i;
}, bt = (s, t, e) => t.has(s) || it("Cannot " + e), C = (s, t, e) => (bt(s, t, "read from private field"), e ? e.call(s) : t.get(s)), Z = (s, t, e) => t.has(s) ? it("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, e), T, E;
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
], jt = ["400", "500", "600", "700"], wt = [
  "default",
  "muted",
  "primary",
  "secondary",
  "tertiary",
  "inverse",
  "error",
  "success",
  "warning"
], J = "body-regular", K = "default", q = {
  0: "span",
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6"
};
let f = class extends st {
  constructor() {
    super(...arguments), this.variant = J, this.weight = "", this.color = K, this.level = 0, this.label = "", this.interactive = !1, this.disabled = !1, Z(this, T, (s) => {
      !this.interactive || this.disabled || s.key !== "Enter" && s.key !== " " || (s.preventDefault(), this.click());
    }), Z(this, E, (s) => {
      this.disabled && (s.stopImmediatePropagation(), s.preventDefault());
    });
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("keydown", C(this, T)), this.addEventListener("click", C(this, E), !0);
  }
  disconnectedCallback() {
    this.removeEventListener("keydown", C(this, T)), this.removeEventListener("click", C(this, E), !0), super.disconnectedCallback();
  }
  willUpdate() {
    xt.includes(this.variant) || (this.variant = J), wt.includes(this.color) || (this.color = K), this.weight && !jt.includes(this.weight) && (this.weight = "");
    const s = Number(this.level);
    !Number.isInteger(s) || s < 0 || s > 6 ? this.level = 0 : this.level = s;
  }
  updated() {
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
    const s = q[this.level] ?? q[0], t = ut(s), e = this.label ? this.label : nt;
    return At`<${t} class="text"><slot>${e}</slot></${t}>`;
  }
};
T = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakMap();
f.styles = ot`
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
  `;
m([
  _({ type: String, reflect: !0 })
], f.prototype, "variant", 2);
m([
  _({ type: String, reflect: !0 })
], f.prototype, "weight", 2);
m([
  _({ type: String, reflect: !0 })
], f.prototype, "color", 2);
m([
  _({ type: Number, reflect: !0 })
], f.prototype, "level", 2);
m([
  _({ type: String })
], f.prototype, "label", 2);
m([
  _({ type: Boolean, reflect: !0 })
], f.prototype, "interactive", 2);
m([
  _({ type: Boolean, reflect: !0 })
], f.prototype, "disabled", 2);
f = m([
  at("jz-text")
], f);
export {
  f as JzTextElement
};
//# sourceMappingURL=jz-text-6aPdAKc6.js.map
