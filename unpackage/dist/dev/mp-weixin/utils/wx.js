"use strict";
const common_vendor = require("../common/vendor.js");
const toast = (title, icon = "none") => {
  common_vendor.index.showToast({ title, icon });
};
const showLoading = (title = "加载中...") => {
  common_vendor.index.showLoading({
    title,
    mask: true
  });
};
const hideLoading = () => {
  common_vendor.index.hideLoading();
};
exports.hideLoading = hideLoading;
exports.showLoading = showLoading;
exports.toast = toast;
