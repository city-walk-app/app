"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_http = require("../../utils/http.js");
const utils_positioning = require("../../utils/positioning.js");
const utils_wx = require("../../utils/wx.js");
const store_router_index = require("../../store/router/index.js");
const store_touch_index = require("../../store/touch/index.js");
require("../../store/router/config.js");
require("../../utils/is.js");
if (!Math) {
  CityDialog();
}
const CityDialog = () => "../../components/city-dialog/index.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const touchStore = store_touch_index.useTouchStore();
    const routerStore = store_router_index.useRouterStore();
    const { isExceed } = utils_positioning.usePositioning();
    const imageUrl = common_vendor.ref("");
    const imageFile = common_vendor.ref();
    const touchLoading = common_vendor.ref(false);
    const info = JSON.parse(common_vendor.index.getStorageSync("USER_INFO") || null);
    const visible = common_vendor.ref(false);
    const formData = common_vendor.reactive({
      user_id: info.id,
      content: "",
      public_state: "1",
      pos_name: ""
    });
    const provinceInfo = common_vendor.ref();
    const updateImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        // 文件个数
        mediaType: ["image"],
        // 类型
        sourceType: ["album", "camera"],
        // 相册和拍照选择
        camera: "back",
        // 后置摄像头
        success: (res) => {
          imageUrl.value = res.tempFilePaths[0];
          imageFile.value = res.tempFiles[0];
        }
      });
    };
    const touchRight = async () => {
      if (!formData.content || !imageUrl.value) {
        utils_wx.toast("请输入内容");
        return;
      }
      touchLoading.value = true;
      common_vendor.index.uploadFile({
        url: utils_http.VUE_APP_API_URL + "/article/release",
        // 上传文件的服务器地址
        filePath: imageUrl.value,
        // 本地文件路径
        name: "image",
        // 上传文件字段的名称
        formData,
        // 表单数据
        success: (response) => {
          const res = JSON.parse(response.data);
          if (res.code === 200) {
            formData.content = "";
            imageUrl.value = "";
            imageFile.value = null;
            touchLoading.value = false;
            if (res.data.new_province && res.data.new_province.province_code) {
              visible.value = true;
              provinceInfo.value = res.data.new_province;
              return;
            }
            touchStore.clearTouch();
            routerStore.go("/recommend/index");
          }
        },
        fail: (error) => {
          console.error(error);
        }
      });
    };
    touchStore.setTouch(touchRight);
    common_vendor.onBeforeUnmount(touchStore.clearTouch);
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
    const ok = () => {
      visible.value = false;
      routerStore.go("/recommend/index");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: imageUrl.value
      }, imageUrl.value ? {
        b: imageUrl.value
      } : {}, {
        c: common_vendor.o(updateImage),
        d: formData.content,
        e: common_vendor.o(($event) => formData.content = $event.detail.value),
        f: common_vendor.t(formData.pos_name || "你在哪？"),
        g: common_vendor.o(getAround),
        h: provinceInfo.value
      }, provinceInfo.value ? {
        i: common_vendor.t(provinceInfo.value.province_name),
        j: `${common_vendor.unref(utils_http.VUE_APP_API_URL)}/images/province/${provinceInfo.value.province_code}.png`,
        k: common_vendor.o(ok)
      } : {}, {
        l: common_vendor.p({
          visible: visible.value
        })
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-92ea1845"], ["__file", "D:/project/city-walk-app/pages/release/index.vue"]]);
wx.createComponent(Component);
