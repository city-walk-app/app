"use strict";const e=require("../../common/vendor.js"),t=require("../../api/api.js"),a=require("../../utils/http.js"),i=require("../../utils/positioning.js"),u=require("../../utils/wx.js");require("../../enum/user.js");const l={__name:"index",setup(l){const r=new t.Api,d=e.ref(),n=e.ref(),o=e.ref(0),s=e.ref(0);return(async()=>{u.showLoading();const e=await r.getRouteHistory({id:1});if(u.hideLoading(),200===e.code){const{latitude:t,longitude:u}=i.calculateCenter(e.data);o.value=t,s.value=u;const l=await r.getUserInfo({id:e.data[0].user_id});let c="";200===l.code&&(c=a.VUE_APP_API_URL+l.data.avatar),e.data&&e.data.length&&(n.value=e.data.map((e=>({latitude:Number(e.latitude),longitude:Number(e.longitude),fillColor:"#333333",radius:30}))),d.value=e.data.map((e=>({id:e.id,latitude:Number(e.latitude),longitude:Number(e.longitude),title:e.name,iconPath:c,width:30,height:30}))))}})(),(t,a)=>e.e({a:d.value&&d.value.length},d.value&&d.value.length?{b:o.value,c:n.value,d:s.value,e:t.scale,f:d.value}:{})}};wx.createPage(l);
