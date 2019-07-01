// pages/other-service/other-service.js
const app = getApp()
const utils = require('../../utils/util.js')
const http = require('../../utils/http.js')
const map = require('../../common/map.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [
    ],
    totalCountOfMessage: 0,
    messageOffset: 0,
    countPerPage: 6,
    isMoreData: true
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
  makeLevelText: function(){
    if(0==this.data.messages.length){
      return;
    }
    for(var i=0;i<this.data.messages.length;i++){
      if('10'==this.data.messages[i].level){
        this.data.messages[i].levelText='自营';
      } else if ('0' == this.data.messages[i].level) {
        this.data.messages[i].levelText = '';
      } else {
        this.data.messages[i].levelText = 'V';
      }
    }
    this.setData({
      messages: this.data.messages
    });
    console.log(this.data.messages);
  },
  refreshMessageList: function(){
    http.queryMessagesAsync(this.data.messageOffset, this.data.countPerPage, (total, entities)=>{
      console.log(total);
      console.log(entities);
      var newArr = this.data.messages.concat(entities);
      this.setData({
        totalCountOfMessage: total,
        messages: newArr,
        messageOffset: newArr.length
      });
      if(this.data.messages.length >= this.data.totalCountOfMessage){
        this.setData({
          isMoreData: false
        });
      }
      this.makeLevelText();
    });
  },
  initParams: function(){
    this.setData({
      messages: [],
      messageOffset: 0,
      isMoreData: true
    });
  },
  onShow: function () {
    this.initParams();
    this.refreshMessageList();
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
  onGetMoreData: function(){
    if (this.data.isMoreData){
      this.refreshMessageList();
    }
  },
  onNewMessageClick: function() {
    wx.navigateTo({
      url: '../../pages/message-edit/message-edit',
    })
  }
})