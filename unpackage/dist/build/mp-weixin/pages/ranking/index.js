"use strict";const e=require("../../common/vendor.js"),a=require("../../utils/http.js"),u=require("../../utils/wx.js"),r=require("../../api/api.js"),n=require("../../enum/user.js"),_={__name:"index",setup(_){const t=new r.Api,i=u.getStorage(n.USER_PROVINCE_CODE),s=e.ref([]);return(async()=>{const e=await t.getRanking({province_code:i.province_code});200===e.code&&(s.value=e.data)})(),(u,r)=>e.e({a:s.value&&s.value.length},s.value&&s.value.length?e.e({b:s.value[1]},s.value[1]?{c:e.unref(a.VUE_APP_API_URL)+s.value[1].user_info.avatar}:{},{d:s.value[0]},s.value[0]?{e:e.unref(a.VUE_APP_API_URL)+s.value[0].user_info.avatar}:{},{f:s.value[2]},s.value[2]?{g:e.unref(a.VUE_APP_API_URL)+s.value[2].user_info.avatar}:{}):{},{h:`url('${e.unref(a.VUE_APP_API_URL)}/images/assets/5.jpg') no-repeat`,i:s.value&&s.value.length},s.value&&s.value.length?{j:e.f(s.value,((u,r,n)=>e.e({a:e.t(r+1),b:u.user_info},u.user_info?{c:e.unref(a.VUE_APP_API_URL)+u.user_info.avatar,d:e.t(u.user_info.nick_name)}:{},{e:r,f:e.o((e=>{u.user_id}),r)})))}:{})}};wx.createPage(_);
