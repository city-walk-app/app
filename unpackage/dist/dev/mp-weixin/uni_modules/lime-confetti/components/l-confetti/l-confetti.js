"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_limeConfetti_components_lConfetti_useCanvas = require("./useCanvas.js");
const uni_modules_limeConfetti_components_lConfetti_confetti = require("./confetti.js");
require("./version.js");
const _sfc_main = common_vendor.defineComponent({
  name: "l-confetti",
  emits: ["done"],
  setup(props, { expose, emit }) {
    const app = common_vendor.getCurrentInstance();
    const canvasId = `l-confetti-${app.uid}`;
    const canvas = uni_modules_limeConfetti_components_lConfetti_useCanvas.useCanvas(`#${canvasId}`, { context: app.proxy });
    let isDestroy = common_vendor.ref(false);
    let confetti = null;
    const play = (options) => confetti.play(options);
    const done = () => emit("done");
    common_vendor.watch(canvas, (v) => {
      if (v) {
        confetti = new uni_modules_limeConfetti_components_lConfetti_confetti.o(canvas.value, { resize: true, done });
      }
    }, { immediate: true });
    common_vendor.onUnmounted(() => {
      isDestroy.value = true;
      confetti = null;
    });
    expose({
      play
    });
    return {
      isDestroy,
      canvasId
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !_ctx.isDestroy
  }, !_ctx.isDestroy ? {
    b: _ctx.canvasId,
    c: _ctx.canvasId
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/project/city-walk-app/uni_modules/lime-confetti/components/l-confetti/l-confetti.vue"]]);
wx.createComponent(Component);
