"use strict";
const common_vendor = require("../../common/vendor.js");
const store_router_config = require("./config.js");
const history = [];
const sethistory = (url) => {
  if (history.length < 10) {
    history.push(url);
    return;
  }
  history.shift();
  history.push(url);
};
const useRouterStore = common_vendor.defineStore("city-walk-router", () => {
  var _a;
  const _path = common_vendor.index.getStorageSync("CITY_WALK_PATH");
  const path = common_vendor.ref(_path || "/home/index");
  const params = common_vendor.ref();
  const headerTitle = common_vendor.ref();
  headerTitle.value = (_a = store_router_config.routers.value.find((item) => item.path === path.value)) == null ? void 0 : _a.meta;
  const go = (url, _params, record = true) => {
    common_vendor.index.setStorageSync("CITY_WALK_PATH", url);
    const route = store_router_config.routers.value.find((item) => item.path === url);
    if (route) {
      path.value = url;
      headerTitle.value = route == null ? void 0 : route.meta;
      if (record) {
        sethistory(url);
      }
      if (_params) {
        console.log(store_router_config.routers);
        route.params = _params;
      }
      params.value = route.params;
      return;
    }
    console.warn("[city-walk-router]：当前跳转的路径不存在");
  };
  const back = () => {
    history.pop();
    if (history && history.length) {
      const lastUrl = history.pop() || "/home/index";
      const route = store_router_config.routers.value.find((item) => item.path === lastUrl);
      params.value = route.params;
      path.value = lastUrl;
      return;
    }
    path.value = "/home/index";
  };
  return { path, params, headerTitle, back, go };
});
exports.useRouterStore = useRouterStore;
