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
    unCheckTitle: '设为默认',
    checkTitle: '默认',
    unCheckUrl: '/images/uncheck.png',
    checkUrl: '/images/check.png',
    currentDefaultItemIndex: 0,
    readyToDeleteIndex: 0,
    defaultHouseUid: 0
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
      console.log(data)

      app.globalData.houses = data;

      if (0 != data.length && !app.getDefaultHouseUid()){
        app.setDefaultHouseUid(data[0].uid);
      }
      console.log('key set data');
      this.setData({
        houses: data,
        defaultHouseUid: app.getDefaultHouseUid()
      });
    });
  },
  onShow: function () {
    console.log(app.getDefaultHouseUid());

    this.setData({
      houses: app.globalData.houses,
      defaultHouseUid: app.getDefaultHouseUid()
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
  onDefaultClick: function (e) {
    console.log(e);
    var clickedIndex = e.currentTarget.dataset.index;
    if (this.data.houses[clickedIndex].uid == this.data.defaultHouseUid){
      return;
    }
    app.setDefaultHouseUid(this.data.houses[clickedIndex].uid);
    this.setData({
      houses: this.data.houses,
      defaultHouseUid: app.getDefaultHouseUid()
    });
  },
  onDeleteClick: function (e) {
    var clickedIndex = e.currentTarget.dataset.index;
    this.data.readyToDeleteIndex = clickedIndex;
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