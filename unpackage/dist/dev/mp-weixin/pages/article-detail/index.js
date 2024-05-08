"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_http = require("../../utils/http.js");
const store_router_index = require("../../store/router/index.js");
require("../../store/touch/index.js");
require("../../store/router/config.js");
require("../../utils/is.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const routerStore = store_router_index.useRouterStore();
    const API = new api_index.Api();
    const articleDetail = common_vendor.ref();
    JSON.parse(common_vendor.index.getStorageSync("USER_INFO") || null);
    const getArticleList = async () => {
      const res = await API.getArticleList({ article_id: routerStore.params.id });
      if (res.code === 200) {
        articleDetail.value = res.data;
      }
    };
    getArticleList();
    const viewImages = (url) => {
      common_vendor.index.previewImage({ urls: [url] });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: articleDetail.value
      }, articleDetail.value ? {
        b: common_vendor.unref(utils_http.VUE_APP_API_URL) + articleDetail.value.image,
        c: common_vendor.o(($event) => viewImages(common_vendor.unref(utils_http.VUE_APP_API_URL) + articleDetail.value.image)),
        d: common_vendor.t(articleDetail.value.content)
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6cdcc2be"], ["__file", "D:/project/city-walk-app/pages/article-detail/index.vue"]]);
wx.createComponent(Component);
