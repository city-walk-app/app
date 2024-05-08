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
    const userInfo = common_vendor.ref();
    const info = JSON.parse(common_vendor.index.getStorageSync("USER_INFO") || null);
    const articleList = common_vendor.ref();
    const activeTab = common_vendor.ref(0);
    const provinceList = common_vendor.ref();
    const getUserInfo = async () => {
      const res = await API.getUserInfo({ id: routerStore.params.id });
      if (res.code === 200) {
        userInfo.value = res.data;
      }
    };
    const getArticleList = async () => {
      const res = await API.getArticleList({
        page: 1,
        pageSize: 10,
        user_id: routerStore.params.id,
        view_user_id: Number(info.id)
      });
      if (res.code === 200) {
        articleList.value = res.data;
      }
    };
    const goSetting = () => {
      routerStore.go("/setting/index");
    };
    const goArticleDetail = (id) => {
      routerStore.go("/article-detail/index", { id });
    };
    const getUserProvince = async () => {
      const res = await API.getUserProvince({ id: routerStore.params.id });
      if (res.code === 200) {
        provinceList.value = res.data;
      }
    };
    getUserInfo();
    getArticleList();
    getUserProvince();
    const tabs = ["icon-wode", "icon-chengshi", "icon-shoucang"];
    const changeTab = (index) => {
      activeTab.value = index;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.value
      }, userInfo.value ? common_vendor.e({
        b: common_vendor.unref(utils_http.VUE_APP_API_URL) + userInfo.value.avatar,
        c: common_vendor.t(userInfo.value.nick_name),
        d: common_vendor.t(userInfo.value.signature),
        e: common_vendor.t(userInfo.value.province),
        f: common_vendor.t(userInfo.value.city),
        g: common_vendor.unref(info).id === common_vendor.unref(routerStore).params.id
      }, common_vendor.unref(info).id === common_vendor.unref(routerStore).params.id ? {
        h: common_vendor.o(goSetting)
      } : {}) : {}, {
        i: common_vendor.f(tabs, (tab, index, i0) => {
          return {
            a: common_vendor.n(tab),
            b: index,
            c: common_vendor.n({
              "tabs-active": activeTab.value === index
            }),
            d: common_vendor.o(($event) => changeTab(index), index)
          };
        }),
        j: `translateX(${activeTab.value * 122}px)`,
        k: articleList.value && articleList.value.length
      }, articleList.value && articleList.value.length ? {
        l: common_vendor.unref(utils_http.VUE_APP_API_URL) + articleList.value[0].image,
        m: common_vendor.o(($event) => goArticleDetail(articleList.value[0].id)),
        n: common_vendor.f(articleList.value, (article, index, i0) => {
          return {
            a: common_vendor.unref(utils_http.VUE_APP_API_URL) + article.image,
            b: index,
            c: common_vendor.o(($event) => goArticleDetail(article.id), index)
          };
        })
      } : {}, {
        o: provinceList.value && provinceList.value.length
      }, provinceList.value && provinceList.value.length ? {
        p: common_vendor.f(provinceList.value, (item, index, i0) => {
          return {
            a: `${common_vendor.unref(utils_http.VUE_APP_API_URL)}/images/province/${item.province_code}.png`,
            b: common_vendor.t(item.province_name),
            c: index
          };
        })
      } : {}, {
        q: `translateX(-${activeTab.value * 366}px)`
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-79e6a490"], ["__file", "D:/project/city-walk-app/pages/user/index.vue"]]);
wx.createComponent(Component);
