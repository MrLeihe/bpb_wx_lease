// pages/photoAudit/photoAudit.js
const app = getApp();
var sourceType = [
  ['camera'],
  ['album'],
  ['camera', 'album']
]
var sizeType = [
  ['compressed'],
  ['original'],
  ['compressed', 'original']
]
var typeArray = ['REGISTER', 'CHECK']
var uploadType = ['front_img', 'inner_img', 'left_img', 'right_img']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadUrl: app.globalData.baseUrl + 'leaseServer/upload/regist_img',
    confirmUrl: app.globalData.baseUrl + 'leaseServer/commit/regist_info',
    disabled: false,
    btnLoading: false,
    auditBtnBgBgColor: '#ff5539',
    auditBtnText: '提交',
    showPlaceholder1: true,
    showPlaceholder2: true,
    showPlaceholder3: true,
    showPlaceholder4: true,
    imageSrc1: '',
    imageSrc2: '',
    imageSrc3: '',
    imageSrc4: '',
    showLoading1: false,
    showLoading2: false,
    showLoading3: false,
    showLoading4: false,
    typeValue: 1,
    car_id: '',
    ad_id: '',
    server_id: '',
    //检测的时候上传
    check_id: '',
    //预约上传
    time_id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var typeValue = options.typeValue;
    if (typeValue == typeArray[0]) {
      this.setData({
        typeValue: 1
      })
    } else if (typeValue == typeArray[1]) {
      this.setData({
        typeValue: 2
      })
    }
    this.setData({
      car_id: options.car_id,
      ad_id: options.ad_id,
      server_id: app.globalData.server_id,
    })
  },

  /**
   * 选择图片
   */
  chooseImage: function (params) {
    var clickId = params.target.id;
    var that = this;
    wx.chooseImage({
      sourceType: sourceType[2],
      sizeType: sizeType[0],
      count: 1,
      success: function (res) {
        console.log(res)
        //上传图片
        that.showLoadingView(clickId);
        that.uploadImage(res.tempFilePaths[0], clickId);
      }
    })
  },

  showLoadingView: function (clickId) {
    var that = this
    if (clickId == uploadType[0]) {
      that.setData({
        showLoading1: true
      })
    } else if (clickId == uploadType[1]) {
      that.setData({
        showLoading2: true
      })
    } else if (clickId == uploadType[2]) {
      that.setData({
        showLoading3: true
      })
    } else if (clickId == uploadType[3]) {
      that.setData({
        showLoading4: true
      })
    }
  },

  /**
   * 上传图片
   */
  uploadImage: function (filePath, clickId) {
    var that = this;
    var filename;
    if (filePath == undefined || filePath == '') {
      return;
    } else {
      if (clickId == uploadType[0]) {
        filename = uploadType[0];
      } else if (clickId == uploadType[1]) {
        filename = uploadType[1];
      } else if (clickId == uploadType[2]) {
        filename = uploadType[2];
      } else if (clickId == uploadType[3]) {
        filename = uploadType[3];
      }
      console.log('filename--------->' + filename);
      wx.uploadFile({
        url: that.data.uploadUrl,
        filePath: filePath,
        name: filename,
        formData: {
          car_id: that.data.car_id,
          ad_id: that.data.ad_id,
          server_id: that.data.server_id,
        },
        success: function (res) {
          console.log(res)
          var resdata = JSON.parse(res.data);
          if (resdata.code == 1000) {
            that.loadImageSrc(filePath, clickId);
          } else {
            console.log('图片上传失败')
            that.hideLoadingView(clickId)
          }
        },
      })
    }
  },

  /**
   * 上传成功后才设置图片
   */
  loadImageSrc: function (filePath, clickId) {
    var that = this;
    if (clickId == uploadType[0]) {
      that.setData({
        showPlaceholder1: false,
        imageSrc1: filePath,
        showLoading1: false
      })
    } else if (clickId == uploadType[1]) {
      that.setData({
        showPlaceholder2: false,
        imageSrc2: filePath,
        showLoading2: false
      })
    } else if (clickId == uploadType[2]) {
      that.setData({
        showPlaceholder3: false,
        imageSrc3: filePath,
        showLoading3: false
      })
    } else if (clickId == uploadType[3]) {
      that.setData({
        showPlaceholder4: false,
        imageSrc4: filePath,
        showLoading4: false
      })
    }
  },

  hideLoadingView: function (clickId) {
    var that = this;
    if (clickId == uploadType[0]) {
      that.setData({
        showLoading1: false
      })
    } else if (clickId == uploadType[1]) {
      that.setData({
        showLoading2: false
      })
    } else if (clickId == uploadType[2]) {
      that.setData({
        showLoading3: false
      })
    } else if (clickId == uploadType[3]) {
      that.setData({
        showLoading4: false
      })
    }
  },

  /**
   * 提交审核
   */
  commitAudit: function () {
    var that = this
    if (!that.checkImage(that.data.imageSrc1, '请拍摄车辆正面照片')) {
      return;
    }
    if (!that.checkImage(that.data.imageSrc2, '请拍摄车内照片')) {
      return;
    }
    if (!that.checkImage(that.data.imageSrc3, '请拍摄车身左侧照片')) {
      return;
    }
    if (!that.checkImage(that.data.imageSrc4, '请拍摄车身右侧照片')) {
      return;
    }
    that.redirectTo();
  },

  redirectTo: function () {
    var that = this;
    var typeValue = that.data.typeValue;
    if (typeValue == 1) {
      that.sendRequest();
    } else if (typeValue == 2) {
      wx.redirectTo({
        url: '../inspect/inspect?user_id=' + that.data.car_id + '&ad_id=' + that.data.ad_id + '&server_id=' + that.data.server_id + '&check_id=' + that.data.check_id,
      })
    }
  },

  /**
   * 发起请求
   */
  sendRequest: function () {
    var that = this; 
    that.setCommitStatus();
    var requestData = {};
    requestData.car_id = that.data.car_id;
    requestData.ad_id = that.data.ad_id;
    requestData.server_id = that.data.server_id;
    wx.request({
      url: that.data.confirmUrl,
      data: requestData,
      success: function (res) {
        if(res.data.code == 1000){
          wx.showToast({
            title: "提交成功"
          })
          setTimeout(function () {
            that.goNavigatinBack();
          }, 1000);
          
        }else{
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '网络错误'
        });
      },
      complete: function () {
        that.changeCommitStatus();
      },
    })
  },

  //回到上一页
  goNavigatinBack: function(){
    wx.redirectTo({
      url: '../register/register',
    })
  },

  setCommitStatus: function () {
    this.setData({
      auditBtnText: "提交中",
      disabled: !this.data.disabled,
      auditBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    })
  },

  changeCommitStatus: function () {
    this.setData({
      auditBtnText: "提交",
      disabled: !this.data.disabled,
      auditBtnBgBgColor: "#ff5539",
      btnLoading: !this.data.btnLoading
    })
  },

  checkImage: function (imageSrc, tipsContent) {
    if (imageSrc == '' || imageSrc == undefined || imageSrc == null) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: tipsContent
      });
      return false;
    }
    return true;
  },

  //关闭页面
  closePage: function(){
    wx.showModal({
      title: '提示',
      content: '确定要返回首页吗',
      success: function(res){
        if(res.confirm){
          wx.redirectTo({
            url: '../register/register',
          })
        }else{
          //do nothing
        }
      }
    })
  },

})