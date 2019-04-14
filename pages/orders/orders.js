// pages/orders/orders.js
const app = getApp()
const map = require('../../common/map.js')

Page({

  /**
   * Page initial data
   */
  data: {
    tabOptions:[
      {
        value: 'non-payment', 
        title: '未支付'
      },
      {
        value: 'paid',
        title: '已支付'
      },
      {
        value: 'accepted',
        title: '已接单'
      },
      {
        value: 'completed',
        title: '已完成'
      }
    ],
    currentSelectTabOptions:'non-payment',
    orders: [],
    textMapping: {},
    readyToDeleteIndex: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      textMapping: map.text
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  updateOrderList: function () {
    this.getOrdersAsync(orders => {
      this.setData({
        orders: orders
      });
    });
  },
  onShow: function () {
    console.log('on show in orders');
    this.updateOrderList();
  },
  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  getOrdersAsync: function(callback) {
    app.getOrdersAsync(0, 1000, this.data.currentSelectTabOptions, orders => {
      console.log('get orders as follow:', orders);
      if (callback){
        callback(orders);
      }
    })
  },
  onTabItemClick: function (e) {
    var clickedIndex = e.currentTarget.dataset.index;
    var selectedValue = this.data.tabOptions[clickedIndex].value;
    console.log(selectedValue);
    if (selectedValue == this.data.currentSelectTabOptions){
      return;
    }
    this.setData({
      currentSelectTabOptions: selectedValue
    });
    this.updateOrderList();
  },
  onListItemClick: function(e) {
    var clickedIndex = e.currentTarget.dataset.index;
    console.log(clickedIndex);
    wx.navigateTo({
      url: '../../pages/order-detail/order-detail?uid=' + this.data.orders[clickedIndex].uid,
    });
  },
  onDeleteClick: function(e) {
    var clickedIndex = e.currentTarget.dataset.index;
    this.data.readyToDeleteIndex = clickedIndex;
    wx.showModal({
      title: "删除",
      content: "确定删除?",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#000",
      confirmText: "确定",
      confirmColor: "#0f0",
      success: res => {
        console.log(res)
        if (true == res.confirm) {
          this.deleteOrderAsync(_=>{
            console.log('delete success');
            wx.showToast({
              title: '已删除!',
            }, 1500);
            this.updateOrderList();
          });
        }
      }
    });
  },
  deleteOrderAsync: function(callback) {
    app.deleteOrderAsync(this.data.orders[this.data.readyToDeleteIndex].uid, callback);
  }
})