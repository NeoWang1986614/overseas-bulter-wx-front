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
    filtedHouses: [],
    housesDescriptions: [],
    isHousesEmpty: true,
    filtedHouseCurrentIndex: utils.invalidIndex,
    isShowHouseModal: false,
    /* real price*/
    computedPrice: 0.0, 

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
  getCurrentLayoutOption:function(){
    for (let i = 0; i < this.data.layoutOptions.length; i++){
      if (this.data.layoutOptions[i].isChecked){
        return this.data.layoutOptions[i].value;
      }
    }
  },
  housesFilter: function (houses){
    if(this.data.isHomeDecoration && 0 != houses.length){
      var ret = [];
      var currentLayoutOption = this.getCurrentLayoutOption();
      console.log('currentLayoutOption = ', currentLayoutOption);
      for(let i=0; i< houses.length; i++){
        if (currentLayoutOption == houses[i].layout){
          ret.push(houses[i]);
        }
      }
      console.log('housesFilter = ', ret);
      return ret;
    }
    return houses;
  },
  /*当前服务类型判断*/
  checkIsHomeDecoration:function(){
    return 'home-decoration' == this.data.serviceType;
  },
  checkIsHouseMaintain: function () {
    return 'house-maintain' == this.data.serviceType;
  },
  checkIsHouseRent: function () {
    return 'house-rent' == this.data.serviceType;
  },
  updateFiltedHouses: function(){
    var filtedHouses = this.housesFilter(this.data.houses);
    this.setData({
      filtedHouses: filtedHouses,
      housesDescriptions: utils.generateHousesDescriptions(filtedHouses),
      isHousesEmpty: 0 == filtedHouses.length
    });
    
    console.log('select index = ', this.data.filtedHouseCurrentIndex);
  },
  getHousesAsync: function (callback) {
    app.getHousesByOwnerIdAsync(app.globalData.loginInfo.userId, 0, this.data.constInvalidIndex, houses => {
      console.log('getHousesAsync', houses);
      this.setData({
        houses: houses
      });
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
  onShow: function () {
    this.setNavigationBarTitle();
    this.updateServices(_ => {
    });

    this.getHousesAsync(_ => {
      if (this.data.isShowHouseModal){
        this.updateFiltedHouses();
      }
    });
    console.log('filtedHouseCurrentIndex = ', this.data.filtedHouseCurrentIndex);
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
  /*save*/
  checkHouseValid: function () {
    if (utils.invalidIndex == this.data.filtedHouseCurrentIndex) {
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
                this.setData({
                  filtedHouseCurrentIndex: this.data.constInvalidIndex
                });
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
      houseNation: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].nation,
      houseAdLevel1: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].adLevel1,
      houseAdLevel2: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].adLevel2,
      houseAdLevel3: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].adLevel3,
      houseStreetName: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].streetName,
      houseStreetNum: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].streetNum,
      houseBuildingNum: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].buildingNum,
      houseRoomNum: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].roomNum,
      houseAddress: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].address,
      houseLayout: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].layout,
      houseArea: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].area,
      price: this.data.computedPrice,
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
      this.updateFiltedHouses();
      this.setData({
        isShowHouseModal: true
      });
      console.log('computedPrice = ', this.data.computedPrice);
    });
  },
  onHouseModalCancel: function(){
    console.log('cancel');
    this.setData({
      filtedHouseCurrentIndex: this.data.constInvalidIndex,
      isShowHouseModal: false
    });
  },
  onHouseModalConfirmClick: function(){
    if(0 == this.data.filtedHouses.length){
      this.navigateToAddHouse();
    }else{
      this.submitOrder();
    }
  },
  /*价格计算*/
  computeHomeDecorationPrice: function(){
    var ret = 0.0;
    var selectedHouse = this.data.filtedHouses[this.data.filtedHouseCurrentIndex];
    switch (this.getCurrentLayoutOption()) {
      case 'studio':
        ret = utils.computeHomeDecorationPrice(selectedHouse.area, 20.0, this.data.service.price, 500.0);
        break;
      case 'one-bedroom':
        ret = utils.computeHomeDecorationPrice(selectedHouse.area, 30.0, this.data.service.price, 500.0);
        break;
      case 'two-bedroom':
        ret = utils.computeHomeDecorationPrice(selectedHouse.area, 40.0, this.data.service.price, 500.0);
        break;
      default:
        break;
    }
    return ret;
  },
  computeHouseMaintainPrice:function(){
    var ret = 0.0;
    var selectedHouse = this.data.filtedHouses[this.data.filtedHouseCurrentIndex];
    switch (selectedHouse.layout) {
      case 'studio':
        ret = 1000.0;
        break;
      case 'one-bedroom':
        ret = 3000.0;
        break;
      case 'two-bedroom':
        ret = 4000.0;
        break;
      default:
        break;
    }
    return ret;
  },
  computePrice: function(){
    var retPrice = 0.0
    if (this.checkIsHomeDecoration()){
      retPrice = this.computeHomeDecorationPrice();
    }else if(this.checkIsHouseMaintain){
      retPrice = this.computeHouseMaintainPrice();
    }else if (this.checkIsHouseMaintain) {
      //nothing;
    }
    this.setData({
      computedPrice: retPrice
    });
  },
  onHouseRadioChange: function(e){
    console.log('onHouseRadioChange e=', e);
    var clickedIndex = e.detail.value;
    this.setData({
      filtedHouseCurrentIndex: clickedIndex
    });
    this.computePrice();
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