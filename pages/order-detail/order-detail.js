// pages/order-detail/order-detail.js
const app = getApp()
const config = require('../../common/config.js')
const map = require('../../common/map.js')
const orderEntity = require('../../entity/order.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null,
    mapText: null,
    houseDescription: '',
    user: null,
    service: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload', options);
    if(options.hasOwnProperty('uid')){
      this.data.order = {
        uid: options['uid']
      };
    }
    // if (options.hasOwnProperty('serviceId')) {
    //   console.log(options['serviceId']);
    //   app.getServiceAsync(options['serviceId'], serviceData => {
    //     this.setData({
    //       service: serviceData
    //     });
    //   });
    // }
    this.setData({
      mapText: map.text
    });
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
    console.log('on show function');

    app.getOrderAsync(this.data.order.uid, orderObj => {
      console.log('on show data', orderObj);
      var hd = map.text[orderObj.houseCountry]
        + map.text[orderObj.houseProvince]
        + map.text[orderObj.houseCity]
        + orderObj.houseAddress;
      this.setData({
        order: orderObj,
        houseDescription: hd
      });
      app.getUserAsync(orderObj.placerId, userData => {
        console.log('user ', userData);
        this.setData({
          user: userData
        })
      });
    });
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
  orderPay: function() {
    this.data.order.status = 'paid';
    console.log(this.data.order);
    wx.request({
      url: config.generateFullUrl('/order'),
      method: 'PUT',
      data: orderEntity.convertOrderObject(this.data.order),
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('pay order response ',res);
        if (200 == res.statusCode) {
          wx.showToast({
            title: '订单已支付!',
          }, 1500);
          setTimeout(_ => {
            wx.navigateBack({
              delta: getCurrentPages().length
            })
          }, 1500);
        }
      }
    })
  },
  onPayClick: function () {
    wx.showModal({
      content: '确定支付该订单?',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000',
      confirmText: '确定',
      confirmColor: '#0f0',
      success: res => {
        console.log(res)
        if(res.confirm){
          this.orderPay();
        }
      }
    })
  },
  onViewFeedbackClick: function () {
    wx.navigateTo({
      url: '../../pages/feedback-detail/feedback-detail?orderId=' + this.data.order.uid,
    });
  }
})