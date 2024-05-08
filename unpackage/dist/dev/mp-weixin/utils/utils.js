"use strict";
const utils_is = require("./is.js");
require("../common/vendor.js");
const run = (callback, ...params) => {
  utils_is.isFunction(callback) && callback(...params);
};
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
exports.run = run;
