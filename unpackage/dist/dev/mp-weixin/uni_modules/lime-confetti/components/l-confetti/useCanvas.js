"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_limeConfetti_components_lConfetti_version = require("./version.js");
function getRect(selector, options = {}) {
  const typeDefault = "boundingClientRect";
  const { context, type = typeDefault } = options;
  return new Promise((resolve, reject) => {
    const dom = common_vendor.index.createSelectorQuery().in(context).select(selector);
    const result = (rect) => {
      if (rect) {
        resolve(rect);
      } else {
        reject();
      }
    };
    if (type == typeDefault) {
      dom[type](result).exec();
    } else {
      dom[type]({
        node: true,
        size: true,
        rect: true
      }, result).exec();
    }
  });
}
function useCanvas(selector, options) {
  const { context } = options;
  const isCanvas2d = uni_modules_limeConfetti_components_lConfetti_version.canIUseCanvas2d();
  const canvas = common_vendor.ref();
  common_vendor.onMounted(() => {
    if (isCanvas2d) {
      getRect(selector, { context, type: "fields" }).then((res) => {
        if (res) {
          const { pixelRatio } = uni_modules_limeConfetti_components_lConfetti_version.getSystemInfoSync();
          const { bottom, width, height, left, node } = res;
          node.width = width * pixelRatio;
          node.height = height * pixelRatio;
          const context2 = node.getContext("2d");
          context2.scale(pixelRatio, pixelRatio);
          canvas.value = {
            bottom,
            width,
            height,
            left,
            getContext: () => context2,
            requestAnimationFrame: node.requestAnimationFrame,
            cancelAnimationFrame: node.cancelAnimationFrame
          };
        }
      });
    } else {
      getRect(selector, { context }).then((res) => {
        if (res) {
          common_vendor.index.createCanvasContext(selector.replace("#", ""), context);
          const { bottom, width, height, left } = res;
          canvas.value = {
            bottom,
            width,
            height,
            left,
            getContext: () => common_vendor.index.createCanvasContext(selector.replace("#", ""), context)
          };
        }
      });
    }
  });
  return common_vendor.computed(() => canvas.value);
}
exports.useCanvas = useCanvas;
