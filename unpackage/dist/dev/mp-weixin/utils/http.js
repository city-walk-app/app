"use strict";
const common_vendor = require("../common/vendor.js");
const VUE_APP_API_URL = "http://172.20.10.12:1219";
class Http {
  constructor() {
  }
  request({
    url = "",
    data = {},
    method = "GET",
    header = { token: "" }
  } = {}) {
    const info = common_vendor.index.getStorageSync("USER_INFO");
    if (info) {
      header.token = JSON.parse(info).token;
    }
    return new Promise((resolve, reject) => {
      common_vendor.index.request({
        url: VUE_APP_API_URL + url,
        data,
        header,
        method,
        success: (res) => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(res.data);
          } else {
            reject(new Error("请求失败"));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
}
exports.Http = Http;
exports.VUE_APP_API_URL = VUE_APP_API_URL;
