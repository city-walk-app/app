"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {};
function _sfc_render(_ctx, _cache) {
  return {
    a: common_vendor.f(50, (i, k0, i0) => {
      return {
        a: common_vendor.t(i),
        b: i
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/project/city-walk-app/pages/chat/index.vue"]]);
wx.createComponent(Component);
