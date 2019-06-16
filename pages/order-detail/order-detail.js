// pages/order-detail/order-detail.js
const app = getApp()
const config = require('../../common/config.js')
const map = require('../../common/map.js')
const orderEntity = require('../../entity/order.js')
const utils = require('../../utils/util.js')
const utilMd5 = require('../../utils/md5.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    order: null,
    mapText: null,
    houseDescription: '',
    user: null,
    service: null,
    isHomeDecoration: false,
    isHouseMaintain: false,
    isHouseRent: false,
    metaData: {},
    isPrepaying: false,
    attachment: '',
    houseRentYear: '',
    houseRentPrice: {
      "from": 0.0,
      "to": 0.0
    },
    houseRentAccount:{
      country: '',
      bank: '',
      number: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload', options);
    if(options.hasOwnProperty('uid')){
      this.data.orderId = options['uid'];
    }
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
  makeMetaData: function(){
    console.log('makeMetaData');
    console.log(this.data.order.type);
    if(this.data.isHouseMaintain){
      var metaObj = JSON.parse(this.data.order.meta);
      this.setData({
        metaData: metaObj,
        attachment: metaObj.attachment,
      })
    } else if (this.data.isHomeDecoration) {
      var metaObj = JSON.parse(this.data.order.meta);
      this.setData({
        attachment: metaObj.attachment,
      })
    } else if (this.data.isHouseRent) {
      var metaObj = JSON.parse(this.data.order.meta);
      this.setData({
        houseRentYear: metaObj.year,
        houseRentPrice: metaObj.priceRange,
        houseRentAccount: {
          country: metaObj.accountCountry,
          bank: metaObj.accountBank,
          number: metaObj.accountNumber,
        }
      });
    }
  },
  checkOrderType: function(){
    this.setData({
      isHomeDecoration: 'home-decoration'==this.data.order.type,
      isHouseMaintain: 'house-maintain' == this.data.order.type,
      isHouseRent: 'house-rent' == this.data.order.type,
    });
  },
  updateOrder: function(){
    app.getOrderAsync(this.data.orderId, orderObj => {
      console.log('order = ');
      console.log(orderObj);
      var hd = utils.generateHouseInOrderDescription(orderObj);
      this.setData({
        order: orderObj,
        houseDescription: hd
      });
      this.checkOrderType();
      this.makeMetaData();
      app.getUserAsync(orderObj.placerId, userData => {
        console.log('user ', userData);
        this.setData({
          user: userData
        })
      });
    });
  },
  onShow: function () {
    console.log('on show function');
    this.updateOrder();
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
  // onShareAppMessage: function () {

  // },
  updateOrderPaidStatus: function(){
    this.data.order.status = 'paid';
    app.updateOrderAsync(this.data.order,res => {
      console.log('update order to paid status, res = ', res);
      this.updateOrder();
    });
  },
  prepaymentAsync: function(callback){
    app.requestPrePaymentAsync(
      app.globalData.loginInfo.userId,
      this.data.orderId,
      ret => {
        console.log('prepayment = ', ret);
        if(callback){
          callback(ret)
        }
      }
    );
  },
  makePaySign: function(appId,nonceStr, prepayId, timeStamp){
    var signString = "appId=" + appId + 
    "&nonceStr="+ nonceStr + 
    "&package=prepay_id="+prepayId+
    "&signType=MD5&timeStamp=" + timeStamp+
    "&key=kflskdjfklsdjfksdfflj34234234234";
    console.log("rawString:", signString);
    var ret = utilMd5.hex_md5(signString).toUpperCase();
    console.log("sign ret = ", ret);
    return ret;
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
          this.prepaymentAsync(ret => {
            console.log('预支付结果: ', ret);
            this.data.prepaymentRet = ret;
            var paySign = this.makePaySign(ret.appId, ret.nonceStr, ret.prepayId, ret.timeStamp);
            wx.requestPayment({
              timeStamp: "" + ret.timeStamp,
              nonceStr: ret.nonceStr,
              package: "prepay_id=" + ret.prepayId,
              signType: ret.signType,
              paySign: paySign,
              success: res => {
                console.log('支付成功! res = ', res);
                this.updateOrderPaidStatus();
                wx.showToast({
                  title: '支付成功!',
                }, 1500);
              },
              fail: res => {
                console.log('支付失败! res = ', res);
                wx.showToast({
                  title: '支付失败!',
                }, 1500);
              },
              complete: res => {
                console.log('支付完成! res = ', res);
              }
            });
          });
        }
      }
    })
  },
  onViewFeedbackClick: function () {
    wx.navigateTo({
      url: '../../pages/feedbacks/feedbacks?orderId=' + this.data.orderId,
    });
  },
  onPreviewClick: function () {
    console.log('onPreviewClick');
    console.log(this.data.attachment);
    wx.downloadFile({
      url: this.data.attachment,
      success: function (res) {
        console.log('download file = ');
        console.log(res);
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType: 'xlsx',
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: res => {
            console.log('open document fail');
            console.log(res);
          }
        })
      }
    });
  }
})