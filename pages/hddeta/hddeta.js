let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
let util = require('../../utils/util.js');
Page({
  data: {
    isIpx: app.globalData.isIpx,
    radioList: ['活动详情', '装备须知', '费用说明'],
    footOn: 1,
    radioOn: '0',
    radioListShow: [],
    pupShow: false,
    imgUrls: [],
  },
  //单选
  radio(e) {
    var e = e.currentTarget.dataset,
      that = this
    var radioOn = e.index
    that.setData({
      radioOn: radioOn
    })
  },
  // 弹窗
  pupShow() {
    this.setData({
      pupShow: true
    })
  },
  pupClose() {
    this.setData({
      pupShow: false
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.imgurl;
    let images = []
    images.push(current)
    wx.previewImage({
      current: current,
      urls: images
    })
  },
  onShow() {
    var that = this;
    that.getActivedetail();
    that.getAready();
  },
  onLoad(options) {
    this.setData({ activeid: options.activeid})
  },
  //活动详情最下面已报名列表
  getAready:function(){
    let that=this;
    let memberid = wx.getStorageSync("memberId");
    let mgactivityid = that.data.activeid;
    postData.request('api/activity/aready', { memberid, mgactivityid},res=>{
      if (res.data.code==100000){
        let areadyList = res.data.data;
        that.setData({ areadyList})
      }
    },fail=>{})
  },
  //获取活动详情
  getActivedetail:function(){
    let that=this;
    let memberid = wx.getStorageSync("memberId");
    let activeid = that.data.activeid;
    console.log(activeid)
    postData.request('api/activity/activedetail', { memberid, activeid},res=>{
      if (res.data.code==100000){
        let activedetail = res.data.data;
        for (let i = 0; i < activedetail.picsimages.length;i++){
          activedetail.picsimages[i] = !regImg.test(activedetail.picsimages[i]) ? app.globalData.DoBaseUrl + activedetail.picsimages[i] : activedetail.picsimages[i]
        }
        activedetail.qrcodeimage = !regImg.test(activedetail.qrcodeimage) ? app.globalData.DoBaseUrl + activedetail.qrcodeimage : activedetail.qrcodeimage;
        activedetail.thumbimage = !regImg.test(activedetail.thumbimage) ? app.globalData.DoBaseUrl + activedetail.thumbimage : activedetail.thumbimage;
        let btnstatus;//报名按钮状态
        let radioListShow=[];
        // let nowDay = moment(new Date()).format('YYYY-MM-DD');//用户进入页面的时候获取当前日期
        // activedetail.starttime = moment(activedetail.starttime * 1000).format('YYYY-MM-DD');
        // activedetail.endtime = moment(activedetail.endtime * 1000).format('YYYY-MM-DD');
        // if (toDate(activedetail.starttime) <= toDate(nowDay)){
        //   // console.log('活动已开始')
        //   if (toDate(activedetail.endtime) <= toDate(nowDay)) {
        //     console.log('活动已结束')
        //     btnstatus=false
        //   } else {
        //     btnstatus=true
        //     console.log('活动还未结束')
        //   }
        // }else{
        //   console.log('活动未开始')
        // }
        radioListShow.push(activedetail.body);
        radioListShow.push(activedetail.needknow)
        radioListShow.push(activedetail.cashdoc)
        that.setData({ activedetail, radioListShow, btnstatus: res.data.btnstatus})
      }
    },fail=>{})
  },
  nostartedtip:function(){
    util.showTost('活动未开始,敬请期待')
  },
  finishtip:function(){
    util.showTost('活动已结束,敬请期待下次活动')
  },

  enroll: function () {
    let activedetail = this.data.activedetail;
   if(activedetail.alreadynum< activedetail.limitnum){
     wx.navigateTo({
       url: '../baom/baom?activeid=' + this.data.activeid,
     })
   }else{
     util.showTost('该活动报名人数已达上限,敬请期待下次活动')
   }
  },
  formSubmit: function (e) {
    let formid=e.detail.formId
    let memberid = wx.getStorageSync("memberId");
    postData.pushMessage({
      formid, memberid
    })
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

function toDate(str) {
  var sd = str.split("-");
  return new Date(sd[0], sd[1], sd[2]);
}