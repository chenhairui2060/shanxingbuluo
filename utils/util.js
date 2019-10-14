//当前时间-数组模式 年月日 时分秒
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const nowTime = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')//整合时间
  const time = {
    'year': year, 'month': month, 'day': day, 'hour': hour, 'minute': minute, 'second': second, 'nowTime': nowTime
  }
  return time
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getDateStr(date) {
  if (!date) return '';
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}
/**
 * 生成GUID序列号
 * @returns {string} GUID
 */
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 记录日志
 * @param {Mixed} 记录的信息
 * @returns {Void}
 */
function log(msg) {
  if (!msg) return;
  if (getApp().settings['debug'])
    console.log(msg);
  let logs = wx.getStorageSync('logs') || [];
  logs.unshift(msg)
  wx.setStorageSync('logs', logs)
}

/**
 * @param {Function} func 接口
 * @param {Object} options 接口参数
 * @returns {Promise} Promise对象
*/
function promiseHandle(func, options) {
  options = options || {};
  return new Promise((resolve, reject) => {
    if (typeof func !== 'function')
      reject();
    options.success = resolve;
    options.fail = reject;
    func(options);
  });
}
function buttonClicked(self) {
  self.setData({
    buttonClicked: true
  })
  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 2000)
}
var showBusy = function (o) {
  return wx.showToast({
    title: o,
    icon: "loading",
    duration: 2e3
  })
},
  showSuccess = function (o, s) {
    console.log(o, s)
    return wx.showToast({
      title: o,
      icon: "success",
      duration: 2e3,
      success: function () {
        "function" == typeof s && s()
      }
    })
  },

  showModel = function (o, n, s) {
    wx.hideToast(), wx.showModal({
      title: o,
      content: n,
      showCancel: !1,
      success: function (o) {
        o.confirm && "function" == typeof s && s()
      }
    })
  },

  showLoading = function (o) {
    return wx.showLoading({
      title: o,
      icon: "loading",
      mask: !0,
      duration: 1e4
    })
  },
  showTost = function (t, s) {
    return wx.showToast({
      title: t,
      icon: "none",
      duration: 2e3,
      success: function () {
        "function" == typeof s && s()
      }
    })
  },
  hideLoading = function () {
    wx.hideLoading()
  },

  showWarning = function (o, n) {
    wx.hideToast(), wx.showModal({
      title: o,
      content: n,
      showCancel: !1
    })
  },

  showConfirm = function (o, n, s) {
    wx.hideToast(), wx.showModal({
      title: o,
      content: n,
      success: function (o) {
        o.confirm && "function" == typeof s && s()
      }
    })
  };
//多张图片上传
function uploadimg(data) {
  var that = this,
    i = data.i ? data.i : 0,//当前上传的哪张图片
    success = data.success ? data.success : 0,//上传成功的个数
    fail = data.fail ? data.fail : 0;//上传失败的个数
  wx.uploadFile({
    url: data.url,
    filePath: data.path[i],
    name: 'file',//这里根据自己的实际情况改
    formData: null,//这里是上传图片时一起上传的数据
    success: (resp) => {
      success++;//图片上传成功，图片上传成功的变量+1
      console.log(resp)
      console.log(i);
      //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
    },
    fail: (res) => {
      fail++;//图片上传失败，图片上传失败的变量+1
      console.log('fail:' + i + "fail:" + fail);
    },
    complete: () => {
      console.log(i);
      i++;//这个图片执行完上传后，开始上传下一张
      if (i == data.path.length) {   //当图片传完时，停止调用          
        console.log('执行完毕');
        console.log('成功：' + success + " 失败：" + fail);
      } else {//若图片还没有传完，则继续调用函数
        console.log(i);
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data);
      }
    }
  });
}
module.exports = {
  formatTime: formatTime,
  buttonClicked: buttonClicked,
  uploadimg: uploadimg,
  showBusy: showBusy, //加载框
  showSuccess: showSuccess, //成功
  showModel: showModel,
  showLoading: showLoading,
  hideLoading: hideLoading,
  showWarning: showWarning,
  showConfirm: showConfirm,
  guid: guid,
  log: log,
  showTost: showTost,
  promiseHandle: promiseHandle,
  getDateStr: getDateStr,
  formatNumber: formatNumber
}
