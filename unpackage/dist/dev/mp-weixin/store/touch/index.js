"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_is = require("../../utils/is.js");
const useTouchStore = common_vendor.defineStore("city-walk-touch", () => {
  let touchRight = common_vendor.ref(null);
  const setTouch = (fn) => {
    if (utils_is.isFunction(fn)) {
      touchRight.value = fn;
    }
  };
  const clearTouch = () => {
    touchRight.value = null;
  };
  return { touchRight, setTouch, clearTouch };
});
exports.useTouchStore = useTouchStore;
