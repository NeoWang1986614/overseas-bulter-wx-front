// pages/house-deal/house-deal.js
const app = getApp()
const http = require('../../utils/http.js')
const map = require('../../common/map.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseDealType: '',
    isHouseSale: false,
    isHouseRent: false,
    map: map,
    houseDeals: [],
    isShowModal: false,
    isMoreData: false,
    countPerPage: 5,
    currentOffset: 0
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
        isHouseSale: 'house-sale' == this.data.houseDealType,
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
  checkIsMoreData: function(total){
    var ret = false;
    if(total > this.data.houseDeals.length){
      ret = true;
    }
    this.setData({
      isMoreData: ret
    });
    console.log('isMoreData=');
    console.log(this.data.isMoreData);
  },
  getHouseDealsRefresh: function(){
    this.setData({
      currentOffset: 0,
      houseDeals: []
    });
    this.getHouseDealAsync();
  },
  getHouseDealAsync: function(){
    http.queryHouseDealAsync(
      this.data.houseDealType, 
      this.data.currentOffset,
      this.data.countPerPage, 
      (total, entities)=>{
        console.log('getHouseDealAsync');
        this.parseImageArr(entities);
        console.log(entities);
        this.data.houseDeals = this.data.houseDeals.concat(entities);
        console.log(this.data.houseDeals);
        this.setData({
          houseDeals: this.data.houseDeals
        });
        this.checkIsMoreData(total);
        this.data.currentOffset += this.data.countPerPage;
    });
  },
  parseImageArr: function(arr){
    if (0 == arr.length){
      return [];
    }
    for (var i = 0; i < arr.length;i++){
      if (0 != arr[i].image.length){
        arr[i].image = JSON.parse(arr[i].image)[0];
      }
    }
  },
  getNaviBarTitle: function(){
    if(this.data.isHouseRent){
      return '房屋出租';
    } else if(this.data.isHouseSale){
      return '二手房买卖';
    }
  },
  onShow: function () {
    this.getHouseDealsRefresh();
    wx.setNavigationBarTitle({
      title: this.getNaviBarTitle()
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
  onItemClick: function(e){
    var index = e.currentTarget.dataset.index;
    var houseDeals = this.data.houseDeals[index];
    wx.navigateTo({
      url: '../../pages/house-deal-view/house-deal-view?uid=' + houseDeals.uid + '&type=' + this.data.houseDealType,
    })
  },
  onMoreClick: function(){
    if(this.data.isMoreData){
      this.getHouseDealAsync();
    }
  },
  onNeedHouseDeal: function(){
    this.setData({
      isShowModal: true
    });
  },
  onModalCancel: function(){
    this.setData({
      isShowModal: false
    });
  },
  onExistHouseClick: function(){
    wx.navigateTo({
      url: '../../pages/house-list/house-list?type=' + this.data.houseDealType,
    });
    this.setData({
      isShowModal: false
    });
  },
  onNewHouseDealsClick: function(){
    wx.navigateTo({
      url: '../../pages/house-deal-detail/house-deal-detail?type='+this.data.houseDealType + '&source=self',
    });
    this.setData({
      isShowModal: false
    });
  }
})