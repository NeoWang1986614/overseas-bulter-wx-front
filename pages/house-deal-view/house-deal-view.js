// pages/rent-house-detail/rent-house-detail.js
const app = getApp()
const http = require('../../utils/http.js')
const util = require('../../utils/util.js')
const map = require('../../common/map.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    map: map,
    houseDealId: '',
    houseDealType: '',
    isHouseSale: false,
    isHouseRent: false,
    isProxy: false,
    houseDeal: {},
    houseInfo: {},
    houseAddress: '',
    headImageArr:[],

    orderId: '',
    order: {},
    orderMeta: {},
    house: {},
    inspectRecords: [],
    layoutTitleMap: {},
    installedTitleMap:[
      "未安装","已安装"
    ],

    houseImageUrls: [],
    houseAddress: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  parseOptions: function(options){
    if (options.hasOwnProperty('uid')){
      this.data.houseDealId = options['uid']
    }
    if (options.hasOwnProperty('type')) {
      this.data.houseDealType = options['type']
    }
    console.log(this.data.houseDealId);
    console.log(this.data.houseDealType);
    this.setData({
      isHouseRent: 'house-rent' == this.data.houseDealType,
      isHouseSale: 'house-sale' == this.data.houseDealType
    });
  },
  makeLayoutTitleMap: function () {
    if (0 != this.data.layoutArr.length) {
      for (var i = 0; i < this.data.layoutArr.length; i++) {
        this.data.layoutTitleMap[this.data.layoutArr[i].value] = this.data.layoutArr[i].title;
      }
    }
    this.setData({
      layoutTitleMap: this.data.layoutTitleMap
    });
  },
  makeHeadImageArr: function(){
    var headImageArr = [];
    if(0!=this.data.houseDeal.image.length){
      console.log(this.data.houseDeal.image);
      headImageArr = headImageArr.concat(JSON.parse(this.data.houseDeal.image))
    }
    if(0!=this.data.houseInfo.meta){
      console.log(this.data.houseInfo.meta);
      headImageArr = headImageArr.concat(JSON.parse(this.data.houseInfo.meta).layoutChart);
    }

    this.setData({
      headImageArr: headImageArr
    });
    
  },
  checkIsProxy: function(){
    this.setData({
      isProxy: 'proxy' == this.data.houseDeal.source
    });
  },
  makeHouseAddress: function(){
    this.setData({
      houseAddress: util.getHouseAddress(this.data.houseInfo)
    });
  },
  onLoad: function (options) {
    this.parseOptions(options);
    http.querySearchLayoutAsync(0, 10000, res => {
      this.setData({
        layoutArr: res
      });
      this.makeLayoutTitleMap();
    });
    http.getHouseDealAsync(this.data.houseDealId, res=>{
      console.log(' house deal = ');
      console.log(res);
      this.setData({
        houseDeal: res
      });

      this.checkIsProxy();

      http.getHouseAsync(this.data.houseDeal.houseId, res1=>{
        console.log('house info = ');
        console.log(res1);
        this.setData({
          houseInfo: res1
        });
        this.makeHouseAddress();
        this.makeHeadImageArr();
      });

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  getNaviBarTitle: function(){
    if(this.data.isHouseRent){
      return '房屋出租详情';
    } else if (this.data.isHouseSale){
      return '房屋出售详情';
    }
  },
  onShow: function () {
    // this.updateOrder();
    wx.setNavigationBarTitle({
      title: this.getNaviBarTitle()
    });
  },
  getHouseImageArr: function(){
    var imageUrlArr = [];
    if(0!=this.data.inspectRecords){
      for(var i=0; i<this.data.inspectRecords.length;i++){
        if (0 != this.data.inspectRecords[i].area.length){
          for (var j = 0; j < this.data.inspectRecords[i].area.length; j++) {
            imageUrlArr = imageUrlArr.concat(this.data.inspectRecords[i].area[j].urls);
          }
        }
      }
    }
    console.log(imageUrlArr);
    this.setData({
      houseImageUrls: imageUrlArr
    });
  },
  updateOrder: function(){
    http.getOrderAsync(this.data.orderId, res=>{
      console.log(res);
      this.setData({
        order: res,
        orderMeta: JSON.parse(res.meta),
        houseAddress: util.generateHouseInOrderDescription(res)
      });
      http.getRecordsAsync('inspect-record', this.data.orderId, 0, 10000, res1=>{
        console.log(res1);
        this.setData({
          inspectRecords: res1
        });
        this.getHouseImageArr();
      });
      http.getHouseAsync(res.houseId, res2=>{
        this.setData({
          house: res2
        });
        console.log(res2);
      });
    });
  },
  onSwiperItemClick: function(e){
    console.log(e);
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
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
    console.log('转发');
    console.log(this.data.houseInfo);
    var title = this.data.houseInfo.adLevel2 + this.data.houseInfo.name + this.data.houseInfo.area + 'm²' + this.data.map.text[this.data.houseInfo.property] + (this.data.isHouseSale?'出售':'出租') + '...';
    console.log(this.data.isHouseSale);
    console.log(title);
    return{
      title: title,
      success: res => {
        console.log(res);
      },
      fail: res => {
        console.log(res);
      }
    }
  }
})