"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_http = require("../../utils/http.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const API = new api_index.Api();
    const organizationList = common_vendor.ref();
    const getOrganizationList = async () => {
      const res = await API.getOrganizationList();
      if (res.code === 200) {
        organizationList.value = res.data;
      }
    };
    getOrganizationList();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: organizationList.value
      }, organizationList.value ? {
        b: common_vendor.f(organizationList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.province),
            b: common_vendor.t(item.city),
            c: item.memberList && item.memberList.length
          }, item.memberList && item.memberList.length ? {
            d: common_vendor.f(item.memberList, (member, index2, i1) => {
              return common_vendor.e({
                a: member
              }, member ? {
                b: common_vendor.unref(utils_http.VUE_APP_API_URL) + member.avatar,
                c: index2
              } : {});
            })
          } : {}, {
            e: common_vendor.t(item.created_at),
            f: index
          });
        })
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/city-walk-app/pages/organization/index.vue"]]);
wx.createComponent(Component);
