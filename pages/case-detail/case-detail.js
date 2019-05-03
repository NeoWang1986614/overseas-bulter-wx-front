// pages/case-detail/case-detail.js
//获取应用实例
const app = getApp()
const publicAccountEntity = require('../../entity/public-account.js')

Page({

  /**
   * Page initial data
   */
  data: {
    materialDetailNewsItem: null,
    article: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(options);

    if(!options.hasOwnProperty('media_id')){
      return;
    }

    app.getPublicAccountMaterialDetailAsync(options['media_id'], res => {
      console.log('getPublicAccountMaterialDetailAsync', res);
      this.setData({
        materialDetailNewsItem: res.newsItem[0]
      });
    })
    
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
  // onShareAppMessage: function () {

  // }
})