let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    newsBan: [],
    footOn: 1,
    pagesize: 3,
    p: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      appId: wx.getStorageSync("appId")
    })
  },
  //获取顶部信息
  gettopdata: function() {
    let that = this;
    let memberid = wx.getStorageSync("memberId");
    postData.request('api/home/top', {
      memberid
    }, res => {
      console.log(res)
      if (res.data.code == 100000) {
        let topData = res.data.data;
        topData.Tribeimg = !regImg.test(topData.Tribeimg) ? app.globalData.DoBaseUrl + topData.Tribeimg : topData.Tribeimg
        that.setData({
          topData
        })
      } else {
        console.log('请求数据失败')
      }
    }, fail => {})
  },
  //获取公告
  getNotice: function() {
    let that = this;
    postData.getData('api/notice/index', res => {
      if (res.data.code == 100000) {
        let newsBan = res.data.data;
        console.log(newsBan)
        that.setData({
          newsBan
        })
      } else {
        console.log('请求数据失败')
      }
      // newsBan
    }, fail => {})
  },
  //获取小导航
  gethomeNavList: function() {
    let that = this;
    postData.getData('api/home/three', res => {
      if (res.data.code == 100000) {
        let homeNavList = res.data.data;
        homeNavList.forEach(item => {
          item.image = !regImg.test(item.image) ? app.globalData.DoBaseUrl + item.image : item.image;
        })
        that.setData({
          homeNavList
        })
      } else {
        console.log('请求数据失败')
      }
    }, fail => {})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let memberid = wx.getStorageSync("memberId");
    let pagesize = this.data.pagesize;
    this.setData({
      p: 1
    })
    this.gettopdata();
    this.getNotice();
    this.gethomeNavList();
    this.getActivity({
      memberid,
      p: 1,
      pagesize
    })
  },
  //首页推荐活动
  getActivity: function(data) {
    let newsUrl = app.globalData.DoBaseUrl + 'api/activity/homerecommend';
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
  navouturl:function(e){
    console.log(e)
    let noticeid = e.currentTarget.dataset.noticeid;
    wx.navigateTo({
      url: '../about/about?pathname=notice' + "&noticeid=" + noticeid
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
  onShareAppMessage: function() {
    return {
      title: app.globalData.share.title,
      path: app.globalData.share.path,
      imageUrl: app.globalData.share.imageUrl // 图片 URL
    }
  }
})