// pages/service-detail-v1/service-detail-v1.js
const app = getApp()
const utils = require('../../utils/util.js')
const map = require('../../common/map.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*const*/
    map: map,
    serviceType: '',
    isHomeDecoration: false,
    constInvalidIndex: utils.invalidIndex,
    /*house data*/
    houses: [],
    housesDescriptions: [],
    isHousesEmpty: true,
    houseCurrentIndex: utils.invalidIndex,
    isShowHouseModal: false,
    /*service data*/
    services: [],
    service: {},
    layoutOptions: [
      {
        value: 'studio',
        isChecked: true
      },
      {
        value: 'one-bedroom',
        isChecked: false
      },
      {
        value: 'two-bedroom',
        isChecked: false
      }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  parseOptions: function (options) {
    if (options && options.hasOwnProperty('type')) {
      this.setData({
        serviceType: options['type'],
        isHomeDecoration: 'home-decoration' == options['type']
      });
      console.log('parseOptions serviceType=', this.data.serviceType);
    }
  },
  getHousesAsync: function (callback) {
    app.getHousesByOwnerIdAsync(app.globalData.loginInfo.userId, 0, this.data.constInvalidIndex, houses => {
      console.log('getHousesAsync', houses);
      this.setData({
        houses: houses, 
        housesDescriptions: utils.generateHousesDescriptions(houses),
        isHousesEmpty: 0 == houses.length
      });
      console.log('???? = ', this.data.housesDescriptions);
      if (callback) {
        callback();
      }
    });
  },
  onLoad: function (options) {
    this.parseOptions(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  setLayoutIsChecked: function(layout){
    if(0==this.data.layoutOptions.length){
      return;
    }
    for (var i = 0; i < this.data.layoutOptions.length; i++){
      this.data.layoutOptions[i].isChecked = false;
      if (layout == this.data.layoutOptions[i].value){
        this.data.layoutOptions[i].isChecked = true;
      }
    }
  },
  getLayoutIsChecked: function(){
    if(!this.data.isHomeDecoration){
      return 'all';
    }
    if (0 == this.data.layoutOptions.length) {
      return;
    }
    for (var i = 0; i < this.data.layoutOptions.length; i++) {
      if (this.data.layoutOptions[i].isChecked) {
        return this.data.layoutOptions[i].value;
      }
    }
  },
  onLayoutRadioChange: function(e){
    console.log('onLayoutRadioChange e= ', e);
    var layout = e.detail.value;
    this.setLayoutIsChecked(layout);
    this.updateServices();
  },
  updateServices: function (callback) {
    app.getServicesByTypeLayoutAsync(this.data.serviceType, this.getLayoutIsChecked(), serviceData => {
      console.log('getServicesAsync', serviceData);
      if (0 != serviceData.length){
        this.setData({
          services: serviceData,
          service: serviceData[0]
        });
      }
      if (callback) {
        callback();
      }
    });
  },
  setNavigationBarTitle: function () {
    wx.setNavigationBarTitle({
      title: map.text[this.data.serviceType] + ('other-service' == this.data.serviceType ? '' : '服务')
    });
  },
  getCurrentHouseIndexByDefault: function () {
    if (0 == this.data.houses) {
      return utils.invalidIndex;
    }
    var defaultHouseUid = app.getDefaultHouseUid();
    if (!defaultHouseUid) {
      return utils.invalidIndex;
    }
    for (let i = 0; i < this.data.houses.length; i++) {
      if (this.data.houses[i].uid == defaultHouseUid) {
        return i;
      }
    }
    return utils.invalidIndex;
  },
  onShow: function () {
    this.setNavigationBarTitle();
    this.updateServices(_ => {
      // this.changeHouseIndex(this.getCurrentHouseIndexByDefault());
    });

    this.getHousesAsync(_ => {
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  onHousePickerChange: function (e) {
    console.log(e);
    var index = e.detail.value;
    this.changeHouseIndex(index);
  },
  changeHouseIndex: function (index) {
    this.setData({
      houseCurrentIndex: index
    });
    this.changeServiceByHouse();
  },
  getServiceFromMultiServicesByHouseLayout: function () {
    if (this.data.houseCurrentIndex == utils.invalidIndex ||
      0 == this.data.houses.length ||
      0 == this.data.services.length) {
      return {};
    }
    var layout = this.data.houses[this.data.houseCurrentIndex].layout;
    for (let i = 0; i < this.data.services.length; i++) {
      if (layout == this.data.services[i].layout) {
        return this.data.services[i];
      }
    }
  },
  changeServiceByHouse: function () {
    var service = {};
    if (1 == this.data.services.length) {
      service = this.data.services[0];
    } else {
      service = this.getServiceFromMultiServicesByHouseLayout();
    }
    console.log('changeServiceByHouse:', service);
    this.setData({
      service: service
    });
  },
  /*save*/
  checkHouseValid: function () {
    if (utils.invalidIndex == this.data.houseCurrentIndex) {
      wx.showToast({
        title: '请选择房产!',
      });
      return false;
    }
    return true;
  },
  submitOrder: function (e) {
    console.log(e);
    if (!this.checkHouseValid()) {
      return;
    }
    app.checkUserInfoValid(res => {
      if (!res) {
        wx.showModal({
          content: '提交订单前,请先完善个人资料!',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#0f0',
          success: res => {
            console.log('confirm');
          }
        })
      } else {
        wx.showModal({
          content: '确定提交订单?',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000',
          confirmText: '确定',
          confirmColor: '#0f0',
          success: res => {
            console.log(res)
            if (true == res.confirm) {
              this.setData({
                isShowHouseModal: false
              });
              this.submitOrderAsync(ret => {
                console.log('order sumited :', ret);
                setTimeout(_ => {
                  wx.navigateTo({
                    url: '../../pages/order-detail/order-detail?uid=' + ret.id,
                  })
                }, 1500);
                wx.showToast({
                  title: '订单已提交!',
                }, 1500);
              });
            }
          }
        })
      }
    });
  },
  submitOrderAsync: function (callback) {
    app.submitOrderAsync({
      type: this.data.serviceType,
      content: this.data.service.content,
      houseNation: this.data.houses[this.data.houseCurrentIndex].nation,
      houseAdLevel1: this.data.houses[this.data.houseCurrentIndex].adLevel1,
      houseAdLevel2: this.data.houses[this.data.houseCurrentIndex].adLevel2,
      houseAdLevel3: this.data.houses[this.data.houseCurrentIndex].adLevel3,
      houseStreetName: this.data.houses[this.data.houseCurrentIndex].streetName,
      houseStreetNum: this.data.houses[this.data.houseCurrentIndex].streetNum,
      houseBuildingNum: this.data.houses[this.data.houseCurrentIndex].buildingNum,
      houseRoomNum: this.data.houses[this.data.houseCurrentIndex].roomNum,
      houseAddress: this.data.houses[this.data.houseCurrentIndex].address,
      houseLayout: this.data.houses[this.data.houseCurrentIndex].layout,
      price: this.data.service.price,
      status: 'non-payment',
      placerId: app.globalData.loginInfo.userId,
      accepterId: ''
    }, data => {
      console.log('submit success', data);
      if (callback) {
        callback(data);
      }
    });
  },
  onSelectHouseClick: function(){
    this.getHousesAsync(_ => {
      if(0 == this.data.services.length){
        wx.showToast({
          title: '暂时没有服务!',
        },1500);
        return;
      }
      this.setData({
        isShowHouseModal: true
      });
    });
  },
  onHouseModalCancel: function(){
    console.log('cancel');
    this.setData({
      isShowHouseModal: false
    });
  },
  onHouseModalConfirmClick: function(){
    if(0 == this.data.houses.length){
      this.navigateToAddHouse();
    }else{
      this.submitOrder();
    }
  },
  onHouseRadioChange: function(e){
    console.log('onHouseRadioChange e=', e);
    var clickedIndex = e.detail.value;
    this.data.houseCurrentIndex = clickedIndex;
  },
  onNavigateToAddHouse: function(){
    this.navigateToAddHouse();
  },
  navigateToAddHouse: function () {
    wx.navigateTo({
      url: '../../pages/house-edit/house-edit?type=add',
    });
  }
})