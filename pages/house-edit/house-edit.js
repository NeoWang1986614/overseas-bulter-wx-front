// pages/house-edit/house-edit.js
const app = getApp()
const config = require('../../common/config.js')
const map = require('../../common/map.js')
const houseEntity = require('../../entity/house.js')

Page({

  /**
   * Page initial data
   */
  data: {
    navigateTitle: '',
    currentName: '',
    editType: '',
    houseInfo: {},
    addressDetail: '',

    currentIsDefault: false,
    isDefaultIconUrl: '',

    addressValueArrayForPicker: [],
    addressTextArrayForPicker: [],
    addressTextShowCurrent: '<未选择>',
    addressIndexArrayCurrent: [],

    layoutValueArrayForPicker: [],
    layoutTextArrayForPicker: [],
    layoutTextShowCurrent: '<未选择>',
    layoutIndexCurrent: null,
  },

  /**
   * Lifecycle function--Called when page load
   */
  generateAddressTextArrayForMultiPicker: function() {
    var valueArr = this.data.addressValueArrayForPicker;
    var result = [];
    for (let i = 0; i < valueArr.length; i++){
      var valueSubArr = valueArr[i];
      var subResult = [];
      for (let j = 0; j < valueSubArr.length; j++){
        subResult.push(map.text[valueSubArr[j]]);
      }
      result.push(subResult);
    }
    return result;
  },
  generateAddressIndexArrayCurrent: function() {
    var originArr = [
      this.data.houseInfo.country,
      this.data.houseInfo.province,
      this.data.houseInfo.city
    ];
    console.log('generateAddressIndexArrayCurrent', result);
    var result = [];
    for (let i = 0; i < originArr.length; i++) {
      var originValue = originArr[i];
      result.push(this.data.addressValueArrayForPicker[i].indexOf(originValue));
    }
    console.log('generateAddressIndexArrayCurrent', result);
    return result;
  },
  generateLayoutTextArrayForPicker: function () {
    var originArr = this.data.layoutValueArrayForPicker;
    var result = [];
    for (let i = 0; i < originArr.length; i++) {
      result.push(map.text[originArr[i]]);
    }
    return result;
  },
  generateLayoutIndexCurrent: function () {
    var originValue = this.data.houseInfo.layout;
    return this.data.layoutValueArrayForPicker.indexOf(originValue);
  },
  onLoad: function (options) {
    console.log(options);
    this.data.addressValueArrayForPicker = [
      app.globalData.countryValueArray,
      app.globalData.provinceValueArray,
      app.globalData.cityValueArray
    ];
    this.data.layoutValueArrayForPicker = app.globalData.layoutValueArray;

    this.setData({
      addressTextArrayForPicker: this.generateAddressTextArrayForMultiPicker(),
      layoutTextArrayForPicker: this.generateLayoutTextArrayForPicker()
    });

    this.data.editType = options['type'];
    if (this.data.editType == 'add') {
      this.data.navigateTitle = '添加新房产';
    }else{
      this.data.navigateTitle = '编辑房产';
      if(!options.hasOwnProperty('index')){
        return;
      }
      this.data.houseInfo = app.globalData.houses[options.index];

      /*实始化address picker 和 layout picker数据*/
      this.setData({
        currentName: this.data.houseInfo.name,
        addressDetail: this.data.houseInfo.address,
        addressIndexArrayCurrent: this.generateAddressIndexArrayCurrent(),
        layoutIndexCurrent: this.generateLayoutIndexCurrent()
      });
      this.updateTextShowCurrent();
      this.updateAddressTextShowCurrent();
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    console.log("onShow");
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    });
    this.updateIsDefaultUrl(); 
    // this.updateCurrentSelect();
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  onAddressMultiPickerChange: function (e) {
    console.log(e);
    this.data.addressIndexArrayCurrent = e.detail.value;
    this.updateAddressTextShowCurrent();
  },
  onLayoutPickerChange: function (e) {
    console.log(e);
    this.data.layoutIndexCurrent = e.detail.value;
    this.updateTextShowCurrent();
  },
  updateTextShowCurrent: function() {
    this.setData({
      layoutTextShowCurrent: this.data.layoutTextArrayForPicker[this.data.layoutIndexCurrent]
    });
  },
  updateAddressTextShowCurrent: function () {
    console.log('updateAddressTextShowCurrent', this.data.addressTextArrayForPicker);
    var tempText = this.data.addressTextArrayForPicker[0][this.data.addressIndexArrayCurrent[0]] 
    + this.data.addressTextArrayForPicker[1][this.data.addressIndexArrayCurrent[1]] 
    + this.data.addressTextArrayForPicker[2][this.data.addressIndexArrayCurrent[2]]
    console.log(tempText);
    this.setData({
      addressTextShowCurrent: tempText
    });
  },
  onNameInput: function(e) {
    console.log(e);
    this.setData({
      currentName: e.detail.value
    });
  },
  onAddressInput: function (e) {
    console.log(e);
    this.setData({
      addressDetail: e.detail.value
    });
  },
  onIsDefaultClick: function (e) {
    this.data.currentIsDefault = !this.data.currentIsDefault; 
    this.updateIsDefaultUrl(); 
  },
  updateIsDefaultUrl: function () {
    this.setData({
      isDefaultIconUrl: this.data.currentIsDefault ? '../../images/check.png' : '../../images/uncheck.png'
    });
  },
  clearIsDefaultForAllHouses: function () {
    var houses = app.globalData.houses;
    for (let i = 0; i < houses.length; ++i) {
      if (houses[i].isDefault) {
        houses[i] = false;
        break;
      }
    }
  },
  saveSuccess: function(res) {
    if (200 == res.statusCode) {
      if (this.data.currentIsDefault) {
        app.setDefaultHouseUid(res.data.uid);
      }
      wx.showToast({
        title: '保存成功!',
        icon: 'success',
        duration: 1500,
        success: function () {
          console.log('toast success !');
          setTimeout(function () {
            wx.navigateBack({
            });
          }, 1500);
        }
      });
    } else {
      wx.showToast({
        title: '网络错误!',
      })
    }
  },
  checkHouseInfoValid: function() {
    var toastTitle = '';
    if (0 == this.data.currentName.length){
      toastTitle = '名字不能为空!';
    }else if (0 == this.data.addressIndexArrayCurrent.length) {
      toastTitle = '请选择地址!';
    }else if (!this.data.layoutIndexCurrent) {
      toastTitle = '请选择户型!';
    }

    if ('' == toastTitle){
      return true;
    }

    wx.showToast({
      title: toastTitle,
      icon: 'none',
      duration: 1500
    });

    return false;

  },
  onSaveClick: function (e) {

    if (!this.checkHouseInfoValid()){
      return;
    }

    this.data.houseInfo.name = this.data.currentName;
    this.data.houseInfo.country = this.data.addressValueArrayForPicker[0][this.data.addressIndexArrayCurrent[0]]; 
    this.data.houseInfo.province = this.data.addressValueArrayForPicker[1][this.data.addressIndexArrayCurrent[1]];
    this.data.houseInfo.city = this.data.addressValueArrayForPicker[2][this.data.addressIndexArrayCurrent[2]];
    this.data.houseInfo.address = this.data.addressDetail;
    this.data.houseInfo.layout = this.data.layoutValueArrayForPicker[this.data.layoutIndexCurrent];
    this.data.houseInfo.ownerId = app.globalData.loginInfo.userId;

    console.log('房产信息:', this.data.houseInfo);

    if ('add' == this.data.editType) {
      this.addHouse( res => {
        console.log(res);
        this.saveSuccess(res);
      });
    } else {
      this.updateHouse( res => {
        console.log(res);
        this.saveSuccess(res);
      });
    }
  },
  addHouse: function (callback) {
    wx.request({
      url: config.generateFullUrl('/house'),
      method: 'POST',
      data: houseEntity.convertHouseObject(this.data.houseInfo),
      success: function (res) {
        if (callback) {
          callback(res)
        }
      }
    })
  },
  updateHouse: function (callback) {
    wx.request({
      url: config.generateFullUrl('/house'),
      method: 'PUT',
      data: houseEntity.convertHouseObject(this.data.houseInfo),
      success: function (res) {
        if (callback) {
          callback(res)
        }
      }
    })
  }
  
})