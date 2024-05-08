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
    const articleList = common_vendor.ref();
    const getArticleList = async () => {
      const res = await API.getArticleList({ page: 1, pageSize: 10 });
      if (res.code === 200) {
        articleList.value = res.data;
      }
    };
    getArticleList();
    const goUser = (id) => {
      routerStore.go("/user/index", { id });
    };
    const goArticleDetail = (article) => {
      if (article.id && article.author_info) {
        routerStore.go("/article-detail/index", { id: article.id });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: articleList.value && articleList.value.length
      }, articleList.value && articleList.value.length ? {
        b: common_vendor.f(articleList.value, (article, index, i0) => {
          return common_vendor.e({
            a: article.author_info
          }, article.author_info ? {
            b: common_vendor.unref(utils_http.VUE_APP_API_URL) + article.author_info.avatar,
            c: common_vendor.t(article.author_info.nick_name),
            d: common_vendor.o(($event) => goUser(article.author_info.id), index)
          } : {}, {
            e: common_vendor.unref(utils_http.VUE_APP_API_URL) + article.image,
            f: common_vendor.o(($event) => goArticleDetail(article), index),
            g: article.author_info
          }, article.author_info ? {
            h: common_vendor.unref(utils_http.VUE_APP_API_URL) + article.author_info.avatar,
            i: common_vendor.t(article.content),
            j: common_vendor.o(($event) => goArticleDetail(article.id), index)
          } : {}, {
            k: article.pos_name
          }, article.pos_name ? {
            l: common_vendor.t(article.pos_name)
          } : {}, {
            m: index
          });
        })
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/city-walk-app/pages/recommend/index.vue"]]);
wx.createComponent(Component);
