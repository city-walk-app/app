"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_http = require("../../utils/http.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const API = new api_index.Api();
    const info = JSON.parse(common_vendor.index.getStorageSync("USER_INFO") || null);
    const settingInfo = common_vendor.ref([
      { title: "头像", key: "avatar", value: "" },
      { title: "名字", key: "nick_name", value: "" },
      { title: "性别", key: "gender", value: "" },
      { title: "位置", key: "city", value: "" },
      { title: "生日", key: "birthday", value: "" },
      { title: "签名", key: "signature", value: "" }
    ]);
    const settingAccount = common_vendor.ref([
      { title: "邮箱", key: "email", value: "" },
      { title: "手机", key: "mobile", value: "" }
    ]);
    const getUserInfo = async () => {
      const res = await API.getUserInfo({ id: info.id });
      if (res.code === 200) {
        settingInfo.value = settingInfo.value.map((item) => {
          if (res.data[item.key]) {
            item.value = res.data[item.key];
          }
          return item;
        });
        settingAccount.value = settingAccount.value.map((item) => {
          if (res.data[item.key]) {
            item.value = res.data[item.key];
          }
          return item;
        });
      }
    };
    getUserInfo();
    const goSetting = (item) => {
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(settingInfo.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.title),
            b: item.key === "avatar"
          }, item.key === "avatar" ? {
            c: common_vendor.unref(utils_http.VUE_APP_API_URL) + item.value
          } : item.key === "gender" ? common_vendor.e({
            e: item.value === "1"
          }, item.value === "1" ? {} : item.value === "0" ? {} : {}, {
            f: item.value === "0"
          }) : {
            g: common_vendor.t(item.value)
          }, {
            d: item.key === "gender",
            h: index,
            i: common_vendor.o(($event) => goSetting(), index)
          });
        }),
        b: common_vendor.f(settingAccount.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.value),
            c: index,
            d: common_vendor.o(($event) => goSetting(), index)
          };
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-861f37f2"], ["__file", "D:/project/city-walk-app/pages/setting/index.vue"]]);
wx.createComponent(Component);
