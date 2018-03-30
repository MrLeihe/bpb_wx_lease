//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    img: '../../image/index.png'
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    // 登录
    wx.login({

      success: res => {
        //var that = this;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          app.globalData.code = res.code
          wx.redirectTo({
            url: '../login/login',
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
})