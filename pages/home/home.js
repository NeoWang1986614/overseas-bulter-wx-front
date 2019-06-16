// pages/home/home.js
//获取应用实例
const app = getApp()
const entityCase = require('../../entity/case.js')
const map = require('../../common/map.js')
const http = require('../../utils/http.js')

Page({

  /**
   * Page initial data
   */
  data: {
    carouselFigureArr: [],
    recommendCases:[],
    textMap: {},
    material:[],
    servicePrimaryFixedArr: [
      {
        value: 'house-rent',
        title: '房屋出租',
        iconUrl: '/images/house-rent.png'
      },
      {
        value: 'house-sale',
        title: '二手房买卖',
        iconUrl: '/images/house-sale.png'
      },
      {
        value: 'customer-service',
        title: '客服咨询',
        iconUrl: '/images/customer-service.png'
      },
      {
        value: 'my-house',
        title: '我的房产',
        iconUrl: '/images/my-house.png'
      },
    ],
    servicePrimaryArr: [],
    servicePrimaryNavigateUrl: '../../pages/service-detail-v1/service-detail-v1',
    myHouseNavigateUrl: '../../pages/houses/houses',
    houseDealNavigateUrl: '../../pages/house-deal/house-deal',
    trackItems:[
      {
        name: 'order-track',
        icon: '/images/order.png',
        title: '我的订单跟踪',
        navigateUrl: '../../pages/orders/orders'
      },
      {
        name: 'feedback-track',
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
  parseOptions: function(options){
    console.log('home options = ', options);
    if (options.hasOwnProperty('redirect')) {
      var redirectToServiceIndex = options['redirect'];
      console.log('redirect to index', redirectToServiceIndex);
      var item = this.data.serviceItems[redirectToServiceIndex];
      this.navigateWrapper(item.navigateUrl + item.navigateParams);
    }
  },
  onLoad: function (options) {

    this.parseOptions(options);

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
  exchangeItemInArr: function(fromIndex, toIndex, arr){
    arr[fromIndex] =  arr.splice(toIndex, 1, arr[fromIndex])[0];
    return arr;
  },
  onShow: function () {
    console.log('home on show');
    console.log('userInfo: ', app.globalData.userInfo);
    app.queryPublicAccountMaterialAsync("news", 0, 10000, res => {
      this.setData({
        material: res
      });
    });
    http.queryCarouselFigureAsync(0, 10000, res=>{
      console.log('carousel configure = ');
      console.log(res);
      this.setData({
        carouselFigureArr: res
      });
    });
    http.querySearchServicePrimaryAsync(0, 10000, res=>{
      console.log('home page services = ');
      console.log(res);
      var newArr = res.concat(this.data.servicePrimaryFixedArr);
      this.exchangeItemInArr(2, 3, newArr);
      this.setData({
        servicePrimaryArr: this.exchangeItemInArr(3, 4, newArr)
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
      title: '菲洋管家',
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
    console.log('onUserAvatarClick e=');
    console.log(e);
    if (!e.detail.hasOwnProperty("userInfo")) {
      return;
    }

    /*已获得用户信息*/
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
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var value = e.currentTarget.dataset.value;
    var serviceItem = this.data.servicePrimaryArr[index];
    console.log(serviceItem);
    if('my-house' == serviceItem.value){
      this.navigateWrapper(this.data.myHouseNavigateUrl);
    } else if('house-rent' == serviceItem.value
      || 'house-sale' == serviceItem.value){
      var naviUrl = this.data.houseDealNavigateUrl + '?type=' + serviceItem.value;
      this.navigateWrapper(naviUrl);
    }else{
      var naviUrl = this.data.servicePrimaryNavigateUrl + '?type=' + value;
      if (serviceItem.hasOwnProperty('uid')) {
        naviUrl += '&uid=' + serviceItem.uid;
      }
      console.log(naviUrl);
      this.navigateWrapper(naviUrl);
    }
  },
  onOrdresTrackClick: function (e) {
    var clickedIndex = e.currentTarget.dataset.index;
    this.navigateWrapper(this.data.trackItems[clickedIndex].navigateUrl);
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