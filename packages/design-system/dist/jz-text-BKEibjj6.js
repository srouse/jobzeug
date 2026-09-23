import { LitElement as X, nothing as Y, css as tt } from "lit";
import { property as H, customElement as et } from "lit/decorators.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis, L = (n) => n, T = x.trustedTypes, R = T ? T.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, G = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, J = "?" + v, it = `<${J}>`, u = document, S = () => u.createComment(""), b = (n) => n === null || typeof n != "object" && typeof n != "function", O = Array.isArray, st = (n) => O(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", M = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, U = /-->/g, P = />/g, d = RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), D = /'/g, V = /"/g, q = /^(?:script|style|textarea|title)$/i, nt = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), ot = nt(1), j = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), W = /* @__PURE__ */ new WeakMap(), $ = u.createTreeWalker(u, 129);
function K(n, t) {
  if (!O(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return R !== void 0 ? R.createHTML(t) : t;
}
const rt = (n, t) => {
  const e = n.length - 1, s = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = z;
  for (let c = 0; c < e; c++) {
    const a = n[c];
    let l, p, h = -1, g = 0;
    for (; g < a.length && (o.lastIndex = g, p = o.exec(a), p !== null); ) g = o.lastIndex, o === z ? p[1] === "!--" ? o = U : p[1] !== void 0 ? o = P : p[2] !== void 0 ? (q.test(p[2]) && (i = RegExp("</" + p[2], "g")), o = d) : p[3] !== void 0 && (o = d) : o === d ? p[0] === ">" ? (o = i ?? z, h = -1) : p[1] === void 0 ? h = -2 : (h = o.lastIndex - p[2].length, l = p[1], o = p[3] === void 0 ? d : p[3] === '"' ? V : D) : o === V || o === D ? o = d : o === U || o === P ? o = z : (o = d, i = void 0);
    const y = o === d && n[c + 1].startsWith("/>") ? " " : "";
    r += o === z ? a + it : h >= 0 ? (s.push(l), a.slice(0, h) + G + a.slice(h) + v + y) : a + v + (h === -2 ? c : y);
  }
  return [K(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class w {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let r = 0, o = 0;
    const c = t.length - 1, a = this.parts, [l, p] = rt(t, e);
    if (this.el = w.createElement(l, s), $.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = $.nextNode()) !== null && a.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(G)) {
          const g = p[o++], y = i.getAttribute(h).split(v), N = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: r, name: N[2], strings: y, ctor: N[1] === "." ? lt : N[1] === "?" ? ht : N[1] === "@" ? ct : E }), i.removeAttribute(h);
        } else h.startsWith(v) && (a.push({ type: 6, index: r }), i.removeAttribute(h));
        if (q.test(i.tagName)) {
          const h = i.textContent.split(v), g = h.length - 1;
          if (g > 0) {
            i.textContent = T ? T.emptyScript : "";
            for (let y = 0; y < g; y++) i.append(h[y], S()), $.nextNode(), a.push({ type: 2, index: ++r });
            i.append(h[g], S());
          }
        }
      } else if (i.nodeType === 8) if (i.data === J) a.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(v, h + 1)) !== -1; ) a.push({ type: 7, index: r }), h += v.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = u.createElement("template");
    return s.innerHTML = t, s;
  }
}
function A(n, t, e = n, s) {
  var o, c;
  if (t === j) return t;
  let i = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const r = b(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== r && ((c = i == null ? void 0 : i._$AO) == null || c.call(i, !1), r === void 0 ? i = void 0 : (i = new r(n), i._$AT(n, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = A(n, i._$AS(n, t.values), i, s)), t;
}
class at {
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
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? u).importNode(e, !0);
    $.currentNode = i;
    let r = $.nextNode(), o = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let l;
        a.type === 2 ? l = new C(r, r.nextSibling, this, t) : a.type === 1 ? l = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (l = new pt(r, this, t)), this._$AV.push(l), a = s[++c];
      }
      o !== (a == null ? void 0 : a.index) && (r = $.nextNode(), o++);
    }
    return $.currentNode = u, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class C {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    t = A(this, t, e), b(t) ? t === f || t == null || t === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : t !== this._$AH && t !== j && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : st(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== f && b(this._$AH) ? this._$AA.nextSibling.data = t : this.T(u.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = w.createElement(K(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === i) this._$AH.p(e);
    else {
      const o = new at(i, this), c = o.u(this.options);
      o.p(e), this.T(c), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = W.get(t.strings);
    return e === void 0 && W.set(t.strings, e = new w(t)), e;
  }
  k(t) {
    O(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const r of t) i === e.length ? e.push(s = new C(this.O(S()), this.O(S()), this, this.options)) : s = e[i], s._$AI(r), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = L(t).nextSibling;
      L(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class E {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, r) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = f;
  }
  _$AI(t, e = this, s, i) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = A(this, t, e, 0), o = !b(t) || t !== this._$AH && t !== j, o && (this._$AH = t);
    else {
      const c = t;
      let a, l;
      for (t = r[0], a = 0; a < r.length - 1; a++) l = A(this, c[s + a], e, a), l === j && (l = this._$AH[a]), o || (o = !b(l) || l !== this._$AH[a]), l === f ? t = f : t !== f && (t += (l ?? "") + r[a + 1]), this._$AH[a] = l;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class lt extends E {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === f ? void 0 : t;
  }
}
class ht extends E {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== f);
  }
}
class ct extends E {
  constructor(t, e, s, i, r) {
    super(t, e, s, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = A(this, t, e, 0) ?? f) === j) return;
    const s = this._$AH, i = t === f && s !== f || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== f && (s === f || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class pt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    A(this, t);
  }
}
const I = x.litHtmlPolyfillSupport;
I == null || I(w, C), (x.litHtmlVersions ?? (x.litHtmlVersions = [])).push("3.3.3");
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = Symbol.for(""), ft = (n) => {
  if ((n == null ? void 0 : n.r) === Q) return n == null ? void 0 : n._$litStatic$;
}, gt = (n) => ({ _$litStatic$: n, r: Q }), B = /* @__PURE__ */ new Map(), yt = (n) => (t, ...e) => {
  const s = e.length;
  let i, r;
  const o = [], c = [];
  let a, l = 0, p = !1;
  for (; l < s; ) {
    for (a = t[l]; l < s && (r = e[l], (i = ft(r)) !== void 0); ) a += i + t[++l], p = !0;
    l !== s && c.push(r), o.push(a), l++;
  }
  if (l === s && o.push(t[s]), p) {
    const h = o.join("$$lit$$");
    (t = B.get(h)) === void 0 && (o.raw = o, B.set(h, t = o)), e = c;
  }
  return n(t, ...e);
}, vt = yt(ot);
var mt = Object.defineProperty, dt = Object.getOwnPropertyDescriptor, _ = (n, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? dt(t, e) : t, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (i = (s ? o(t, e, i) : o(i)) || i);
  return s && i && mt(t, e, i), i;
};
const $t = [
  "display-large",
  "display",
  "title",
  "heading",
  "subtitle",
  "body-default",
  "body-regular",
  "body-strong",
  "label",
  "label-sm",
  "caption",
  "overline"
], ut = ["400", "500", "600", "700"], At = [
  "default",
  "muted",
  "primary",
  "secondary",
  "tertiary",
  "inverse",
  "error",
  "success",
  "warning"
], k = "body-regular", F = "default", Z = {
  0: "span",
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6"
};
let m = class extends X {
  constructor() {
    super(...arguments), this.variant = k, this.weight = "", this.color = F, this.level = 0, this.label = "";
  }
  willUpdate() {
    $t.includes(this.variant) || (this.variant = k), At.includes(this.color) || (this.color = F), this.weight && !ut.includes(this.weight) && (this.weight = "");
    const n = Number(this.level);
    !Number.isInteger(n) || n < 0 || n > 6 ? this.level = 0 : this.level = n;
  }
  render() {
    const n = Z[this.level] ?? Z[0], t = gt(n), e = this.label ? this.label : Y;
    return vt`<${t} class="text"><slot>${e}</slot></${t}>`;
  }
};
m.styles = tt`
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
  `;
_([
  H({ type: String, reflect: !0 })
], m.prototype, "variant", 2);
_([
  H({ type: String, reflect: !0 })
], m.prototype, "weight", 2);
_([
  H({ type: String, reflect: !0 })
], m.prototype, "color", 2);
_([
  H({ type: Number, reflect: !0 })
], m.prototype, "level", 2);
_([
  H({ type: String })
], m.prototype, "label", 2);
m = _([
  et("jz-text")
], m);
export {
  m as JzTextElement
};
//# sourceMappingURL=jz-text-BKEibjj6.js.map
