"use strict";const e=require("../../common/vendor.js"),t=require("../../utils/http.js"),a=require("../../utils/wx.js"),i=require("../../enum/user.js"),r=require("../../api/api.js");Math||e.unref(n)();const n=()=>"../../components/sheet/index.js",c={__name:"index",setup(n){new r.Api;const c=e.ref([{key:"avatar",active:!1,title:"头像"},{key:"nick_name",active:!1,title:"名字"},{key:["province","city"],active:!1,title:"位置"},{key:"birthday",active:!1,title:"生日"},{key:"signature",active:!1,title:"签名"},{key:"email",active:!1,title:"邮箱"},{key:"mobel",active:!1,title:"手机"}]),l=e.ref({});e.ref(a.getStorage(i.USER_INFO));const u=()=>{e.index.showModal({title:"退出登录",content:"确定退出登录吗？",showCancel:!0,success:t=>{t.confirm&&(e.index.clearStorage(),e.index.navigateTo({url:"/pages/home/index"}))}})},v=e.ref(!1),s=()=>{v.value=!1};return(a,i)=>e.e({a:l.value},l.value?{b:e.o((e=>v.value=!0)),c:e.f(c.value,((a,i,r)=>e.e({a:e.t(a.title),b:"avatar"===a.key},"avatar"===a.key?{c:e.unref(t.VUE_APP_API_URL)+l.value.avatar}:Array.isArray(a.key)?{e:e.t(l.value.province||""),f:e.t(l.value.city||"")}:{g:e.t(l.value[a.key]||"未设置")},{d:Array.isArray(a.key),h:i,i:`blur(${a.active?0:45}px)`,j:e.o((e=>(e=>{const t=c.value;t.find((t=>t.key===e.key)).active=!0,c.value=t})(a)),i)}))),d:e.o(u)}:{},{e:e.o(s),f:e.p({visible:v.value})})}};wx.createPage(c);
