// pages/billing-record/billing-record.js
const app = getApp()
const utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordId: '',
    billingRecord: {},
    order: {},
    houseAddressDesc: '',
    incomeTotal: 0.0,
    outgoingsTotal: 0.0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  computeFeeItemsTotal: function(feeItems){
    var ret =  0.0;
    if(0 != feeItems.length){
      for(let i=0; i<feeItems.length; i++){
        ret += feeItems[i].amount;
      }
    }
    return ret;
  },
  generateHouseInOrderDescription: function(orderObj){
    return utils.generateHouseInOrderDescription(orderObj);
  },
  parseOptions: function (options) {
    if (options && options.hasOwnProperty('uid')) {
      this.data.recordId = options['uid'],
      console.log('order id =', this.data.recordId);
      app.getRecordAsync('billing-record', this.data.recordId, res=>{
        console.log('test res = ', res);
        this.setData({
          billingRecord: res,
          incomeTotal: this.computeFeeItemsTotal(res.income),
          outgoingsTotal: this.computeFeeItemsTotal(res.outgoings),
        });
        app.getOrderAsync(this.data.billingRecord.orderId, order=>{
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