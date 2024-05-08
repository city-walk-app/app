"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const store_router_index = require("../../store/router/index.js");
require("../../store/touch/index.js");
require("../../utils/http.js");
require("../../store/router/config.js");
require("../../utils/is.js");
if (!Math) {
  CityScroll();
}
const CityScroll = () => "../../components/city-sroll/index.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const routerStore = store_router_index.useRouterStore();
    const API = new api_index.Api();
    const findItem = common_vendor.ref();
    const getFindList = async () => {
      const res = await API.getFindList({ id: routerStore.params.id });
      if (res.code === 200) {
        findItem.value = res.data;
      }
    };
    getFindList();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: findItem.value
      }, findItem.value ? {
        b: common_vendor.t(findItem.value.address),
        c: common_vendor.t(findItem.value.introduce),
        d: findItem.value.banner
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-296c7960"], ["__file", "D:/project/city-walk-app/pages/find-item/index.vue"]]);
wx.createComponent(Component);
