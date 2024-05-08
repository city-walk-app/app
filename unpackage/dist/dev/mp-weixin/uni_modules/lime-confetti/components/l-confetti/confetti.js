"use strict";
function t(t2, e2) {
  for (var n2 = 0; e2.length > n2; n2++) {
    var a2 = e2[n2];
    a2.enumerable = a2.enumerable || false, a2.configurable = true, "value" in a2 && (a2.writable = true), Object.defineProperty(t2, a2.key, a2);
  }
}
var e = 0;
function n(t2) {
  return "__private_" + e++ + "_" + t2;
}
var a = "undefined" != typeof window, i = n("defaults"), o = function() {
  function e2(t2, n3) {
    !function(t3, e3) {
      if (!(t3 instanceof e3))
        throw new TypeError("Cannot call a class as a function");
    }(this, e2), Object.defineProperty(this, i, { writable: true, value: { particleCount: 50, angle: 90, spread: 45, startVelocity: 45, decay: 0.9, gravity: 1, drift: 0, ticks: 200, x: 0.5, y: 0.5, shapes: ["square", "circle"], zIndex: 100, colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"], disableForReducedMotion: false, scalar: 1 } }), this.canvas = void 0, this.play = void 0, this.raf = void 0, this.done = void 0, this.options = void 0, this.canvas = t2, this.options = n3, this.done = function() {
      return n3.done && n3.done();
    }, this._requestAnimationFrame(), this.play = this.confettiCannon(t2, n3);
  }
  var n2, o2;
  return n2 = e2, o2 = [{ key: "_requestAnimationFrame", value: function() {
    var t2, e3, n3 = {}, i2 = 0, o3 = a ? window.requestAnimationFrame : this.canvas.requestAnimationFrame, r = a ? window.cancelAnimationFrame : this.canvas.cancelAnimationFrame;
    "function" == typeof o3 && "function" == typeof r ? (t2 = function(t3) {
      var e4 = Math.random();
      return n3[e4] = o3(function a2(r2) {
        i2 === r2 || r2 > i2 + 16 - 1 ? (i2 = r2, delete n3[e4], t3()) : n3[e4] = o3(a2);
      }), e4;
    }, e3 = function(t3) {
      n3[t3] && r(n3[t3]);
    }) : (t2 = function(t3) {
      return setTimeout(t3, 16);
    }, e3 = function(t3) {
      return clearTimeout(t3);
    }), this.raf = { frame: t2, cancel: e3 };
  } }, { key: "convert", value: function(t2, e3) {
    return e3 ? e3(t2) : t2;
  } }, { key: "isOk", value: function(t2) {
    return !(null == t2);
  } }, { key: "prop", value: function(t2, e3, n3) {
    return this.convert(t2 && this.isOk(t2[e3]) ? t2[e3] : function(t3, e4) {
      if (!Object.prototype.hasOwnProperty.call(t3, e4))
        throw new TypeError("attempted to use private field on non-instance");
      return t3;
    }(this, i)[i][e3], n3);
  } }, { key: "onlyPositiveInt", value: function(t2) {
    return 0 > t2 ? 0 : Math.floor(t2);
  } }, { key: "randomInt", value: function(t2, e3) {
    return Math.floor(Math.random() * (e3 - t2)) + t2;
  } }, { key: "toDecimal", value: function(t2) {
    return parseInt(t2, 16);
  } }, { key: "colorsToRgb", value: function(t2) {
    return t2.map(this.hexToRgb.bind(this));
  } }, { key: "hexToRgb", value: function(t2) {
    var e3 = (t2 + "").replace(/[^0-9a-f]/gi, "");
    return 6 > e3.length && (e3 = e3[0] + e3[0] + e3[1] + e3[1] + e3[2] + e3[2]), { r: this.toDecimal(e3.substring(0, 2)), g: this.toDecimal(e3.substring(2, 4)), b: this.toDecimal(e3.substring(4, 6)) };
  } }, { key: "getOrigin", value: function(t2) {
    var e3 = this.prop(t2, "origin", Object);
    return e3.x = this.prop(e3, "x", Number), e3.y = this.prop(e3, "y", Number), e3;
  } }, { key: "setCanvasWindowSize", value: function(t2) {
    a && (t2.width = document.documentElement.clientWidth, t2.height = document.documentElement.clientHeight);
  } }, { key: "setCanvasRectSize", value: function(t2) {
    if (a && t2.getBoundingClientRect) {
      var e3 = t2.getBoundingClientRect();
      t2.width = e3.width, t2.height = e3.height;
    }
  } }, { key: "getCanvas", value: function(t2) {
    if (a) {
      var e3 = document.createElement("canvas");
      return e3.style.position = "fixed", e3.style.top = "0px", e3.style.left = "0px", e3.style.pointerEvents = "none", e3.style.zIndex = t2, e3;
    }
  } }, { key: "_draw", value: function(t2) {
    t2.draw && t2.draw(true);
  } }, { key: "ellipse", value: function(t2, e3, n3, a2, i2, o3, r, l, s) {
    t2.save(), t2.translate(e3, n3), t2.rotate(o3), t2.scale(a2, i2), t2.arc(0, 0, 1, r, l, s), t2.fill(), t2.restore();
  } }, { key: "randomPhysics", value: function(t2) {
    var e3 = t2.angle * (Math.PI / 180), n3 = t2.spread * (Math.PI / 180);
    return { x: t2.x, y: t2.y, wobble: 10 * Math.random(), wobbleSpeed: Math.min(0.11, 0.1 * Math.random() + 0.05), velocity: 0.5 * t2.startVelocity + Math.random() * t2.startVelocity, angle2D: -e3 + (0.5 * n3 - Math.random() * n3), tiltAngle: (0.5 * Math.random() + 0.25) * Math.PI, color: t2.color, shape: t2.shape, tick: 0, totalTicks: t2.ticks, decay: t2.decay, drift: t2.drift, random: Math.random() + 2, tiltSin: 0, tiltCos: 0, wobbleX: 0, wobbleY: 0, gravity: 3 * t2.gravity, ovalScalar: 0.6, scalar: t2.scalar };
  } }, { key: "updateFetti", value: function(t2, e3) {
    e3.x += Math.cos(e3.angle2D) * e3.velocity + e3.drift, e3.y += Math.sin(e3.angle2D) * e3.velocity + e3.gravity, e3.wobble += e3.wobbleSpeed, e3.velocity *= e3.decay, e3.tiltAngle += 0.1, e3.tiltSin = Math.sin(e3.tiltAngle), e3.tiltCos = Math.cos(e3.tiltAngle), e3.random = Math.random() + 2, e3.wobbleX = e3.x + 10 * e3.scalar * Math.cos(e3.wobble), e3.wobbleY = e3.y + 10 * e3.scalar * Math.sin(e3.wobble);
    var n3 = e3.tick++ / e3.totalTicks, a2 = e3.x + e3.random * e3.tiltCos, i2 = e3.y + e3.random * e3.tiltSin, o3 = e3.wobbleX + e3.random * e3.tiltCos, r = e3.wobbleY + e3.random * e3.tiltSin;
    if (t2.fillStyle = "rgba(" + e3.color.r + ", " + e3.color.g + ", " + e3.color.b + ", " + (1 - n3) + ")", t2.beginPath(), "circle" === e3.shape)
      t2.ellipse ? t2.ellipse(e3.x, e3.y, Math.abs(o3 - a2) * e3.ovalScalar, Math.abs(r - i2) * e3.ovalScalar, Math.PI / 10 * e3.wobble, 0, 2 * Math.PI) : this.ellipse(t2, e3.x, e3.y, Math.abs(o3 - a2) * e3.ovalScalar, Math.abs(r - i2) * e3.ovalScalar, Math.PI / 10 * e3.wobble, 0, 2 * Math.PI);
    else if ("star" === e3.shape)
      for (var l = Math.PI / 2 * 3, s = 4 * e3.scalar, c = 8 * e3.scalar, h = 5, u = Math.PI / h; h--; )
        t2.lineTo(e3.x + Math.cos(l) * c, e3.y + Math.sin(l) * c), t2.lineTo(e3.x + Math.cos(l += u) * s, e3.y + Math.sin(l) * s), l += u;
    else
      t2.moveTo(Math.floor(e3.x), Math.floor(e3.y)), t2.lineTo(Math.floor(e3.wobbleX), Math.floor(i2)), t2.lineTo(Math.floor(o3), Math.floor(r)), t2.lineTo(Math.floor(a2), Math.floor(e3.wobbleY));
    return t2.closePath(), t2.fill(), this._draw(t2), e3.totalTicks > e3.tick;
  } }, { key: "animate", value: function(t2, e3, n3, a2, i2) {
    var o3, r, l = this, s = e3.slice(), c = t2.getContext("2d"), h = this.raf, u = new Promise(function(e4) {
      var u2 = function() {
        o3 = r = null, null == c || c.clearRect(0, 0, a2.width, a2.height), i2(), e4("");
      };
      o3 = h.frame(function e5() {
        a2.width || a2.height || (n3(t2), a2.width = t2.width, a2.height = t2.height), c && (c.clearRect(0, 0, a2.width, a2.height), (s = s.filter(function(t3) {
          if (c)
            return l.updateFetti(c, t3);
        })).length ? o3 = h.frame(e5) : u2());
      }), r = u2;
    });
    return { addFettis: function(t3) {
      return s = s.concat(t3), u;
    }, canvas: t2, promise: u, reset: function() {
      o3 && h.cancel(o3), r && r();
    } };
  } }, { key: "confettiCannon", value: function(t2, e3) {
    var n3, i2 = this, o3 = !t2, r = !!this.prop(e3 || {}, "resize"), l = this.prop(e3, "disableForReducedMotion", Boolean), s = o3 ? this.setCanvasWindowSize : this.setCanvasRectSize, c = false, h = "function" == typeof matchMedia && matchMedia("(prefers-reduced-motion)").matches, u = function(e4) {
      var u2 = l || i2.prop(e4, "disableForReducedMotion", Boolean), d = i2.prop(e4, "zIndex", Number);
      if (u2 && h)
        return new Promise(function(t3) {
          t3("");
        });
      o3 && n3 ? t2 = n3.canvas : o3 && !t2 && (t2 = i2.getCanvas(d), a && document.body.appendChild(t2)), r && !c && s(t2);
      var f = { width: t2.width, height: t2.height };
      function p() {
        f.width = f.height = 0;
      }
      return r && a && window.addEventListener("resize", p, false), function(e5, a2, o4) {
        for (var r2 = i2.prop(e5, "particleCount", i2.onlyPositiveInt.bind(i2)), l2 = i2.prop(e5, "angle", Number), c2 = i2.prop(e5, "spread", Number), h2 = i2.prop(e5, "startVelocity", Number), u3 = i2.prop(e5, "decay", Number), d2 = i2.prop(e5, "gravity", Number), f2 = i2.prop(e5, "drift", Number), p2 = i2.prop(e5, "colors", i2.colorsToRgb.bind(i2)), v = i2.prop(e5, "ticks", Number), y = i2.prop(e5, "shapes"), m = i2.prop(e5, "scalar"), b = i2.getOrigin(e5), g = r2, w = [], M = t2.width * b.x, k = t2.height * b.y; g--; )
          w.push(i2.randomPhysics({ x: M, y: k, angle: l2, spread: c2, startVelocity: h2, color: p2[g % p2.length], shape: y[i2.randomInt(0, y.length)], ticks: v, decay: u3, gravity: d2, drift: f2, scalar: m }));
        return n3 ? n3.addFettis(w) : (n3 = i2.animate(t2, w, s, a2, o4)).promise;
      }(e4, f, function() {
        i2.done(), n3 = null, r && a && window.removeEventListener("resize", p), o3 && t2 && (a && document.body.removeChild(t2), t2 = null, c = false);
      });
    };
    return u.reset = function() {
      n3 && n3.reset();
    }, u;
  } }], o2 && t(n2.prototype, o2), Object.defineProperty(n2, "prototype", { writable: false }), e2;
}();
exports.o = o;
