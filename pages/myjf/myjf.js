let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
let util = require('../../utils/util.js');
Page({
  data: {
    isIpx: app.globalData.isIpx,
    footOn:2,
    p:1,
    pagesize:6
    
  },
  onShow(){
    var that = this;
    let memberid = wx.getStorageSync("memberId");
    that.getMyziliao();
    that.setData({p:1})
    that.getMyintegral({ p: 1, pagesize: 6, memberid})
  },
  onLoad(options) {
    
  },
  getMyziliao: function () {
    let that = this;
    let memberid = wx.getStorageSync("memberId");
    postData.request('api/personalcenter/myziliao', {
      memberid
    }, res => {
      if (res.data.code == 100000) {
        that.setData({
          userInfo: res.data.data
        })
      }
    }, fail => { })
  },
  //首页推荐活动
  getMyintegral: function (data) {
    let newsUrl = app.globalData.DoBaseUrl + 'api/personalcenter/myintegral';
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: newsUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: data,
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.code == 100000) {
          if (that.data.p == 1) {
            let integral = res.data.message == "查询成功" ? res.data.data : [];;
            for (let i = 0; i < integral.length; i++) {
              integral[i].createtime = moment(integral[i].createtime * 1000).format('YYYY-MM-DD')
            }
            that.setData({
              integral
            })
          } else {
            var l = that.data.integral;
            if (res.data.data.length == 0) {
              wx.showToast({
                title: '数据加载完毕',
                icon: 'none'
              })
            } else {
              for (var i = 0; i < res.data.data.length; i++) {
                l.push(res.data.data[i]);
              }
              let integral = l;
              for (let i = 0; i < integral.length; i++) {
                let dateFormat = /^(\d{4})-(\d{2})-(\d{2})$/;
                integral[i].createtime = dateFormat.test(integral[i].createtime) ? integral[i].createtime : moment(integral[i].createtime * 1000).format('YYYY-MM-DD')
              }
              that.setData({
                integral
              })
            }
          }
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '请求失败',
          icon: 'loading',
          duration: 1000
        })
      }
    })

  },
  onReachBottom: function () {
    let that = this;
    let p = that.data.p;
    let pagesize = that.data.pagesize;
    let memberid = wx.getStorageSync("memberId");
    p++;
    that.setData({
      p: p
    })
    that.getMyintegral({
      p,
      pagesize,
      memberid
    });
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