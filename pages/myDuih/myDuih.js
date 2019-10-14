let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
let util = require('../../utils/util.js');
Page({
  data: {
    isIpx: app.globalData.isIpx,
    radioList: ['全部', '进行中', '已完成'],
    footOn: 1,
    radioOn: '0',
    p: 1,
    pagesize: 4,
    type: 1
  },
  //单选
  radio(e) {
    var e = e.currentTarget.dataset,
      that = this
    var radioOn = e.index
    that.setData({
      p: 1
    })
    let pagesize = that.data.pagesize;
    let memberid = wx.getStorageSync("memberId");
    let type = radioOn + 1
    that.setData({
      radioOn: radioOn,
      type
    })
    that.getMyexchange({
      type,
      p: 1,
      pagesize,
      memberid
    })
  },
  onShow() {
    var that = this;
    let p = that.data.p;
    let pagesize = that.data.pagesize;
    let memberid = wx.getStorageSync("memberId");
    that.setData({
      p: 1
    })
    that.getMyexchange({
      type: 1,
      p: 1,
      pagesize: 4,
      memberid
    })
  },
  onLoad(options) {

  },
  yesgoods: function(e) {
    let that = this;
    let activitylist = that.data.activitylist;
    let dhid = e.currentTarget.dataset.dhid;
    let memberid = wx.getStorageSync("memberId");
    let idx = e.currentTarget.dataset.idx;
    postData.request('api/personalcenter/yesgoods', {
      memberid,
      dhid
    }, res => {
      if (res.data.code == 100000) {
        util.showSuccess(res.data.message);
        activitylist[idx].status = 2
        that.setData({
          activitylist
        })
      }
    }, fail => {})

  },
  getMyexchange: function(data) {
    let newsUrl = app.globalData.DoBaseUrl + 'api/personalcenter/myexchange';
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
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 100000) {
          if (that.data.p == 1) {
            let activitylist = res.data.message == "查询成功" ? res.data.data : [];
            for (let i = 0; i < activitylist.length; i++) {
              activitylist[i].thumbimage = !regImg.test(activitylist[i].thumbimage) ? app.globalData.DoBaseUrl + activitylist[i].thumbimage : activitylist[i].thumbimage;
            }
            that.setData({
              activitylist
            })
          } else {
            var l = that.data.activitylist;
            if (res.data.data.length == 0) {
              wx.showToast({
                title: '数据加载完毕',
                icon: 'none'
              })
            } else {
              for (var i = 0; i < res.data.data.length; i++) {
                l.push(res.data.data[i]);
              }
              let activitylist = l;
              for (let i = 0; i < activitylist.length; i++) {
                activitylist[i].thumbimage = !regImg.test(activitylist[i].thumbimage) ? app.globalData.DoBaseUrl + activitylist[i].thumbimage : activitylist[i].thumbimage;
              }
              that.setData({
                activitylist
              })
            }
          }
        }
      },
      fail: function() {
        wx.hideLoading();
        wx.showToast({
          title: '请求失败',
          icon: 'loading',
          duration: 1000
        })
      }
    })
  },
  onReachBottom: function() {
    let that = this;
    let p = that.data.p;
    let pagesize = that.data.pagesize;
    let type = that.data.type;
    let memberid = wx.getStorageSync("memberId");
    p++;
    that.setData({
      p: p
    })
    that.getMyexchange({
      p,
      pagesize,
      memberid,
      type
    });
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