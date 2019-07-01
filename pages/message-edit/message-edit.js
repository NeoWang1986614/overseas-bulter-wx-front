// pages/message-edit/message-edit.js
const app = getApp()
const utils = require('../../utils/util.js')
const http = require('../../utils/http.js')
const map = require('../../common/map.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPublishing: false,
    message: {
      category: '',
      title: '',
      content: ''
    },
    categoryCurrentIndex: 0,
    categoryOptions: [
      '签证保关',
      '移民留学',
      '公司注册',
      '旅游游学',
      '开户换汇',
      '菲佣外教',
      '驾照证件',
      '其他服务'
    ],
    maxCountOfTitle: 20,
    maxCountOfContent: 120
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onCategoryChange: function(e){
    console.log(e);
    var index = e.detail.value;
    this.setData({
      categoryCurrentIndex: index
    });
  },
  onTitleInput: function(e){
    console.log(e);
    var title = e.detail.value;
    var length = title.length;
    console.log(length);
    if (length > this.data.maxCountOfTitle) {
      this.data.message.title = title.substr(0, this.data.maxCountOfTitle);;
      
      this.setData({
        message: this.data.message
      });      
      return;
    }
    this.data.message.title = title;
    this.setData({
      message: this.data.message
    });
  },
  onContentInput: function(e){
    console.log(e);
    // var content = utils.filterEmoji(e.detail.value);
    var content = e.detail.value;
    var length = content.length;
    console.log(length);
    if(length > this.data.maxCountOfContent){
      return;
    }
    this.data.message.content = content;
    this.setData({
      message: this.data.message
    });
  },
  checkMessageValid: function(){
    if(0==this.data.message.title.length){
      app.notifyMessage('标题不能为空');
      return false;
    }
    if (0 == this.data.message.content.length) {
      app.notifyMessage('内容不能为空');
      return false;
    }
    return true;
  },
  makeMessage: function(){
    this.data.message.category = this.data.categoryOptions[this.data.categoryCurrentIndex];
    this.data.message.creatorId = app.globalData.loginInfo.userId;
  },
  onPublishClick: function(){
    if (this.data.isPublishing){
      return;
    }
    this.makeMessage();
    if (!this.checkMessageValid()){
      return;
    }

    wx.showLoading({
      title: '发布中...',
    })
    this.data.isPublishing=true;
    http.addMessageAsync(this.data.message, res=>{
      console.log(res);
      wx.hideLoading();
      if(res.data.hasOwnProperty('code') && 0 != res.data.code){
        wx.showToast({
          icon: 'none',
          title: res.data.message,
        }, 1500);
        this.data.isPublishing = false;
      }else{
        wx.showToast({
          title: '发布成功!',
        }, 1500);
        setTimeout(_ => {
          this.data.isPublishing = false;
          wx.navigateBack({
          })
        }, 1500);
      }
      
    });
  }
})