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
    category: '',
    isSelectHouseDecoration: false,
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
    if (options && options.hasOwnProperty('category')) {
      this.setData({
        category: options['category']
      });
      console.log('parseOptions category=');
      console.log(this.data.category);
      this.setData({
        isDecoration: 'decoration' == this.data.category
      });
      console.log(this.data.isDecoration);
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
  isHouseDecorationCompleted: function(house){
    if (house.status == 'home-decoration#completed'){
      return true;
    }else{
      return false;
    }
  },
  sortHouses: function(houses){
    if(0==houses.length){
      return [];
    }
    var ret = [];
    var tops = [];
    var bottoms = [];
    for(var i=0; i<houses.length; i++){
      if (this.isHouseDecorationCompleted(houses[i])){
        tops.push(houses[i]);
      } else{
        bottoms.push(houses[i]);
      }
    }
    ret = tops.concat(bottoms);
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
        var houseArr = this.sortHouses(res);
        this.makeAddresForHouses(houseArr);
        this.setData({
          houses: houseArr
        });
    });
  },
  getNaviTitle: function(){
    // if(this.data.isDecoration){
    //   return '菲洋家装房源';
    // }else{
    //   return '普通房源';
    // }
    return '我的房产';
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: this.getNaviTitle(),
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
    var index = e.currentTarget.dataset.index;
    var house = this.data.houses[index];
    this.data.currentHouseId = house.uid;

    this.setData({
      isSelectHouseDecoration: 'home-decoration#completed' == house.status,
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
      url: '../../pages/house-edit/house-edit?dealtype=' + this.data.houseDealType + '&houseId=' + this.data.currentHouseId + '&source=proxy&isHouseDeal',
    });
    this.setData({
      isShowModal: false
    });
  },
  onSelfRentClick: function(){
    wx.navigateTo({
      url: '../../pages/house-edit/house-edit?dealtype=' + this.data.houseDealType + '&houseId=' + this.data.currentHouseId + '&source=self&isHouseDeal',
    });
    this.setData({
      isShowModal: false
    });
  }
})