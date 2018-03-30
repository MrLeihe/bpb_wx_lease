var util = require("../../utils/util.js");
const app = getApp()
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

Page({
  data: {
    searchUrl: app.globalData.baseUrl + 'leaseServer/get/car_info',
    plate_no: "",
    textTips: "在搜索框内输入车牌号查询",
    sta: -1,
    leaseName: '',
    car_plate_number: '',
    appointment_time: '',
    actionText: '激活广告',
    showCarInfo: false,
    //判断登记还是检测(登记REGIST 检测CHECK)
    typeValue: typeArray[0],
    car_id: '',
    idList: [],
    nameList: [],
    sourceTypeIndex: '',
    car_color: '',
    car_brand: '',

    //键盘
    isKeyboard: false, //是否显示键盘
    specialBtn: false,
    tapNum: false, //数字键盘是否可以点击
    keyboardNumber: '1234567890',
    keyboardAlph: 'QWERTYUIOPASDFGHJKL巛ZXCVBNM',
    keyboard1:
    '京津沪冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁渝',
    keyboardValue: '',
    keyboard2: '',
    keyboard2For: ['完成'],
    textArr: [],
    textValue: '',
    isFocus: false, //输入框聚焦
    disabled: true,
  },

  onShow: function () {

  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },

  checkCarCode: function (code) {
    var carcode = code;
    if (util.isVehicleNumber(carcode)) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '输入的车牌号不合法'
      });
      return false;
    }
  },

  setAdCheckInfo: function () {
    var that = this;
    var typeValue = that.data.typeValue;
    if (typeValue == typeArray[0]) {
      this.setData({
        actionText: '激活广告',
        textTips: "该车辆需激活广告",
      })
    } else if (typeValue = typeArray[1]) {
      this.setData({
        actionText: '检测广告',
        textTips: "该车辆需检测广告",
      })
    }
  },

  actionClick: function () {
    var that = this;
    var adId = that.data.idList[that.data.sourceTypeIndex];
    if (adId == '' || adId == undefined){
      wx.showModal({
        title: '提示',
        content: '请选择广告',
        showCancel: false,
      })
      return false;
    }
    console.log('adid--------->' + adId);
    wx.navigateTo({
      url: '../photoAudit/photoAudit?typeValue=' + that.data.typeValue + '&car_id=' + that.data.car_id + '&ad_id=' + adId,
    })
    that.resetKeyboard();
  },

  resetKeyboard: function(){
    this.setData({
      isKeyboard: false, //是否显示键盘
      specialBtn: false,
      tapNum: false, //数字键盘是否可以点击
      keyboardNumber: '1234567890',
      keyboardAlph: 'QWERTYUIOPASDFGHJKL巛ZXCVBNM',
      keyboard1:
      '京津沪冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁渝',
      keyboardValue: '',
      keyboard2: '',
      keyboard2For: ['完成'],
      textArr: [],
      textValue: '',
      isFocus: false, //输入框聚焦
      disabled: true,
    })
  },

  /**
   * 键盘相关
   */
  tapKeyboard: function (e) {
    var self = this;
    //获取键盘点击的内容，并将内容赋值到textarea框中
    var tapIndex = e.target.dataset.index;
    var tapVal = e.target.dataset.val;
    var keyboardValue;
    var specialBtn;
    var tapNum;
    if (tapVal == '巛') {
      //说明是删除
      self.data.textArr.pop();
      if (self.data.textArr.length == 0) {
        //说明没有数据了，返回到省份选择键盘
        this.specialBtn = false;
        this.tapNum = false;
        this.keyboardValue = self.data.keyboard1;
      } else if (self.data.textArr.length == 1) {
        //只能输入字母
        this.tapNum = false;
        this.specialBtn = true;
        this.keyboardValue = self.data.keyboard2;
      } else {
        this.specialBtn = true;
        this.tapNum = true;
        this.keyboardValue = self.data.keyboard2;
      }
      self.data.textValue = self.data.textArr.join('');
      self.setData({
        textValue: self.data.textValue,
        keyboardValue: this.keyboardValue,
        specialBtn: this.specialBtn,
        tapNum: this.tapNum
      });
      self.search(self.data.textValue);
      return false;
    }
    if (self.data.textArr.length >= 8) {
      return false;
    }
    self.data.textArr.push(tapVal);
    self.data.textValue = self.data.textArr.join('');
    self.setData({
      textValue: self.data.textValue,
      keyboardValue: self.data.keyboard2,
      specialBtn: true
    });
    if (self.data.textArr.length > 1) {
      //展示数字键盘
      self.setData({
        tapNum: true
      });
    }
    self.search(self.data.textValue);
  },

  search: function (params) {
    var that = this;
    var plateNo = params;
    console.log('plate_no-------->' + plateNo);
    that.setData({
      textTips: "输入的车牌号长度不合法",
      sta: 0,
      plate_no: plateNo,
      showCarInfo: false,
    })
    if (plateNo.length >= 7 && plateNo.length <= 8) {
      that.setData({
        textTips: "正在查询...",
        sta: 0
      })
      wx.request({
        url: that.data.searchUrl,
        data: {
          plate_no: plateNo
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          if (res.data.code == 1000) {
            var dataBean = res.data.data;
            if (dataBean == null) {
              that.setData({
                textTips: "该车辆尚未登记广告",
                sta: 0,
                showCarInfo: false,
              })
            } else {
              that.setData({
                sta: -1,
                leaseName: dataBean.lease_company,
                car_plate_number: dataBean.plate_no,
                typeValue: typeArray[0],
                showCarInfo: true,
                car_id: dataBean.car_id,
                car_color: dataBean.car_color,
                car_brand: dataBean.car_brand,
              })
              var idList = [];
              var nameList = [];
              for(var key in dataBean.ads){
                idList.push(dataBean.ads[key].ad_id);
                nameList.push(dataBean.ads[key].ad_name);
              }
              that.setData({
                idList: idList,
                nameList: nameList,
              })
              //填充数据
              that.setAdCheckInfo();
              that.hideKeyboard();
            }
          } else {
            that.setData({
              textTips: res.data.msg,
              showCarInfo: false,
            })
          }
        },
        fail: res => {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '网络错误'
          });
        }
      })
    }
  },

  /**
   * 点击页面隐藏键盘事件
   */
  hideKeyboard: function () {
    var self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      if (self.data.textValue) {
        self.setData({
          isKeyboard: false
        });
      } else {
        self.setData({
          isKeyboard: false,
          isFocus: false
        });
      }
    }
  },

  bindFocus: function () {
    var self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      self.setData({
        isKeyboard: false,
        isFocus: true
      });
    } else {
      //说明键盘是隐藏的，再次点击显示键盘
      self.setData({
        isFocus: true,
        isKeyboard: true
      });
    }
  },

  showKeyboard: function () {
    var self = this;
    self.setData({
      isFocus: true,
      isKeyboard: true
    });
  },

  onReady: function () {
    var self = this;
    //将keyboard1和keyboard2中的所有字符串拆分成一个一个字组成的数组
    self.data.keyboard1 = self.data.keyboard1.split('');
    self.data.keyboard2 = self.data.keyboard2.split('');
    self.setData({
      keyboardValue: self.data.keyboard1
    });
  },
  onShow: function () {
    var self = this;
    self.setData({
      flag: false
    });
  },

  tapSpecBtn: function () {
    this.hideKeyboard();
  },

  switchAccount: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要退出当前账号吗？',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../login/login',
          })
        } else if (res.cancel) {
        }
      },
    })
  },

  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
});