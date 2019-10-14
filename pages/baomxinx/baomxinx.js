let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
let util = require('../../utils/util.js');
Page({
  data: {
    isIpx: app.globalData.isIpx,
    current: 0,
    adult_children: 0,
    piaoType: [{
      piaoval: '拼房'
    }, {
      iconpath: '../img/ico-check.png',
    }]
  },

  onShow() {
    var that = this;
    that.setData({
      adult_children: 0
    })
    that.getmyziliao();
  },
  onLoad(options) {
    var that = this,
      time = util.formatTime(new Date())
    that.setData({
      y: time.year,
      m: time.month,
    })
  },
  //获取资料
  getmyziliao: function() {
    let that = this;
    let memberid = wx.getStorageSync("memberId");
    postData.request('api/personalcenter/myziliao', {
      memberid
    }, res => {
      console.log(res)
      if (res.data.code == 100000) {
        that.setData({
          userInfo: res.data.data
        })
      }
    }, fail => {})
  },
  piaoType: function(e) {
    this.setData({
      current: e.currentTarget.dataset.idx
    })
  },
  formSubmit: function(e) {
    let that = this,
      formdata = e.detail.value,
      memberid = wx.getStorageSync("memberId"),
      ispreader_bed, //票类型
      current = that.data.current,
      nameReg = /^[\u4E00-\u9FA5]{2,4}$/,
      mobileReg = /^1[3|4|5|7|8][0-9]{9}$/,
      idcardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      nameflag = nameReg.test(formdata.truename),
      mobileflagp = mobileReg.test(formdata.phone),
      idcardflag = idcardReg.test(formdata.idcard),
      adult_children = that.data.adult_children,
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
    if (adult_children == 1) {
      if (current == 0) {
        ispreader_bed = 1
      } else {
        ispreader_bed = 2
      }
    } else if (adult_children == 2) {
      if (current == 0) {
        ispreader_bed = 1
      } else {
        ispreader_bed = 2
      }
    }
    console.log(ispreader_bed)
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
    postData.request('api/datacard/addcard', {
      memberid,
      wxname: formdata.wxname,
      truename: formdata.truename,
      idcard: formdata.idcard,
      adult_children,
      ispreader_bed,
      phone: formdata.phone,
      emergencyphone: formdata.emergencyphone,
      boarding_location: formdata.boarding_location
    }, res => {
      if (res.data.code==100000){
        util.showTost(res.data.message)
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })},1500)
      }
    }, fail => {})
  },
  //判断是否成年
  cardKey(e) {
    var d = e.currentTarget.dataset,
      that = this,
      adult_children = that.data.adult_children,
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
      if (y - _y > 13) {
        adult_children = 1
      }
      if (y - _y < 13 || y - _y == 13) {
        adult_children = 2
      }

    } else {
      adult_children = 0
    }
    that.setData({
      adult_children
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