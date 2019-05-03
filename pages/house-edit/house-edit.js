// pages/house-edit/house-edit.js
const app = getApp()
const config = require('../../common/config.js')
const map = require('../../common/map.js')
const constant = require('../../common/constant.js')
const utils = require('../../utils/util.js')
const houseEntity = require('../../entity/house.js')
const qqMapWX = require('../../libs/qqmap-wx-jssdk.js');
const wxMap = new qqMapWX({
  key: 'JB3BZ-OVV6X-XQQ4J-ZK6HH-J34KJ-OAB4Y' // 必填
});
Page({

  /**
   * Page initial data
   */
  data: {
    /*const*/
    invalidIndex: utils.invalidIndex,
    map: map,

    navigateTitle: '',
    editType: '',
    houseInfo: {},

    /*house name*/
    houseName: '',
    /*location*/
    lat: '14.607107',
    lng: '121.015916',
    /*nation*/
    nationOptions: constant.nationOptions,
    nationTextOptions: [],
    nationCurrentIndex: 0,//utils.invalidIndex,
    /*adlevel1*/
    adLevel1Options: constant.adLevel1Options,
    adLevel1TextOptions: [],
    adLevel1CurrentIndex: 0,//utils.invalidIndex,
    /*adlevel2*/
    adLevel2Options: constant.adLevel2Options,
    adLevel2TextOptions: [],
    adLevel2CurrentIndex: utils.invalidIndex,
    /*adlevel3*/
    adLevel3:'',
    /*street name*/
    streetName: '',
    /*street num*/
    streetNum: '',
    /*building num*/
    buildingNum: '',
    /*room num*/
    roomNum: '',

    /*layout*/
    layoutOptions: constant.layoutOptions,
    layoutTextOptions: [],
    layoutCurrentIndex: utils.invalidIndex,

    currentIsDefault: false,
    isDefaultIconUrl: '',

    /*map*/
    isOpenMap: false,
    mapCtx: {},
    markers: [],
    isShowMapModal: false,
    mapNation:'',
    mapAdLevel1: '',
    mapAdLevel2: '',
    mapAdLevel3: '',
    mapStreetName: ''
  },
  convertMapToContent: function(){
    var indexOfAdLevel2 = this.data.adLevel2Options.indexOf(this.data.mapAdLevel2);

    if (-1 != indexOfAdLevel2){
      this.setData({
        adLevel2CurrentIndex: indexOfAdLevel2,
      });
    }
    this.setData({
      adLevel3: this.data.mapAdLevel3,
      streetName: this.data.mapStreetName
    });
  },
  regionchange(e) {
    // console.log('region change e = ', e);
    if('end'==e.type){
      this.data.mapCtx = wx.createMapContext('map');
      this.data.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: res => {
          console.log('regionchange res = ', res);
          wxMap.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: res => {
              console.log('wxmap reverse: res =' ,res);
              var adInfo = res.result.ad_info;
              var adComponents = res.result.address_component;
              this.setData({
                lat: adInfo.location.lat,
                lng: adInfo.location.lng,
                mapNation: adComponents.nation,
                mapAdLevel1: adComponents.ad_level_1,
                mapAdLevel2: adComponents.ad_level_2,
                mapAdLevel3: adComponents.ad_level_3,
                mapStreetName: adComponents.street
              });
              this.convertMapToContent();
            },
            fail(res) {
              console.log(res)
            }
          });
        }
      });
    }
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log('control tap e= ', e)
  },
  onMapClick(e){
    console.log('onMapClick: e= ', e);
  },
  onPoiClick(e) {
    console.log('onPoiClick: e= ', e);
  },
  /**
   * Lifecycle function--Called when page load
   */
  makeOptionArrToTextArr(fromArr, toArr, isMixed){
    if (!fromArr || !toArr || 0==fromArr.length){
      return;
    }
    for(let i=0; i< fromArr.length; i++){
      toArr.push((isMixed ? fromArr[i] : '' ) + map.text[fromArr[i]]);
    }
  },
  getHouseInfoAsync(uid, callback){
    app.getHouseAsync(uid, res => {
      console.log('get house async : ', res);
      this.setData({
        houseInfo: res
      });
      if(callback){
        callback();
      }
    });
  },
  initHouseInfo(){
    this.setData({
      houseName: this.data.houseInfo.name,
      nationCurrentIndex: this.data.nationOptions.indexOf(this.data.houseInfo.nation),
      adLevel1CurrentIndex: this.data.adLevel1Options.indexOf(this.data.houseInfo.adLevel1),
      adLevel2CurrentIndex: this.data.adLevel2Options.indexOf(this.data.houseInfo.adLevel2),
      adLevel3: this.data.houseInfo.adLevel3,
      layoutCurrentIndex: this.data.layoutOptions.indexOf(this.data.houseInfo.layout),
      streetName: this.data.houseInfo.streetName,
      streetNum: this.data.houseInfo.streetNum,
      buildingNum: this.data.houseInfo.buildingNum,
      roomNum: this.data.houseInfo.roomNum,
    });
  },
  makeTextOptions(){
    this.makeOptionArrToTextArr(this.data.nationOptions, this.data.nationTextOptions, true);
    this.makeOptionArrToTextArr(this.data.adLevel1Options, this.data.adLevel1TextOptions, true);
    this.makeOptionArrToTextArr(this.data.adLevel2Options, this.data.adLevel2TextOptions, true);
    this.makeOptionArrToTextArr(this.data.layoutOptions, this.data.layoutTextOptions, false);
    console.log(this.data.layoutTextOptions);
    this.setData({
      nationTextOptions: this.data.nationTextOptions,
      adLevel1TextOptions: this.data.adLevel1TextOptions,
      adLevel2TextOptions: this.data.adLevel2TextOptions,
      layoutTextOptions: this.data.layoutTextOptions
    });
  },
  onLoad: function (options) {
    console.log(options);
    this.makeTextOptions();

    this.data.editType = options['type'];
    if (this.data.editType == 'add') {
      this.data.navigateTitle = '添加新房产';
    }else{
      this.data.navigateTitle = '编辑房产';
      if(!options.hasOwnProperty('uid')){
        return;
      }
      this.getHouseInfoAsync(options['uid'], res=>{
        this.initHouseInfo();
      });
      
      this.setData({
        currentIsDefault: app.getDefaultHouseUid() == options['uid']
      });
    }
  },
  onHouseNameInput: function (e) {
    console.log(e);
    this.setData({
      houseName: e.detail.value
    });
  },
  onNationPickerChange(e){
    var index = e.detail.value;
    this.setData({
      nationCurrentIndex: index
    });
  },
  onAdLevel1PickerChange(e) {
    var index = e.detail.value;
    this.setData({
      adLevel1CurrentIndex: index
    });
  },
  onAdLevel2PickerChange(e) {
    var index = e.detail.value;
    this.setData({
      adLevel2CurrentIndex: index
    });
  },
  onAdLevel3Input(e){
    this.setData({
      adLevel3: e.detail.value
    });
  },
  onLayoutPickerChange: function (e) {
    var index = e.detail.value;
    this.setData({
      layoutCurrentIndex: index
    });
  },
  onStreetNameInput: function (e) {
    this.setData({
      streetName: e.detail.value
    });
  },
  onStreetNumInput: function (e) {
    this.setData({
      streetNum: e.detail.value
    });
  },
  onBuildingNumberInput: function (e) {
    this.setData({
      buildingNum: e.detail.value
    });
  },
  onRoomNumberInput: function (e) {
    this.setData({
      roomNum: e.detail.value
    });
  },
  onMapCheckChange: function(e){
    console.log('onMapCheckChange e=', e);
    this.setData({
      isOpenMap: !this.data.isOpenMap
    });
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
    console.log("onShow");
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    });
    this.updateIsDefaultUrl(); 
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
  onIsDefaultClick: function (e) {
    this.data.currentIsDefault = !this.data.currentIsDefault; 
    this.updateIsDefaultUrl(); 
  },
  updateIsDefaultUrl: function () {
    this.setData({
      isDefaultIconUrl: this.data.currentIsDefault ? '../../images/check.png' : '../../images/uncheck.png'
    });
  },
  onOpenMapClick(){
    this.setData({
      isShowMapModal: true
    });
  },
  saveSuccess: function(res) {
    if (200 == res.statusCode) {
      if (this.data.currentIsDefault) {
        app.setDefaultHouseUid(res.data.uid);
      }
      wx.showToast({
        title: '保存成功!',
        icon: 'success',
        duration: 1500,
        success: function () {
          console.log('toast success !');
          setTimeout(function () {
            wx.navigateBack({
            });
          }, 1500);
        }
      });
    } else {
      wx.showToast({
        title: '网络错误!',
      })
    }
  },
  showToast: function(title){
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 1500
    });
  },
  checkHouseInfoValid: function() {
    var toastTitle = '';
    if (0 == this.data.houseName.length){
      toastTitle = '请填写楼盘名字!';
    } else if (this.data.invalidIndex == this.data.nationCurrentIndex) {
      toastTitle = '请选择国家!';
    } else if (this.data.invalidIndex == this.data.adLevel1CurrentIndex) {
      toastTitle = '请选择区域!';
    } else if (this.data.invalidIndex == this.data.adLevel2CurrentIndex) {
      toastTitle = '请选择城市!';
    } else if (0 == this.data.streetName.length) {
      toastTitle = '请填写街道名称!';
    } else if (0 == this.data.streetNum.length) {
      toastTitle = '请填写街道号码!';
    } else if (0 == this.data.buildingNum.length) {
      toastTitle = '请填写完整单元号!';
    } else if (0 == this.data.roomNum.length) {
      toastTitle = '请填写完整单元号!';
    } else if (this.data.invalidIndex == this.data.layoutCurrentIndex) {
      toastTitle = '请选择户型!';
    }

    if ('' == toastTitle){
      return true;
    }

    this.showToast(toastTitle);

    return false;

  },
  makeHouseInfo(){
    this.data.houseInfo.name = this.data.houseName;
    this.data.houseInfo.lat = String(this.data.lat);
    this.data.houseInfo.lng = String(this.data.lng);
    this.data.houseInfo.nation = this.data.nationOptions[this.data.nationCurrentIndex];
    this.data.houseInfo.adLevel1 = this.data.adLevel1Options[this.data.adLevel1CurrentIndex];
    this.data.houseInfo.adLevel2 = this.data.adLevel2Options[this.data.adLevel2CurrentIndex];
    this.data.houseInfo.adLevel3 = this.data.adLevel3;
    this.data.houseInfo.locality = '';
    this.data.houseInfo.streetName = this.data.streetName;
    this.data.houseInfo.streetNum = this.data.streetNum;
    this.data.houseInfo.buildingNum = this.data.buildingNum;
    this.data.houseInfo.roomNum = this.data.roomNum;
    this.data.houseInfo.layout = this.data.layoutOptions[this.data.layoutCurrentIndex];
    this.data.houseInfo.ownerId = app.globalData.loginInfo.userId;
    console.log('makeHouseInfo:', this.data.houseInfo);
  },
  onSaveClick: function (e) {

    if (!this.checkHouseInfoValid()){
      return;
    }

    this.makeHouseInfo();
    

    console.log('准备保存房产信息:', this.data.houseInfo);

    if ('add' == this.data.editType) {
      this.addHouse( res => {
        console.log(res);
        this.saveSuccess(res);
      });
    } else {
      this.updateHouse( res => {
        console.log(res);
        this.saveSuccess(res);
      });
    }
  },
  addHouse: function (callback) {
    wx.request({
      url: config.generateFullUrl('/house'),
      method: 'POST',
      data: houseEntity.convertHouseObject(this.data.houseInfo),
      success: function (res) {
        if (callback) {
          callback(res)
        }
      }
    })
  },
  updateHouse: function (callback) {
    wx.request({
      url: config.generateFullUrl('/house'),
      method: 'PUT',
      data: houseEntity.convertHouseObject(this.data.houseInfo),
      success: function (res) {
        if (callback) {
          callback(res)
        }
      }
    })
  }
  
})