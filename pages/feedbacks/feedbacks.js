// pages/feedbacks/feedbacks.js
const app = getApp()
const map = require('../../common/map.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    orders: [],
    tabOptions: [
      {
        value: 'rent-record',
        title: '出租记录'
      },
      {
        value: 'inspect-record',
        title: '验房报告'
      },
      {
        value: 'repair-record',
        title: '维修记录'
      }
    ],
    currentSelectTabOption: 'rent-record',
    rentRecords: [],
    inspectRecords: [],
    repairRecords: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  parseOptions: function (options) {
    if (options && options.hasOwnProperty('orderId')) {
      this.data.orderId = options['orderId'],
      console.log('order id =', this.data.orderId);
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
    this.updateRecordList();
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
  onTabItemClick: function (e) {
    var clickedIndex = e.currentTarget.dataset.index;
    var selectedValue = this.data.tabOptions[clickedIndex].value;
    console.log(selectedValue);
    if (selectedValue == this.data.currentSelectTabOption) {
      return;
    }
    this.setData({
      currentSelectTabOption: selectedValue
    });
    this.updateRecordList();
  },
  localGetOrdersAsync:function(callback){
    if(0!=this.data.orderId.length){
      app.getOrderAsync(this.data.orderId, res=>{
        if (callback) {
          callback([res])
        };
      });
    }else{
      app.getOrdersAsync(0, 10000, 'accepted', res => {
        console.log('on show get orders = ', res);
        if (callback) {
          callback(res)
        };
      });
    }
  },
  updateRecordList: function() {
    this.data.rentRecords=[];
    this.data.inspectRecords=[];
    this.data.repairRecords=[];
    this.localGetOrdersAsync(res => {
      this.data.orders = res;
      if(0 != this.data.orders.length){
        for(let i=0 ; i<this.data.orders.length; i++){
          app.getRecordsAsync(
            this.data.currentSelectTabOption,
            this.data.orders[i].uid,
            0,
            10000,
            records=>{
              console.log('get records = ', records);
              if('rent-record' == this.data.currentSelectTabOption){
                this.setData({
                  rentRecords: this.data.rentRecords.concat(records)
                });
              } else if ('inspect-record' == this.data.currentSelectTabOption) {
                this.setData({
                  inspectRecords: this.data.inspectRecords.concat(records)
                });
              } else if ('repair-record' == this.data.currentSelectTabOption) {
                this.setData({
                  repairRecords: this.data.repairRecords.concat(records)
                });
              }
            });
        }
      }
    });
  },
  onRentRecordItemClick: function(e){
    console.log('onRentRecordItemClick =', e);
    var clickedIndex = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../../pages/rent-record/rent-record?uid=' + this.data.rentRecords[clickedIndex].uid,
    });
  },
  onInspectRecordItemClick: function (e) {
    console.log('onInspectRecordItemClick =', e);
    var clickedIndex = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../../pages/inspect-record/inspect-record?uid=' + this.data.inspectRecords[clickedIndex].uid,
    });
  },
  onRepairRecordItemClick: function (e) {
    console.log('onRepairRecordItemClick =', e);
    var clickedIndex = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../../pages/repair-record/repair-record?uid=' + this.data.repairRecords[clickedIndex].uid,
    });
  }
})