
Page({
  data: {
    options:{},
    _options: ''//用来看二维码里面带的是什么值

  },
  onLoad: function (options) {
    let that=this;
    that.setData({
      _options: JSON.stringify(options),
      options: options
    })
    
  },
  //未授权进行操作
 

  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      wx.showToast({
        title: '登录中',
        icon: 'loading',
        mask: true
      })
      wx.setStorageSync('userInfo', e.detail.userInfo)
      //调用登录接口
      var code=''
      request.login().then(function (res) {
        code = res.code
      }).then(function (e) {
        request.getUserInfo().then(res=>{
          console.log('用户同意授权', res)
          if (code){
            app.ajaxpost(api.authorize, {
              'content-type': 'application/x-www-form-urlencoded'
            }, {
              "code": code,
              'iv': res['iv'],
              'encryptedData': res['encryptedData']
              }, function (e) { 
                console.log('3',e)
              }, function (e) {
                
              }, function (){})
          }
        })
      });
      

    } else {
      //用户按了拒绝按钮
      app.showToast('您拒绝了授权，请重新授权，查看更多内容')
    }
  },

});