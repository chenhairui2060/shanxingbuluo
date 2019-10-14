let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
Page({
  data: {
    isIpx: app.globalData.isIpx
    ,imgUrls: [
      '../img/ban.png',
      '../img/ban.png',
      '../img/ban.png'
    ]
    ,footOn:2,
    pagesize: 4,
    p: 1
    
  },
  onShow(){
    var that=this;
    let memberid = wx.getStorageSync("memberId");
    that.setData({ p: 1, appId: wx.getStorageSync("appId")})
    that.getlottering();
    that.getActivity({
      p: 1, pagesize:4
    })
  },
  onLoad(options) {
    
  },
  navtoshopdeta:function(e){
    console.log(e)
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../shopdeta/shopdeta?goodsid=' + goodsid
    })
  },
  getlottering:function(){
    let that = this;
    let memberid = wx.getStorageSync("memberId");
    postData.getData('api/Leescore/homebanner', res => {
      console.log(res)
      if (res.data.code == 100000) {
        let topData = res.data.data;
        for (let i = 0; i < topData.length;i++){
          topData[i] = !regImg.test(topData[i]) ? app.globalData.DoBaseUrl + topData[i] : topData[i];
        }
        that.setData({
          topData
        })
      } else {
        console.log('请求数据失败')
      }
    }, fail => { })
  },
  getActivity: function (data) {
    let newsUrl = app.globalData.DoBaseUrl + 'api/Leescore/index';
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
        wx.hideLoading();
        if (res.data.code == 100000) {
          if (that.data.p == 1) {
            let activitylist = res.data.message == "查询成功" ? res.data.data : [];;
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
    that.getActivity({
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