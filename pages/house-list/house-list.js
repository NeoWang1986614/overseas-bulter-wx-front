// pages/house-list/house-list.js
const app = getApp()
const http = require('../../utils/http.js')
const utils = require('../../utils/util.js')
const map = require('../../common/map.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    map: map,
    houseDealType: '',
    isHouseRent: false,
    isHouseSale: false,
    houses: [],
    currentHouseId: '',
    isShowModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  parseOptions: function (options) {
    if (options && options.hasOwnProperty('type')) {
      this.setData({
        houseDealType: options['type']
      });
      console.log('parseOptions type=');
      console.log(this.data.houseDealType);
      this.setData({
        isHouseRent: 'house-rent' == this.data.houseDealType,
        isHouseSale: 'house-sale' == this.data.houseDealType
      });
    }
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
  housesFilter: function(houses){
    if(0==houses.length){
      return [];
    }
    var ret = [];
    for(var i=0; i<houses.length; i++){
      if(houses[i].status == 'home-decoration#completed'){
        ret.push(houses[i]);
      }
    }
    console.log('housesFilter ret = ');
    console.log(ret);
    return ret;
  },
  makeAddresForHouses: function (arr) {
    if (0 == arr.length) {
      return;
    }
    for (var i = 0; i < arr.length; i++) {
      arr[i].address = utils.getHouseAddress(arr[i]);
    }
  },
  getHousesAsync: function(){
    app.getHousesByOwnerIdAsync(
      app.globalData.loginInfo.userId,
      0,
      1000,
      res => {
        var houseArr = this.housesFilter(res);
        this.makeAddresForHouses(houseArr);
        this.setData({
          houses: houseArr
        });
    });
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '家装完成房源',
    });
    this.getHousesAsync();
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
  onHouseItemClick: function(e){
    this.data.currentHouseId = e.currentTarget.dataset.uid;
    this.setData({
      isShowModal: true
    });
  },
  onModalCancel: function(){
    this.setData({
      isShowModal: false
    });
  },
  onContactClick: function(){
    this.setData({
      isShowModal: false
    });
  },
  onProxyRentClick: function(){
    wx.navigateTo({
      url: '../../pages/house-deal-detail/house-deal-detail?type=' + this.data.houseDealType + '&houseId=' + this.data.currentHouseId + '&source=proxy',
    });
    this.setData({
      isShowModal: false
    });
  },
  onSelfRentClick: function(){
    wx.navigateTo({
      url: '../../pages/house-deal-detail/house-deal-detail?type=' + this.data.houseDealType + '&houseId=' + this.data.currentHouseId + '&source=self',
    });
    this.setData({
      isShowModal: false
    });
  }
})