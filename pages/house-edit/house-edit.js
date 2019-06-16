// pages/house-edit/house-edit.js
const app = getApp()
const config = require('../../common/config.js')
const map = require('../../common/map.js')
const constant = require('../../common/constant.js')
const utils = require('../../utils/util.js')
const http = require('../../utils/http.js')
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

    isEdit: false,
    isEditable: false,
    /*house name*/
    houseName: '',
    /*property*/
    propertyOptions: constant.propertyOptions,
    propertyTextOptions: [],
    propertyCurrentIndex: utils.invalidIndex,
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
    /*area*/
    area: '',
    // areaCharts: [],
    // isAreaChartsModified: false,
    /*layout chart*/
    layoutCharts: [],
    isLayoutChartsModified: false,

    /*layout*/
    layoutOptions: constant.layoutOptions,
    layoutTextOptions: [],
    layoutCurrentIndex: utils.invalidIndex,

    /*map*/
    isOpenMap: false,
    mapCtx: {},
    isRegionParseWaiting: false,
    parseWaitingTimer: null,
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
  regionParse: function(e){
    console.log('region parse');
    if ('end' == e.type) {
      this.data.mapCtx = wx.createMapContext('map');
      this.data.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: res1 => {
          console.log('getCenterLocation success');
          wxMap.reverseGeocoder({
            location: {
              latitude: res1.latitude,
              longitude: res1.longitude
            },
            success: res2 => {
              console.log('reverseGeocoder success');
              var adInfo = res2.result.ad_info;
              var adComponents = res2.result.address_component;
              this.data.lat=adInfo.location.lat;
              this.data.lng= adInfo.location.lng;
              this.setData({
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
  regionchange(e) {
    console.log('region change e = ', e);
    if (this.data.parseWaitingTimer){
      clearTimeout(this.data.parseWaitingTimer)
      this.data.parseWaitingTimer = null;
    }
    this.data.parseWaitingTimer = setTimeout(_ => {
      this.regionParse(e, null);
    }, 1000);
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
    var meta = JSON.parse(this.data.houseInfo.meta);
    this.setData({
      houseName: this.data.houseInfo.name,
      propertyCurrentIndex: this.data.propertyOptions.indexOf(this.data.houseInfo.property),
      nationCurrentIndex: this.data.nationOptions.indexOf(this.data.houseInfo.nation),
      adLevel1CurrentIndex: this.data.adLevel1Options.indexOf(this.data.houseInfo.adLevel1),
      adLevel2CurrentIndex: this.data.adLevel2Options.indexOf(this.data.houseInfo.adLevel2),
      adLevel3: this.data.houseInfo.adLevel3,
      layoutCurrentIndex: this.data.layoutOptions.indexOf(this.data.houseInfo.layout),
      streetName: this.data.houseInfo.streetName,
      streetNum: this.data.houseInfo.streetNum,
      buildingNum: this.data.houseInfo.buildingNum,
      roomNum: this.data.houseInfo.roomNum,
      area: this.data.houseInfo.area,
      layoutCharts: meta.layoutChart,
      // areaCharts: meta.areaChart,
      isEditable: 'editable' == this.data.houseInfo.status
    });
  },
  makeTextOptions(){
    this.makeOptionArrToTextArr(this.data.nationOptions, this.data.nationTextOptions, true);
    this.makeOptionArrToTextArr(this.data.adLevel1Options, this.data.adLevel1TextOptions, true);
    this.makeOptionArrToTextArr(this.data.adLevel2Options, this.data.adLevel2TextOptions, true);
    this.makeOptionArrToTextArr(this.data.layoutOptions, this.data.layoutTextOptions, false);
    this.makeOptionArrToTextArr(this.data.propertyOptions, this.data.propertyTextOptions, false);
    console.log(this.data.propertyTextOptions);
    this.setData({
      nationTextOptions: this.data.nationTextOptions,
      adLevel1TextOptions: this.data.adLevel1TextOptions,
      adLevel2TextOptions: this.data.adLevel2TextOptions,
      layoutTextOptions: this.data.layoutTextOptions,
      propertyTextOptions: this.data.propertyTextOptions
    });
  },
  onLoad: function (options) {
    console.log(options);
    this.makeTextOptions();

    this.data.editType = options['type'];
    if (this.data.editType == 'add') {
      this.data.navigateTitle = '添加新房产';
      this.data.isEdit = false;
    }else{
      this.data.navigateTitle = '编辑房产';
      this.data.isEdit = true;
      if(!options.hasOwnProperty('uid')){
        return;
      }
      this.getHouseInfoAsync(options['uid'], res=>{
        this.initHouseInfo();
      });
    }
  },
  onHouseNameInput: function (e) {
    console.log(e);
    this.setData({
      houseName: e.detail.value
    });
  },
  onPropertyPickerChange(e) {
    var index = e.detail.value;
    this.setData({
      propertyCurrentIndex: index
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
  onAreaInput: function(e){
    this.setData({
      area: e.detail.value
    });
    console.log('area = ', this.data.area);
  },
  onMapCheckChange: function(e){
    console.log('onMapCheckChange e=', e);
    this.setData({
      isOpenMap: !this.data.isOpenMap
    });
  },
  onPreviwImageClick: function(e){
    console.log(e);
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
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
    http.querySearchLayoutAsync(0, 10000, res => {
      console.log('query search layouts = ');
      console.log(res);
      this.parseLayoutArray(res);
    });
  },
  parseLayoutArray: function(layouts){
    var layoutOptions = [];
    var layoutTextOptions = [];
    if (0 == layouts.length){
      return;
    }
    for(var i=0; i<layouts.length; i++){
      layoutOptions.push(layouts[i].value);
      layoutTextOptions.push(layouts[i].title);
    }
    this.setData({
      layoutOptions: layoutOptions,
      layoutTextOptions: layoutTextOptions
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
  onOpenMapClick(){
    this.setData({
      isShowMapModal: true
    });
  },
  saveSuccess: function(res) {
    if (200 == res.statusCode) {
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
      app.notifyMessage('网络错误!');
    }
  },
  checkHouseInfoValid: function() {
    var toastTitle = '';
    if (0 == this.data.houseName.length){
      toastTitle = '请填写楼盘名字!';
    } else if (this.data.invalidIndex == this.data.propertyCurrentIndex) {
      toastTitle = '请选择房源性质!'; 
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
    } else if (0 == this.data.area) {
      toastTitle = '请填写房产面积!';
    } else if (this.data.invalidIndex == this.data.layoutCurrentIndex) {
      toastTitle = '请选择户型!';
    } else if (0 == this.data.layoutCharts.length) {
      toastTitle = '请上传户型图!';
    }

    if ('' == toastTitle){
      return true;
    }
    app.notifyMessage(toastTitle);

    return false;

  },
  makeMetaData: function(){
    var metaData = {
      layoutChart: this.data.layoutCharts
    };
    return JSON.stringify(metaData);
  },
  makeHouseInfo(){
    this.data.houseInfo.name = this.data.houseName;
    this.data.houseInfo.property = this.data.propertyOptions[this.data.propertyCurrentIndex];
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
    this.data.houseInfo.area = Number(parseFloat(this.data.area).toFixed(2));
    this.data.houseInfo.layout = this.data.layoutOptions[this.data.layoutCurrentIndex];
    this.data.houseInfo.ownerId = app.globalData.loginInfo.userId;
    this.data.houseInfo.meta = this.makeMetaData();
    console.log('makeHouseInfo:');
    console.log(this.data.houseInfo);
  },
  onSaveClick: function (e) {

    if (this.data.isEdit && !this.data.isEditable){
      app.notifyMessage('无法修改资料!');
      return;
    }

    if (!this.checkHouseInfoValid()){
      return;
    }

    console.log('准备保存房产信息:', this.data.houseInfo);

    this.uploadLayoutCharts(result=>{
      if(!result){
        app.notifyMessage('上传户型图错误!');
        return;
      }

      this.makeHouseInfo();

      if (!this.data.isEdit) {
        this.addHouse(res => {
          console.log(res);
          this.saveSuccess(res);
        });
      } else {
        this.updateHouse(res => {
          console.log(res);
          this.saveSuccess(res);
        });
      }

    });
    
  },
  uploadLayoutCharts: function(callback){
    if(!this.data.isLayoutChartsModified && callback){
      callback(true);
      return;
    }
    if(0==this.data.layoutCharts.length){
      console.log('err: no layout charts to upload');
      return;
    }
    console.log('uploadLayoutCharts');
    console.log(this.data.layoutCharts);
    wx.uploadFile({
      url: 'https://bulter.mroom.com.cn:8008/overseas-bulter/v1/image',      //此处换上你的接口地址 
      filePath: this.data.layoutCharts[0],
      name: 'img',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json'
      },
      formData: {
        'user': 'test'  //其他额外的formdata，可不写 
      },
      success: res => {
        console.log('success res = ', res);
        var imagePath = JSON.parse(res.data);
        console.log('imagePath = ', imagePath)
        this.data.layoutCharts = [imagePath.path];
        if(callback){
          callback(true);
        }
      },
      fail: res => {
        console.log('error: fail res=', res);
        if (callback) {
          callback(false);
        }
      },
    })
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
    console.log('准备更新房屋信息=', this.data.houseInfo);
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
  },
  chooseLocalLayoutImage: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log('images = ', res);
        var tempFilePaths = res.tempFilePaths;
        this.setData({
          layoutCharts: tempFilePaths,
          isLayoutChartsModified: true
        });
        console.log('chooseImage success');
        console.log(this.data.layoutCharts);
      }
    })
  },
  onDeleteLayoutChart: function(){
    console.log('onDeleteLayoutChart');
    this.setData({
      layoutCharts: []
    });
  }
})