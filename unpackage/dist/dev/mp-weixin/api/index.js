"use strict";
const utils_http = require("../utils/http.js");
class Api extends utils_http.Http {
  constructor() {
    super();
    this.setUserInfo = (data) => {
      return this.request({
        method: "POST",
        url: "/user/info/set_user_info",
        data
      });
    };
    this.getFindList = (data) => {
      return this.request({
        method: "GET",
        url: "/find/list",
        data
      });
    };
    this.getArticleList = (data) => {
      return this.request({
        method: "GET",
        url: "/article/article_list",
        data
      });
    };
    this.getOrganizationList = (data) => {
      return this.request({
        method: "GET",
        url: "/organization/list",
        data
      });
    };
    this.sendEmail = (data) => {
      return this.request({
        method: "POST",
        url: "/email/send",
        data
      });
    };
    this.emailLogin = (data) => {
      return this.request({
        method: "POST",
        url: "/user/login/email",
        data
      });
    };
    this.getUserInfo = (data) => {
      return this.request({
        method: "GET",
        url: "/user/info",
        data
      });
    };
    this.getUserProvince = (data) => {
      return this.request({
        method: "GET",
        url: "/gps/get_user_province",
        data
      });
    };
  }
}
exports.Api = Api;
