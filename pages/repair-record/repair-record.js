// pages/repair-record/repair-record.js
const app = getApp()
const utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordId: '',
    repairRecord: {},
    order: {},
    houseAddressDesc: '',
    imgUrl: '',
    isShowWebView: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  generateHouseInOrderDescription: function (orderObj) {
    return utils.generateHouseInOrderDescription(orderObj);
  },
  parseOptions: function (options) {
    if (options && options.hasOwnProperty('uid')) {
      this.data.recordId = options['uid'],
        console.log('order id =', this.data.recordId);
      app.getRecordAsync('repair-record', this.data.recordId, res => {
        console.log('test res = ', res);
        this.setData({
          repairRecord: res
        });
        app.getOrderAsync(this.data.repairRecord.orderId, order => {
          console.log('order = ', order);
          this.setData({
            order: order,
            houseAddressDesc: this.generateHouseInOrderDescription(order)
          });
        });
      });
    }
  },
  onLoad: function (options) {
    this.parseOptions(options);
  },
  onImageLinkClick: function(e){
    console.log(e);
    var urls = e.currentTarget.dataset.urls;
    this.setData({
      imgUrl: urls[0],
      isShowWebView: true
    });
    console.log(this.data.imgUrl);
  },
  onWebViewClick: function(){
    this.setData({
      imgUrl: '',
      isShowWebView: false
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
  onShow: function () {

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

  }
})