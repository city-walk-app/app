"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const store_router_index = require("../../store/router/index.js");
require("../../store/touch/index.js");
require("../../utils/http.js");
require("../../store/router/config.js");
require("../../utils/is.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const routerStore = store_router_index.useRouterStore();
    const API = new api_index.Api();
    const findList = common_vendor.ref();
    const getFindList = async () => {
      const res = await API.getFindList();
      if (res.code === 200) {
        findList.value = res.data;
      }
    };
    getFindList();
    const viewDetail = (id) => {
      routerStore.go("/find-item/index", { id });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(findList.value, (item, index, i0) => {
          return {
            a: item.banner,
            b: common_vendor.t(item.address),
            c: common_vendor.t(item.introduce),
            d: index,
            e: common_vendor.o(($event) => viewDetail(item.id), index)
          };
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/city-walk-app/pages/find/index.vue"]]);
wx.createComponent(Component);
