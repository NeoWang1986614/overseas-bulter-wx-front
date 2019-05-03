// pages/user-info/user-info.js
const app = getApp()
const config = require('../../common/config.js')
const entityUser = require('../../entity/user.js')

Page({

  /**
   * Page initial data
   */
  data: {
    nickName: '',
    name: '',
    phoneNumber: '',
    idCardNumber: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo.nickName);
    this.setData({
      nickName: app.globalData.userInfo.nickName
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
    app.getUserAsync(app.globalData.loginInfo.userId, userData => {
      this.setData({
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        idCardNumber: userData.idCardNumber
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
  // onShareAppMessage: function () {

  // },
  nickNameInput: function(e) {
    this.data.nickName = e.detail.value;
  },
  nameInput: function (e) {
    this.data.name = e.detail.value;
  },
  phoneNumberInput: function (e) {
    this.data.phoneNumber = e.detail.value;
  },
  idCardNumberInput: function (e) {
    this.data.idCardNumber = e.detail.value;
  },
  checkUserInfoValid: function(){
    var toastTitle = null;
    console.log('nick name', this.data.nickName);
    if (0 == this.data.name.length) {
      console.log('empty name');
      toastTitle = '姓名为空!';
    } else if (0 == this.data.nickName.length) {
      console.log('empty nick name');
      toastTitle = '昵称为空!';
    } else if(0 == this.data.phoneNumber.length) {
      console.log('empty phone number');
      toastTitle = '电话号码为空!';
    } else if (0 == this.data.idCardNumber.length) {
      console.log('empty id card number');
      toastTitle = '身份证号码为空!';
    }
    console.log('toastTitle', toastTitle);
    if(toastTitle){
      wx.showToast({
        title: toastTitle,
      },1500);
      return false;
    }
    return true;
  },
  onSaveClick: function () {
    console.log('save user info');
    if(!this.checkUserInfoValid()){
      return;
    }
    wx.request({
      url: config.generateFullUrl('/user'),
      method: 'PUT',
      data: {
        uid: app.globalData.loginInfo.userId,
        name: this.data.name,
        phone_number: this.data.phoneNumber,
        id_card_number: this.data.idCardNumber
      },
      header: {
        'content-type': 'applicfation/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log(res);
        wx.showToast({
          title: '保存成功!',
          icon: 'success',
          duration: 1500,
          success: function () {
            console.log('toast success !');
            setTimeout(function (){
              wx.navigateBack({
              });
            }, 1500);
          }
        })
      }
    })
  }
})