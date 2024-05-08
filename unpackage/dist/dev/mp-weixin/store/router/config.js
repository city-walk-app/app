"use strict";
const common_vendor = require("../../common/vendor.js");
const routers = common_vendor.ref([
  {
    path: "/article-detail/index",
    params: null,
    meta: { title: "详情" }
  },
  {
    path: "/chat/index",
    params: null,
    meta: { title: "聊天", icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/ce89vt.webp" }
  },
  {
    path: "/find/index",
    params: null,
    meta: { title: "发现", icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/cejngj.webp" }
  },
  {
    path: "/find-item/index",
    params: null,
    meta: { title: "发现详情" }
  },
  {
    path: "/footprint/index",
    params: null,
    meta: { title: "足迹", icon: "https://png.cm/app/thumb.php?img=/i/2023/09/29/yqjc3s.webp" }
  },
  {
    path: "/home/index",
    params: null,
    meta: { title: "City Walk", icon: "https://img.erpweb.eu.org/imgs/2024/01/245c8a7130242d47.png" }
  },
  {
    path: "/login/index",
    params: null,
    meta: { title: "登录" }
  },
  {
    path: "/organization/index",
    params: null,
    meta: { title: "组织", icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/ceo9qf.webp" }
  },
  {
    path: "/recommend/index",
    params: null,
    meta: { title: "推荐", icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/ces8j9.webp" }
  },
  {
    path: "/release/index",
    params: null,
    meta: { title: "发布", icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/ceukds.webp" }
  },
  {
    path: "/setting/index",
    params: null,
    meta: { title: "设置", icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/cev2lr.webp" }
  },
  {
    path: "/user/index",
    params: null,
    meta: { title: "用户" }
  },
  {
    path: "/weather/index",
    params: null,
    meta: { title: "天气", icon: "https://png.cm/app/thumb.php?img=/i/2023/09/04/cf5itp.webp" }
  }
]);
exports.routers = routers;
