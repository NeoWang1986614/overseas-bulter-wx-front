// pages/feedback/feedback.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    orders: null,
    allItemComponent: null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    this.data.allItemComponent = this.selectAllComponents('#feedbackItem');
    console.log(this.data.allItemComponent);
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.onLoad();
    console.log('feedback on show');
    app.getOrdersAsync(0, 10000, 'accepted',res => {
      console.log(res);
      this.setData({
        orders: res
      });
    });

    if (this.data.allItemComponent){
      for (let i = 0; i < this.data.allItemComponent.length; i++) {
        this.data.allItemComponent[i].refresh();
      }
    }
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
  onFeedbackItemClick: function (e) {
    console.log('onFeedbackItemClick');
    var clickedIndex = e.currentTarget.dataset.index;
    console.log(clickedIndex);
    wx.navigateTo({
      url: '../../pages/feedback-detail/feedback-detail?orderId=' + this.data.orders[clickedIndex].uid,
    });
  }
})