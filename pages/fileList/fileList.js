let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
let util = require('../../utils/util.js');
Page({
  data: {
    isIpx: app.globalData.isIpx,
    nameCheck: [],
    footOn: 1,
    p: 1,
    pagesize: 8

  },
  // 多选
  checkbox(e) {
    var e = e.currentTarget.dataset,
      that = this,
      nameCheck = that.data.nameCheck
    for (let i = 0; i < nameCheck.length; i++) {
      if (i == e.index) {
        nameCheck[i].checked = !nameCheck[i].checked
      }
    }
    that.setData({
      nameCheck: nameCheck
    })
  },
  //删除资料卡
  delcard:function(e){
    let that=this;
    let nameCheck = that.data.nameCheck;
    let memberid = wx.getStorageSync("memberId");
    let cardid = e.currentTarget.dataset.cardid;
    let idx = e.currentTarget.dataset.idx;
    if (nameCheck[idx].checked){  
      postData.request('api/datacard/delcard', { memberid, cardid},res=>{
        nameCheck.splice(idx, 1)
        that.setData({ nameCheck })
        if (res.data.code==100000){
          util.showTost(res.data.message)
        }
      },fail=>{})
    }else{
      util.showTost('您未要操作的选择资料卡')
    }
  },
  edit:function(e){
    let cardid = e.currentTarget.dataset.cardid;
    wx.navigateTo({
      url: '../edit/edit?cardid=' + cardid
    })
  },
  //首页推荐活动
  getdatacard: function(data) {
    let newsUrl = app.globalData.DoBaseUrl + 'api/datacard/index';
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
        console.log(res)
        wx.hideLoading();
        if (res.data.code == 100000) {
          if (that.data.p == 1) {
            let nameCheck = res.data.message == "查询成功"? res.data.data:[];
            for (let i = 0; i < nameCheck.length; i++) {
              nameCheck[i].checked = false;
            }
            that.setData({
              nameCheck
            })
          } else {
            var l = that.data.nameCheck;
            if (res.data.data.length == 0) {
              wx.showToast({
                title: '数据加载完毕',
                icon: 'none'
              })
            } else {
              for (var i = 0; i < res.data.data.length; i++) {
                l.push(res.data.data[i]);
              }
              for (let i = 0; i < l.length; i++) {
                l[i].checked = false;
              }
              that.setData({
                nameCheck:l
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
  navtobaomxinx: function() {
    wx.navigateTo({
      url: '../baomxinx/baomxinx',
    })
  },
  onShow() {
    var that = this;
    let memberid = wx.getStorageSync("memberId");
    that.setData({p:1})
    that.getdatacard({
      p:1,
      pagesize:8,
      memberid
    })
  },
  onLoad(options) {

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