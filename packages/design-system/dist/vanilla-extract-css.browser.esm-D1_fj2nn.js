var Kt = Object.defineProperty;
var lt = (i) => {
  throw TypeError(i);
};
var Zt = (i, e, t) => e in i ? Kt(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var L = (i, e, t) => Zt(i, typeof e != "symbol" ? e + "" : e, t), Be = (i, e, t) => e.has(i) || lt("Cannot " + t);
var o = (i, e, t) => (Be(i, e, "read from private field"), t ? t.call(i) : e.get(i)), j = (i, e, t) => e.has(i) ? lt("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(i) : e.set(i, t), A = (i, e, t, r) => (Be(i, e, "write to private field"), r ? r.call(i, t) : e.set(i, t), t), b = (i, e, t) => (Be(i, e, "access private method"), t);
var Le = (i, e, t, r) => ({
  set _(n) {
    A(i, e, n, t);
  },
  get _() {
    return o(i, e, r);
  }
});
function rt(i, e) {
  return e || (e = i.slice(0)), Object.freeze(Object.defineProperties(i, {
    raw: {
      value: Object.freeze(e)
    }
  }));
}
function ot(i, e) {
  var t = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(i);
    e && (r = r.filter(function(n) {
      return Object.getOwnPropertyDescriptor(i, n).enumerable;
    })), t.push.apply(t, r);
  }
  return t;
}
function ut(i) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? ot(Object(t), !0).forEach(function(r) {
      Yt(i, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(t)) : ot(Object(t)).forEach(function(r) {
      Object.defineProperty(i, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return i;
}
function Yt(i, e, t) {
  return e = Jt(e), e in i ? Object.defineProperty(i, e, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : i[e] = t, i;
}
function Jt(i) {
  var e = Xt(i, "string");
  return typeof e == "symbol" ? e : String(e);
}
function Xt(i, e) {
  if (typeof i != "object" || i === null) return i;
  var t = i[Symbol.toPrimitive];
  if (t !== void 0) {
    var r = t.call(i, e);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(i);
}
const nt = Lt({});
function Lt(i) {
  return e.withOptions = (t) => Lt(ut(ut({}, i), t)), e;
  function e(t, ...r) {
    const n = typeof t == "string" ? [t] : t.raw, {
      alignValues: a = !1,
      escapeSpecialCharacters: s = Array.isArray(t),
      trimWhitespace: u = !0
    } = i;
    let l = "";
    for (let c = 0; c < n.length; c++) {
      let m = n[c];
      if (s && (m = m.replace(/\\\n[ \t]*/g, "").replace(/\\`/g, "`").replace(/\\\$/g, "$").replace(/\\\{/g, "{")), l += m, c < r.length) {
        const y = a ? Qt(r[c], l) : r[c];
        l += y;
      }
    }
    const f = l.split(`
`);
    let p = null;
    for (const c of f) {
      const m = c.match(/^(\s+)\S+/);
      if (m) {
        const y = m[1].length;
        p ? p = Math.min(p, y) : p = y;
      }
    }
    if (p !== null) {
      const c = p;
      l = f.map((m) => m[0] === " " || m[0] === "	" ? m.slice(c) : m).join(`
`);
    }
    return u && (l = l.trim()), s && (l = l.replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\r/g, "\r").replace(/\\v/g, "\v").replace(/\\b/g, "\b").replace(/\\f/g, "\f").replace(/\\0/g, "\0").replace(/\\x([\da-fA-F]{2})/g, (c, m) => String.fromCharCode(parseInt(m, 16))).replace(/\\u\{([\da-fA-F]{1,6})\}/g, (c, m) => String.fromCodePoint(parseInt(m, 16))).replace(/\\u([\da-fA-F]{4})/g, (c, m) => String.fromCharCode(parseInt(m, 16)))), typeof Bun < "u" && (l = l.replace(
      // Matches e.g. \\u{1f60a} or \\u5F1F
      /\\u(?:\{([\da-fA-F]{1,6})\}|([\da-fA-F]{4}))/g,
      (c, m, y) => {
        var w;
        const C = (w = m ?? y) !== null && w !== void 0 ? w : "";
        return String.fromCodePoint(parseInt(C, 16));
      }
    )), l;
  }
}
function Qt(i, e) {
  if (typeof i != "string" || !i.includes(`
`))
    return i;
  const r = e.slice(e.lastIndexOf(`
`) + 1).match(/^(\s+)/);
  if (r) {
    const n = r[1];
    return i.replace(/\n/g, `
${n}`);
  }
  return i;
}
var er = {
  appendCss: () => {
  },
  registerClassName: () => {
  },
  onEndFileScope: () => {
  },
  registerComposition: () => {
  },
  markCompositionUsed: () => {
  },
  getIdentOption: () => process.env.NODE_ENV === "production" ? "short" : "debug"
}, Me = [er], ye = () => {
  if (Me.length < 1)
    throw new Error("No adapter configured");
  return Me[Me.length - 1];
}, kt = !1, tr = (i) => {
  kt || rr(i);
}, rr = (i) => {
  if (!i)
    throw new Error('No adapter provided when calling "setAdapter"');
  kt = !0, Me.push(i);
}, Mt = function() {
  return ye().appendCss(...arguments);
}, Dt = function() {
  return ye().registerClassName(...arguments);
}, nr = function() {
  return ye().registerComposition(...arguments);
}, _t = function() {
  return ye().markCompositionUsed(...arguments);
}, ir = function() {
  for (var e, t, r = arguments.length, n = new Array(r), a = 0; a < r; a++)
    n[a] = arguments[a];
  return (e = (t = ye()).onBeginFileScope) === null || e === void 0 ? void 0 : e.call(t, ...n);
}, ar = function() {
  return ye().onEndFileScope(...arguments);
}, sr = function() {
  var e = ye();
  return "getIdentOption" in e ? e.getIdentOption(...arguments) : process.env.NODE_ENV === "production" ? "short" : "debug";
}, ft, it = 0, Ne = [];
function bn(i, e) {
  it = 0;
  var t = {
    filePath: i,
    packageName: e
  };
  Ne.unshift(t), ir(t);
}
function wn() {
  ar(de()), it = 0, Ne.splice(0, 1);
}
function de() {
  if (Ne.length === 0)
    throw new Error(nt(ft || (ft = rt([`
        Styles were unable to be assigned to a file. This is generally caused by one of the following:

        - You may have created styles outside of a '.css.ts' context
        - You may have incorrect configuration. See https://vanilla-extract.style/documentation/getting-started
      `]))));
  return Ne[0];
}
function lr() {
  return it++;
}
var ht = {}, or = (i) => {
  var {
    fileScope: e,
    css: t
  } = i, r = e.packageName ? [e.packageName, e.filePath].join("/") : e.filePath, n = ht[r];
  if (!n) {
    var a = document.createElement("style");
    e.packageName && a.setAttribute("data-package", e.packageName), a.setAttribute("data-file", e.filePath), a.setAttribute("type", "text/css"), n = ht[r] = a, document.head.appendChild(a);
  }
  n.innerHTML = t;
};
function ur(i) {
  var e = i.match(/^var\((.*)\)$/);
  return e ? e[1] : i;
}
var fr = class {
  constructor(i) {
    const { failure: e, gotoFn: t, output: r } = this._buildTables(i);
    this.gotoFn = t, this.output = r, this.failure = e;
  }
  _buildTables(i) {
    const e = {
      0: {}
    }, t = {};
    let r = 0;
    for (const s of i) {
      let u = 0;
      for (const l of s)
        e[u] && l in e[u] ? u = e[u][l] : (r++, e[u][l] = r, e[r] = {}, u = r, t[r] = []);
      t[u].push(s);
    }
    const n = {}, a = [];
    for (const s in e[0]) {
      const u = e[0][s];
      n[u] = 0, a.push(u);
    }
    for (; a.length > 0; ) {
      const s = a.shift();
      if (s !== void 0)
        for (const u in e[s]) {
          const l = e[s][u];
          a.push(l);
          let f = n[s];
          for (; f > 0 && !(u in e[f]); )
            f = n[f];
          if (u in e[f]) {
            const p = e[f][u];
            n[l] = p, t[l] = [...t[l], ...t[p]];
          } else
            n[l] = 0;
        }
    }
    return {
      gotoFn: e,
      output: t,
      failure: n
    };
  }
  search(i) {
    let e = 0;
    const t = [];
    for (let r = 0; r < i.length; r++) {
      const n = i[r];
      for (; e > 0 && !(n in this.gotoFn[e]); )
        e = this.failure[e];
      if (n in this.gotoFn[e] && (e = this.gotoFn[e][n], this.output[e].length > 0)) {
        const a = this.output[e];
        t.push([r, a]);
      }
    }
    return t;
  }
  match(i) {
    let e = 0;
    for (let t = 0; t < i.length; t++) {
      const r = i[t];
      for (; e > 0 && !(r in this.gotoFn[e]); )
        e = this.failure[e];
      if (r in this.gotoFn[e] && (e = this.gotoFn[e][r], this.output[e].length > 0))
        return !0;
    }
    return !1;
  }
}, k;
(function(i) {
  i.Attribute = "attribute", i.Pseudo = "pseudo", i.PseudoElement = "pseudo-element", i.Tag = "tag", i.Universal = "universal", i.Adjacent = "adjacent", i.Child = "child", i.Descendant = "descendant", i.Parent = "parent", i.Sibling = "sibling", i.ColumnCombinator = "column-combinator";
})(k || (k = {}));
var K;
(function(i) {
  i.Any = "any", i.Element = "element", i.End = "end", i.Equals = "equals", i.Exists = "exists", i.Hyphen = "hyphen", i.Not = "not", i.Start = "start";
})(K || (K = {}));
const ct = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/, hr = /\\([\da-f]{1,6}\s?|(\s)|.)/gi, cr = /* @__PURE__ */ new Map([
  [126, K.Element],
  [94, K.Start],
  [36, K.End],
  [42, K.Any],
  [33, K.Not],
  [124, K.Hyphen]
]), pr = /* @__PURE__ */ new Set([
  "has",
  "not",
  "matches",
  "is",
  "where",
  "host",
  "host-context"
]);
function dr(i) {
  switch (i.type) {
    case k.Adjacent:
    case k.Child:
    case k.Descendant:
    case k.Parent:
    case k.Sibling:
    case k.ColumnCombinator:
      return !0;
    default:
      return !1;
  }
}
const mr = /* @__PURE__ */ new Set(["contains", "icontains"]);
function gr(i, e, t) {
  const r = parseInt(e, 16) - 65536;
  return r !== r || t ? e : r < 0 ? (
    // BMP codepoint
    String.fromCharCode(r + 65536)
  ) : (
    // Supplemental Plane codepoint (surrogate pair)
    String.fromCharCode(r >> 10 | 55296, r & 1023 | 56320)
  );
}
function Ee(i) {
  return i.replace(hr, gr);
}
function qe(i) {
  return i === 39 || i === 34;
}
function pt(i) {
  return i === 32 || i === 9 || i === 10 || i === 12 || i === 13;
}
function vr(i) {
  const e = [], t = Rt(e, `${i}`, 0);
  if (t < i.length)
    throw new Error(`Unmatched selector: ${i.slice(t)}`);
  return e;
}
function Rt(i, e, t) {
  let r = [];
  function n(m) {
    const y = e.slice(t + m).match(ct);
    if (!y)
      throw new Error(`Expected name, found ${e.slice(t)}`);
    const [w] = y;
    return t += m + w.length, Ee(w);
  }
  function a(m) {
    for (t += m; t < e.length && pt(e.charCodeAt(t)); )
      t++;
  }
  function s() {
    t += 1;
    const m = t;
    let y = 1;
    for (; y > 0 && t < e.length; t++)
      e.charCodeAt(t) === 40 && !u(t) ? y++ : e.charCodeAt(t) === 41 && !u(t) && y--;
    if (y)
      throw new Error("Parenthesis not matched");
    return Ee(e.slice(m, t - 1));
  }
  function u(m) {
    let y = 0;
    for (; e.charCodeAt(--m) === 92; )
      y++;
    return (y & 1) === 1;
  }
  function l() {
    if (r.length > 0 && dr(r[r.length - 1]))
      throw new Error("Did not expect successive traversals.");
  }
  function f(m) {
    if (r.length > 0 && r[r.length - 1].type === k.Descendant) {
      r[r.length - 1].type = m;
      return;
    }
    l(), r.push({ type: m });
  }
  function p(m, y) {
    r.push({
      type: k.Attribute,
      name: m,
      action: y,
      value: n(1),
      namespace: null,
      ignoreCase: "quirks"
    });
  }
  function c() {
    if (r.length && r[r.length - 1].type === k.Descendant && r.pop(), r.length === 0)
      throw new Error("Empty sub-selector");
    i.push(r);
  }
  if (a(0), e.length === t)
    return t;
  e: for (; t < e.length; ) {
    const m = e.charCodeAt(t);
    switch (m) {
      // Whitespace
      case 32:
      case 9:
      case 10:
      case 12:
      case 13: {
        (r.length === 0 || r[0].type !== k.Descendant) && (l(), r.push({ type: k.Descendant })), a(1);
        break;
      }
      // Traversals
      case 62: {
        f(k.Child), a(1);
        break;
      }
      case 60: {
        f(k.Parent), a(1);
        break;
      }
      case 126: {
        f(k.Sibling), a(1);
        break;
      }
      case 43: {
        f(k.Adjacent), a(1);
        break;
      }
      // Special attribute selectors: .class, #id
      case 46: {
        p("class", K.Element);
        break;
      }
      case 35: {
        p("id", K.Equals);
        break;
      }
      case 91: {
        a(1);
        let y, w = null;
        e.charCodeAt(t) === 124 ? y = n(1) : e.startsWith("*|", t) ? (w = "*", y = n(2)) : (y = n(0), e.charCodeAt(t) === 124 && e.charCodeAt(t + 1) !== 61 && (w = y, y = n(1))), a(0);
        let C = K.Exists;
        const v = cr.get(e.charCodeAt(t));
        if (v) {
          if (C = v, e.charCodeAt(t + 1) !== 61)
            throw new Error("Expected `=`");
          a(2);
        } else e.charCodeAt(t) === 61 && (C = K.Equals, a(1));
        let h = "", g = null;
        if (C !== "exists") {
          if (qe(e.charCodeAt(t))) {
            const F = e.charCodeAt(t);
            let P = t + 1;
            for (; P < e.length && (e.charCodeAt(P) !== F || u(P)); )
              P += 1;
            if (e.charCodeAt(P) !== F)
              throw new Error("Attribute value didn't end");
            h = Ee(e.slice(t + 1, P)), t = P + 1;
          } else {
            const F = t;
            for (; t < e.length && (!pt(e.charCodeAt(t)) && e.charCodeAt(t) !== 93 || u(t)); )
              t += 1;
            h = Ee(e.slice(F, t));
          }
          a(0);
          const O = e.charCodeAt(t) | 32;
          O === 115 ? (g = !1, a(1)) : O === 105 && (g = !0, a(1));
        }
        if (e.charCodeAt(t) !== 93)
          throw new Error("Attribute selector didn't terminate");
        t += 1;
        const S = {
          type: k.Attribute,
          name: y,
          action: C,
          value: h,
          namespace: w,
          ignoreCase: g
        };
        r.push(S);
        break;
      }
      case 58: {
        if (e.charCodeAt(t + 1) === 58) {
          r.push({
            type: k.PseudoElement,
            name: n(2).toLowerCase(),
            data: e.charCodeAt(t) === 40 ? s() : null
          });
          continue;
        }
        const y = n(1).toLowerCase();
        let w = null;
        if (e.charCodeAt(t) === 40)
          if (pr.has(y)) {
            if (qe(e.charCodeAt(t + 1)))
              throw new Error(`Pseudo-selector ${y} cannot be quoted`);
            if (w = [], t = Rt(w, e, t + 1), e.charCodeAt(t) !== 41)
              throw new Error(`Missing closing parenthesis in :${y} (${e})`);
            t += 1;
          } else {
            if (w = s(), mr.has(y)) {
              const C = w.charCodeAt(0);
              C === w.charCodeAt(w.length - 1) && qe(C) && (w = w.slice(1, -1));
            }
            w = Ee(w);
          }
        r.push({ type: k.Pseudo, name: y, data: w });
        break;
      }
      case 44: {
        c(), r = [], a(1);
        break;
      }
      default: {
        if (e.startsWith("/*", t)) {
          const C = e.indexOf("*/", t + 2);
          if (C < 0)
            throw new Error("Comment was not terminated");
          t = C + 2, r.length === 0 && a(0);
          break;
        }
        let y = null, w;
        if (m === 42)
          t += 1, w = "*";
        else if (m === 124) {
          if (w = "", e.charCodeAt(t + 1) === 124) {
            f(k.ColumnCombinator), a(2);
            break;
          }
        } else if (ct.test(e.slice(t)))
          w = n(0);
        else
          break e;
        e.charCodeAt(t) === 124 && e.charCodeAt(t + 1) !== 124 && (y = w, e.charCodeAt(t + 1) === 42 ? (w = "*", t += 2) : w = n(1)), r.push(w === "*" ? { type: k.Universal, namespace: y } : { type: k.Tag, name: w, namespace: y });
      }
    }
  }
  return c(), t;
}
/*! @license MediaQueryParser - MIT License - Tom Golden (github@tbjgolden.com) */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Ie = function() {
  return Ie = Object.assign || function(e) {
    for (var t, r = 1, n = arguments.length; r < n; r++) {
      t = arguments[r];
      for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
    }
    return e;
  }, Ie.apply(this, arguments);
};
function $e(i, e) {
  var t = {};
  for (var r in i) Object.prototype.hasOwnProperty.call(i, r) && e.indexOf(r) < 0 && (t[r] = i[r]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var n = 0, r = Object.getOwnPropertySymbols(i); n < r.length; n++)
      e.indexOf(r[n]) < 0 && Object.prototype.propertyIsEnumerable.call(i, r[n]) && (t[r[n]] = i[r[n]]);
  return t;
}
function yr(i) {
  var e = typeof Symbol == "function" && Symbol.iterator, t = e && i[e], r = 0;
  if (t) return t.call(i);
  if (i && typeof i.length == "number") return {
    next: function() {
      return i && r >= i.length && (i = void 0), { value: i && i[r++], done: !i };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function _(i, e) {
  var t = typeof Symbol == "function" && i[Symbol.iterator];
  if (!t) return i;
  var r = t.call(i), n, a = [], s;
  try {
    for (; (e === void 0 || e-- > 0) && !(n = r.next()).done; ) a.push(n.value);
  } catch (u) {
    s = { error: u };
  } finally {
    try {
      n && !n.done && (t = r.return) && t.call(r);
    } finally {
      if (s) throw s.error;
    }
  }
  return a;
}
var br = /(\u000D|\u000C|\u000D\u000A)/g, wr = /[\u0000\uD800-\uDFFF]/g, Sr = /(\/\*)[\s\S]*?(\*\/)/g, Cr = function(e, t) {
  t === void 0 && (t = 0), e = e.replace(br, `
`).replace(wr, "�"), e = e.replace(Sr, "");
  for (var r = []; t < e.length; t += 1) {
    var n = e.charCodeAt(t);
    if (n === 9 || n === 32 || n === 10) {
      for (var a = e.charCodeAt(++t); a === 9 || a === 32 || a === 10; )
        a = e.charCodeAt(++t);
      t -= 1, r.push({
        type: "<whitespace-token>"
      });
    } else if (n === 34) {
      var s = dt(e, t);
      if (s === null)
        return null;
      var u = _(s, 2), l = u[0], f = u[1];
      r.push({
        type: "<string-token>",
        value: f
      }), t = l;
    } else if (n === 35) {
      if (t + 1 < e.length) {
        var p = e.charCodeAt(t + 1);
        if (p === 95 || p >= 65 && p <= 90 || p >= 97 && p <= 122 || p >= 128 || p >= 48 && p <= 57 || p === 92 && t + 2 < e.length && e.charCodeAt(t + 2) !== 10) {
          var c = Nt(e, t + 1) ? "id" : "unrestricted", s = Or(e, t + 1);
          if (s !== null) {
            var m = _(s, 2), l = m[0], f = m[1];
            r.push({
              type: "<hash-token>",
              value: f.toLowerCase(),
              flag: c
            }), t = l;
            continue;
          }
        }
      }
      r.push({
        type: "<delim-token>",
        value: n
      });
    } else if (n === 39) {
      var s = dt(e, t);
      if (s === null)
        return null;
      var y = _(s, 2), l = y[0], f = y[1];
      r.push({
        type: "<string-token>",
        value: f
      }), t = l;
    } else if (n === 40)
      r.push({
        type: "<(-token>"
      });
    else if (n === 41)
      r.push({
        type: "<)-token>"
      });
    else if (n === 43) {
      var w = ke(e, t);
      if (w === null)
        r.push({
          type: "<delim-token>",
          value: n
        });
      else {
        var C = _(w, 2), l = C[0], v = C[1];
        v[0] === "<dimension-token>" ? r.push({
          type: "<dimension-token>",
          value: v[1],
          unit: v[2].toLowerCase(),
          flag: "number"
        }) : v[0] === "<number-token>" ? r.push({
          type: v[0],
          value: v[1],
          flag: v[2]
        }) : r.push({
          type: v[0],
          value: v[1],
          flag: "number"
        }), t = l;
      }
    } else if (n === 44)
      r.push({
        type: "<comma-token>"
      });
    else if (n === 45) {
      var h = ke(e, t);
      if (h !== null) {
        var g = _(h, 2), l = g[0], v = g[1];
        v[0] === "<dimension-token>" ? r.push({
          type: "<dimension-token>",
          value: v[1],
          unit: v[2].toLowerCase(),
          flag: "number"
        }) : v[0] === "<number-token>" ? r.push({
          type: v[0],
          value: v[1],
          flag: v[2]
        }) : r.push({
          type: v[0],
          value: v[1],
          flag: "number"
        }), t = l;
        continue;
      }
      if (t + 2 < e.length) {
        var p = e.charCodeAt(t + 1), S = e.charCodeAt(t + 2);
        if (p === 45 && S === 62) {
          r.push({
            type: "<CDC-token>"
          }), t += 2;
          continue;
        }
      }
      var s = mt(e, t);
      if (s !== null) {
        var O = _(s, 3), l = O[0], f = O[1], F = O[2];
        r.push({
          type: F,
          value: f
        }), t = l;
        continue;
      }
      r.push({
        type: "<delim-token>",
        value: n
      });
    } else if (n === 46) {
      var h = ke(e, t);
      if (h === null)
        r.push({
          type: "<delim-token>",
          value: n
        });
      else {
        var P = _(h, 2), l = P[0], v = P[1];
        v[0] === "<dimension-token>" ? r.push({
          type: "<dimension-token>",
          value: v[1],
          unit: v[2].toLowerCase(),
          flag: "number"
        }) : v[0] === "<number-token>" ? r.push({
          type: v[0],
          value: v[1],
          flag: v[2]
        }) : r.push({
          type: v[0],
          value: v[1],
          flag: "number"
        }), t = l;
        continue;
      }
    } else if (n === 58)
      r.push({
        type: "<colon-token>"
      });
    else if (n === 59)
      r.push({
        type: "<semicolon-token>"
      });
    else if (n === 60) {
      if (t + 3 < e.length) {
        var p = e.charCodeAt(t + 1), S = e.charCodeAt(t + 2), $ = e.charCodeAt(t + 3);
        if (p === 33 && S === 45 && $ === 45) {
          r.push({
            type: "<CDO-token>"
          }), t += 3;
          continue;
        }
      }
      r.push({
        type: "<delim-token>",
        value: n
      });
    } else if (n === 64) {
      var s = at(e, t + 1);
      if (s !== null) {
        var I = _(s, 2), l = I[0], f = I[1];
        r.push({
          type: "<at-keyword-token>",
          value: f.toLowerCase()
        }), t = l;
        continue;
      }
      r.push({
        type: "<delim-token>",
        value: n
      });
    } else if (n === 91)
      r.push({
        type: "<[-token>"
      });
    else if (n === 92) {
      var s = Pe(e, t);
      if (s === null)
        return null;
      var ae = _(s, 2), l = ae[0], f = ae[1];
      e = e.slice(0, t) + f + e.slice(l + 1), t -= 1;
    } else if (n === 93)
      r.push({
        type: "<]-token>"
      });
    else if (n === 123)
      r.push({
        type: "<{-token>"
      });
    else if (n === 125)
      r.push({
        type: "<}-token>"
      });
    else if (n >= 48 && n <= 57) {
      var s = ke(e, t), Oe = _(s, 2), l = Oe[0], v = Oe[1];
      v[0] === "<dimension-token>" ? r.push({
        type: "<dimension-token>",
        value: v[1],
        unit: v[2].toLowerCase(),
        flag: "number"
      }) : v[0] === "<number-token>" ? r.push({
        type: v[0],
        value: v[1],
        flag: v[2]
      }) : r.push({
        type: v[0],
        value: v[1],
        flag: "number"
      }), t = l;
    } else if (n === 95 || n >= 65 && n <= 90 || n >= 97 && n <= 122 || n >= 128) {
      var s = mt(e, t);
      if (s === null)
        return null;
      var Te = _(s, 3), l = Te[0], f = Te[1], F = Te[2];
      r.push({
        type: F,
        value: f
      }), t = l;
    } else
      r.push({
        type: "<delim-token>",
        value: n
      });
  }
  return r.push({
    type: "<EOF-token>"
  }), r;
}, dt = function(e, t) {
  if (e.length <= t + 1) return null;
  for (var r = e.charCodeAt(t), n = [], a = t + 1; a < e.length; a += 1) {
    var s = e.charCodeAt(a);
    if (s === r)
      return [a, String.fromCharCode.apply(null, n)];
    if (s === 92) {
      var u = Pe(e, a);
      if (u === null) return null;
      var l = _(u, 2), f = l[0], p = l[1];
      n.push(p), a = f;
    } else {
      if (s === 10)
        return null;
      n.push(s);
    }
  }
  return null;
}, Nt = function(e, t) {
  if (e.length <= t) return !1;
  var r = e.charCodeAt(t);
  if (r === 45) {
    if (e.length <= t + 1) return !1;
    var n = e.charCodeAt(t + 1);
    if (n === 45 || n === 95 || n >= 65 && n <= 90 || n >= 97 && n <= 122 || n >= 128)
      return !0;
    if (n === 92) {
      if (e.length <= t + 2) return !1;
      var a = e.charCodeAt(t + 2);
      return a !== 10;
    } else
      return !1;
  } else {
    if (r === 95 || r >= 65 && r <= 90 || r >= 97 && r <= 122 || r >= 128)
      return !0;
    if (r === 92) {
      if (e.length <= t + 1) return !1;
      var n = e.charCodeAt(t + 1);
      return n !== 10;
    } else
      return !1;
  }
}, Pe = function(e, t) {
  if (e.length <= t + 1 || e.charCodeAt(t) !== 92) return null;
  var r = e.charCodeAt(t + 1);
  if (r === 10)
    return null;
  if (r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102) {
    for (var n = [r], a = Math.min(t + 7, e.length), s = t + 2; s < a; s += 1) {
      var u = e.charCodeAt(s);
      if (u >= 48 && u <= 57 || u >= 65 && u <= 70 || u >= 97 && u <= 102)
        n.push(u);
      else
        break;
    }
    if (s < e.length) {
      var l = e.charCodeAt(s);
      (l === 9 || l === 32 || l === 10) && (s += 1);
    }
    return [s - 1, parseInt(String.fromCharCode.apply(null, n), 16)];
  } else
    return [t + 1, r];
}, ke = function(e, t) {
  var r = Ar(e, t);
  if (r === null) return null;
  var n = _(r, 3), a = n[0], s = n[1], u = n[2], l = at(e, a + 1);
  if (l !== null) {
    var f = _(l, 2), p = f[0], c = f[1];
    return [p, ["<dimension-token>", s, c]];
  }
  return a + 1 < e.length && e.charCodeAt(a + 1) === 37 ? [a + 1, ["<percentage-token>", s]] : [a, ["<number-token>", s, u]];
}, Ar = function(e, t) {
  if (e.length <= t) return null;
  var r = "integer", n = [], a = e.charCodeAt(t);
  for ((a === 43 || a === 45) && (t += 1, a === 45 && n.push(45)); t < e.length; ) {
    var s = e.charCodeAt(t);
    if (s >= 48 && s <= 57)
      n.push(s), t += 1;
    else
      break;
  }
  if (t + 1 < e.length) {
    var u = e.charCodeAt(t), l = e.charCodeAt(t + 1);
    if (u === 46 && l >= 48 && l <= 57)
      for (n.push(u, l), r = "number", t += 2; t < e.length; ) {
        var s = e.charCodeAt(t);
        if (s >= 48 && s <= 57)
          n.push(s), t += 1;
        else
          break;
      }
  }
  if (t + 1 < e.length) {
    var u = e.charCodeAt(t), l = e.charCodeAt(t + 1), f = e.charCodeAt(t + 2);
    if (u === 69 || u === 101) {
      var p = l >= 48 && l <= 57;
      if (p || (l === 43 || l === 45) && f >= 48 && f <= 57)
        for (r = "number", p ? (n.push(69, l), t += 2) : l === 45 ? (n.push(69, 45, f), t += 3) : (n.push(69, f), t += 3); t < e.length; ) {
          var s = e.charCodeAt(t);
          if (s >= 48 && s <= 57)
            n.push(s), t += 1;
          else
            break;
        }
    }
  }
  var c = String.fromCharCode.apply(null, n), m = r === "number" ? parseFloat(c) : parseInt(c);
  return m === -0 && (m = 0), Number.isNaN(m) ? null : [t - 1, m, r];
}, Or = function(e, t) {
  if (e.length <= t)
    return null;
  for (var r = [], n = e.charCodeAt(t); t < e.length; n = e.charCodeAt(++t)) {
    if (n === 45 || n === 95 || n >= 65 && n <= 90 || n >= 97 && n <= 122 || n >= 128 || n >= 48 && n <= 57) {
      r.push(n);
      continue;
    } else {
      var a = Pe(e, t);
      if (a !== null) {
        var s = _(a, 2), u = s[0], l = s[1];
        r.push(l), t = u;
        continue;
      }
    }
    break;
  }
  return t === 0 ? null : [t - 1, String.fromCharCode.apply(null, r)];
}, at = function(e, t) {
  if (e.length <= t || !Nt(e, t))
    return null;
  for (var r = [], n = e.charCodeAt(t); t < e.length; n = e.charCodeAt(++t)) {
    if (n === 45 || n === 95 || n >= 65 && n <= 90 || n >= 97 && n <= 122 || n >= 128 || n >= 48 && n <= 57) {
      r.push(n);
      continue;
    } else {
      var a = Pe(e, t);
      if (a !== null) {
        var s = _(a, 2), u = s[0], l = s[1];
        r.push(l), t = u;
        continue;
      }
    }
    break;
  }
  return [t - 1, String.fromCharCode.apply(null, r)];
}, Er = function(e, t) {
  for (var r = e.charCodeAt(t); r === 9 || r === 32 || r === 10; )
    r = e.charCodeAt(++t);
  for (var n = [], a = !1; t < e.length; ) {
    if (r === 41)
      return [t, String.fromCharCode.apply(null, n)];
    if (r === 34 || r === 39 || r === 40)
      return null;
    if (r === 9 || r === 32 || r === 10)
      !a && n.length !== 0 && (a = !0);
    else if (r === 92) {
      var s = Pe(e, t);
      if (s === null || a) return null;
      var u = _(s, 2), l = u[0], f = u[1];
      n.push(f), t = l;
    } else {
      if (a) return null;
      n.push(r);
    }
    r = e.charCodeAt(++t);
  }
  return null;
}, mt = function(e, t) {
  var r = at(e, t);
  if (r === null) return null;
  var n = _(r, 2), a = n[0], s = n[1];
  if (s.toLowerCase() === "url") {
    if (e.length > a + 1) {
      var u = e.charCodeAt(a + 1);
      if (u === 40) {
        for (var l = 2; a + l < e.length; l += 1) {
          var f = e.charCodeAt(a + l);
          if (f === 34 || f === 39)
            return [a + 1, s.toLowerCase(), "<function-token>"];
          if (f !== 9 && f !== 32 && f !== 10) {
            var p = Er(e, a + l);
            if (p === null) return null;
            var c = _(p, 2), m = c[0], y = c[1];
            return [m, y, "<url-token>"];
          }
        }
        return [a + 1, s.toLowerCase(), "<function-token>"];
      }
    }
  } else if (e.length > a + 1) {
    var u = e.charCodeAt(a + 1);
    if (u === 40)
      return [a + 1, s.toLowerCase(), "<function-token>"];
  }
  return [a, s.toLowerCase(), "<ident-token>"];
}, Fr = function(e) {
  for (var t = e.length - 1; t >= 0; t--)
    e[t] = jr(e[t]);
  return e;
}, jr = function(e) {
  if (e.mediaCondition === null) return e;
  var t = xr(e.mediaCondition);
  return t.operator === null && t.children.length === 1 && "children" in t.children[0] && (t = t.children[0]), {
    mediaPrefix: e.mediaPrefix,
    mediaType: e.mediaType,
    mediaCondition: t
  };
}, xr = function i(e) {
  for (var t = e.children.length - 1; t >= 0; t--) {
    var r = e.children[t];
    if (!("context" in r)) {
      var n = i(r);
      if (n.operator === null && n.children.length === 1)
        e.children[t] = n.children[0];
      else if (n.operator === e.operator && (n.operator === "and" || n.operator === "or")) {
        for (var a = [t, 1], s = 0; s < n.children.length; s++)
          a.push(n.children[s]);
        e.children.splice.apply(e.children, a);
      }
    }
  }
  return e;
}, B = function(e, t) {
  return t instanceof Error ? new Error("".concat(t.message.trim(), `
`).concat(e.trim())) : new Error(e.trim());
}, zr = function(e) {
  return Fr(Pr(e));
}, Pr = function(e) {
  var t = Cr(e.trim());
  if (t === null)
    throw B("Failed tokenizing");
  var r = 0, n = t.length - 1;
  if (t[0].type === "<at-keyword-token>" && t[0].value === "media") {
    if (t[1].type !== "<whitespace-token>")
      throw B("Expected whitespace after media");
    r = 2;
    for (var a = 2; a < t.length - 1; a++) {
      var s = t[a];
      if (s.type === "<{-token>") {
        n = a;
        break;
      } else if (s.type === "<semicolon-token>")
        throw B("Expected '{' in media query but found ';'");
    }
  }
  return t = t.slice(r, n), kr(t);
}, Lr = function(e) {
  for (var t = [], r = !1, n = 0; n < e.length; n++)
    e[n].type === "<whitespace-token>" ? (r = !0, t.length > 0 && (t[t.length - 1].wsAfter = !0)) : (t.push(Ie(Ie({}, e[n]), {
      wsBefore: r,
      wsAfter: !1
    })), r = !1);
  return t;
}, kr = function(e) {
  for (var t, r, n = [[]], a = 0; a < e.length; a++) {
    var s = e[a];
    s.type === "<comma-token>" ? n.push([]) : n[n.length - 1].push(s);
  }
  var u = n.map(Lr);
  if (u.length === 1 && u[0].length === 0)
    return [{
      mediaCondition: null,
      mediaPrefix: null,
      mediaType: "all"
    }];
  var l = u.map(function(y) {
    return y.length === 0 ? null : Mr(y);
  }), f = [];
  try {
    for (var p = yr(l), c = p.next(); !c.done; c = p.next()) {
      var m = c.value;
      m !== null && f.push(m);
    }
  } catch (y) {
    t = {
      error: y
    };
  } finally {
    try {
      c && !c.done && (r = p.return) && r.call(p);
    } finally {
      if (t) throw t.error;
    }
  }
  if (f.length === 0)
    throw B("No valid media queries");
  return f;
}, Mr = function(e) {
  var t = e[0];
  if (t.type === "<(-token>")
    try {
      return {
        mediaPrefix: null,
        mediaType: "all",
        mediaCondition: Ge(e, !0)
      };
    } catch (c) {
      throw B("Expected media condition after '('", c);
    }
  else if (t.type === "<ident-token>") {
    var r = null, n = void 0, a = t.value;
    (a === "only" || a === "not") && (r = a);
    var s = r === null ? 0 : 1;
    if (e.length <= s)
      throw B("Expected extra token in media query");
    var u = e[s];
    if (u.type === "<ident-token>") {
      var l = u.value;
      if (l === "all")
        n = "all";
      else if (l === "print" || l === "screen")
        n = l;
      else if (l === "tty" || l === "tv" || l === "projection" || l === "handheld" || l === "braille" || l === "embossed" || l === "aural" || l === "speech")
        r = r === "not" ? null : "not", n = "all";
      else
        throw B("Unknown ident '".concat(l, "' in media query"));
    } else if (r === "not" && u.type === "<(-token>") {
      var f = [{
        type: "<(-token>",
        wsBefore: !1,
        wsAfter: !1
      }];
      f.push.apply(f, e), f.push({
        type: "<)-token>",
        wsBefore: !1,
        wsAfter: !1
      });
      try {
        return {
          mediaPrefix: null,
          mediaType: "all",
          mediaCondition: Ge(f, !0)
        };
      } catch (c) {
        throw B("Expected media condition after '('", c);
      }
    } else
      throw B("Invalid media query");
    if (s + 1 === e.length)
      return {
        mediaPrefix: r,
        mediaType: n,
        mediaCondition: null
      };
    if (s + 4 < e.length) {
      var p = e[s + 1];
      if (p.type === "<ident-token>" && p.value === "and")
        try {
          return {
            mediaPrefix: r,
            mediaType: n,
            mediaCondition: Ge(e.slice(s + 2), !1)
          };
        } catch (c) {
          throw B("Expected media condition after 'and'", c);
        }
      else
        throw B("Expected 'and' after media prefix");
    } else
      throw B("Expected media condition after media prefix");
  } else
    throw B("Expected media condition or media prefix");
}, Ge = function i(e, t, r) {
  if (r === void 0 && (r = null), e.length < 3 || e[0].type !== "<(-token>" || e[e.length - 1].type !== "<)-token>")
    throw new Error("Invalid media condition");
  for (var n = e.length - 1, a = 0, s = 0, u = 0; u < e.length; u++) {
    var l = e[u];
    if (l.type === "<(-token>" ? (s += 1, a = Math.max(a, s)) : l.type === "<)-token>" && (s -= 1), s === 0) {
      n = u;
      break;
    }
  }
  if (s !== 0)
    throw new Error(`Mismatched parens
Invalid media condition`);
  var f, p = e.slice(0, n + 1);
  if (a === 1 ? f = Dr(p) : p[1].type === "<ident-token>" && p[1].value === "not" ? f = i(p.slice(2, -1), !0, "not") : f = i(p.slice(1, -1), !0), n === e.length - 1)
    return {
      operator: r,
      children: [f]
    };
  var c = e[n + 1];
  if (c.type !== "<ident-token>")
    throw new Error(`Invalid operator
Invalid media condition`);
  if (r !== null && r !== c.value)
    throw new Error("'".concat(c.value, "' and '").concat(r, `' must not be at same level
Invalid media condition`));
  if (c.value === "or" && !t)
    throw new Error(`Cannot use 'or' at top level of a media query
Invalid media condition`);
  if (c.value !== "and" && c.value !== "or")
    throw new Error("Invalid operator: '".concat(c.value, `'
Invalid media condition`));
  var m = i(e.slice(n + 2), t, c.value);
  return {
    operator: c.value,
    children: [f].concat(m.children)
  };
}, Dr = function(e) {
  if (e.length < 3 || e[0].type !== "<(-token>" || e[e.length - 1].type !== "<)-token>")
    throw new Error("Invalid media feature");
  for (var t = [e[0]], r = 1; r < e.length; r++) {
    if (r < e.length - 2) {
      var n = e[r], a = e[r + 1], s = e[r + 2];
      if (n.type === "<number-token>" && n.value > 0 && a.type === "<delim-token>" && a.value === 47 && s.type === "<number-token>" && s.value > 0) {
        t.push({
          type: "<ratio-token>",
          numerator: n.value,
          denominator: s.value,
          wsBefore: n.wsBefore,
          wsAfter: s.wsAfter
        }), r += 2;
        continue;
      }
    }
    t.push(e[r]);
  }
  var u = t[1];
  if (u.type === "<ident-token>" && t.length === 3)
    return {
      context: "boolean",
      feature: u.value
    };
  if (t.length === 5 && t[1].type === "<ident-token>" && t[2].type === "<colon-token>") {
    var l = t[3];
    if (l.type === "<number-token>" || l.type === "<dimension-token>" || l.type === "<ratio-token>" || l.type === "<ident-token>") {
      var f = t[1].value, p = null, c = f.slice(0, 4);
      c === "min-" ? (p = "min", f = f.slice(4)) : c === "max-" && (p = "max", f = f.slice(4)), l.wsBefore, l.wsAfter;
      var m = $e(l, ["wsBefore", "wsAfter"]);
      return {
        context: "value",
        prefix: p,
        feature: f,
        value: m
      };
    }
  } else if (t.length >= 5)
    try {
      var y = _r(t);
      return {
        context: "range",
        feature: y.featureName,
        range: y
      };
    } catch (w) {
      throw B("Invalid media feature", w);
    }
  throw new Error("Invalid media feature");
}, _r = function(e) {
  var t, r, n, a;
  if (e.length < 5 || e[0].type !== "<(-token>" || e[e.length - 1].type !== "<)-token>")
    throw new Error("Invalid range");
  var s = {
    leftToken: null,
    leftOp: null,
    featureName: "",
    rightOp: null,
    rightToken: null
  }, u = e[1].type === "<number-token>" || e[1].type === "<dimension-token>" || e[1].type === "<ratio-token>" || e[1].type === "<ident-token>" && e[1].value === "infinite";
  if (e[2].type === "<delim-token>") {
    if (e[2].value === 60)
      e[3].type === "<delim-token>" && e[3].value === 61 && !e[3].wsBefore ? s[u ? "leftOp" : "rightOp"] = "<=" : s[u ? "leftOp" : "rightOp"] = "<";
    else if (e[2].value === 62)
      e[3].type === "<delim-token>" && e[3].value === 61 && !e[3].wsBefore ? s[u ? "leftOp" : "rightOp"] = ">=" : s[u ? "leftOp" : "rightOp"] = ">";
    else if (e[2].value === 61)
      s[u ? "leftOp" : "rightOp"] = "=";
    else
      throw new Error("Invalid range");
    if (u)
      s.leftToken = e[1];
    else if (e[1].type === "<ident-token>")
      s.featureName = e[1].value;
    else
      throw new Error("Invalid range");
    var l = 2 + ((r = (t = s[u ? "leftOp" : "rightOp"]) === null || t === void 0 ? void 0 : t.length) !== null && r !== void 0 ? r : 0), f = e[l];
    if (u)
      if (f.type === "<ident-token>") {
        if (s.featureName = f.value, e.length >= 7) {
          var p = e[l + 1], c = e[l + 2];
          if (p.type === "<delim-token>") {
            var m = p.value;
            if (m === 60)
              c.type === "<delim-token>" && c.value === 61 && !c.wsBefore ? s.rightOp = "<=" : s.rightOp = "<";
            else if (m === 62)
              c.type === "<delim-token>" && c.value === 61 && !c.wsBefore ? s.rightOp = ">=" : s.rightOp = ">";
            else
              throw new Error("Invalid range");
            var y = e[l + 1 + ((a = (n = s.rightOp) === null || n === void 0 ? void 0 : n.length) !== null && a !== void 0 ? a : 0)];
            s.rightToken = y;
          } else
            throw new Error("Invalid range");
        } else if (l + 2 !== e.length)
          throw new Error("Invalid range");
      } else
        throw new Error("Invalid range");
    else
      s.rightToken = f;
    var w = null, C = s.leftToken, v = s.leftOp, h = s.featureName, g = s.rightOp, S = s.rightToken, O = null;
    if (C !== null) {
      if (C.type === "<ident-token>") {
        var F = C.type, P = C.value;
        P === "infinite" && (O = {
          type: F,
          value: P
        });
      } else if (C.type === "<number-token>" || C.type === "<dimension-token>" || C.type === "<ratio-token>") {
        C.wsBefore, C.wsAfter;
        var $ = $e(C, ["wsBefore", "wsAfter"]);
        O = $;
      }
    }
    var I = null;
    if (S !== null) {
      if (S.type === "<ident-token>") {
        var F = S.type, P = S.value;
        P === "infinite" && (I = {
          type: F,
          value: P
        });
      } else if (S.type === "<number-token>" || S.type === "<dimension-token>" || S.type === "<ratio-token>") {
        S.wsBefore, S.wsAfter;
        var ae = $e(S, ["wsBefore", "wsAfter"]);
        I = ae;
      }
    }
    if (O !== null && I !== null)
      if ((v === "<" || v === "<=") && (g === "<" || g === "<="))
        w = {
          leftToken: O,
          leftOp: v,
          featureName: h,
          rightOp: g,
          rightToken: I
        };
      else if ((v === ">" || v === ">=") && (g === ">" || g === ">="))
        w = {
          leftToken: O,
          leftOp: v,
          featureName: h,
          rightOp: g,
          rightToken: I
        };
      else
        throw new Error("Invalid range");
    else O === null && v === null && g !== null && I !== null ? w = {
      leftToken: O,
      leftOp: v,
      featureName: h,
      rightOp: g,
      rightToken: I
    } : O !== null && v !== null && g === null && I === null && (w = {
      leftToken: O,
      leftOp: v,
      featureName: h,
      rightOp: g,
      rightToken: I
    });
    return w;
  } else
    throw new Error("Invalid range");
};
function Rr(i, e) {
  if (typeof i != "object" || !i) return i;
  var t = i[Symbol.toPrimitive];
  if (t !== void 0) {
    var r = t.call(i, e);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(i);
}
function Nr(i) {
  var e = Rr(i, "string");
  return typeof e == "symbol" ? e : String(e);
}
function Ir(i, e, t) {
  return e = Nr(e), e in i ? Object.defineProperty(i, e, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : i[e] = t, i;
}
function gt(i, e) {
  var t = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(i);
    e && (r = r.filter(function(n) {
      return Object.getOwnPropertyDescriptor(i, n).enumerable;
    })), t.push.apply(t, r);
  }
  return t;
}
function ie(i) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? gt(Object(t), !0).forEach(function(r) {
      Ir(i, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(t)) : gt(Object(t)).forEach(function(r) {
      Object.defineProperty(i, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return i;
}
function Wr(i, e) {
  if (i == null) return {};
  var t = {}, r = Object.keys(i), n, a;
  for (a = 0; a < r.length; a++)
    n = r[a], !(e.indexOf(n) >= 0) && (t[n] = i[n]);
  return t;
}
function vt(i, e) {
  if (i == null) return {};
  var t = Wr(i, e), r, n;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(i);
    for (n = 0; n < a.length; n++)
      r = a[n], !(e.indexOf(r) >= 0) && Object.prototype.propertyIsEnumerable.call(i, r) && (t[r] = i[r]);
  }
  return t;
}
var Ur = new RegExp(`(?<=^(?:[^"']|"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')*)&`, "g");
function Fe(i, e) {
  for (var t in i)
    e(i[t], t);
}
function se(i, e) {
  var t = {};
  for (var r in i)
    e.indexOf(r) === -1 && (t[r] = i[r]);
  return t;
}
function Tr(i, e) {
  var t = {};
  for (var r in i)
    t[e(i[r], r)] = i[r];
  return t;
}
function Ke(i) {
  for (var e = arguments.length, t = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)
    t[r - 1] = arguments[r];
  for (var n of t)
    n.length !== 0 && (typeof n == "string" ? n.includes(" ") ? Ke(i, ...n.trim().split(" ")) : i.add(n) : Array.isArray(n) && Ke(i, ...n));
}
function Br(i) {
  var e = /* @__PURE__ */ new Set();
  return Ke(e, ...i), Array.from(e).join(" ");
}
function It(i) {
  return i.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
var qr = /[ -,\.\/:-@\[-\^`\{-~]/, Gr = /[ -,\.\/:-@\[\]\^`\{-~]/, Vr = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g, Hr = {
  escapeEverything: !1,
  isIdentifier: !1,
  quotes: "single",
  wrap: !1
};
function Wt(i) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  e = ie(ie({}, Hr), e);
  for (var t = e.quotes === "double" ? '"' : "'", {
    isIdentifier: r
  } = e, n = i.charAt(0), a = "", s = 0, u = i.length; s < u; ) {
    var l = i.charAt(s++), f = l.charCodeAt(0), p = void 0;
    if (f < 32 || f > 126) {
      if (f >= 55296 && f <= 56319 && s < u) {
        var c = i.charCodeAt(s++);
        (c & 64512) === 56320 ? f = ((f & 1023) << 10) + (c & 1023) + 65536 : s--;
      }
      p = "\\" + f.toString(16).toUpperCase() + " ";
    } else
      e.escapeEverything ? qr.test(l) ? p = "\\" + l : p = "\\" + f.toString(16).toUpperCase() + " " : /[\t\n\f\r\x0B]/.test(l) ? p = "\\" + f.toString(16).toUpperCase() + " " : l === "\\" || !r && (l === '"' && t === l || l === "'" && t === l) || r && Gr.test(l) ? p = "\\" + l : p = l;
    a += p;
  }
  return r && (/^-[-\d]/.test(a) ? a = "\\-" + a.slice(1) : /\d/.test(n) && (a = "\\3" + n + " " + a.slice(1))), a = a.replace(Vr, function(m, y, w) {
    return y && y.length % 2 ? m : (y || "") + w;
  }), !r && e.wrap ? t + a + t : a;
}
var yt;
function Ut(i, e) {
  for (var t = i.length - 1; t >= 0; t--) {
    var r = i[t];
    if (r.type === "child" || r.type === "parent" || r.type === "sibling" || r.type === "adjacent" || r.type === "descendant")
      return !1;
    if (r.type === "attribute" && r.name === "class" && r.value === e || r.type === "pseudo" && Array.isArray(r.data) && (r.name === "is" || r.name === "where") && r.data.every((n) => Ut(n, e)))
      return !0;
  }
  return !1;
}
var $r = (i, e) => {
  var t = () => {
    var n = new RegExp(".".concat(It(Wt(e, {
      isIdentifier: !0
    }))), "g");
    return i.replace(n, "&");
  }, r;
  try {
    r = vr(i);
  } catch (n) {
    throw new Error("Invalid selector: ".concat(t()), {
      cause: n
    });
  }
  r.forEach((n) => {
    if (!Ut(n, e))
      throw new Error(nt(yt || (yt = rt([`
        Invalid selector: `, `

        Style selectors must target the '&' character (along with any modifiers), e.g. `, " or ", `.

        This is to ensure that each style block only affects the styling of a single class.

        If your selector is targeting another class, you should move it to the style definition for that class, e.g. given we have styles for 'parent' and 'child' elements, instead of adding a selector of `, ") to 'parent', you should add ", ` to 'child').

        If your selector is targeting something global, use the 'globalStyle' function instead, e.g. if you wanted to write `, ", you should instead write 'globalStyle(", `, { ... })'
      `])), t(), "`${parent} &`", "`${parent} &:hover`", "`& ${child}`", "`${parent} &`", "`& h1`", "`${parent} h1`"));
  });
};
class We {
  /**
   * Stores information about where conditions must be in relation to other conditions
   *
   * e.g. mobile -> tablet, desktop
   */
  constructor() {
    this.ruleset = /* @__PURE__ */ new Map(), this.precedenceLookup = /* @__PURE__ */ new Map();
  }
  findOrCreateCondition(e) {
    var t = this.ruleset.get(e);
    return t || (t = {
      query: e,
      rules: [],
      children: new We()
    }, this.ruleset.set(e, t)), t;
  }
  getConditionalRulesetByPath(e) {
    var t = this;
    for (var r of e) {
      var n = t.findOrCreateCondition(r);
      t = n.children;
    }
    return t;
  }
  addRule(e, t, r) {
    var n = this.getConditionalRulesetByPath(r), a = n.findOrCreateCondition(t);
    if (!a)
      throw new Error("Failed to add conditional rule");
    a.rules.push(e);
  }
  addConditionPrecedence(e, t) {
    for (var r = this.getConditionalRulesetByPath(e), n = 0; n < t.length; n++) {
      var a, s = t[n], u = (a = r.precedenceLookup.get(s)) !== null && a !== void 0 ? a : /* @__PURE__ */ new Set();
      for (var l of t.slice(n + 1))
        u.add(l);
      r.precedenceLookup.set(s, u);
    }
  }
  isCompatible(e) {
    for (var [t, r] of this.precedenceLookup.entries())
      for (var n of r) {
        var a;
        if ((a = e.precedenceLookup.get(n)) !== null && a !== void 0 && a.has(t))
          return !1;
      }
    for (var {
      query: s,
      children: u
    } of e.ruleset.values()) {
      var l = this.ruleset.get(s);
      if (l && !l.children.isCompatible(u))
        return !1;
    }
    return !0;
  }
  merge(e) {
    for (var {
      query: t,
      rules: r,
      children: n
    } of e.ruleset.values()) {
      var a = this.ruleset.get(t);
      a ? (a.rules.push(...r), a.children.merge(n)) : this.ruleset.set(t, {
        query: t,
        rules: r,
        children: n
      });
    }
    for (var [s, u] of e.precedenceLookup.entries()) {
      var l, f = (l = this.precedenceLookup.get(s)) !== null && l !== void 0 ? l : /* @__PURE__ */ new Set();
      this.precedenceLookup.set(s, /* @__PURE__ */ new Set([...f, ...u]));
    }
  }
  /**
   * Merge another ConditionalRuleset into this one if they are compatible
   *
   * @returns true if successful, false if the ruleset is incompatible
   */
  mergeIfCompatible(e) {
    return this.isCompatible(e) ? (this.merge(e), !0) : !1;
  }
  getSortedRuleset() {
    var e = this, t = [], r = function(u) {
      var l = e.ruleset.get(n);
      if (!l)
        throw new Error("Can't find condition for ".concat(n));
      var f = t.findIndex((p) => u.has(p.query));
      f > -1 ? t.splice(f, 0, l) : t.push(l);
    };
    for (var [n, a] of this.precedenceLookup.entries())
      r(a);
    return t;
  }
  renderToArray() {
    var e = [];
    for (var {
      query: t,
      rules: r,
      children: n
    } of this.getSortedRuleset()) {
      var a = {};
      for (var s of r)
        a[s.selector] = ie(ie({}, a[s.selector]), s.rule);
      Object.assign(a, ...n.renderToArray()), e.push({
        [t]: a
      });
    }
    return e;
  }
}
var Tt = {
  ":-moz-any-link": !0,
  ":-moz-full-screen": !0,
  ":-moz-placeholder": !0,
  ":-moz-read-only": !0,
  ":-moz-read-write": !0,
  ":-ms-fullscreen": !0,
  ":-ms-input-placeholder": !0,
  ":-webkit-any-link": !0,
  ":-webkit-full-screen": !0,
  "::-moz-color-swatch": !0,
  "::-moz-list-bullet": !0,
  "::-moz-list-number": !0,
  "::-moz-page-sequence": !0,
  "::-moz-page": !0,
  "::-moz-placeholder": !0,
  "::-moz-progress-bar": !0,
  "::-moz-range-progress": !0,
  "::-moz-range-thumb": !0,
  "::-moz-range-track": !0,
  "::-moz-scrolled-page-sequence": !0,
  "::-moz-selection": !0,
  "::-ms-backdrop": !0,
  "::-ms-browse": !0,
  "::-ms-check": !0,
  "::-ms-clear": !0,
  "::-ms-fill-lower": !0,
  "::-ms-fill-upper": !0,
  "::-ms-fill": !0,
  "::-ms-reveal": !0,
  "::-ms-thumb": !0,
  "::-ms-ticks-after": !0,
  "::-ms-ticks-before": !0,
  "::-ms-tooltip": !0,
  "::-ms-track": !0,
  "::-ms-value": !0,
  "::-webkit-backdrop": !0,
  "::-webkit-calendar-picker-indicator": !0,
  "::-webkit-inner-spin-button": !0,
  "::-webkit-input-placeholder": !0,
  "::-webkit-meter-bar": !0,
  "::-webkit-meter-even-less-good-value": !0,
  "::-webkit-meter-inner-element": !0,
  "::-webkit-meter-optimum-value": !0,
  "::-webkit-meter-suboptimum-value": !0,
  "::-webkit-outer-spin-button": !0,
  "::-webkit-progress-bar": !0,
  "::-webkit-progress-inner-element": !0,
  "::-webkit-progress-inner-value": !0,
  "::-webkit-progress-value": !0,
  "::-webkit-resizer": !0,
  "::-webkit-scrollbar-button": !0,
  "::-webkit-scrollbar-corner": !0,
  "::-webkit-scrollbar-thumb": !0,
  "::-webkit-scrollbar-track-piece": !0,
  "::-webkit-scrollbar-track": !0,
  "::-webkit-scrollbar": !0,
  "::-webkit-search-cancel-button": !0,
  "::-webkit-search-results-button": !0,
  "::-webkit-slider-runnable-track": !0,
  "::-webkit-slider-thumb": !0,
  "::after": !0,
  "::backdrop": !0,
  "::before": !0,
  "::cue": !0,
  "::file-selector-button": !0,
  "::first-letter": !0,
  "::first-line": !0,
  "::grammar-error": !0,
  "::marker": !0,
  "::placeholder": !0,
  "::selection": !0,
  "::spelling-error": !0,
  "::target-text": !0,
  "::view-transition-group": !0,
  "::view-transition-image-pair": !0,
  "::view-transition-new": !0,
  "::view-transition-old": !0,
  "::view-transition": !0,
  ":active": !0,
  ":after": !0,
  ":any-link": !0,
  ":before": !0,
  ":blank": !0,
  ":checked": !0,
  ":default": !0,
  ":defined": !0,
  ":disabled": !0,
  ":empty": !0,
  ":enabled": !0,
  ":first-child": !0,
  ":first-letter": !0,
  ":first-line": !0,
  ":first-of-type": !0,
  ":first": !0,
  ":focus-visible": !0,
  ":focus-within": !0,
  ":focus": !0,
  ":fullscreen": !0,
  ":hover": !0,
  ":in-range": !0,
  ":indeterminate": !0,
  ":invalid": !0,
  ":last-child": !0,
  ":last-of-type": !0,
  ":left": !0,
  ":link": !0,
  ":only-child": !0,
  ":only-of-type": !0,
  ":optional": !0,
  ":out-of-range": !0,
  ":placeholder-shown": !0,
  ":read-only": !0,
  ":read-write": !0,
  ":required": !0,
  ":right": !0,
  ":root": !0,
  ":scope": !0,
  ":target": !0,
  ":valid": !0,
  ":visited": !0
}, Kr = Object.keys(Tt), Zr = Tt, bt, wt = (i, e) => new Error(nt(bt || (bt = rt([`
    Invalid media query: "`, `"

    `, `

    Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
  `])), i, e)), Yr = (i) => {
  if (i === "@media ")
    throw wt(i, "Query is empty");
  try {
    zr(i);
  } catch (e) {
    throw wt(i, e.message);
  }
}, Jr = ["vars"], Xr = ["content"], Bt = "__DECLARATION", Qr = {
  animationIterationCount: !0,
  borderImage: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexShrink: !0,
  fontWeight: !0,
  gridArea: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnStart: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowStart: !0,
  initialLetter: !0,
  lineClamp: !0,
  lineHeight: !0,
  maxLines: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  scale: !0,
  tabSize: !0,
  WebkitLineClamp: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  // svg properties
  fillOpacity: !0,
  floodOpacity: !0,
  maskBorder: !0,
  maskBorderOutset: !0,
  maskBorderSlice: !0,
  maskBorderWidth: !0,
  shapeImageThreshold: !0,
  stopOpacity: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
};
function en(i) {
  return i.replace(/([A-Z])/g, "-$1").replace(/^ms-/, "-ms-").toLowerCase();
}
function tn(i, e, t, r) {
  var n = i.slice(0, e), a = i.slice(t);
  return "".concat(n).concat(r).concat(a);
}
var rn = "  ", le = [...Kr, "@layer", "@scope", "@media", "@supports", "@container", "@starting-style", "selectors"];
class nn {
  constructor(e, t) {
    this.rules = [], this.conditionalRulesets = [new We()], this.fontFaceRules = [], this.keyframesRules = [], this.propertyRules = [], this.localClassNamesMap = new Map(e.map((r) => [r, r])), this.localClassNamesSearch = new fr(e), this.layers = /* @__PURE__ */ new Map(), this.composedClassLists = t.map((r) => {
      var {
        identifier: n,
        classList: a
      } = r;
      return {
        identifier: n,
        regex: RegExp("(".concat(It(a), ")"), "g")
      };
    }).reverse();
  }
  processCssObj(e) {
    if (e.type === "fontFace") {
      this.fontFaceRules.push(e.rule);
      return;
    }
    if (e.type === "property") {
      this.propertyRules.push(e);
      return;
    }
    if (e.type === "keyframes") {
      e.rule = Object.fromEntries(Object.entries(e.rule).map((a) => {
        var [s, u] = a;
        return [s, this.transformVars(this.transformProperties(u))];
      })), this.keyframesRules.push(e);
      return;
    }
    if (this.currConditionalRuleset = new We(), e.type === "layer") {
      var t = "@layer ".concat(e.name);
      this.addLayer([t]);
    } else {
      var r = se(e.rule, le);
      this.addRule({
        selector: e.selector,
        rule: r
      }), this.transformLayer(e, e.rule["@layer"]), this.transformScope(e, e.rule["@scope"]), this.transformMedia(e, e.rule["@media"]), this.transformSupports(e, e.rule["@supports"]), this.transformContainer(e, e.rule["@container"]), this.transformStartingStyle(e, e.rule["@starting-style"]), this.transformSimplePseudos(e, e.rule), this.transformSelectors(e, e.rule);
    }
    var n = this.conditionalRulesets[this.conditionalRulesets.length - 1];
    n.mergeIfCompatible(this.currConditionalRuleset) || this.conditionalRulesets.push(this.currConditionalRuleset);
  }
  addConditionalRule(e, t) {
    var r = this.transformVars(this.transformProperties(e.rule)), n = this.transformSelector(e.selector);
    if (!this.currConditionalRuleset)
      throw new Error("Couldn't add conditional rule");
    var a = t[t.length - 1], s = t.slice(0, t.length - 1);
    this.currConditionalRuleset.addRule({
      selector: n,
      rule: r
    }, a, s);
  }
  addRule(e) {
    var t = this.transformVars(this.transformProperties(e.rule)), r = this.transformSelector(e.selector);
    this.rules.push({
      selector: r,
      rule: t
    });
  }
  addLayer(e) {
    var t = e.join(" - ");
    this.layers.set(t, e);
  }
  transformProperties(e) {
    return this.transformContent(this.pixelifyProperties(e));
  }
  pixelifyProperties(e) {
    return Fe(e, (t, r) => {
      typeof t == "number" && t !== 0 && !Qr[r] && (e[r] = "".concat(t, "px"));
    }), e;
  }
  transformVars(e) {
    var {
      vars: t
    } = e, r = vt(e, Jr);
    return t ? ie(ie({}, Tr(t, (n, a) => ur(a))), r) : r;
  }
  transformContent(e) {
    var {
      content: t
    } = e, r = vt(e, Xr);
    if (typeof t > "u")
      return r;
    var n = Array.isArray(t) ? t : [t];
    return ie({
      content: n.map((a) => (
        // This logic was adapted from Stitches :)
        a && (a.includes('"') || a.includes("'") || /^([A-Za-z-]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)(\s|$)/.test(a)) ? a : '"'.concat(a, '"')
      ))
    }, r);
  }
  transformClassname(e) {
    return ".".concat(Wt(e, {
      isIdentifier: !0
    }));
  }
  transformSelector(e) {
    var t = e, r = function(w) {
      t = t.replace(a, () => (_t(w), w));
    };
    for (var {
      identifier: n,
      regex: a
    } of this.composedClassLists)
      r(n);
    if (this.localClassNamesMap.has(t))
      return this.transformClassname(t);
    for (var s = this.localClassNamesSearch.search(t), u = t.length, l = s.length - 1; l >= 0; l--) {
      var [f, [p]] = s[l], c = f - p.length + 1, m = u <= f;
      m || (u = c, t[c - 1] !== "." && (t = tn(t, c, f + 1, this.transformClassname(p))));
    }
    return t;
  }
  transformSelectors(e, t, r) {
    Fe(t.selectors, (n, a) => {
      if (e.type !== "local")
        throw new Error("Selectors are not allowed within ".concat(e.type === "global" ? '"globalStyle"' : '"selectors"'));
      var s = this.transformSelector(a.replace(RegExp("&", "g"), e.selector));
      $r(s, e.selector);
      var u = {
        selector: s,
        rule: se(n, le)
      };
      r ? this.addConditionalRule(u, r) : this.addRule(u);
      var l = {
        type: "selector",
        selector: s,
        rule: n
      };
      this.transformLayer(l, n["@layer"], r), this.transformScope(l, n["@scope"], r), this.transformSupports(l, n["@supports"], r), this.transformMedia(l, n["@media"], r), this.transformContainer(l, n["@container"], r), this.transformStartingStyle(l, n["@starting-style"], r);
    });
  }
  transformMedia(e, t) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    if (t) {
      var n;
      (n = this.currConditionalRuleset) === null || n === void 0 || n.addConditionPrecedence(r, Object.keys(t).map((f) => "@media ".concat(f)));
      for (var [a, s] of Object.entries(t)) {
        var u = "@media ".concat(a);
        Yr(u);
        var l = [...r, u];
        this.addConditionalRule({
          selector: e.selector,
          rule: se(s, le)
        }, l), e.type === "local" && (this.transformSimplePseudos(e, s, l), this.transformSelectors(e, s, l)), this.transformLayer(e, s["@layer"], l), this.transformScope(e, s["@scope"], l), this.transformSupports(e, s["@supports"], l), this.transformContainer(e, s["@container"], l), this.transformStartingStyle(e, s["@starting-style"], l);
      }
    }
  }
  transformContainer(e, t) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    if (t) {
      var n;
      (n = this.currConditionalRuleset) === null || n === void 0 || n.addConditionPrecedence(r, Object.keys(t).map((a) => "@container ".concat(a))), Fe(t, (a, s) => {
        var u = "@container ".concat(s), l = [...r, u];
        this.addConditionalRule({
          selector: e.selector,
          rule: se(a, le)
        }, l), e.type === "local" && (this.transformSimplePseudos(e, a, l), this.transformSelectors(e, a, l)), this.transformLayer(e, a["@layer"], l), this.transformScope(e, a["@scope"], l), this.transformSupports(e, a["@supports"], l), this.transformMedia(e, a["@media"], l), this.transformStartingStyle(e, a["@starting-style"], l);
      });
    }
  }
  transformLayer(e, t) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    if (t) {
      var n;
      (n = this.currConditionalRuleset) === null || n === void 0 || n.addConditionPrecedence(r, Object.keys(t).map((a) => "@layer ".concat(a))), Fe(t, (a, s) => {
        var u = [...r, "@layer ".concat(s)];
        this.addLayer(u), this.addConditionalRule({
          selector: e.selector,
          rule: se(a, le)
        }, u), e.type === "local" && (this.transformSimplePseudos(e, a, u), this.transformSelectors(e, a, u)), this.transformScope(e, a["@scope"], u), this.transformMedia(e, a["@media"], u), this.transformSupports(e, a["@supports"], u), this.transformContainer(e, a["@container"], u), this.transformStartingStyle(e, a["@starting-style"], u);
      });
    }
  }
  transformScope(e, t) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    if (t) {
      var n, a = {};
      (n = this.currConditionalRuleset) === null || n === void 0 || n.addConditionPrecedence(r, Object.keys(t).map((f) => (a[f] = "@scope ".concat(this.transformSelector(f.replace(Ur, e.selector))), a[f])));
      for (var [s, u] of Object.entries(t)) {
        var l = [...r, a[s]];
        this.addConditionalRule({
          selector: e.selector,
          rule: se(u, le)
        }, l), e.type === "local" && (this.transformSimplePseudos(e, u, l), this.transformSelectors(e, u, l)), this.transformLayer(e, u["@layer"], l), this.transformMedia(e, u["@media"], l), this.transformSupports(e, u["@supports"], l), this.transformContainer(e, u["@container"], l), this.transformStartingStyle(e, u["@starting-style"], l);
      }
    }
  }
  transformSupports(e, t) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    if (t) {
      var n;
      (n = this.currConditionalRuleset) === null || n === void 0 || n.addConditionPrecedence(r, Object.keys(t).map((a) => "@supports ".concat(a))), Fe(t, (a, s) => {
        var u = [...r, "@supports ".concat(s)];
        this.addConditionalRule({
          selector: e.selector,
          rule: se(a, le)
        }, u), e.type === "local" && (this.transformSimplePseudos(e, a, u), this.transformSelectors(e, a, u)), this.transformLayer(e, a["@layer"], u), this.transformScope(e, a["@scope"], u), this.transformMedia(e, a["@media"], u), this.transformContainer(e, a["@container"], u), this.transformStartingStyle(e, a["@starting-style"], u);
      });
    }
  }
  transformSimplePseudos(e, t, r) {
    for (var n of Object.keys(t))
      if (Zr[n]) {
        if (e.type !== "local")
          throw new Error("Simple pseudos are not valid in ".concat(e.type === "global" ? '"globalStyle"' : '"selectors"'));
        r ? this.addConditionalRule({
          selector: "".concat(e.selector).concat(n),
          rule: t[n]
        }, r) : this.addRule({
          conditions: r,
          selector: "".concat(e.selector).concat(n),
          rule: t[n]
        });
      }
  }
  transformStartingStyle(e, t) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    if (t) {
      var n, a = Object.keys(t).find((u) => u.startsWith("@"));
      if (a)
        throw new Error('Nested at-rules (e.g. "'.concat(a, '") are not allowed inside @starting-style.'));
      (n = this.currConditionalRuleset) === null || n === void 0 || n.addConditionPrecedence(r, ["@starting-style"]);
      var s = [...r, "@starting-style"];
      this.addConditionalRule({
        selector: e.selector,
        rule: se(t, le)
      }, s), e.type === "local" && (this.transformSimplePseudos(e, t, s), this.transformSelectors(e, t, s));
    }
  }
  toCss() {
    var e = [];
    for (var t of this.fontFaceRules)
      e.push(ce({
        "@font-face": t
      }));
    for (var r of this.propertyRules)
      e.push(ce({
        ["@property ".concat(r.name)]: r.rule
      }));
    for (var n of this.keyframesRules)
      e.push(ce({
        ["@keyframes ".concat(n.name)]: n.rule
      }));
    for (var a of this.layers.values()) {
      var [s, ...u] = a.reverse(), l = {
        [s]: Bt
      };
      for (var f of u)
        l = {
          [f]: l
        };
      e.push(ce(l));
    }
    for (var p of this.rules)
      e.push(ce({
        [p.selector]: p.rule
      }));
    for (var c of this.conditionalRulesets)
      for (var m of c.renderToArray())
        e.push(ce(m));
    return e.filter(Boolean);
  }
}
function ce(i) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", t = [], r = function(s) {
    var u = i[s];
    if (u && Array.isArray(u))
      t.push(...u.map((f) => ce({
        [s]: f
      }, e)));
    else if (u && typeof u == "object") {
      var l = Object.keys(u).length === 0;
      l || t.push("".concat(e).concat(s, ` {
`).concat(ce(u, e + rn), `
`).concat(e, "}"));
    } else u === Bt ? t.push("".concat(e).concat(s, ";")) : t.push("".concat(e).concat(s.startsWith("--") ? s : en(s), ": ").concat(u, ";"));
  };
  for (var n of Object.keys(i))
    r(n);
  return t.join(`
`);
}
function an(i) {
  var {
    localClassNames: e,
    cssObjs: t,
    composedClassLists: r
  } = i, n = new nn(e, r);
  for (var a of t)
    n.processCssObj(a);
  return n.toCss();
}
function sn(i) {
  for (var e = 0, t, r = 0, n = i.length; n >= 4; ++r, n -= 4)
    t = i.charCodeAt(r) & 255 | (i.charCodeAt(++r) & 255) << 8 | (i.charCodeAt(++r) & 255) << 16 | (i.charCodeAt(++r) & 255) << 24, t = /* Math.imul(k, m): */
    (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16), t ^= /* k >>> r: */
    t >>> 24, e = /* Math.imul(k, m): */
    (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
    (e & 65535) * 1540483477 + ((e >>> 16) * 59797 << 16);
  switch (n) {
    case 3:
      e ^= (i.charCodeAt(r + 2) & 255) << 16;
    case 2:
      e ^= (i.charCodeAt(r + 1) & 255) << 8;
    case 1:
      e ^= i.charCodeAt(r) & 255, e = /* Math.imul(h, m): */
      (e & 65535) * 1540483477 + ((e >>> 16) * 59797 << 16);
  }
  return e ^= e >>> 13, e = /* Math.imul(h, m): */
  (e & 65535) * 1540483477 + ((e >>> 16) * 59797 << 16), ((e ^ e >>> 15) >>> 0).toString(36);
}
const be = typeof performance == "object" && performance && typeof performance.now == "function" ? performance : Date, qt = /* @__PURE__ */ new Set(), Ze = typeof process == "object" && process ? process : {}, Gt = (i, e, t, r) => {
  typeof Ze.emitWarning == "function" ? Ze.emitWarning(i, e, t, r) : console.error(`[${t}] ${e}: ${i}`);
};
let Ue = globalThis.AbortController, St = globalThis.AbortSignal;
var xt;
if (typeof Ue > "u") {
  St = class {
    constructor() {
      L(this, "onabort");
      L(this, "_onabort", []);
      L(this, "reason");
      L(this, "aborted", !1);
    }
    addEventListener(r, n) {
      this._onabort.push(n);
    }
  }, Ue = class {
    constructor() {
      L(this, "signal", new St());
      e();
    }
    abort(r) {
      var n, a;
      if (!this.signal.aborted) {
        this.signal.reason = r, this.signal.aborted = !0;
        for (const s of this.signal._onabort)
          s(r);
        (a = (n = this.signal).onabort) == null || a.call(n, r);
      }
    }
  };
  let i = ((xt = Ze.env) == null ? void 0 : xt.LRU_CACHE_IGNORE_AC_WARNING) !== "1";
  const e = () => {
    i && (i = !1, Gt("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", e));
  };
}
const ln = (i) => !qt.has(i), oe = (i) => i && i === Math.floor(i) && i > 0 && isFinite(i), Vt = (i) => oe(i) ? i <= Math.pow(2, 8) ? Uint8Array : i <= Math.pow(2, 16) ? Uint16Array : i <= Math.pow(2, 32) ? Uint32Array : i <= Number.MAX_SAFE_INTEGER ? De : null : null;
class De extends Array {
  constructor(e) {
    super(e), this.fill(0);
  }
}
var we;
const me = class me {
  constructor(e, t) {
    L(this, "heap");
    L(this, "length");
    if (!o(me, we))
      throw new TypeError("instantiate Stack using Stack.create(n)");
    this.heap = new t(e), this.length = 0;
  }
  static create(e) {
    const t = Vt(e);
    if (!t)
      return [];
    A(me, we, !0);
    const r = new me(e, t);
    return A(me, we, !1), r;
  }
  push(e) {
    this.heap[this.length++] = e;
  }
  pop() {
    return this.heap[--this.length];
  }
};
we = new WeakMap(), // private constructor
j(me, we, !1);
let Ye = me;
var zt, Pt, Z, q, Y, J, Se, Ce, D, X, M, z, E, U, G, W, R, Q, N, ee, te, V, re, pe, T, d, Xe, ge, ne, xe, H, Ht, ve, Ae, ze, ue, fe, Qe, _e, Re, x, et, je, he, tt;
const st = class st {
  constructor(e) {
    j(this, d);
    // options that cannot be changed without disaster
    j(this, Z);
    j(this, q);
    j(this, Y);
    j(this, J);
    j(this, Se);
    j(this, Ce);
    /**
     * {@link LRUCache.OptionsBase.ttl}
     */
    L(this, "ttl");
    /**
     * {@link LRUCache.OptionsBase.ttlResolution}
     */
    L(this, "ttlResolution");
    /**
     * {@link LRUCache.OptionsBase.ttlAutopurge}
     */
    L(this, "ttlAutopurge");
    /**
     * {@link LRUCache.OptionsBase.updateAgeOnGet}
     */
    L(this, "updateAgeOnGet");
    /**
     * {@link LRUCache.OptionsBase.updateAgeOnHas}
     */
    L(this, "updateAgeOnHas");
    /**
     * {@link LRUCache.OptionsBase.allowStale}
     */
    L(this, "allowStale");
    /**
     * {@link LRUCache.OptionsBase.noDisposeOnSet}
     */
    L(this, "noDisposeOnSet");
    /**
     * {@link LRUCache.OptionsBase.noUpdateTTL}
     */
    L(this, "noUpdateTTL");
    /**
     * {@link LRUCache.OptionsBase.maxEntrySize}
     */
    L(this, "maxEntrySize");
    /**
     * {@link LRUCache.OptionsBase.sizeCalculation}
     */
    L(this, "sizeCalculation");
    /**
     * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
     */
    L(this, "noDeleteOnFetchRejection");
    /**
     * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
     */
    L(this, "noDeleteOnStaleGet");
    /**
     * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
     */
    L(this, "allowStaleOnFetchAbort");
    /**
     * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
     */
    L(this, "allowStaleOnFetchRejection");
    /**
     * {@link LRUCache.OptionsBase.ignoreFetchAbort}
     */
    L(this, "ignoreFetchAbort");
    // computed properties
    j(this, D);
    j(this, X);
    j(this, M);
    j(this, z);
    j(this, E);
    j(this, U);
    j(this, G);
    j(this, W);
    j(this, R);
    j(this, Q);
    j(this, N);
    j(this, ee);
    j(this, te);
    j(this, V);
    j(this, re);
    j(this, pe);
    j(this, T);
    // conditionally set private methods related to TTL
    j(this, ge, () => {
    });
    j(this, ne, () => {
    });
    j(this, xe, () => {
    });
    /* c8 ignore stop */
    j(this, H, () => !1);
    j(this, ve, (e) => {
    });
    j(this, Ae, (e, t, r) => {
    });
    j(this, ze, (e, t, r, n) => {
      if (r || n)
        throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
      return 0;
    });
    /**
     * A String value that is used in the creation of the default string
     * description of an object. Called by the built-in method
     * `Object.prototype.toString`.
     */
    L(this, zt, "LRUCache");
    const { max: t = 0, ttl: r, ttlResolution: n = 1, ttlAutopurge: a, updateAgeOnGet: s, updateAgeOnHas: u, allowStale: l, dispose: f, disposeAfter: p, noDisposeOnSet: c, noUpdateTTL: m, maxSize: y = 0, maxEntrySize: w = 0, sizeCalculation: C, fetchMethod: v, memoMethod: h, noDeleteOnFetchRejection: g, noDeleteOnStaleGet: S, allowStaleOnFetchRejection: O, allowStaleOnFetchAbort: F, ignoreFetchAbort: P } = e;
    if (t !== 0 && !oe(t))
      throw new TypeError("max option must be a nonnegative integer");
    const $ = t ? Vt(t) : Array;
    if (!$)
      throw new Error("invalid max value: " + t);
    if (A(this, Z, t), A(this, q, y), this.maxEntrySize = w || o(this, q), this.sizeCalculation = C, this.sizeCalculation) {
      if (!o(this, q) && !this.maxEntrySize)
        throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
      if (typeof this.sizeCalculation != "function")
        throw new TypeError("sizeCalculation set to non-function");
    }
    if (h !== void 0 && typeof h != "function")
      throw new TypeError("memoMethod must be a function if defined");
    if (A(this, Ce, h), v !== void 0 && typeof v != "function")
      throw new TypeError("fetchMethod must be a function if specified");
    if (A(this, Se, v), A(this, pe, !!v), A(this, M, /* @__PURE__ */ new Map()), A(this, z, new Array(t).fill(void 0)), A(this, E, new Array(t).fill(void 0)), A(this, U, new $(t)), A(this, G, new $(t)), A(this, W, 0), A(this, R, 0), A(this, Q, Ye.create(t)), A(this, D, 0), A(this, X, 0), typeof f == "function" && A(this, Y, f), typeof p == "function" ? (A(this, J, p), A(this, N, [])) : (A(this, J, void 0), A(this, N, void 0)), A(this, re, !!o(this, Y)), A(this, T, !!o(this, J)), this.noDisposeOnSet = !!c, this.noUpdateTTL = !!m, this.noDeleteOnFetchRejection = !!g, this.allowStaleOnFetchRejection = !!O, this.allowStaleOnFetchAbort = !!F, this.ignoreFetchAbort = !!P, this.maxEntrySize !== 0) {
      if (o(this, q) !== 0 && !oe(o(this, q)))
        throw new TypeError("maxSize must be a positive integer if specified");
      if (!oe(this.maxEntrySize))
        throw new TypeError("maxEntrySize must be a positive integer if specified");
      b(this, d, Ht).call(this);
    }
    if (this.allowStale = !!l, this.noDeleteOnStaleGet = !!S, this.updateAgeOnGet = !!s, this.updateAgeOnHas = !!u, this.ttlResolution = oe(n) || n === 0 ? n : 1, this.ttlAutopurge = !!a, this.ttl = r || 0, this.ttl) {
      if (!oe(this.ttl))
        throw new TypeError("ttl must be a positive integer if specified");
      b(this, d, Xe).call(this);
    }
    if (o(this, Z) === 0 && this.ttl === 0 && o(this, q) === 0)
      throw new TypeError("At least one of max, maxSize, or ttl is required");
    if (!this.ttlAutopurge && !o(this, Z) && !o(this, q)) {
      const I = "LRU_CACHE_UNBOUNDED";
      ln(I) && (qt.add(I), Gt("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", I, st));
    }
  }
  /**
   * Do not call this method unless you need to inspect the
   * inner workings of the cache.  If anything returned by this
   * object is modified in any way, strange breakage may occur.
   *
   * These fields are private for a reason!
   *
   * @internal
   */
  static unsafeExposeInternals(e) {
    return {
      // properties
      starts: o(e, te),
      ttls: o(e, V),
      sizes: o(e, ee),
      keyMap: o(e, M),
      keyList: o(e, z),
      valList: o(e, E),
      next: o(e, U),
      prev: o(e, G),
      get head() {
        return o(e, W);
      },
      get tail() {
        return o(e, R);
      },
      free: o(e, Q),
      // methods
      isBackgroundFetch: (t) => {
        var r;
        return b(r = e, d, x).call(r, t);
      },
      backgroundFetch: (t, r, n, a) => {
        var s;
        return b(s = e, d, Re).call(s, t, r, n, a);
      },
      moveToTail: (t) => {
        var r;
        return b(r = e, d, je).call(r, t);
      },
      indexes: (t) => {
        var r;
        return b(r = e, d, ue).call(r, t);
      },
      rindexes: (t) => {
        var r;
        return b(r = e, d, fe).call(r, t);
      },
      isStale: (t) => {
        var r;
        return o(r = e, H).call(r, t);
      }
    };
  }
  // Protected read-only members
  /**
   * {@link LRUCache.OptionsBase.max} (read-only)
   */
  get max() {
    return o(this, Z);
  }
  /**
   * {@link LRUCache.OptionsBase.maxSize} (read-only)
   */
  get maxSize() {
    return o(this, q);
  }
  /**
   * The total computed size of items in the cache (read-only)
   */
  get calculatedSize() {
    return o(this, X);
  }
  /**
   * The number of items stored in the cache (read-only)
   */
  get size() {
    return o(this, D);
  }
  /**
   * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
   */
  get fetchMethod() {
    return o(this, Se);
  }
  get memoMethod() {
    return o(this, Ce);
  }
  /**
   * {@link LRUCache.OptionsBase.dispose} (read-only)
   */
  get dispose() {
    return o(this, Y);
  }
  /**
   * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
   */
  get disposeAfter() {
    return o(this, J);
  }
  /**
   * Return the number of ms left in the item's TTL. If item is not in cache,
   * returns `0`. Returns `Infinity` if item is in cache without a defined TTL.
   */
  getRemainingTTL(e) {
    return o(this, M).has(e) ? 1 / 0 : 0;
  }
  /**
   * Return a generator yielding `[key, value]` pairs,
   * in order from most recently used to least recently used.
   */
  *entries() {
    for (const e of b(this, d, ue).call(this))
      o(this, E)[e] !== void 0 && o(this, z)[e] !== void 0 && !b(this, d, x).call(this, o(this, E)[e]) && (yield [o(this, z)[e], o(this, E)[e]]);
  }
  /**
   * Inverse order version of {@link LRUCache.entries}
   *
   * Return a generator yielding `[key, value]` pairs,
   * in order from least recently used to most recently used.
   */
  *rentries() {
    for (const e of b(this, d, fe).call(this))
      o(this, E)[e] !== void 0 && o(this, z)[e] !== void 0 && !b(this, d, x).call(this, o(this, E)[e]) && (yield [o(this, z)[e], o(this, E)[e]]);
  }
  /**
   * Return a generator yielding the keys in the cache,
   * in order from most recently used to least recently used.
   */
  *keys() {
    for (const e of b(this, d, ue).call(this)) {
      const t = o(this, z)[e];
      t !== void 0 && !b(this, d, x).call(this, o(this, E)[e]) && (yield t);
    }
  }
  /**
   * Inverse order version of {@link LRUCache.keys}
   *
   * Return a generator yielding the keys in the cache,
   * in order from least recently used to most recently used.
   */
  *rkeys() {
    for (const e of b(this, d, fe).call(this)) {
      const t = o(this, z)[e];
      t !== void 0 && !b(this, d, x).call(this, o(this, E)[e]) && (yield t);
    }
  }
  /**
   * Return a generator yielding the values in the cache,
   * in order from most recently used to least recently used.
   */
  *values() {
    for (const e of b(this, d, ue).call(this))
      o(this, E)[e] !== void 0 && !b(this, d, x).call(this, o(this, E)[e]) && (yield o(this, E)[e]);
  }
  /**
   * Inverse order version of {@link LRUCache.values}
   *
   * Return a generator yielding the values in the cache,
   * in order from least recently used to most recently used.
   */
  *rvalues() {
    for (const e of b(this, d, fe).call(this))
      o(this, E)[e] !== void 0 && !b(this, d, x).call(this, o(this, E)[e]) && (yield o(this, E)[e]);
  }
  /**
   * Iterating over the cache itself yields the same results as
   * {@link LRUCache.entries}
   */
  [(Pt = Symbol.iterator, zt = Symbol.toStringTag, Pt)]() {
    return this.entries();
  }
  /**
   * Find a value for which the supplied fn method returns a truthy value,
   * similar to `Array.find()`. fn is called as `fn(value, key, cache)`.
   */
  find(e, t = {}) {
    for (const r of b(this, d, ue).call(this)) {
      const n = o(this, E)[r], a = b(this, d, x).call(this, n) ? n.__staleWhileFetching : n;
      if (a !== void 0 && e(a, o(this, z)[r], this))
        return this.get(o(this, z)[r], t);
    }
  }
  /**
   * Call the supplied function on each item in the cache, in order from most
   * recently used to least recently used.
   *
   * `fn` is called as `fn(value, key, cache)`.
   *
   * If `thisp` is provided, function will be called in the `this`-context of
   * the provided object, or the cache if no `thisp` object is provided.
   *
   * Does not update age or recenty of use, or iterate over stale values.
   */
  forEach(e, t = this) {
    for (const r of b(this, d, ue).call(this)) {
      const n = o(this, E)[r], a = b(this, d, x).call(this, n) ? n.__staleWhileFetching : n;
      a !== void 0 && e.call(t, a, o(this, z)[r], this);
    }
  }
  /**
   * The same as {@link LRUCache.forEach} but items are iterated over in
   * reverse order.  (ie, less recently used items are iterated over first.)
   */
  rforEach(e, t = this) {
    for (const r of b(this, d, fe).call(this)) {
      const n = o(this, E)[r], a = b(this, d, x).call(this, n) ? n.__staleWhileFetching : n;
      a !== void 0 && e.call(t, a, o(this, z)[r], this);
    }
  }
  /**
   * Delete any stale entries. Returns true if anything was removed,
   * false otherwise.
   */
  purgeStale() {
    let e = !1;
    for (const t of b(this, d, fe).call(this, { allowStale: !0 }))
      o(this, H).call(this, t) && (b(this, d, he).call(this, o(this, z)[t], "expire"), e = !0);
    return e;
  }
  /**
   * Get the extended info about a given entry, to get its value, size, and
   * TTL info simultaneously. Returns `undefined` if the key is not present.
   *
   * Unlike {@link LRUCache#dump}, which is designed to be portable and survive
   * serialization, the `start` value is always the current timestamp, and the
   * `ttl` is a calculated remaining time to live (negative if expired).
   *
   * Always returns stale values, if their info is found in the cache, so be
   * sure to check for expirations (ie, a negative {@link LRUCache.Entry#ttl})
   * if relevant.
   */
  info(e) {
    const t = o(this, M).get(e);
    if (t === void 0)
      return;
    const r = o(this, E)[t], n = b(this, d, x).call(this, r) ? r.__staleWhileFetching : r;
    if (n === void 0)
      return;
    const a = { value: n };
    if (o(this, V) && o(this, te)) {
      const s = o(this, V)[t], u = o(this, te)[t];
      if (s && u) {
        const l = s - (be.now() - u);
        a.ttl = l, a.start = Date.now();
      }
    }
    return o(this, ee) && (a.size = o(this, ee)[t]), a;
  }
  /**
   * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
   * passed to {@link LRLUCache#load}.
   *
   * The `start` fields are calculated relative to a portable `Date.now()`
   * timestamp, even if `performance.now()` is available.
   *
   * Stale entries are always included in the `dump`, even if
   * {@link LRUCache.OptionsBase.allowStale} is false.
   *
   * Note: this returns an actual array, not a generator, so it can be more
   * easily passed around.
   */
  dump() {
    const e = [];
    for (const t of b(this, d, ue).call(this, { allowStale: !0 })) {
      const r = o(this, z)[t], n = o(this, E)[t], a = b(this, d, x).call(this, n) ? n.__staleWhileFetching : n;
      if (a === void 0 || r === void 0)
        continue;
      const s = { value: a };
      if (o(this, V) && o(this, te)) {
        s.ttl = o(this, V)[t];
        const u = be.now() - o(this, te)[t];
        s.start = Math.floor(Date.now() - u);
      }
      o(this, ee) && (s.size = o(this, ee)[t]), e.unshift([r, s]);
    }
    return e;
  }
  /**
   * Reset the cache and load in the items in entries in the order listed.
   *
   * The shape of the resulting cache may be different if the same options are
   * not used in both caches.
   *
   * The `start` fields are assumed to be calculated relative to a portable
   * `Date.now()` timestamp, even if `performance.now()` is available.
   */
  load(e) {
    this.clear();
    for (const [t, r] of e) {
      if (r.start) {
        const n = Date.now() - r.start;
        r.start = be.now() - n;
      }
      this.set(t, r.value, r);
    }
  }
  /**
   * Add a value to the cache.
   *
   * Note: if `undefined` is specified as a value, this is an alias for
   * {@link LRUCache#delete}
   *
   * Fields on the {@link LRUCache.SetOptions} options param will override
   * their corresponding values in the constructor options for the scope
   * of this single `set()` operation.
   *
   * If `start` is provided, then that will set the effective start
   * time for the TTL calculation. Note that this must be a previous
   * value of `performance.now()` if supported, or a previous value of
   * `Date.now()` if not.
   *
   * Options object may also include `size`, which will prevent
   * calling the `sizeCalculation` function and just use the specified
   * number if it is a positive integer, and `noDisposeOnSet` which
   * will prevent calling a `dispose` function in the case of
   * overwrites.
   *
   * If the `size` (or return value of `sizeCalculation`) for a given
   * entry is greater than `maxEntrySize`, then the item will not be
   * added to the cache.
   *
   * Will update the recency of the entry.
   *
   * If the value is `undefined`, then this is an alias for
   * `cache.delete(key)`. `undefined` is never stored in the cache.
   */
  set(e, t, r = {}) {
    var m, y, w, C, v;
    if (t === void 0)
      return this.delete(e), this;
    const { ttl: n = this.ttl, start: a, noDisposeOnSet: s = this.noDisposeOnSet, sizeCalculation: u = this.sizeCalculation, status: l } = r;
    let { noUpdateTTL: f = this.noUpdateTTL } = r;
    const p = o(this, ze).call(this, e, t, r.size || 0, u);
    if (this.maxEntrySize && p > this.maxEntrySize)
      return l && (l.set = "miss", l.maxEntrySizeExceeded = !0), b(this, d, he).call(this, e, "set"), this;
    let c = o(this, D) === 0 ? void 0 : o(this, M).get(e);
    if (c === void 0)
      c = o(this, D) === 0 ? o(this, R) : o(this, Q).length !== 0 ? o(this, Q).pop() : o(this, D) === o(this, Z) ? b(this, d, _e).call(this, !1) : o(this, D), o(this, z)[c] = e, o(this, E)[c] = t, o(this, M).set(e, c), o(this, U)[o(this, R)] = c, o(this, G)[c] = o(this, R), A(this, R, c), Le(this, D)._++, o(this, Ae).call(this, c, p, l), l && (l.set = "add"), f = !1;
    else {
      b(this, d, je).call(this, c);
      const h = o(this, E)[c];
      if (t !== h) {
        if (o(this, pe) && b(this, d, x).call(this, h)) {
          h.__abortController.abort(new Error("replaced"));
          const { __staleWhileFetching: g } = h;
          g !== void 0 && !s && (o(this, re) && ((m = o(this, Y)) == null || m.call(this, g, e, "set")), o(this, T) && ((y = o(this, N)) == null || y.push([g, e, "set"])));
        } else s || (o(this, re) && ((w = o(this, Y)) == null || w.call(this, h, e, "set")), o(this, T) && ((C = o(this, N)) == null || C.push([h, e, "set"])));
        if (o(this, ve).call(this, c), o(this, Ae).call(this, c, p, l), o(this, E)[c] = t, l) {
          l.set = "replace";
          const g = h && b(this, d, x).call(this, h) ? h.__staleWhileFetching : h;
          g !== void 0 && (l.oldValue = g);
        }
      } else l && (l.set = "update");
    }
    if (n !== 0 && !o(this, V) && b(this, d, Xe).call(this), o(this, V) && (f || o(this, xe).call(this, c, n, a), l && o(this, ne).call(this, l, c)), !s && o(this, T) && o(this, N)) {
      const h = o(this, N);
      let g;
      for (; g = h == null ? void 0 : h.shift(); )
        (v = o(this, J)) == null || v.call(this, ...g);
    }
    return this;
  }
  /**
   * Evict the least recently used item, returning its value or
   * `undefined` if cache is empty.
   */
  pop() {
    var e;
    try {
      for (; o(this, D); ) {
        const t = o(this, E)[o(this, W)];
        if (b(this, d, _e).call(this, !0), b(this, d, x).call(this, t)) {
          if (t.__staleWhileFetching)
            return t.__staleWhileFetching;
        } else if (t !== void 0)
          return t;
      }
    } finally {
      if (o(this, T) && o(this, N)) {
        const t = o(this, N);
        let r;
        for (; r = t == null ? void 0 : t.shift(); )
          (e = o(this, J)) == null || e.call(this, ...r);
      }
    }
  }
  /**
   * Check if a key is in the cache, without updating the recency of use.
   * Will return false if the item is stale, even though it is technically
   * in the cache.
   *
   * Check if a key is in the cache, without updating the recency of
   * use. Age is updated if {@link LRUCache.OptionsBase.updateAgeOnHas} is set
   * to `true` in either the options or the constructor.
   *
   * Will return `false` if the item is stale, even though it is technically in
   * the cache. The difference can be determined (if it matters) by using a
   * `status` argument, and inspecting the `has` field.
   *
   * Will not update item age unless
   * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
   */
  has(e, t = {}) {
    const { updateAgeOnHas: r = this.updateAgeOnHas, status: n } = t, a = o(this, M).get(e);
    if (a !== void 0) {
      const s = o(this, E)[a];
      if (b(this, d, x).call(this, s) && s.__staleWhileFetching === void 0)
        return !1;
      if (o(this, H).call(this, a))
        n && (n.has = "stale", o(this, ne).call(this, n, a));
      else return r && o(this, ge).call(this, a), n && (n.has = "hit", o(this, ne).call(this, n, a)), !0;
    } else n && (n.has = "miss");
    return !1;
  }
  /**
   * Like {@link LRUCache#get} but doesn't update recency or delete stale
   * items.
   *
   * Returns `undefined` if the item is stale, unless
   * {@link LRUCache.OptionsBase.allowStale} is set.
   */
  peek(e, t = {}) {
    const { allowStale: r = this.allowStale } = t, n = o(this, M).get(e);
    if (n === void 0 || !r && o(this, H).call(this, n))
      return;
    const a = o(this, E)[n];
    return b(this, d, x).call(this, a) ? a.__staleWhileFetching : a;
  }
  async fetch(e, t = {}) {
    const {
      // get options
      allowStale: r = this.allowStale,
      updateAgeOnGet: n = this.updateAgeOnGet,
      noDeleteOnStaleGet: a = this.noDeleteOnStaleGet,
      // set options
      ttl: s = this.ttl,
      noDisposeOnSet: u = this.noDisposeOnSet,
      size: l = 0,
      sizeCalculation: f = this.sizeCalculation,
      noUpdateTTL: p = this.noUpdateTTL,
      // fetch exclusive options
      noDeleteOnFetchRejection: c = this.noDeleteOnFetchRejection,
      allowStaleOnFetchRejection: m = this.allowStaleOnFetchRejection,
      ignoreFetchAbort: y = this.ignoreFetchAbort,
      allowStaleOnFetchAbort: w = this.allowStaleOnFetchAbort,
      context: C,
      forceRefresh: v = !1,
      status: h,
      signal: g
    } = t;
    if (!o(this, pe))
      return h && (h.fetch = "get"), this.get(e, {
        allowStale: r,
        updateAgeOnGet: n,
        noDeleteOnStaleGet: a,
        status: h
      });
    const S = {
      allowStale: r,
      updateAgeOnGet: n,
      noDeleteOnStaleGet: a,
      ttl: s,
      noDisposeOnSet: u,
      size: l,
      sizeCalculation: f,
      noUpdateTTL: p,
      noDeleteOnFetchRejection: c,
      allowStaleOnFetchRejection: m,
      allowStaleOnFetchAbort: w,
      ignoreFetchAbort: y,
      status: h,
      signal: g
    };
    let O = o(this, M).get(e);
    if (O === void 0) {
      h && (h.fetch = "miss");
      const F = b(this, d, Re).call(this, e, O, S, C);
      return F.__returned = F;
    } else {
      const F = o(this, E)[O];
      if (b(this, d, x).call(this, F)) {
        const Oe = r && F.__staleWhileFetching !== void 0;
        return h && (h.fetch = "inflight", Oe && (h.returnedStale = !0)), Oe ? F.__staleWhileFetching : F.__returned = F;
      }
      const P = o(this, H).call(this, O);
      if (!v && !P)
        return h && (h.fetch = "hit"), b(this, d, je).call(this, O), n && o(this, ge).call(this, O), h && o(this, ne).call(this, h, O), F;
      const $ = b(this, d, Re).call(this, e, O, S, C), ae = $.__staleWhileFetching !== void 0 && r;
      return h && (h.fetch = P ? "stale" : "refresh", ae && P && (h.returnedStale = !0)), ae ? $.__staleWhileFetching : $.__returned = $;
    }
  }
  async forceFetch(e, t = {}) {
    const r = await this.fetch(e, t);
    if (r === void 0)
      throw new Error("fetch() returned undefined");
    return r;
  }
  memo(e, t = {}) {
    const r = o(this, Ce);
    if (!r)
      throw new Error("no memoMethod provided to constructor");
    const { context: n, forceRefresh: a, ...s } = t, u = this.get(e, s);
    if (!a && u !== void 0)
      return u;
    const l = r(e, u, {
      options: s,
      context: n
    });
    return this.set(e, l, s), l;
  }
  /**
   * Return a value from the cache. Will update the recency of the cache
   * entry found.
   *
   * If the key is not found, get() will return `undefined`.
   */
  get(e, t = {}) {
    const { allowStale: r = this.allowStale, updateAgeOnGet: n = this.updateAgeOnGet, noDeleteOnStaleGet: a = this.noDeleteOnStaleGet, status: s } = t, u = o(this, M).get(e);
    if (u !== void 0) {
      const l = o(this, E)[u], f = b(this, d, x).call(this, l);
      return s && o(this, ne).call(this, s, u), o(this, H).call(this, u) ? (s && (s.get = "stale"), f ? (s && r && l.__staleWhileFetching !== void 0 && (s.returnedStale = !0), r ? l.__staleWhileFetching : void 0) : (a || b(this, d, he).call(this, e, "expire"), s && r && (s.returnedStale = !0), r ? l : void 0)) : (s && (s.get = "hit"), f ? l.__staleWhileFetching : (b(this, d, je).call(this, u), n && o(this, ge).call(this, u), l));
    } else s && (s.get = "miss");
  }
  /**
   * Deletes a key out of the cache.
   *
   * Returns true if the key was deleted, false otherwise.
   */
  delete(e) {
    return b(this, d, he).call(this, e, "delete");
  }
  /**
   * Clear the cache entirely, throwing away all values.
   */
  clear() {
    return b(this, d, tt).call(this, "delete");
  }
};
Z = new WeakMap(), q = new WeakMap(), Y = new WeakMap(), J = new WeakMap(), Se = new WeakMap(), Ce = new WeakMap(), D = new WeakMap(), X = new WeakMap(), M = new WeakMap(), z = new WeakMap(), E = new WeakMap(), U = new WeakMap(), G = new WeakMap(), W = new WeakMap(), R = new WeakMap(), Q = new WeakMap(), N = new WeakMap(), ee = new WeakMap(), te = new WeakMap(), V = new WeakMap(), re = new WeakMap(), pe = new WeakMap(), T = new WeakMap(), d = new WeakSet(), Xe = function() {
  const e = new De(o(this, Z)), t = new De(o(this, Z));
  A(this, V, e), A(this, te, t), A(this, xe, (a, s, u = be.now()) => {
    if (t[a] = s !== 0 ? u : 0, e[a] = s, s !== 0 && this.ttlAutopurge) {
      const l = setTimeout(() => {
        o(this, H).call(this, a) && b(this, d, he).call(this, o(this, z)[a], "expire");
      }, s + 1);
      l.unref && l.unref();
    }
  }), A(this, ge, (a) => {
    t[a] = e[a] !== 0 ? be.now() : 0;
  }), A(this, ne, (a, s) => {
    if (e[s]) {
      const u = e[s], l = t[s];
      if (!u || !l)
        return;
      a.ttl = u, a.start = l, a.now = r || n();
      const f = a.now - l;
      a.remainingTTL = u - f;
    }
  });
  let r = 0;
  const n = () => {
    const a = be.now();
    if (this.ttlResolution > 0) {
      r = a;
      const s = setTimeout(() => r = 0, this.ttlResolution);
      s.unref && s.unref();
    }
    return a;
  };
  this.getRemainingTTL = (a) => {
    const s = o(this, M).get(a);
    if (s === void 0)
      return 0;
    const u = e[s], l = t[s];
    if (!u || !l)
      return 1 / 0;
    const f = (r || n()) - l;
    return u - f;
  }, A(this, H, (a) => {
    const s = t[a], u = e[a];
    return !!u && !!s && (r || n()) - s > u;
  });
}, ge = new WeakMap(), ne = new WeakMap(), xe = new WeakMap(), H = new WeakMap(), Ht = function() {
  const e = new De(o(this, Z));
  A(this, X, 0), A(this, ee, e), A(this, ve, (t) => {
    A(this, X, o(this, X) - e[t]), e[t] = 0;
  }), A(this, ze, (t, r, n, a) => {
    if (b(this, d, x).call(this, r))
      return 0;
    if (!oe(n))
      if (a) {
        if (typeof a != "function")
          throw new TypeError("sizeCalculation must be a function");
        if (n = a(r, t), !oe(n))
          throw new TypeError("sizeCalculation return invalid (expect positive integer)");
      } else
        throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
    return n;
  }), A(this, Ae, (t, r, n) => {
    if (e[t] = r, o(this, q)) {
      const a = o(this, q) - e[t];
      for (; o(this, X) > a; )
        b(this, d, _e).call(this, !0);
    }
    A(this, X, o(this, X) + e[t]), n && (n.entrySize = r, n.totalCalculatedSize = o(this, X));
  });
}, ve = new WeakMap(), Ae = new WeakMap(), ze = new WeakMap(), ue = function* ({ allowStale: e = this.allowStale } = {}) {
  if (o(this, D))
    for (let t = o(this, R); !(!b(this, d, Qe).call(this, t) || ((e || !o(this, H).call(this, t)) && (yield t), t === o(this, W))); )
      t = o(this, G)[t];
}, fe = function* ({ allowStale: e = this.allowStale } = {}) {
  if (o(this, D))
    for (let t = o(this, W); !(!b(this, d, Qe).call(this, t) || ((e || !o(this, H).call(this, t)) && (yield t), t === o(this, R))); )
      t = o(this, U)[t];
}, Qe = function(e) {
  return e !== void 0 && o(this, M).get(o(this, z)[e]) === e;
}, _e = function(e) {
  var a, s;
  const t = o(this, W), r = o(this, z)[t], n = o(this, E)[t];
  return o(this, pe) && b(this, d, x).call(this, n) ? n.__abortController.abort(new Error("evicted")) : (o(this, re) || o(this, T)) && (o(this, re) && ((a = o(this, Y)) == null || a.call(this, n, r, "evict")), o(this, T) && ((s = o(this, N)) == null || s.push([n, r, "evict"]))), o(this, ve).call(this, t), e && (o(this, z)[t] = void 0, o(this, E)[t] = void 0, o(this, Q).push(t)), o(this, D) === 1 ? (A(this, W, A(this, R, 0)), o(this, Q).length = 0) : A(this, W, o(this, U)[t]), o(this, M).delete(r), Le(this, D)._--, t;
}, Re = function(e, t, r, n) {
  const a = t === void 0 ? void 0 : o(this, E)[t];
  if (b(this, d, x).call(this, a))
    return a;
  const s = new Ue(), { signal: u } = r;
  u == null || u.addEventListener("abort", () => s.abort(u.reason), {
    signal: s.signal
  });
  const l = {
    signal: s.signal,
    options: r,
    context: n
  }, f = (C, v = !1) => {
    const { aborted: h } = s.signal, g = r.ignoreFetchAbort && C !== void 0;
    if (r.status && (h && !v ? (r.status.fetchAborted = !0, r.status.fetchError = s.signal.reason, g && (r.status.fetchAbortIgnored = !0)) : r.status.fetchResolved = !0), h && !g && !v)
      return c(s.signal.reason);
    const S = y;
    return o(this, E)[t] === y && (C === void 0 ? S.__staleWhileFetching ? o(this, E)[t] = S.__staleWhileFetching : b(this, d, he).call(this, e, "fetch") : (r.status && (r.status.fetchUpdated = !0), this.set(e, C, l.options))), C;
  }, p = (C) => (r.status && (r.status.fetchRejected = !0, r.status.fetchError = C), c(C)), c = (C) => {
    const { aborted: v } = s.signal, h = v && r.allowStaleOnFetchAbort, g = h || r.allowStaleOnFetchRejection, S = g || r.noDeleteOnFetchRejection, O = y;
    if (o(this, E)[t] === y && (!S || O.__staleWhileFetching === void 0 ? b(this, d, he).call(this, e, "fetch") : h || (o(this, E)[t] = O.__staleWhileFetching)), g)
      return r.status && O.__staleWhileFetching !== void 0 && (r.status.returnedStale = !0), O.__staleWhileFetching;
    if (O.__returned === O)
      throw C;
  }, m = (C, v) => {
    var g;
    const h = (g = o(this, Se)) == null ? void 0 : g.call(this, e, a, l);
    h && h instanceof Promise && h.then((S) => C(S === void 0 ? void 0 : S), v), s.signal.addEventListener("abort", () => {
      (!r.ignoreFetchAbort || r.allowStaleOnFetchAbort) && (C(void 0), r.allowStaleOnFetchAbort && (C = (S) => f(S, !0)));
    });
  };
  r.status && (r.status.fetchDispatched = !0);
  const y = new Promise(m).then(f, p), w = Object.assign(y, {
    __abortController: s,
    __staleWhileFetching: a,
    __returned: void 0
  });
  return t === void 0 ? (this.set(e, w, { ...l.options, status: void 0 }), t = o(this, M).get(e)) : o(this, E)[t] = w, w;
}, x = function(e) {
  if (!o(this, pe))
    return !1;
  const t = e;
  return !!t && t instanceof Promise && t.hasOwnProperty("__staleWhileFetching") && t.__abortController instanceof Ue;
}, et = function(e, t) {
  o(this, G)[t] = e, o(this, U)[e] = t;
}, je = function(e) {
  e !== o(this, R) && (e === o(this, W) ? A(this, W, o(this, U)[e]) : b(this, d, et).call(this, o(this, G)[e], o(this, U)[e]), b(this, d, et).call(this, o(this, R), e), A(this, R, e));
}, he = function(e, t) {
  var n, a, s, u;
  let r = !1;
  if (o(this, D) !== 0) {
    const l = o(this, M).get(e);
    if (l !== void 0)
      if (r = !0, o(this, D) === 1)
        b(this, d, tt).call(this, t);
      else {
        o(this, ve).call(this, l);
        const f = o(this, E)[l];
        if (b(this, d, x).call(this, f) ? f.__abortController.abort(new Error("deleted")) : (o(this, re) || o(this, T)) && (o(this, re) && ((n = o(this, Y)) == null || n.call(this, f, e, t)), o(this, T) && ((a = o(this, N)) == null || a.push([f, e, t]))), o(this, M).delete(e), o(this, z)[l] = void 0, o(this, E)[l] = void 0, l === o(this, R))
          A(this, R, o(this, G)[l]);
        else if (l === o(this, W))
          A(this, W, o(this, U)[l]);
        else {
          const p = o(this, G)[l];
          o(this, U)[p] = o(this, U)[l];
          const c = o(this, U)[l];
          o(this, G)[c] = o(this, G)[l];
        }
        Le(this, D)._--, o(this, Q).push(l);
      }
  }
  if (o(this, T) && ((s = o(this, N)) != null && s.length)) {
    const l = o(this, N);
    let f;
    for (; f = l == null ? void 0 : l.shift(); )
      (u = o(this, J)) == null || u.call(this, ...f);
  }
  return r;
}, tt = function(e) {
  var t, r, n;
  for (const a of b(this, d, fe).call(this, { allowStale: !0 })) {
    const s = o(this, E)[a];
    if (b(this, d, x).call(this, s))
      s.__abortController.abort(new Error("deleted"));
    else {
      const u = o(this, z)[a];
      o(this, re) && ((t = o(this, Y)) == null || t.call(this, s, u, e)), o(this, T) && ((r = o(this, N)) == null || r.push([s, u, e]));
    }
  }
  if (o(this, M).clear(), o(this, E).fill(void 0), o(this, z).fill(void 0), o(this, V) && o(this, te) && (o(this, V).fill(0), o(this, te).fill(0)), o(this, ee) && o(this, ee).fill(0), A(this, W, 0), A(this, R, 0), o(this, Q).length = 0, A(this, X, 0), A(this, D, 0), o(this, T) && o(this, N)) {
    const a = o(this, N);
    let s;
    for (; s = a == null ? void 0 : a.shift(); )
      (n = o(this, J)) == null || n.call(this, ...s);
  }
};
let Je = st;
function on(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var Ve, Ct;
function un() {
  if (Ct) return Ve;
  Ct = 1;
  var i = function(g) {
    return e(g) && !t(g);
  };
  function e(h) {
    return !!h && typeof h == "object";
  }
  function t(h) {
    var g = Object.prototype.toString.call(h);
    return g === "[object RegExp]" || g === "[object Date]" || a(h);
  }
  var r = typeof Symbol == "function" && Symbol.for, n = r ? Symbol.for("react.element") : 60103;
  function a(h) {
    return h.$$typeof === n;
  }
  function s(h) {
    return Array.isArray(h) ? [] : {};
  }
  function u(h, g) {
    return g.clone !== !1 && g.isMergeableObject(h) ? C(s(h), h, g) : h;
  }
  function l(h, g, S) {
    return h.concat(g).map(function(O) {
      return u(O, S);
    });
  }
  function f(h, g) {
    if (!g.customMerge)
      return C;
    var S = g.customMerge(h);
    return typeof S == "function" ? S : C;
  }
  function p(h) {
    return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(h).filter(function(g) {
      return Object.propertyIsEnumerable.call(h, g);
    }) : [];
  }
  function c(h) {
    return Object.keys(h).concat(p(h));
  }
  function m(h, g) {
    try {
      return g in h;
    } catch {
      return !1;
    }
  }
  function y(h, g) {
    return m(h, g) && !(Object.hasOwnProperty.call(h, g) && Object.propertyIsEnumerable.call(h, g));
  }
  function w(h, g, S) {
    var O = {};
    return S.isMergeableObject(h) && c(h).forEach(function(F) {
      O[F] = u(h[F], S);
    }), c(g).forEach(function(F) {
      y(h, F) || (m(h, F) && S.isMergeableObject(g[F]) ? O[F] = f(F, S)(h[F], g[F], S) : O[F] = u(g[F], S));
    }), O;
  }
  function C(h, g, S) {
    S = S || {}, S.arrayMerge = S.arrayMerge || l, S.isMergeableObject = S.isMergeableObject || i, S.cloneUnlessOtherwiseSpecified = u;
    var O = Array.isArray(g), F = Array.isArray(h), P = O === F;
    return P ? O ? S.arrayMerge(h, g, S) : w(h, g, S) : u(g, S);
  }
  C.all = function(g, S) {
    if (!Array.isArray(g))
      throw new Error("first argument should be an array");
    return g.reduce(function(O, F) {
      return C(O, F, S);
    }, {});
  };
  var v = C;
  return Ve = v, Ve;
}
var fn = un();
const hn = /* @__PURE__ */ on(fn);
var At = /* @__PURE__ */ new Set(), Ot = [], He = [], cn = {
  appendCss: (i) => {
    He.push(i);
  },
  registerClassName: (i) => {
    At.add(i);
  },
  registerComposition: (i) => {
    Ot.push(i);
  },
  markCompositionUsed: () => {
  },
  onEndFileScope: (i) => {
    var e = an({
      localClassNames: Array.from(At),
      composedClassLists: Ot,
      cssObjs: He
    }).join(`
`);
    or({
      fileScope: i,
      css: e
    }), He = [];
  },
  getIdentOption: () => process.env.NODE_ENV === "production" ? "short" : "debug"
};
tr(cn);
var Et = (i, e) => {
  for (var t = e - 1; t >= 0; ) {
    if (i[t] === "/")
      return t;
    t--;
  }
  return -1;
}, pn = (i) => {
  var e, t = i.lastIndexOf(".css");
  if (t === -1)
    return "";
  var r = Et(i, t);
  if (e = i.slice(r + 1, t), r === -1)
    return e;
  var n = Et(i, r - 1), a = i.slice(n + 1, r), s = e !== "index" ? e : a;
  return s.replace(/\./g, "_");
}, dn = () => {
  var i = new Je({
    max: 500
  });
  return (e) => {
    var t = i.get(e);
    if (t)
      return t;
    var r = pn(e);
    return i.set(e, r), r;
  };
}, mn = dn();
function gn(i) {
  var {
    debugId: e,
    debugFileName: t
  } = i, r = e ? [e.replace(/\s/g, "_")] : [];
  if (t) {
    var {
      filePath: n
    } = de(), a = mn(n);
    a && r.unshift(a);
  }
  return r.join("_");
}
function Ft(i) {
  return i.match(/^[0-9]/) ? "_".concat(i) : i;
}
function $t(i) {
  var e = sr(), {
    debugId: t,
    debugFileName: r = !0
  } = ie(ie({}, typeof i == "string" ? {
    debugId: i
  } : null), typeof i == "object" ? i : null), n = lr().toString(36), {
    filePath: a,
    packageName: s
  } = de(), u = sn(s ? "".concat(s).concat(a) : a), l = "".concat(u).concat(n);
  if (e === "debug") {
    var f = gn({
      debugId: t,
      debugFileName: r
    });
    return f && (l = "".concat(f, "__").concat(l)), Ft(l);
  }
  if (typeof e == "function") {
    if (l = e({
      hash: l,
      debugId: t,
      filePath: a,
      packageName: s
    }), !l.match(/^[A-Z_][0-9A-Z_-]+$/i))
      throw new Error('Identifier function returned invalid indentifier: "'.concat(l, '"'));
    return l;
  }
  return Ft(l);
}
function vn(i, e) {
  var t = $t(e);
  Dt(t, de());
  var r = [], n = [];
  for (var a of i)
    typeof a == "string" || Array.isArray(a) ? r.push(a) : n.push(a);
  var s = t, u = Br(r);
  if (u.length > 0 && (s = "".concat(t, " ").concat(u), nr({
    identifier: t,
    classList: s
  }, de()), n.length > 0 && _t(t)), n.length > 0) {
    var l = hn.all(n, {
      // Replace arrays rather than merging
      arrayMerge: (f, p) => p
    });
    Mt({
      type: "local",
      selector: t,
      rule: l
    }, de());
  }
  return s;
}
function jt(i, e) {
  if (Array.isArray(i))
    return vn(i, e);
  var t = $t(e);
  return Dt(t, de()), Mt({
    type: "local",
    selector: t,
    rule: i
  }, de()), t;
}
function An() {
  if (typeof (arguments.length <= 1 ? void 0 : arguments[1]) == "function") {
    var i = arguments.length <= 0 ? void 0 : arguments[0], e = arguments.length <= 1 ? void 0 : arguments[1], t = arguments.length <= 2 ? void 0 : arguments[2], r = {};
    for (var n in i)
      r[n] = jt(e(i[n], n), t ? "".concat(t, "_").concat(n) : n);
    return r;
  }
  var a = arguments.length <= 0 ? void 0 : arguments[0], s = arguments.length <= 1 ? void 0 : arguments[1], u = {};
  for (var l in a)
    u[l] = jt(a[l], s ? "".concat(s, "_").concat(l) : l);
  return u;
}
export {
  jt as a,
  bn as b,
  wn as e,
  An as s
};
//# sourceMappingURL=vanilla-extract-css.browser.esm-D1_fj2nn.js.map
