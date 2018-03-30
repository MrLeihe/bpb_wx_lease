var util = require("../../utils/util.js");
const app = getApp()
//console.log(222)

Page({
  data: {
    loginUrl: app.globalData.baseUrl + 'leaseServer/user/login',
    loginBtnTxt: "登录",
    loginBtnBgBgColor: "#ff5539",
    btnLoading: false,
    disabled: false,
    inputUserName: '',
    inputPassword: '',
    userInfo: app.globalData.userInfo,
    logIcon: "../../image/logIcon.png",
    pwdIcon: "../../image/pwdIcon.png",
    usernameText: '',
    passwordText: '',
  },

  onLoad: function (options) {
    //如果检测到本地存储了账号密码，直接填入
    this.getLoginInfo();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  formSubmit: function (e) {
    var param = e.detail.value;
    //this.redirectTo();
    this.mysubmit(param);
  },

  //保存账号密码
  saveLoginInfo: function (username, password) {
    try {
      wx.setStorageSync('username', username);
      wx.setStorageSync('password', password);
      console.log('保存账号密码成功')
    } catch (e) {
      console.log(e);
    }
  },

  //获取账号密码
  getLoginInfo: function () {
    try {
      var username = wx.getStorageSync('username');
      var password = wx.getStorageSync('password');
      this.setData({
        usernameText: username,
        passwordText: password,
      });
    } catch (e) {
      console.log(e);
    }
  },

  mysubmit: function (param) {
    var loginData = {};
    loginData.username = param.username.trim();
    loginData.password = param.password.trim();
    var flag = this.checkUserName(param) && this.checkPassword(param);
    var that = this;
    if (flag) {
      this.setLoginData1();
      wx.request({
        url: that.data.loginUrl,
        data: loginData,
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          if (res.data.code == 1000 && res.data.data.status == 1) {
            app.globalData.server_id = res.data.data.server_id;
            console.log('id---------->' + app.globalData.server_id)
            //保存账号和密码
            that.saveLoginInfo(loginData.username, loginData.password);
            wx.showToast({
              title: "登录成功"
            })
            setTimeout(function () {
              that.redirectTo(res.data.data);
            }, 1000);
          } else {
            console.log(res.data)
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.msg
            });
          }
        },
        fail: res => {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '网络错误'
          });
        },
        complete: function(){
          that.setLoginData2();
        }
      })
    }
  },
  setLoginData1: function () {
    this.setData({
      loginBtnTxt: "登录中",
      disabled: !this.data.disabled,
      loginBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    });
  },
  setLoginData2: function () {
    this.setData({
      loginBtnTxt: "登录",
      disabled: !this.data.disabled,
      loginBtnBgBgColor: "#ff5539",
      btnLoading: !this.data.btnLoading
    });
  },
  checkUserName: function (param) {
    //var email = util.regexConfig().email;
    var inputUserName = param.username.trim();
    if (inputUserName != '' && inputUserName != null) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入账号'
      });
      return false;
    }
  },
  checkPassword: function (param) {
    var userName = param.username.trim();
    var password = param.password.trim();
    if (password.length <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入密码'
      });
      return false;
    } else {
      return true;
    }
  },

  redirectTo: function (param) {
    //需要将param转换为字符串
    //		param = JSON.stringify(param);
    wx.redirectTo({
      url: '../register/register',
    })
  }
})