"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_http = require("../../utils/http.js");
const utils_positioning = require("../../utils/positioning.js");
const store_router_index = require("../../store/router/index.js");
require("../../store/touch/index.js");
require("../../store/router/config.js");
require("../../utils/is.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const routerStore = store_router_index.useRouterStore();
    const { extractCityInfo, isExceed } = utils_positioning.usePositioning();
    const API = new api_index.Api();
    const userInfo = common_vendor.ref();
    const info = JSON.parse(common_vendor.index.getStorageSync("USER_INFO") || null);
    const getUserInfo = async (id) => {
      const res = await API.getUserInfo({ id });
      if (res.code === 200) {
        userInfo.value = res.data;
      }
    };
    common_vendor.onLoad(() => {
      if (info) {
        getUserInfo(Number(info.id));
      }
    });
    const goLogin = () => {
      routerStore.go("/login/index");
    };
    const goUserInfo = () => {
      routerStore.go("/user/index", { id: info.id });
    };
    const formData = common_vendor.reactive({
      user_id: info == null ? void 0 : info.id,
      content: "",
      public_state: "1",
      pos_name: ""
    });
    const arounds = common_vendor.ref([]);
    const getAround = () => {
      common_vendor.index.getLocation({
        type: "gcj02",
        altitude: true,
        isHighAccuracy: true,
        success: (data) => {
          console.log("当前位置", data);
          const { latitude: currentLat, longitude: currentLon } = data;
          common_vendor.index.chooseLocation({
            success: (res) => {
              console.log("chooseLocation 获取成功", res);
              const { province, city } = extractCityInfo(res.address);
              console.log(province, city);
              const { address, latitude, longitude, name } = res;
              const isOk = isExceed(
                currentLat,
                currentLon,
                latitude,
                longitude,
                3
              );
              if (!isOk) {
                common_vendor.index.showToast({
                  icon: "none",
                  title: "请选择3公里以内的位置"
                });
                return;
              }
              formData.pos_address = address;
              formData.pos_latitude = latitude;
              formData.pos_longitude = longitude;
              formData.pos_name = name;
              arounds.value.push(formData);
            },
            fail: (info2) => {
              console.log("openLocation 获取失败", info2);
            }
          });
        },
        fail: (info2) => {
          console.log("getLocation 获取失败", info2);
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !common_vendor.unref(info)
      }, !common_vendor.unref(info) ? {
        b: common_vendor.o(goLogin)
      } : common_vendor.e({
        c: userInfo.value
      }, userInfo.value ? {
        d: common_vendor.unref(utils_http.VUE_APP_API_URL) + userInfo.value.avatar,
        e: common_vendor.t(userInfo.value.nick_name),
        f: common_vendor.o(goUserInfo)
      } : {}, {
        g: common_vendor.o(getAround),
        h: common_vendor.f(arounds.value, (around, index, i0) => {
          return {
            a: common_vendor.t(around.pos_name),
            b: index
          };
        })
      }));
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4978fed5"], ["__file", "D:/project/city-walk-app/pages/home/index.vue"]]);
wx.createComponent(Component);
