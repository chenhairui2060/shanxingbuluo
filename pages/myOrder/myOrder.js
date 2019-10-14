
let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
let util = require('../../utils/util.js');
Page({
  data: {
    isIpx: app.globalData.isIpx
    , radioList: ['全部', '进行中','已完成']
    ,footOn:1
    , radioOn:'0',
    // , radioListShow: ['徒步不是一次旅行，而是一种修行，在坚持的行走中，感受心脏的跳动。', '徒步不是一次旅行，而是一种修行，在坚持的行走中，感受心脏的跳动，感受每个步伐，每次呼吸，最终发现每一步就是幸福的脚印。','徒步不是一次旅行，而是一种修行，在坚持的行走中，感受心脏的跳动111。'],
    p:1,
    type:1,
    pagesize:3
  },
  //单选
  radio(e) {
    var that = this;
    let memberid = wx.getStorageSync("memberId");
    var e = e.currentTarget.dataset, that = this
    var radioOn = e.index
    let type = radioOn+1
    that.setData({ radioOn, type })
    that.setData({ p: 1 })
    that.getMyorders({ memberid, type, p: 1, pagesize: 3 })
  },
  onShow(){
    var that = this;
    let memberid = wx.getStorageSync("memberId");
    that.setData({ p: 1 })
    that.getMyorders({ memberid, type: 1, p: 1, pagesize:3})
  },
  onLoad(options) {
    
  },
  //首页推荐活动
  getMyorders: function (data) {
    let newsUrl = app.globalData.DoBaseUrl + 'api/personalcenter/myorders';
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
              activitylist[i].starttime = moment(activitylist[i].starttime * 1000).format('MM/DD')
              activitylist[i].endtime = moment(activitylist[i].endtime * 1000).format('MM/DD')
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
                let dateFormat = /^(\d{2})\/(\d{2})$/;
                activitylist[i].starttime = dateFormat.test(activitylist[i].starttime) ? activitylist[i].starttime : moment(activitylist[i].starttime * 1000).format('MM/DD')
                activitylist[i].endtime = dateFormat.test(activitylist[i].endtime) ? activitylist[i].endtime : moment(activitylist[i].endtime * 1000).format('MM/DD')
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
  //取消订单
  cancel:function(e){
    let that=this;
    let activitylist = that.data.activitylist;
    let memberid = wx.getStorageSync("memberId");
    let idx = e.currentTarget.dataset.idx;
    let orderid = e.currentTarget.dataset.orderid;
    postData.request('api/personalcenter/cancel', { orderid, memberid},res=>{
      if (res.data.code==100000){
        activitylist.splice(idx, 1);
        that.setData({
          activitylist
        })
      }else{
        util.showTost(res.data.message)
      }
      
    },fail=>{})
    
  },
  onReachBottom: function () {
    let that = this;
    let p = that.data.p;
    let type = that.data.type;
    let pagesize = that.data.pagesize;
    let memberid = wx.getStorageSync("memberId");
    p++;
    that.setData({
      p: p
    })
    that.getMyorders({
      p,
      pagesize,
      memberid,
      type
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