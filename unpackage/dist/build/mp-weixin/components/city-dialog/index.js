"use strict";const e=require("../../common/vendor.js"),i={__name:"index",props:{visible:{type:Boolean,default:!1,required:!0},position:{type:String,default:"center",validator:e=>["center","right"].includes(e)}},setup:i=>(t,o)=>e.e({a:i.visible},i.visible?{b:e.n(`city-dialog__wrapper-${i.position}`)}:{})},t=e._export_sfc(i,[["__scopeId","data-v-96e4201e"]]);wx.createComponent(t);
