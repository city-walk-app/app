"use strict";const e=require("../../common/vendor.js"),o=require("../../api/api.js"),n=require("../../enum/user.js"),i=require("../../utils/positioning.js"),t=require("../../utils/wx.js");require("../../utils/http.js");const s={__name:"index",setup(s){const a=new o.Api,{getAround:l}=i.usePositioning(),c=e.ref(0);e.index.getMenuButtonBoundingClientRect();const d=e.ref(t.getStorage(n.USER_INFO)),u=async o=>{const i=await a.getOpenId({code:o});200===i.code&&(async o=>{const i=await a.loginOpenId({wx_open_id:o});t.toast(i.message),200===i.code?(t.setStorage(n.USER_INFO,i.data),d.value=i.data):e.index.navigateTo({url:"/pages/login/index"})})(i.data.openid)},g=async()=>{const o=await e.index.login();"login:ok"===o.errMsg&&u(o.code)},r=l((async o=>{const{address:n,latitude:i,longitude:s,name:l}=o,c=await a.locationCreateRecord({latitude:i,longitude:s});t.toast(c.message),200===c.code&&e.index.navigateTo({url:"/pages/record-success/index"})})),x=e.ref(39.909),p=e.ref(116.39742),v=e.ref([]),f=()=>{e.index.navigateTo({url:"/pages/setting/index"})},m=()=>{e.index.navigateTo({url:`/pages/mine/index?user_id=${d.value.user_id}`})},w=()=>{e.index.navigateTo({url:"/pages/login/index"})},y=()=>{e.index.navigateTo({url:"/pages/friends/index"})},h=()=>{e.index.navigateTo({url:"/pages/invite/index"})},_=()=>{e.index.navigateTo({url:"/pages/ranking/index"})};return e.onLoad((o=>{o.invite_id&&(async o=>{console.log("获取详情");const n=await a.getFriendInviteInfo({invite_id:o});console.log(n),200===n.code&&e.index.showModal({title:"好友申请",content:`${n.data.name} 申请加你为好友，你同意吗？`,showCancel:!0,cancelText:"拒绝",confirmText:"同意",success:async e=>{if(e.confirm){const e=await a.friendConfirmInvite({invite_id:o});200===e.code&&console.log(e),console.log("同意")}else e.cancel&&console.log("用户点击取消")}})})(o.invite_id)})),e.onShow((()=>{e.index.onGyroscopeChange((e=>{console.log("陀螺仪.x = "+e.x),console.log("陀螺仪.y = "+e.y),console.log("陀螺仪.z = "+e.z)})),e.index.startGyroscope({interval:"normal",success(){console.log("success")},fail(){console.log("fail")}})})),e.onHide((()=>{e.index.stopGyroscope({success(){console.log("stop success!")},fail(){console.log("stop fail!")}})})),d&&d.value&&d.value.user_id?(console.log("已经登录"),(()=>{const o=e.index.getSystemInfoSync();c.value=o.statusBarHeight+44})(),e.index.getLocation({type:"wgs84",success:async e=>{console.log("获取用户位置信息成功:",e),p.value=e.longitude,x.value=e.latitude,v.value.push({id:1,longitude:e.longitude,latitude:e.latitude,iconPath:"https://img1.baidu.com/it/u=1784112474,311889214&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500",width:50,height:50,callout:{content:"我现在在这里",color:"blue",fontSize:24,borderRadius:30,bgColor:"#fff",padding:20}})},fail:e=>{console.log("获取用户位置信息失败:",e)}})):console.log("未登录"),(o,n)=>({a:e.o(m),b:e.o(f),c:e.o(g),d:e.o(w),e:x.value,f:p.value,g:v.value,h:e.o(y),i:e.o(((...o)=>e.unref(r)&&e.unref(r)(...o))),j:e.o(h),k:e.o(_),l:(c.value||90)+"px"})}};wx.createPage(s);
