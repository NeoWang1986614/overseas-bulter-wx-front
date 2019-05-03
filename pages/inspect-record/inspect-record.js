// pages/inspect-record/inspect-record.js
const app = getApp()
const utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordId: '',
    inspectRecord: {},
    order: {},
    houseAddressDesc: '',
    declaration: '请注意此物业验房只是一个视觉上的检查，并非专业验房师。如果您需要一位更全面的检查，我们建议您聘请一位专业的验房师进行检查。'
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
      app.getRecordAsync('inspect-record', this.data.recordId, res => {
        console.log('test res = ', res);
        this.setData({
          inspectRecord: res
        });
        app.getOrderAsync(this.data.inspectRecord.orderId, order => {
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