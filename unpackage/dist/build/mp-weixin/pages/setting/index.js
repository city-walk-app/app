"use strict";const e=require("../../common/vendor.js"),t=require("../../utils/http.js"),a=require("../../utils/wx.js"),i=require("../../enum/user.js"),r=require("../../api/api.js"),u={__name:"index",setup(u){const c=new r.Api,l=e.ref([{key:"avatar",active:!1,title:"头像"},{key:"nick_name",active:!1,title:"名字"},{key:["province","city"],active:!1,title:"位置"},{key:"birthday",active:!1,title:"生日"},{key:"signature",active:!1,title:"签名"},{key:"email",active:!1,title:"邮箱"},{key:"mobel",active:!1,title:"手机"}]),n=e.ref({}),s=e.ref(a.getStorage(i.USER_INFO));(async()=>{if(n.value&&n.value.user_id)return;const e=await c.getUserInfo({user_id:s.value.user_id});200===e.code&&(n.value=e.data)})();const v=()=>{e.index.showModal({title:"退出登录",content:"确定退出登录吗？",showCancel:!0,success:t=>{t.confirm&&(e.index.clearStorage(),e.index.navigateTo({url:"/pages/home/index"}))}})};return(a,i)=>e.e({a:n.value},n.value?{b:e.f(l.value,((a,i,r)=>e.e({a:e.t(a.title),b:"avatar"===a.key},"avatar"===a.key?{c:e.unref(t.VUE_APP_API_URL)+n.value.avatar}:Array.isArray(a.key)?{e:e.t(n.value.province||""),f:e.t(n.value.city||"")}:{g:e.t(n.value[a.key]||"未设置")},{d:Array.isArray(a.key),h:i,i:`blur(${a.active?0:45}px)`,j:e.o((e=>(e=>{const t=l.value;t.find((t=>t.key===e.key)).active=!0,l.value=t})(a)),i)}))),c:e.o(v)}:{})}};wx.createPage(u);
