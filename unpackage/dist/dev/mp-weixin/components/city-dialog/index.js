"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    /**
     * 展示状态
     */
    visible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.visible
      }, __props.visible ? {} : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6ab99e35"], ["__file", "D:/project/city-walk-app/components/city-dialog/index.vue"]]);
wx.createComponent(Component);
