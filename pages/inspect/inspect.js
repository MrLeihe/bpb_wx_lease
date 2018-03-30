// pages/inspect/inspect.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkInfoUrl: app.globalData.baseUrl + 'server/upload/ad_check_info',
    //参数
    user_id: '',
    ad_id: '',
    server_id: '',
    check_id: '',
    outsideItems: [{ value: '无车身广告', name: '无车身广告' },
      { value: '膜已不在', name: '膜已不在'},
      { value: '严重磨损', name: '严重磨损' },
      { value: '轻度磨损', name: '轻度磨损' },
      { value: '正常', name: '正常' },
      { value: '优良', name: '优良' },],
    inspectBtnText: '提交',
    //1广告合格 2广告不合格
    qualfiedResult: 0, 
    outsideResult: '',
    insideResult: '',
    disabled: false,
    inspectBtnBgBgColor: '#ff5539',
    btnLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user_id: options.user_id,
      ad_id: options.ad_id,
      server_id: options.server_id,
      check_id: options.check_id,
    })
  },

  /**
   * 广告是否合格
   */
  radioQualfiedChange: function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      qualfiedResult: e.detail.value,
    })
  },

  /**
   * 车身完整性
   */
  radioOutsideChange: function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      outsideResult: e.detail.value,
    })
  },

  /**
   * 车内广告完整性
   */
  radioInsideChange: function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      insideResult: e.detail.value,
    })
  },

  inspectCommit: function(params){
    console.log(params)
    if (this.data.qualfiedResult == 0){
      this.showTipModal('请确认广告是否合格');
      return;
    }
    if (this.data.outsideResult == '') {
      this.showTipModal('请确认车身广告完整性');
      return;
    }
    if (this.data.insideResult == '') {
      this.showTipModal('请确认车内广告完整性');
      return;
    }
    var remark = params.detail.value.remark.trim()
    this.sendRequest(remark);
  },

  showTipModal: function(tipContent){
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: tipContent,
    });
  },

  sendRequest: function(remark){
    var that = this;
    that.setCommitStatus();
    console.log('user_id------>' + that.data.user_id);
    //设置参数
    var params = {};
    params.user_id = that.data.user_id;
    params.ad_id = that.data.ad_id;
    params.server_id = that.data.server_id;
    params.server_check_result = that.data.qualfiedResult;
    params.outcar_ad_comment = that.data.outsideResult;
    params.incar_ad_comment = that.data.insideResult;
    params.comment = remark;
    params.check_id = that.data.check_id;
    wx.request({
      url: that.data.checkInfoUrl,
      data: params,
      success: function(res){
        if (res.data.code == 1000) {
          wx.showToast({
            title: "提交成功"
          })
          setTimeout(function () {
            that.redirectTo();
          }, 1000);
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg
          });
        }
      },
      fail: function(res){
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '网络错误'
        });
      },
      complete: function(){
        that.resetCommitStatus();
      }
    })
  },

  redirectTo: function(){
    wx.redirectTo({
      url: '../register/register',
    })
  },

  setCommitStatus: function () {
    this.setData({
      inspectBtnText: "提交中",
      disabled: !this.data.disabled,
      inspectBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    })
  },

  resetCommitStatus: function () {
    this.setData({
      inspectBtnText: "提交",
      disabled: !this.data.disabled,
      inspectBtnBgBgColor: "#ff5539",
      btnLoading: !this.data.btnLoading
    })
  },

})