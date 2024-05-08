"use strict";
const common_vendor = require("../common/vendor.js");
const store_router_index = require("../store/router/index.js");
require("../store/touch/index.js");
require("../store/router/config.js");
require("../utils/is.js");
if (!Math) {
  (PageArticleDdetail + PageChat + PageFind + PageFindItem + PageFootprint + PageHome + PageLogin + PageOrganization + PageRecommend + PageRelease + PageSetting + PageUser + PageWeather + CityScroll)();
}
const CityScroll = () => "../components/city-sroll/index.js";
const PageArticleDdetail = () => "../pages/article-detail/index.js";
const PageChat = () => "../pages/chat/index.js";
const PageFind = () => "../pages/find/index.js";
const PageFindItem = () => "../pages/find-item/index.js";
const PageFootprint = () => "../pages/footprint/index.js";
const PageHome = () => "../pages/home/index.js";
const PageLogin = () => "../pages/login/index.js";
const PageOrganization = () => "../pages/organization/index.js";
const PageRecommend = () => "../pages/recommend/index.js";
const PageRelease = () => "../pages/release/index.js";
const PageSetting = () => "../pages/setting/index.js";
const PageUser = () => "../pages/user/index.js";
const PageWeather = () => "../pages/weather/index.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const routerStore = store_router_index.useRouterStore();
    console.log(routerStore);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(routerStore).path === "/article-detail/index"
      }, common_vendor.unref(routerStore).path === "/article-detail/index" ? {} : {}, {
        b: common_vendor.unref(routerStore).path === "/chat/index"
      }, common_vendor.unref(routerStore).path === "/chat/index" ? {} : {}, {
        c: common_vendor.unref(routerStore).path === "/find/index"
      }, common_vendor.unref(routerStore).path === "/find/index" ? {} : {}, {
        d: common_vendor.unref(routerStore).path === "/find-item/index"
      }, common_vendor.unref(routerStore).path === "/find-item/index" ? {} : {}, {
        e: common_vendor.unref(routerStore).path === "/footprint/index"
      }, common_vendor.unref(routerStore).path === "/footprint/index" ? {} : {}, {
        f: common_vendor.unref(routerStore).path === "/home/index"
      }, common_vendor.unref(routerStore).path === "/home/index" ? {} : {}, {
        g: common_vendor.unref(routerStore).path === "/login/index"
      }, common_vendor.unref(routerStore).path === "/login/index" ? {} : {}, {
        h: common_vendor.unref(routerStore).path === "/organization/index"
      }, common_vendor.unref(routerStore).path === "/organization/index" ? {} : {}, {
        i: common_vendor.unref(routerStore).path === "/recommend/index"
      }, common_vendor.unref(routerStore).path === "/recommend/index" ? {} : {}, {
        j: common_vendor.unref(routerStore).path === "/release/index"
      }, common_vendor.unref(routerStore).path === "/release/index" ? {} : {}, {
        k: common_vendor.unref(routerStore).path === "/setting/index"
      }, common_vendor.unref(routerStore).path === "/setting/index" ? {} : {}, {
        l: common_vendor.unref(routerStore).path === "/user/index"
      }, common_vendor.unref(routerStore).path === "/user/index" ? {} : {}, {
        m: common_vendor.unref(routerStore).path === "/weather/index"
      }, common_vendor.unref(routerStore).path === "/weather/index" ? {} : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0d580bf3"], ["__file", "D:/project/city-walk-app/layout/index.vue"]]);
wx.createPage(MiniProgramPage);
