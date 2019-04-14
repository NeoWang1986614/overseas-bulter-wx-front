// pages/case-detail/case-detail.js
//获取应用实例
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    currentCase: null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(options);

    if(!options.hasOwnProperty('id')){
      return;
    }

    app.getCaseAsync(options['id'], caseData => {
      console.log('onload in case detail', caseData);
      this.setData({
        currentCase: caseData
      });
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
  onShow: function () {

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

  }
})