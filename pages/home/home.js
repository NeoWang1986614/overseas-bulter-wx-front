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
    material:[],
    serviceItems:[
      {
        icon: '/images/home-decoration.png',
        name: 'home-decoration',
        navigateUrl: '../../pages/service-detail-v1/service-detail-v1',
        navigateParams: '?type=home-decoration'
      },
      {
        icon: '/images/house-maintain.png',
        name: 'house-maintain',
        navigateUrl: '../../pages/service-detail-v1/service-detail-v1',
        navigateParams: '?type=house-maintain'
      },
      {
        icon: '/images/house-rent.png',
        name: 'house-rent',
        navigateUrl: '../../pages/service-detail-v1/service-detail-v1',
        navigateParams: '?type=house-rent'
      },
      {
        icon: '/images/other-service.png',
        name: 'other-service',
        navigateUrl: '../../pages/service-detail-v1/service-detail-v1',
        navigateParams: '?type=other-service'//没有参数
      },
      {
        icon: '/images/customer-service.png',
        name: 'customer-service',
        navigateUrl: '',
        navigateParams: ''
      },
      {
        icon: '/images/my-house.png',
        name: 'my-houses',
        navigateUrl: '../../pages/houses/houses',
        navigateParams: ''//没有参数
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
        navigateUrl: '../../pages/feedbacks/feedbacks'
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
    wx.showShareMenu({
      withShareTicket: true
    })
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
    // wx.hideShareMenu();
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
    console.log('userInfo: ', app.globalData.userInfo);
    app.queryPublicAccountMaterialAsync("news", 0, 10000, res => {
      this.setData({
        material: res
      });
    });
  },
  onRecommandItemClick: function(e){
    console.log('onRecommandItemClick e=',e);
    var clickedIndex = e.currentTarget.dataset.index;
    var materialItem = app.globalData.material.item[clickedIndex];
    this.navigateWrapper('../../pages/case-detail/case-detail?media_id=' + materialItem.mediaId);
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
  onShareAppMessage: function (options) {
    console.log(options);
    console.log('userId = ', 'pages/home/home?uid=' + app.globalData.loginInfo.userId);
    return {
      title: '海外管家',
      path: 'pages/home/home?uid=' + app.globalData.loginInfo.userId,
      success(res){
        console.log('转发成功');
      },
      fail: function(res){
        console.log('转发失败');
      },
      complete: function(res){
        consonle.log('转发完成:', res);
      }
    };
  },
  onUserAvatarClick: function (e) {
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
    app.loginAsync(res=>{
      
    });

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
    console.log('on service click');
    var clickedIndex = e.currentTarget.dataset.index;
    var item = this.data.serviceItems[clickedIndex];
    // wx.navigateTo({
    //   url: item.navigateUrl + item.navigateParams,
    // })
    this.navigateWrapper(item.navigateUrl + item.navigateParams);
  },
  onOrdresTrackClick: function (e) {
    var clickedIndex = e.currentTarget.dataset.index;
    // wx.navigateTo({
    //   url: this.data.trackItems[clickedIndex].navigateUrl,
    // })
    this.navigateWrapper(this.data.trackItems[clickedIndex].navigateUrl);
  },
  onCaseClick: function (e) {
    console.log(e);
    var clickedIndex = e.currentTarget.dataset.index;
    var materialItem = app.globalData.material.item[clickedIndex];
    this.navigateWrapper('../../pages/case-detail/case-detail?media_id=' + materialItem.mediaId);
  },
  navigateWrapper: function(url) {
    console.log('onUnload', app.globalData.userInfo);
    if (!app.globalData.userInfo) {
      console.log('not authenticate');
      wx.showToast({
        title: '请先登录授权!',
      }, 1500);
      return;
    }
    wx.navigateTo({
      url: url,
    })
  }
})