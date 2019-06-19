// pages/houses/houses.js

const app=getApp()
const config = require('../../common/config.js')
const map = require('../../common/map.js')
const http = require('../../utils/http.js')

Page({

  /**
   * Page initial data
   */
  data: {
    sortedHouses:{},
    layoutMap: {},
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
    
    currentDefaultItemIndex: 0,
    readyToDeleteIndex: 0,

  },

  /**
   * Lifecycle function--Called when page load
   */
  parseLayoutsToMap: function(layouts){
    if (0 == layouts.length){
      return;
    }
    var ret = {};
    for(var i=0;i<layouts.length;i++){
      ret[layouts[i].value] = layouts[i].title;
    }
    console.log('layout map = ');
    console.log(ret);
    return ret;
  },
  querySearchLayout: function (callback) {
    http.querySearchLayoutAsync(0, 10000, res => {
      console.log('query search layouts = ');
      console.log(res);
      this.setData({
        layoutMap: this.parseLayoutsToMap(res)
      });
      if (callback) {
        callback();
      }
    });
  },
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
  initSortHouses: function(){
    this.data.sortedHouses ={
      'studio': [],
      'one-bedroom': [],
      'two-bedroom': [],
      'two-bedroom-two-bathroom': []
    };
  },
  sortHouses: function(houses){
    if(0==houses.length){
      return;
    }
    var ret = this.data.sortedHouses;
    for(var i=0;i<houses.length;i++){
      var tempHouse = houses[i];
      if (ret.hasOwnProperty(tempHouse.layout)){
        ret[tempHouse.layout].push(tempHouse);
      } else {
        console.log(tempHouse.layout);
        ret[tempHouse.layout] = [tempHouse];
      }
    }
    this.setData({
      sortedHouses:ret
    });
  },
  refreshList: function(){
    this.querySearchLayout(_ => {
      this.updateHouseList();
    });
  },
  updateHouseList: function () {
    app.getHousesByOwnerIdAsync(app.globalData.loginInfo.userId, 0, 1000, data => {
      app.globalData.houses = data;
      this.sortHouses(data);
    });
  },
  onShow: function () {
    this.setData({
      houses: app.globalData.houses
    });
    this.initSortHouses();
    this.refreshList();
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
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var key = e.currentTarget.dataset.key;
    var house = this.data.sortedHouses[key][index];
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
          this.deleteHouseByHouseId(house.uid);
        }
      }
    });
  },
  deleteHouseByHouseId: function (houseId) {
    wx.request({
      url: config.generateFullUrl('/house?uid=' + houseId),
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
            this.refreshList();
          }
        }
      }
    })
  },
  onEditClick: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var key = e.currentTarget.dataset.key;
    var house = this.data.sortedHouses[key][index];
    wx.navigateTo({
      url: '../../pages/house-edit/house-edit?houseId=' + house.uid + '&editType=edit',
    });
  },
  onAddClick: function () {
    wx.navigateTo({
      url: '../../pages/house-edit/house-edit?editType=add',
    });
  }
})