
let app = getApp();
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    pagesize:4,
    p:1,
    imgUrls: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({ typeid: options.typeid })
  },
  //分类轮播图
  getTypebanner:function(){
    let that=this;
    let typeid = that.data.typeid;
    postData.request('api/activity/typebanner', { typeid},res=>{
      if (res.data.code==100000){
        let imgUrls = res.data.data;
        imgUrls.forEach(item => {
          item = !regImg.test(item) ? app.globalData.DoBaseUrl + item : item;
        })
        that.setData({ imgUrls})
      }
    },fail=>{})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //分类详情
  getActivity: function (data) {
    let newsUrl = app.globalData.DoBaseUrl + 'api/activity/classificationdetail';
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
        console.log(res)
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let memberid = wx.getStorageSync("memberId");
    let typeid = this.data.typeid;
    let pagesize = this.data.pagesize;
    this.setData({
      p: 1
    })
    this.getTypebanner()
    this.getActivity({
      memberid,
      p: 1,
      typeid,
      pagesize
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let p = that.data.p;
    let pagesize = that.data.pagesize;
    let typeid = that.data.typeid;
    let memberid = wx.getStorageSync("memberId");
    p++;
    that.setData({
      p: p
    })
    that.getActivity({
      p,
      pagesize,
      memberid,
      typeid
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})