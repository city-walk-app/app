"use strict";const t=require("../common/vendor.js"),e=require("../enum/user.js"),s=require("./wx.js");exports.Http=class{request({url:a="",data:r={},method:o="GET",header:u={token:""}}={}){const d=s.getStorage(e.USER_INFO);return d&&(u.token=d.token),new Promise(((e,d)=>{t.index.request({url:"https://api.city-walk.top"+a,data:r,header:u,method:o,success:t=>{200===t.statusCode||201===t.statusCode?e(t.data):s.toast(t.data.message)},fail:()=>{s.toast("网络连接失败")}})}))}},exports.VUE_APP_API_URL="https://api.city-walk.top";
