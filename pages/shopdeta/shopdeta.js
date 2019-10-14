let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let util = require('../../utils/util.js');
let moment = require('../../utils/moment.min.js');
let WxParse = require('../../utils/wxParse/wxParse.js');
Page({
  data: {
    isIpx: app.globalData.isIpx,
    footOn: 1,
    pupShow: false,
    type:1,
    date:'',
    time:''
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
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  onShow() {
    var that = this;
    that.getGoodsdetail();
    that.getproninfo();
  },
  chooseType:function(e){
    this.setData({ type: e.currentTarget.dataset.type})
  },
  exchangeyes:function(e){
    let that=this;
    let date = that.data.date;
    let goodsid = that.data.goodsid;
    let memberid = wx.getStorageSync("memberId");
    let remark = e.detail.value.remark;
    let type = that.data.type;
    if (date==''){
      if(that.data.type==1){
        util.showTost('请输入下次活动时间')
      }else{
        util.showTost('请输入自提时间')
      }  
    }else{
      let time = moment(date).valueOf()/1000
      postData.request('api/Leescore/exchangeyes',{
        goodsid, memberid, type, time, remark
      },res=>{
        if (res.data.code==100000){
          util.showTost(res.data.message)
          that.pupClose()
        }
      },fail=>{})
    
    }
  },
  getproninfo:function(){
    let that=this;
    postData.getData('api/Leescore/getproninfo',res=>{
      console.log(res)
      if (res.data.code==100000){
        that.setData({ proninfo: res.data.data})
      }
    },fail=>{})
  },
  getGoodsdetail:function(){
    let that=this;
    let goodsid = that.data.goodsid;
    let memberid = wx.getStorageSync("memberId");
    postData.request('api/Leescore/goodsdetail', { goodsid, memberid},res=>{
      if (res.data.code==100000){
          let article = res.data.data.body;
        // WxParse.wxParse('article', 'html', article, that, 5)
          that.setData({
            goodsdetail: res.data.data,
            article: WxParse.wxParse('article', 'html', article, that, 5)
          })
        
      }
    },fail=>{})
  },
  onLoad(options) {
    this.setData({
      goodsid: options.goodsid
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