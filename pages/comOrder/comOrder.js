let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
let util = require('../../utils/util.js');
Page({
  data: {
    isIpx: app.globalData.isIpx
    
    
  },
  onShow(){
    var that=this;
    let orderData = wx.getStorageSync('orderData');
    orderData.starttime = moment(orderData.starttime * 1000).format('MM/DD')
    orderData.endtime = moment(orderData.endtime * 1000).format('MM/DD')
    that.setData({ orderData})
  },
  onLoad(options) {
  },
  yesorder:function(){
    let that=this
    util.buttonClicked(that)
    let memberid = wx.getStorageSync("memberId");
    let orderData = that.data.orderData;
    let orderid = orderData.orderid;
    let money = orderData.money
    postData.request('api/activity/yesorder', { memberid, orderid, money},res=>{
      console.log(res)
      if (res.data.code==100000){
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: 'MD5',
          paySign: res.data.data.paySign,
          success(paydata) {
            if (paydata.errMsg == "requestPayment:ok"){
              util.showSuccess('支付成功！')
              wx.removeStorageSync("orderData")
              wx.navigateTo({
                url: '../index/index',
              })
            }else{
             
            }
           },
          fail(res) { }
        })
      }else{
        console.log('支付失败')
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