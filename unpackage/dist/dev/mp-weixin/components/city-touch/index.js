"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_utils = require("../../utils/utils.js");
const store_router_index = require("../../store/router/index.js");
const store_touch_index = require("../../store/touch/index.js");
require("../../utils/is.js");
require("../../store/router/config.js");
if (!Math) {
  CityClose();
}
const CityClose = () => "../../svg/city-close/index.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    /**
     * 是否处于 loading 状态
     */
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup (__props) {
    const prop = __props;
    const touchStore = store_touch_index.useTouchStore();
    const routerStore = store_router_index.useRouterStore();
    const translateX = common_vendor.ref(0);
    const translateY = common_vendor.ref(0);
    let startX = 0;
    let startY = 0;
    let dragging = false;
    const SIZE = 40;
    const direction = common_vendor.ref("");
    const showDialog = common_vendor.ref(false);
    const startDrag = (evt) => {
      evt.preventDefault();
      if (prop.loading) {
        return;
      }
      startX = evt.touches[0].clientX;
      startY = evt.touches[0].clientY;
      dragging = true;
    };
    const drag = (evt) => {
      evt.preventDefault();
      if (prop.loading || !dragging) {
        return;
      }
      const currentX = evt.touches[0].clientX;
      const currentY = evt.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) <= SIZE) {
        translateX.value = deltaX;
        if (deltaX > 0) {
          direction.value = "right";
        } else {
          direction.value = "left";
        }
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) <= SIZE) {
        translateY.value = deltaY;
        direction.value = deltaY > 0 ? "bottom" : "top";
      }
    };
    const directionMap = {
      /**
       * 往左侧拖动
       *
       * 返回上一层
       */
      left: () => {
        routerStore.back();
      },
      right: () => {
        if (touchStore.touchRight) {
          utils_utils.run(touchStore.touchRight);
        }
      },
      /**
       * 往上拖动
       *
       * 打开 app 列表
       */
      top: () => {
        showDialog.value = true;
      },
      /**
       * 向下拖动
       *
       * 到发布页面
       */
      bottom: () => {
        const info = common_vendor.index.getStorageSync("USER_INFO");
        routerStore.push(info ? "/release/index" : "/login/index");
      }
    };
    const endDrag = (evt) => {
      evt.preventDefault();
      if (prop.loading) {
        return;
      }
      if (directionMap[direction.value]) {
        directionMap[direction.value]();
      }
      translateX.value = 0;
      translateY.value = 0;
      dragging = false;
      direction.value = "";
    };
    const handleClick = (evt) => {
      if (prop.loading) {
        return;
      }
      console.log("点击事件");
    };
    const closeDialog = () => {
      showDialog.value = false;
    };
    const appList = [
      {
        title: "天气",
        url: "/weather/index",
        icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/cf5itp.webp"
      },
      {
        title: "聊天",
        url: "/chat/index",
        icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/ce89vt.webp"
      },
      {
        title: "推荐",
        url: "/recommend/index",
        icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/ces8j9.webp"
      },
      {
        title: "组织",
        url: "/organization/index",
        icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/ceo9qf.webp"
      },
      {
        title: "设置",
        url: "/setting/index",
        icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/cev2lr.webp"
      },
      {
        title: "发现",
        url: "/find/index",
        icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/cejngj.webp"
      },
      {
        title: "发布",
        url: "/release/index",
        icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/ceukds.webp"
      },
      {
        title: "足迹",
        url: "/footprint/index",
        icon: "https://png.cm/app/thumb.php?img=/i/2023/09/29/yqjc3s.webp"
      }
    ];
    const goApp = (url) => {
      routerStore.push(url);
      showDialog.value = false;
    };
    const handleLongPress = () => {
      if (prop.loading) {
        return;
      }
      routerStore.push("/home/index");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(closeDialog),
        b: common_vendor.f(common_vendor.unref(appList), (app, index, i0) => {
          return {
            a: app.icon,
            b: common_vendor.t(app.title),
            c: index,
            d: common_vendor.o(($event) => goApp(app.url), index)
          };
        }),
        c: common_vendor.n({
          "city-touch-app-open": showDialog.value
        }),
        d: "translate(" + translateX.value + "px, " + translateY.value + "px)",
        e: common_vendor.o(startDrag),
        f: common_vendor.o(drag),
        g: common_vendor.o(endDrag),
        h: common_vendor.o(handleClick),
        i: common_vendor.o(handleLongPress)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5c036d54"], ["__file", "D:/project/city-walk-app/components/city-touch/index.vue"]]);
wx.createComponent(Component);
