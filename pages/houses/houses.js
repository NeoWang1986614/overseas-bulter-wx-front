// pages/houses/houses.js

const app=getApp()
const config = require('../../common/config.js')
const map = require('../../common/map.js')

Page({

  /**
   * Page initial data
   */
  data: {
    houses: [],
    map: map,
    operateItems:[
      {
        icon: '/images/check.png',
        title: '设为默认'
      },
      {
        icon: '/images/trash.png',
        title: '删除'
      }
    ],
    // unCheckTitle: '设为默认',
    // checkTitle: '默认',
    // unCheckUrl: '/images/uncheck.png',
    // checkUrl: '/images/check.png',
    currentDefaultItemIndex: 0,
    readyToDeleteIndex: 0,
    // defaultHouseUid: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  updateHouseList: function () {
    app.getHousesByOwnerIdAsync(app.globalData.loginInfo.userId, 0, 1000, data => {
      app.globalData.houses = data;
      this.setData({
        houses: data
      });
    });
  },
  onShow: function () {
    this.setData({
      houses: app.globalData.houses
    });

    var that = this;
    //get houses
    this.updateHouseList();
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
  onDeleteClick: function (e) {
    var clickedIndex = e.currentTarget.dataset.index;
    this.data.readyToDeleteIndex = clickedIndex;
    var house = this.data.houses[clickedIndex];
    if('editable' != house.status){
      wx.showModal({
        title: '无法删除',
        content: '房产订单正在进行中...',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#0f0',
        success: res => {
          console.log(res);
        }
      });
      return;
    }
    wx.showModal({
      title: "删除",
      content: "确定删除?",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#000",
      confirmText: "确定",
      confirmColor: "#0f0",
      success: res => {
        console.log(res)
        if(true == res.confirm){
          this.deleteHouseByIndex(this.data.readyToDeleteIndex);
        }
      }
    });
  },
  deleteHouseByIndex: function (index) {
    var deletedHouse = this.data.houses[index];
    wx.request({
      url: config.generateFullUrl('/house?uid=' + deletedHouse.uid),
      method: 'DELETE',
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('delete success',res);
        if(200 == res.statusCode) {
          if(0 == res.data.code){
            console.log('delete success');
            this.updateHouseList();
          }
        }
      }
    })
  },
  onEditClick: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../../pages/house-edit/house-edit?uid=' + this.data.houses[e.currentTarget.dataset.index].uid + '&type=edit',
    });
  },
  onAddClick: function () {
    wx.navigateTo({
      url: '../../pages/house-edit/house-edit?type=add',
    });
  }
})