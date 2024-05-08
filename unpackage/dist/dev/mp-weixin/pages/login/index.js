"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_utils = require("../../utils/utils.js");
const utils_http = require("../../utils/http.js");
const utils_wx = require("../../utils/wx.js");
const store_router_index = require("../../store/router/index.js");
const store_touch_index = require("../../store/touch/index.js");
require("../../utils/is.js");
require("../../store/router/config.js");
if (!Math) {
  IConfetti();
}
const IConfetti = () => "../../uni_modules/lime-confetti/components/l-confetti/l-confetti.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const routerStore = store_router_index.useRouterStore();
    const touchStore = store_touch_index.useTouchStore();
    const API = new api_index.Api();
    const confettiRef = common_vendor.ref();
    const disabled = common_vendor.ref(false);
    const loginInfo = common_vendor.reactive({ email: "", code: "" });
    const step = common_vendor.ref(1);
    const nickName = common_vendor.ref("");
    const userInfo = common_vendor.ref();
    const avatarUrl = common_vendor.ref("");
    const avatarFile = common_vendor.ref();
    const timmer = common_vendor.ref(60);
    const getCodeButtonLoading = common_vendor.ref(false);
    let timeout;
    const codeInputFocus = common_vendor.ref(false);
    const sendEmail = async () => {
      if (getCodeButtonLoading.value) {
        return;
      }
      if (!utils_utils.isValidEmail(loginInfo.email)) {
        utils_wx.toast("输入正确邮箱之后再获取");
        return;
      }
      getCodeButtonLoading.value = true;
      startTimmer();
      utils_wx.showLoading("获取中...");
      const res = await API.sendEmail({ email: loginInfo.email });
      if (res.code === 200) {
        utils_wx.hideLoading();
        utils_wx.toast(res.message);
        codeInputFocus.value = true;
        return;
      }
      utils_wx.hideLoading();
      utils_wx.toast(res.message);
      clearInterval(timeout);
      getCodeButtonLoading.value = false;
      timmer.value = 60;
    };
    const startTimmer = () => {
      timeout = setInterval(() => {
        if (timmer.value === 0) {
          clearInterval(timeout);
          getCodeButtonLoading.value = false;
          timmer.value = 60;
          return;
        }
        timmer.value--;
      }, 1e3);
    };
    const onLogin = async () => {
      if (!utils_utils.isValidEmail(loginInfo.email)) {
        utils_wx.toast("邮箱格式不正确");
        return;
      }
      if (!loginInfo.code || loginInfo.code.length !== 6) {
        utils_wx.toast("验证码格式不正确");
        return;
      }
      utils_wx.showLoading("处理中...");
      disabled.value = true;
      const res = await API.emailLogin(loginInfo);
      utils_wx.hideLoading();
      disabled.value = false;
      if (res.code === 200) {
        disabled.value = false;
        userInfo.value = res.data;
        common_vendor.index.setStorageSync("USER_INFO", JSON.stringify(res.data));
        if (res.data.is_new_user) {
          utils_wx.toast("注册成功，请完善信息");
          step.value = 2;
          touchStore.setTouch(onSetName);
        } else {
          utils_wx.toast(res.message);
          if (confettiRef.value) {
            confettiRef.value.play({
              particleCount: 100,
              spread: 70,
              shapes: ["circle"],
              origin: {
                y: 0.6
              }
            });
            touchStore.clearTouch();
            setTimeout(() => {
              routerStore.go("/home/index");
            }, 1500);
          }
        }
        return;
      }
      utils_wx.toast(res.message);
    };
    touchStore.setTouch(onLogin);
    const onSetName = async () => {
      utils_wx.showLoading("处理中...");
      const res = await API.setUserInfo({
        id: userInfo.value.id,
        nick_name: nickName.value
      });
      utils_wx.hideLoading();
      if (res.code === 200) {
        utils_wx.toast("设置成功");
        touchStore.setTouch(onSubmit);
        step.value = 3;
      }
    };
    const upLoadAvatar = () => {
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
          avatarUrl.value = res.tempFilePaths[0];
          avatarFile.value = res.tempFiles[0];
        }
      });
    };
    const onSubmit = () => {
      utils_wx.showLoading("处理中...");
      common_vendor.index.uploadFile({
        url: utils_http.VUE_APP_API_URL + "/user/info/up_avatar",
        // 上传文件的服务器地址
        filePath: avatarUrl.value,
        // 本地文件路径
        name: "image",
        // 上传文件字段的名称
        formData: {
          id: userInfo.value.id
        },
        // 表单数据
        success: (response) => {
          const res = JSON.parse(response.data);
          utils_wx.hideLoading();
          if (res.code === 200) {
            utils_wx.toast("设置成功");
            if (confettiRef.value) {
              confettiRef.value.play({
                particleCount: 100,
                spread: 70,
                shapes: ["circle"],
                origin: {
                  y: 0.6
                }
              });
              touchStore.clearTouch();
              setTimeout(() => {
                routerStore.go("/home/index");
              }, 1500);
            }
          }
        }
      });
    };
    const codeInput = (evt) => {
      if (evt.detail.value && evt.detail.value.length && evt.detail.value.length === 6) {
        onLogin();
      }
    };
    common_vendor.onBeforeUnmount(touchStore.clearTouch);
    const getPhoneNumber = (evt) => {
      console.log(evt);
      if (evt.detail.errMsg === "getPhoneNumber:ok") {
        const encryptedData = evt.detail.encryptedData;
        const iv = evt.detail.iv;
        console.log(encryptedData, iv);
      } else {
        common_vendor.index.showToast({
          title: "用户拒绝授权",
          icon: "none"
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.sr(confettiRef, "d08ef7d4-0", {
          "k": "confettiRef"
        }),
        b: common_vendor.o(getPhoneNumber),
        c: step.value === 1
      }, step.value === 1 ? common_vendor.e({
        d: step.value === 1,
        e: common_vendor.o(sendEmail),
        f: loginInfo.email,
        g: common_vendor.o(($event) => loginInfo.email = $event.detail.value),
        h: codeInputFocus.value,
        i: common_vendor.o([($event) => loginInfo.code = $event.detail.value, codeInput]),
        j: loginInfo.code,
        k: getCodeButtonLoading.value
      }, getCodeButtonLoading.value ? {
        l: common_vendor.t(timmer.value)
      } : {}, {
        m: getCodeButtonLoading.value,
        n: common_vendor.o(sendEmail)
      }) : {}, {
        o: step.value === 2
      }, step.value === 2 ? {
        p: step.value === 2,
        q: common_vendor.o(onSetName),
        r: nickName.value,
        s: common_vendor.o(($event) => nickName.value = $event.detail.value)
      } : {}, {
        t: step.value === 3
      }, step.value === 3 ? common_vendor.e({
        v: avatarUrl.value && avatarUrl.value.length
      }, avatarUrl.value && avatarUrl.value.length ? {
        w: avatarUrl.value
      } : {}, {
        x: common_vendor.o(upLoadAvatar)
      }) : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d08ef7d4"], ["__file", "D:/project/city-walk-app/pages/login/index.vue"]]);
wx.createComponent(Component);
