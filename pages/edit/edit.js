let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
let util = require('../../utils/util.js');
Page({
  data: {
    isIpx: app.globalData.isIpx

  },
  onShow() {
    var that = this;
    that.getcardinfo();
  },
  onLoad(options) {
    var that = this,
      time = util.formatTime(new Date())
    that.setData({
      y: time.year,
      m: time.month,
      cardid: options.cardid
    })
  },
  piaoType: function(e) {
    let that = this;
    let ispreader_bed = e.currentTarget.dataset.ispreader_bed;
    let userInfo = that.data.userInfo;
    userInfo.ispreader_bed = ispreader_bed;
    that.setData({
      userInfo
    })
  },
  getcardinfo: function() {
    let that = this;
    let memberid = wx.getStorageSync("memberId");
    let cardid = that.data.cardid;
    postData.request('api/datacard/cardinfo', {
      memberid,
      cardid
    }, res => {
      if (res.data.code == 100000) {
        that.setData({
          userInfo: res.data.data
        })
      }
    }, fail => {})
  },
  //判断是否成年
  cardKey(e) {
    var d = e.currentTarget.dataset,
      that = this,
      value = e.detail.value //当前的input 值
      ,
      _y = value.substr(6, 4) //输入的年份
      ,
      _m = value.substr(8, 2) //输入的月份
      ,
      y = that.data.y //当前的年份
      ,
      m = that.data.m; //当前的月份
    if (value.length == 18) {
      let userInfo = that.data.userInfo;
      if (y - _y > 13) {
        userInfo.adult_children = 1;
        userInfo.idcard= value
      }
      if (y - _y < 13 || y - _y == 13) {
        userInfo.adult_children = 2
        userInfo.idcard = value
      }
      that.setData({
        userInfo
      })
    }
  },
  formSubmit: function(e) {
    let that = this,
      formdata = e.detail.value,
      cardid = that.data.cardid,
      memberid = wx.getStorageSync("memberId"),
      current = that.data.current,
      nameReg = /^[\u4E00-\u9FA5]{2,4}$/,
      mobileReg = /^1[3|4|5|7|8][0-9]{9}$/,
      idcardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      nameflag = nameReg.test(formdata.truename),
      mobileflagp = mobileReg.test(formdata.phone),
      idcardflag = idcardReg.test(formdata.idcard),
      userInfo = that.data.userInfo,
      adult_children = userInfo.adult_children,
      ispreader_bed = userInfo.ispreader_bed,
      mobileflagj = mobileReg.test(formdata.emergencyphone);
    if (formdata.wxname == '') {
      util.showTost('微信名不能为空')
      return false
    }
    if (formdata.truename == '') {
      util.showTost('真实姓名不能为空')
      return false
    } else {
      if (!nameflag) {
        util.showTost('请输入真实姓名')
        return false
      }
    }
    if (formdata.idcard == '') {
      util.showTost('身份证不能为空')
      return false
    } else {
      if (!idcardflag) {
        util.showTost('请输入真实身份证号')
        return false
      }
    }
    if (formdata.phone == '') {
      util.showTost('手机号不能为空')
      return false
    } else {
      if (!mobileflagp) {
        util.showTost('请输入真实手机号')
        return false
      }
    }
    if (formdata.emergencyphone == '') {
      util.showTost('紧急联系人不能为空')
      return false
    } else {
      if (!mobileflagj) {
        util.showTost('请输入真实手机号')
        return false
      }
    }
    if (formdata.boarding_location == '') {
      util.showTost('上车地点不能为空')
      return false
    }
    postData.request('api/datacard/editcrd', {
      memberid,
      cardid,
      wxname: formdata.wxname,
      truename: formdata.truename,
      idcard: formdata.idcard,
      adult_children,
      phone: formdata.phone,
      emergencyphone: formdata.emergencyphone,
      boarding_location: formdata.boarding_location,
      ispreader_bed
    }, res => {
      if (res.data.code == 100000) {
        util.showTost(res.data.message)
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
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