let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
Page({
  data: {
    isIpx: app.globalData.isIpx,
    footOn:4,
  },
  
  onShow(){
    var that=this;
    that.setData({ appId: wx.getStorageSync("appId")})
    that.getMyziliao();
  },
  onLoad(options) {
    
  },
  getMyziliao:function(){
    let that=this;
    let memberid = wx.getStorageSync("memberId");
    postData.request('api/personalcenter/myziliao',{
      memberid
    },res=>{
      console.log(res);
      if (res.data.code==100000){
        that.setData({
          userInfo: res.data.data
        })
      }     
    },fail=>{})
  },
  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.share.title,
      path: app.globalData.share.path,
      imageUrl: app.globalData.share.imageUrl // 图片 URL
    }
  }
})