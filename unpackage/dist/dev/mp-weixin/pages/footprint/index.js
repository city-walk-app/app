"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_http = require("../../utils/http.js");
if (!Math) {
  CityMap();
}
const CityMap = () => "../../components/city-map/index.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const API = new api_index.Api();
    let startY = 0;
    const containerSize = common_vendor.ref(300);
    const startDrag = (evt) => {
      evt.preventDefault();
      startY = evt.touches[0].clientY;
    };
    const scrollY = common_vendor.ref(false);
    const handleTouchMove = (evt) => {
      evt.preventDefault();
      const currentY = evt.touches[0].clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {
        containerSize.value = 300;
        scrollY.value = false;
      } else {
        containerSize.value = 700;
        scrollY.value = true;
      }
    };
    const provinceList = common_vendor.ref();
    const info = JSON.parse(common_vendor.index.getStorageSync("USER_INFO") || null);
    const getUserProvince = async () => {
      const res = await API.getUserProvince({ id: info.id });
      if (res.code === 200) {
        provinceList.value = res.data;
      }
    };
    getUserProvince();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: provinceList.value && provinceList.value.length
      }, provinceList.value && provinceList.value.length ? {
        b: common_vendor.f(provinceList.value, (item, index, i0) => {
          return {
            a: `${common_vendor.unref(utils_http.VUE_APP_API_URL)}/images/province/${item.province_code}.png`,
            b: common_vendor.t(item.province_name),
            c: index
          };
        })
      } : {}, {
        c: scrollY.value,
        d: containerSize.value + "px",
        e: common_vendor.o(handleTouchMove),
        f: common_vendor.o(startDrag)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-05504d77"], ["__file", "D:/project/city-walk-app/pages/footprint/index.vue"]]);
wx.createComponent(Component);
