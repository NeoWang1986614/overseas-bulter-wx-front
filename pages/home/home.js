// pages/home/home.js
//获取应用实例
const app = getApp()
const entityCase = require('../../entity/case.js')
const map = require('../../common/map.js')

Page({

  /**
   * Page initial data
   */
  data: {
    recommendCases:[],
    textMap: {},
    serviceItems:[
      {
        icon: '/images/my-house.png',
        name: 'my-houses',
        navigateUrl: '../../pages/houses/houses',
        navigateParams: ''//没有参数
      },
      {
        icon: '/images/house-rent.png',
        name: 'house-rent',
        navigateUrl: '../../pages/service-detail/service-detail',
        navigateParams: '?type=house-rent'
      },
      {
        icon: '/images/home-decoration.png',
        name: 'home-decoration',
        navigateUrl: '../../pages/service-detail/service-detail',
        navigateParams: '?type=home-decoration'
      },
      {
        icon: '/images/house-maintain.png',
        name: 'house-maintain',
        navigateUrl: '../../pages/service-detail/service-detail',
        navigateParams: '?type=house-maintain'
      },
    ],
    trackItems:[
      // {
      //   icon: '/images/requirement.png',
      //   title: '我的需求跟踪'
      // },
      {
        icon: '/images/order.png',
        title: '我的订单跟踪',
        navigateUrl: '../../pages/orders/orders'
      },
      {
        icon: '/images/feedback.png',
        title: '我的反馈跟踪',
        navigateUrl: '../../pages/feedback/feedback'
      },
    ],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userAvatarUrl: '../../images/user-default.png'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      textMap: map.text
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        userAvatarUrl: app.globalData.userInfo.avatarUrl
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          userAvatarUrl: app.globalData.userInfo.avatarUrl
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            userAvatarUrl: app.globalData.userInfo.avatarUrl
          })
        }
      });
    }
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
    console.log('home on show');
    app.getCasesAsync(0, 1000, 0, cases => {
      this.setData({
        recommendCases: cases
      });
    });
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
  onUserAvatarClick: function (e) {
    console.log(e)
    if (!e.detail.hasOwnProperty("userInfo")) {
      return;
    }

    if (null != app.globalData.userInfo) {
      wx.navigateTo({
        url: '../user-info/user-info',
      });
      return;
    }

    this.getUserInfo(e);

  },
  getUserInfo: function (e) {
    
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      userAvatarUrl: e.detail.userInfo.avatarUrl
    })
    console.log("set data success!")
  },
  onServiceClick: function(e) {
    var clickedIndex = e.currentTarget.dataset.index;
    var item = this.data.serviceItems[clickedIndex];
    wx.navigateTo({
      url: item.navigateUrl + item.navigateParams,
    })
  },
  onOrdresTrackClick: function (e) {
    var clickedIndex = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: this.data.trackItems[clickedIndex].navigateUrl,
    })
  },
  onCaseClick: function (e) {
    console.log(e);
    var clickedIndex = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../../pages/case-detail/case-detail?id=' + this.data.recommendCases[clickedIndex].uid,
    })
  }
})