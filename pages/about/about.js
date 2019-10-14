let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
let WxParse = require('../../utils/wxParse/wxParse.js');
Page({
  data: {
    isIpx: app.globalData.isIpx
  },
  onShow() {
    var that = this;
    let pathname = that.data.pathname;
    if (pathname == 'about') {
      wx.setNavigationBarTitle({
        title: '关于我们'
      })
      that.getAboutus()
    } else if (pathname == "notice") {
      wx.setNavigationBarTitle({
        title: '公告详情'
      })
      that.getNotice()
    }
  },
  onLoad(options) {
    console.log(options)
    this.setData({
      pathname: options.pathname,
      noticeid: options.noticeid
    })
  },
  getAboutus: function() {
    let that = this;
    postData.getData('api/personalcenter/aboutus', res => {
      if (res.data.code == 100000) {
        let article = res.data.data.content;
        WxParse.wxParse('article', 'html', article, that, 5)
      }
    }, fail => {})
  },
  getNotice: function() {
    let that = this;
    let noticeid = that.data.noticeid;
    postData.request('api/notice/detail', {
      noticeid
    }, res => {
      if (res.data.code == 100000) {
        let article = res.data.data.content;
        WxParse.wxParse('article', 'html', article, that, 5)
      }
    }, fail => {})
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return {
      title: app.globalData.share.title,
      path: app.globalData.share.path,
      imageUrl: app.globalData.share.imageUrl // 图片 URL
    }
  }

})