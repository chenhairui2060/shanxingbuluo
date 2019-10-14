//app.js
App({
  
  onLaunch: function () {
    let that = this;
    that.Ipx();//判断 Ipx
    //that.getUserInfo();
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    wx.request({
      url: 'https://mtgo.cssnb.com/api/home/outminiprogram',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: function (data) {
        console.log('授权', data)
        if (data.data.code == 100000) {
          wx.setStorageSync('appId', data.data.data.appId)
        }
      },
      fail: function () {
      },
    })
    var memberId = wx.getStorageSync("memberId");
    if (memberId == "") {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            wx.request({
              url: 'https://mtgo.cssnb.com/api/fastlogin/login',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: { code: res.code },
              method: 'POST',
              success: function (data) {
                console.log('授权',data)
                if (data.data.code == 1) {
                  wx.setStorageSync('openid', data.data.data.openid)
                  wx.setStorageSync('session_key', data.data.data.session_key)
                  wx.reLaunch({
                    url: '../homepage/homepage'
                  })
                }
              },
              fail: function () {
              },
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
    
  },
  // 判断是否是IPX
  Ipx: function (e) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          that.globalData.isIpx = true;
        } else { 
        }
      }
    })
  },
  globalData: {
    DoBaseUrl:'https://mtgo.cssnb.com/',
    isIpx: false, //IPX
    msg:'努力加载中',
    share:{
      title: "老赖失信地图",
      path: 'pages/index/index',
      imageUrl:'../img/share.jpg'
    }
  },
})