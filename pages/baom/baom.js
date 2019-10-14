let app = getApp()
let postData = require("../../utils/request.js");
let regImg = /^https?:\/\//i;
let moment = require('../../utils/moment.min.js');
let util = require('../../utils/util.js');
Page({
  data: {
    isIpx: app.globalData.isIpx,
    nameCheck: [],
    nameData: [],
    bnameData: [], //帮报名列表
    bbidx: [],
    bIndex: '0',
    footOn: 1,
    y: '',
    m: '',
    keyOn: 'a',
    xzkeyOn: 'b',
    ispreader_bed: "",
    memberid: wx.getStorageSync('memberId'), //用户Id
    activeid: "", //活动id
  },
  // 房屋类型
  piaoType(e) {
    var e = e.currentTarget.dataset,
      that = this,
      nameData = that.data.nameData
    nameData[e.index].ispreader_bed = e.ispreader_bed;
    that.setData({
      nameData: nameData
    })
  },
  formidSubmit:function(e){
    let formid = e.detail.formId
    let memberid = wx.getStorageSync("memberId");
    postData.pushMessage({
      formid, memberid
    })
  },
  xzpiaoType(e) {
    var e = e.currentTarget.dataset,
      that = this,
      bnameData = that.data.bnameData
    bnameData[e.index].ispreader_bed = e.ispreader_bed;
    that.setData({
      bnameData: bnameData
    })
  },
  // 人员多选
  checkbox(e) {
    var e = e.currentTarget.dataset,
      dataitem = e.dataitem,
      that = this,
      nameCheck = that.data.nameCheck,
      nameData = that.data.nameData,
      name = [{
        "wxname": dataitem.name,
        'adult_children': dataitem.adult_children,
        "wxname": dataitem.wxname,
        "truename": dataitem.truename,
        "idcard": dataitem.idcard,
        "phone": dataitem.phone,
        "emergencyphone": dataitem.emergencyphone,
        "boarding_location": dataitem.boarding_location,
        "ispreader_bed": dataitem.ispreader_bed,
        "type": 1,
        "id": dataitem.id
      }],
      index = e.index,
      nameL = nameData.length;

    //重置报名资料卡的名字
    for (let i = 0; i < nameCheck.length; i++) {
      if (i == e.index) {
        nameCheck[i].checked = !nameCheck[i].checked
      }
    }
    //重置报名资料卡的详细数据
    if (nameCheck[index].checked) {
      nameL = nameL + 1
      nameData = nameData.concat(name)
    } else {
      nameData = nameData.slice(1, nameL)
      nameL = nameL - 1
    }
    that.setData({
      nameCheck: nameCheck,
      nameData: nameData
    })
  },
  //报名类型选择
  baomrtype: function(e) {
    let that = this;
    let idx = e.currentTarget.dataset.idx;
    let id = e.currentTarget.dataset.id;
    let nameCheck = that.data.nameCheck;
    let nameData = that.data.nameData;
    for (let i = 0; i < nameCheck.length;i++){
      if (nameCheck[i].id==id){
        if (nameCheck[i].type==1){
          nameCheck[i].type =2
        }else{
          nameCheck[i].type =1
        }
      }
    }
    if (nameData[idx].type == 1) {
      nameData[idx].type = 2
    } else {
      nameData[idx].type = 1
    }
    that.setData({
      nameData,
      nameCheck
    })
  },
  //帮报名类型选择
  baoxzmrtype:function(e){
    let that = this;
    let idx = e.currentTarget.dataset.idx;
    let bnameData = that.data.bnameData;
    if (bnameData[idx].type == 1) {
      bnameData[idx].type = 2
    } else {
      bnameData[idx].type = 1
    }
    that.setData({
      bnameData
    })
  },
  formSubmit: function(e) {
    var that = this,
      nameReg = /^[\u4E00-\u9FA5]{2,4}$/,
      mobileReg = /^1[3|4|5|7|8][0-9]{9}$/,
      activeid = that.data.activeid,
      idcardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    let nameData = that.data.nameData;
    let nameCheck = that.data.nameCheck;
    let bnameData = that.data.bnameData;
    let memberid = wx.getStorageSync("memberId");
    let dataJsonList = [];
    if (nameData.length != 0) {
      for (let i = 0; i < nameData.length; i++) {
        dataJsonList.push(nameData[i]);
      }
    }
    //数据连接新增用户
    if (bnameData.length != 0) {
      for (let i = 0; i < bnameData.length; i++) {
        dataJsonList.push(bnameData[i]);
      }
    }
    if (dataJsonList.length == 0) {
      util.showTost('您还没有资料，请完善信息再进行报名！')
      return false
    } else {
      for (let i = 0; i < dataJsonList.length; i++) {
        if (dataJsonList[i].wxname == '') {
          util.showTost('微信名不能为空')
          return false
        }
        if (dataJsonList[i].truename == '') {
          util.showTost('真实姓名不能为空')
          return false
        } else {
          if (!nameReg.test(dataJsonList[i].truename)) {
            util.showTost('请输入真实姓名')
            return false 
          }
        }
        if (dataJsonList[i].idcard == '') {
          util.showTost('身份证号不能为空')
          return false
        }else{
          if (!idcardReg.test(dataJsonList[i].idcard)) {
            util.showTost('请输入真实身份证号码')
            return false
          }
        }
        if (dataJsonList[i].phone == '') {
          util.showTost('手机号不能为空')
          return false
        }else{
          if (!mobileReg.test(dataJsonList[i].phone)) {
            util.showTost('请输入真实手机号码')
            return false
          }
        }
        if (dataJsonList[i].emergencyphone == '') {
          util.showTost('手机号不能为空')
          return false
        }else{
          if (!mobileReg.test(dataJsonList[i].phone)) {
            util.showTost('请输入真实手机号码')
            return false
          }
        }
        if (dataJsonList[i].boarding_location == '') {
          util.showTost('上车地点不能为空')
          return false
        }
      }
    }
    postData.request('api/activity/yesbm', { memberid, activeid, datajson: JSON.stringify(dataJsonList)},res=>{
      console.log('确认订单',res)
      if (res.data.code==100000){
        util.showTost(res.data.message)
        setTimeout(()=>{
            wx.setStorageSync('orderData',res.data.data )
            wx.navigateTo({
              url: '../comOrder/comOrder'
            })
        },1500)
      }else{
        util.showTost(res.data.message)
      }
    },fail=>{})
  },
  bbaom(e) {
    var e = e.currentTarget.dataset,
      that = this,
      bnameData = that.data.bnameData,
      index = parseInt(e.index),
      bbidx = that.data.bbidx,
      bbidxlen = [index],
      len = {
        wxname: '',
        truename: '',
        idcard: '',
        adult_children: 0,
        phone: '',
        emergencyphone: '',
        boarding_location: '',
        ispreader_bed: 1,
        type: 1
      };

    var index = index + 1;
    bbidx = bbidx.concat(bbidx);
    bnameData.push(len);
    that.setData({
      bnameData: bnameData,
      bbidx: bbidx,
      bIndex: index
    })
  },
  // 删除帮报名
  delete(e) {
    var e = e.currentTarget.dataset,
      that = this,
      bnameData = that.data.bnameData,
      index = parseInt(e.index),
      len = bnameData.length

    if (index == 0) {
      bnameData = bnameData.splice(1, len - 1)
    }
    if (index == len - 1) {
      bnameData = bnameData.splice(0, len - 1)
    }
    if (index != 0 && index != len - 1) {
      var bnameData1 = bnameData.splice(0, index)
      var bnameData2 = bnameData.splice(index + 1, len)
      bnameData = bnameData1.concat(bnameData2)
    }
    that.setData({
      bnameData: bnameData
    })
  },
  //给当前的添加获取input值事件
  cardClick(e) {
    var e = e.currentTarget.dataset,
      that = this
    that.setData({
      keyOn: e.index
    })
  },
  xzcardClick: function(e) {
    var e = e.currentTarget.dataset,
      that = this
    that.setData({
      xzkeyOn: e.index
    })
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
      m = that.data.m //当前的月份
      ,
      nameData = that.data.nameData; //原数据
      that.data.nameData[d.index].idcard = value;
    if (value.length == 18) {
      if (y - _y > 13) {
        that.data.nameData[d.index].adult_children = 1
      }
      if (y - _y < 13 || y - _y == 13) {
        that.data.nameData[d.index].adult_children = 2
      }
    } else {
      that.data.nameData[d.index].adult_children = 0
    }
      that.setData({ nameData })
  },
  xzcardKey(e) {
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
      m = that.data.m //当前的月份
      ,
      bnameData = that.data.bnameData; //原数据
    let parameter = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    let val = e.detail.value;
    let bnameDataItem = 'bnameData[' + index + '].' + parameter;
    that.setData({
      [bnameDataItem]: val
    });
    if (value.length == 18) {
      if (y - _y > 13) {
        that.data.bnameData[d.index].adult_children = 1
      }
      if (y - _y < 13 || y - _y == 13) {
        that.data.bnameData[d.index].adult_children = 2
      }

    } else {
      that.data.bnameData[d.index].adult_children = 0
    }
    that.setData({
      bnameData: bnameData
    })
  },
  reviseData:function(e){
    var that = this;
    let parameter = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    let val = e.detail.value;
    let nameDataDataItem = 'nameData[' + index + '].' + parameter;
    that.setData({
      [nameDataDataItem]: val
    });
   
  },
    //新增用户数据设置
  addData: function(e) {
    var that = this;
    let parameter = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    let val = e.detail.value;
    let bnameDataItem = 'bnameData[' + index + '].' + parameter;
    that.setData({
      [bnameDataItem]: val
    });
  },
  getdatacard: function() {
    let that = this;
    let memberid = wx.getStorageSync("memberId");
    postData.request('api/datacard/index', {
      memberid,
      p: 1,
      pagesize: 9999
    }, res => {
      if (res.data.code == 100000) {
        let nameCheck = res.data.data;
        for (let i = 0; i < nameCheck.length; i++) {
          nameCheck[i].checked = false;
          nameCheck[i].type = 1
        }
        that.setData({
          nameCheck
        })
      }
    }, fail => {})
  },
  navtofileList:function(){
    wx.navigateTo({
      url: '../fileList/fileList',
    })
  },
  onShow() {
    var that = this;
    that.setData({ nameData:[]})
    that.getdatacard();

  },
  onLoad(options) {
    var that = this,
      time = util.formatTime(new Date())
    that.setData({
      y: time.year,
      m: time.month,
      activeid: options.activeid,
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