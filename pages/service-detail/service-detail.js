// pages/service-detail/service-detail.js
const app = getApp()
const utils = require('../../utils/util.js')
const map = require('../../common/map.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*const*/
    serviceType: '',
    constInvalidIndex: utils.invalidIndex,
    /*house data*/
    houses: [],
    housesDescriptions: [],
    houseCurrentIndex: utils.invalidIndex,
    /*service data*/
    services: [],
    service: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  parseOptions: function(options){
    if(options && options.hasOwnProperty('type')){
      this.data.serviceType = options['type'];
    }
  },
  getHousesAsync: function(callback){
    app.getHousesAsync(0, this.data.constInvalidIndex, houses => {
      console.log(houses);
      this.data.houses = houses;
      this.setData({
        housesDescriptions: utils.generateHousesDescriptions(this.data.houses)
      });
      if(callback){
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
  getServicesAsync: function(callback) {
    app.getServicesByTypeAsync(this.data.serviceType, serviceData => {
      console.log(this.data.serviceType, serviceData);
      this.setData({
        services: serviceData
      });
      if(callback){
        callback();
      }
    });
  },
  setNavigationBarTitle: function() {
    wx.setNavigationBarTitle({
      title: map.text[this.data.serviceType] + '服务'
    });
  },
  getCurrentHouseIndexByDefault: function(){
    if(0 == this.data.houses){
      return utils.invalidIndex;
    }
    var defaultHouseUid = app.getDefaultHouseUid();
    if (!defaultHouseUid){
      return utils.invalidIndex;
    }
    for(let i=0; i < this.data.houses.length;i++){
      if(this.data.houses[i].uid == defaultHouseUid){
        return i;
      }
    }
    return utils.invalidIndex;
  },
  onShow: function () {
    this.setNavigationBarTitle();
    this.getHousesAsync(_=>{
      this.getServicesAsync(_ => {
        this.changeHouseIndex(this.getCurrentHouseIndexByDefault());
      });
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
  onShareAppMessage: function () {

  },
  onHousePickerChange: function(e) {
    console.log(e);
    var index = e.detail.value;
    this.changeHouseIndex(index);
  },
  changeHouseIndex: function(index) {
    this.setData({
      houseCurrentIndex: index
    });
    this.changeServiceByHouse();
  },
  getServiceFromMultiServicesByHouseLayout: function() {
    if (this.data.houseCurrentIndex == utils.invalidIndex ||
    0 == this.data.houses.length ||
    0 == this.data.services.length){
      return {};
    }
    var layout = this.data.houses[this.data.houseCurrentIndex].layout;
    for(let i=0; i < this.data.services.length; i++) {
      if (layout == this.data.services[i].layout){
        return this.data.services[i];
      }
    }
  },
  changeServiceByHouse: function() {
    var service = {};
    if(1 == this.data.services.length){
      service = this.data.services[0];
    }else{
      service = this.getServiceFromMultiServicesByHouseLayout();
    }
    console.log('changeServiceByHouse:',service);
    this.setData({
      service: service
    });
  },
  /*save*/
  checkHouseValid: function() {
    if (utils.invalidIndex == this.data.houseCurrentIndex){
      wx.showToast({
        title: '请选择房产!',
      });
      return false;
    }
    return true;
  },
  onSubmitOrderClick: function (e) {
    console.log(e);
    if (!this.checkHouseValid()){
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
      // houseId: this.data.houses[this.data.houseCurrentIndex].uid,
      houseCountry: this.data.houses[this.data.houseCurrentIndex].country,
      houseProvince: this.data.houses[this.data.houseCurrentIndex].province,
      houseCity: this.data.houses[this.data.houseCurrentIndex].city,
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
  }
})