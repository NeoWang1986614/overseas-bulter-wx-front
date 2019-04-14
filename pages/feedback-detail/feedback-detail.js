// pages/feedback-detail/feedback-detail.js
const app = getApp()
const map = require('../../common/map.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    feedbacks: null,
    order: null,
    house: null,
    houseFullAddressText: null,
    map: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      map: map
    });
    if(!options.hasOwnProperty('orderId')){
      return;
    }
    this.setData({
      orderId: options['orderId']
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
    app.getFeedbacksAsync(0, 1000, this.data.orderId, feedbacksObj => {
      console.log('on show', feedbacksObj);
      this.setData({
        feedbacks: feedbacksObj
      });
    });

    app.getOrderAsync(this.data.orderId, orderObj => {
      console.log('orderObj', orderObj);
      this.setData({
        order: orderObj
      });
      app.getHouseAsync(orderObj.houseId, houseObj => {
        this.setData({
          house: houseObj,
          houseFullAddressText: app.generateHouseFullAddress(houseObj)
        });
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

  }
})