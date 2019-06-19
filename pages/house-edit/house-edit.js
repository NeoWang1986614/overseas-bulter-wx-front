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
    isHouseDeal: false,
    houseId: '',
    isHouseIdExist: false,
    /*出租信息*/
    isHouseInfoReadOnly: false,
    houseDealType: '',
    houseDealSource: '',
    isProxy: false,
    isHouseRent: false,
    isHouseSale: false,
    houseDeal: {
      dealType: '',
      source: '',
      houseId: '',
      decoration: '',
      cost: '',
      linkman: '',
      contactNum: '',
      mail: '',
      weixin: '',
      image: '',
      note: '',
      creator: '',
      meta: ''
    },
    houseDealImageTotalCount: 4,
    houseDealImageArr:[],
    rentUncompressImages:[],



    cWidth: 400,
    cHeight: 400,
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
  parseOptions: function(options){
    if (options && options.hasOwnProperty('houseId')) {
      this.data.houseId = options['houseId'];
      this.data.isHouseIdExist = true;
      console.log('house id = ' + this.data.houseId);
    }
    if (options && options.hasOwnProperty('editType')) {
      this.data.editType = options['editType'];
    }
    if (options && options.hasOwnProperty('isHouseDeal')) {
      this.setData({
        isHouseDeal: true
      });
    }
    if (options && options.hasOwnProperty('source')) {
      this.setData({
        houseDealSource: options['source']
      });
      console.log('parseOptions source=');
      console.log(this.data.houseDealType);
      this.setData({
        isProxy: 'proxy' == this.data.houseDealSource
      });
    }
    if (options && options.hasOwnProperty('dealtype')) {
      this.setData({
        houseDealType: options['dealtype']
      });
      console.log('parseOptions dealtype=');
      console.log(this.data.houseDealType);
      this.setData({
        isHouseRent: 'house-rent' == this.data.houseDealType,
        isHouseSale: 'house-sale' == this.data.houseDealType
      });
    }

    if(this.data.isHouseDeal && this.data.isHouseIdExist){
      this.setData({
        isHouseInfoReadOnly: true
      });
    }

  },
  initHouseInfoPage:function(){
    if (this.data.editType == 'add') {
      this.data.navigateTitle = '添加新房产';
      this.data.isEdit = false;
      this.setData({
        propertyCurrentIndex: 0
      });
    } else {
      this.data.navigateTitle = '编辑房产信息';
      this.data.isEdit = true;
      this.getHouseInfoAsync(this.data.houseId, res => {
        this.initHouseInfo();
      });
    }
  },
  initHouseDealPage: function () {
    this.data.navigateTitle = '出租信息填写';
    this.setData({
      propertyCurrentIndex: 0
    });
    if(this.data.isHouseIdExist){
      this.getHouseInfoAsync(this.data.houseId, res => {
        this.initHouseInfo();
      });
    }
  },
  onLoad: function (options) {
    console.log(options);
    this.makeTextOptions();

    this.parseOptions(options);

    if(this.data.isHouseDeal){
      this.initHouseDealPage();
    }else{
      this.initHouseInfoPage();
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

  /*出租*/
  onNoteInput: function (e) {
    console.log(e);
    this.data.houseDeal.note = e.detail.value;
  },
  onWeixinInput: function (e) {
    console.log(e);
    this.data.houseDeal.weixin = e.detail.value;
  },
  onMailInput: function (e) {
    console.log(e);
    this.data.houseDeal.mail = e.detail.value;
  },
  onContactNumInput: function (e) {
    console.log(e);
    this.data.houseDeal.contactNum = e.detail.value;
  },
  onLinkmanInput: function (e) {
    console.log(e);
    this.data.houseDeal.linkman = e.detail.value;
  },
  onCostInput: function (e) {
    console.log(e);
    this.data.houseDeal.cost = e.detail.value;
  },
  onDecorationInput: function (e) {
    console.log(e);
    this.data.houseDeal.decoration = e.detail.value;
  },
  compressImageSingle: function (index) {

    utils.calculateCompressImageSize(
      this.data.rentUncompressImages[index],
      400,
      400,
      (w, h) => {
        console.log('宽 = ' + w);
        console.log('高 = ' + h);
        this.setData({
          cWidth: w,
          cHeight: h
        });
        utils.compressImage(
          this.data.rentUncompressImages[index],
          'canvas',
          this.data.cWidth,
          this.data.cHeight,
          res1 => {
            console.log('res1 = ');
            console.log(res1);
            if (res1) {
              this.data.houseDealImageArr.push(res1);
              this.setData({
                houseDealImageArr: this.data.houseDealImageArr
              });
              if (++index < this.data.rentUncompressImages.length) {
                this.compressImageSingle(index);
              }
            }
          });
      });
  },
  onChooseHouseDealImage: function () {
    var leftCount = this.data.houseDealImageTotalCount - this.data.houseDealImageArr.length;
    wx.chooseImage({
      count: leftCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log('images = ');
        console.log(res);
        this.data.rentUncompressImages = res.tempFilePaths;
        this.compressImageSingle(0, null);
      }
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
    } else if (0 == this.data.area) {
      toastTitle = '请填写房产面积!';
    } else if (this.data.invalidIndex == this.data.layoutCurrentIndex) {
      toastTitle = '请选择户型!';
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

  /*发布出租*/
  uploadHouseDealImages: function (imgArr, callback) {
    this.uploadHouseDealImageOneByOne(imgArr, 0, res => {
      console.log('uploadImages = ');
      console.log(res);
      callback(res);
    });
  },
  uploadHouseDealImageOneByOne: function (imgArr, index, callback) {

    console.log('read to upload index = ');
    console.log(index);

    if ((0 == imgArr.length || index == imgArr.length)
      && callback) {
      callback([]);
      return;
    }

    console.log('wx.uploadFile= ');
    console.log(imgArr[index]);

    wx.uploadFile({
      url: 'https://bulter.mroom.com.cn:8008/overseas-bulter/v1/image',
      filePath: imgArr[index],
      name: 'img',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json'
      },
      success: res1 => {
        console.log('success res = ');
        console.log(res1);
        var imagePath = JSON.parse(res1.data);
        var ret = [imagePath.path];

        setTimeout(_ => {
          this.uploadHouseDealImageOneByOne(imgArr, index + 1, res3 => {
            ret = ret.concat(res3);
            console.log('ret = ');
            console.log(ret);
            callback(ret);
          });
        }, 1000);

      },
      fail: res2 => {
        console.log('error: fail res=', res2);
        if (callback) {
          callback(null);
        }
      },
    });
  },
  checkHouseDealValid: function () {
    if (0 == this.data.houseDeal.decoration.length) {
      app.notifyMessage('未填写装修情况!');
      return false;
    }
    if (0 == this.data.houseDeal.cost.length) {
      app.notifyMessage('未填写租金!');
      return false;
    }
    if (0 == this.data.houseDeal.linkman.length) {
      app.notifyMessage('未填写联系人!');
      return false;
    }
    if (0 == this.data.houseDeal.contactNum.length) {
      app.notifyMessage('未填写联系电话!');
      return false;
    }
    if (0 == this.data.houseDeal.mail.length) {
      app.notifyMessage('未填写邮箱!');
      return false;
    }
    if (0 == this.data.houseDeal.weixin.length) {
      app.notifyMessage('未填写微信!');
      return false;
    }
    return true;
  },
  onHouseDealImageDeleteClick: function(e){
    var index = e.currentTarget.dataset.index;
    this.data.houseDealImageArr.splice(index, 1);
    this.setData({
      houseDealImageArr: this.data.houseDealImageArr
    });
  },
  makeHouseDealImageArr: function (imgArr) {
    if (0 == imgArr.length) {
      return;
    }
    this.data.houseDeal.image = JSON.stringify(imgArr);
  },
  makeHouseDeal: function () {
    this.data.houseDeal.source = this.data.houseDealSource;
    this.data.houseDeal.dealType = this.data.houseDealType;
    this.data.houseDeal.houseId = this.data.houseId;
    this.data.houseDeal.creator = app.globalData.loginInfo.userId;
  },
  doHouseDealPublish: function(callback){

    this.uploadHouseDealImages(this.data.houseDealImageArr, res => {
      console.log("upload images success");
      console.log(res);
      this.makeHouseDealImageArr(res);
      this.makeHouseDeal();
      http.addHouseDealAsync(this.data.houseDeal, res => {
        console.log('add house deal async success!');
        if (callback){
          callback(true);
        }
      });
    });

  },
  
  doHouseSave: function(callback){

    console.log('准备保存房产信息:', this.data.houseInfo);

    if(this.data.isHouseInfoReadOnly){
      callback(true);
      return;
    }

    this.uploadLayoutCharts(result => {
      if (!result) {
        app.notifyMessage('上传户型图错误!');
        callback(false);
        return;
      }

      this.makeHouseInfo();

      if (!this.data.isEdit) {
        this.addHouse(res => {
          console.log(res);
          this.data.houseId = res.data.uid;
          callback(true);
        });
      } else {
        this.updateHouse(res => {
          console.log(res);
          callback(true);
        });
      }

    });
  },
  getLoadingText: function () {
    if (this.data.isHouseDeal) {
      return '发布中...';
    } else {
      return '保存中...';
    }
  },
  showLoading: function(){
    var title = '';
    if(this.data.isHouseDeal){
      title = '发布中...';
    }else{
      title = '保存中...';
    }
    wx.showLoading({
      title: title,
    })
  },
  hideLoading: function(){
    wx.hideLoading();
  },
  delayToNavigate: function(){
    setTimeout(_=>{
      var backDelta = 1;
      if (this.data.isHouseDeal) {
        if(this.data.isHouseIdExist){
          backDelta = 2;
        }
      }
      wx.navigateBack({
        delta: backDelta
      });
    }, 1500);
    
  },
  checkAllValid: function(){

    if (!this.data.isHouseDeal && this.data.isEdit && !this.data.isEditable) {
      app.notifyMessage('无法修改资料!');
      return false;
    }

    if (!this.checkHouseInfoValid()) {
      return false;
    }

    if (this.data.isHouseDeal && !this.checkHouseDealValid()) {
      return false;
    }

    return true;
  },
  onSaveOrPublishClick: function (e) {

    if(!this.checkAllValid()){
      return;
    }


    this.showLoading();
    this.doHouseSave(isSuccess1=>{

      if(!this.data.isHouseDeal){
        this.hideLoading();
        if (isSuccess1) {
          app.notifyMessage('保存成功!');
          this.delayToNavigate();
        }
      }else{
        this.doHouseDealPublish(isSuccess2=>{
          this.hideLoading();
          if (isSuccess1) {
            app.notifyMessage('发布成功!');
            this.delayToNavigate();
          }
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
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log('images = ');
        console.log(res);
        var tempFile = res.tempFiles[0];

        utils.calculateCompressImageSize(tempFile.path, 400, 400, (w, h)=>{
          console.log('宽 = ' + w);
          console.log('高 = ' + h);
          this.setData({
            cWidth: w,
            cHeight: h
          });
          utils.compressImage(
            tempFile.path,
            'canvas',
            this.data.cWidth,
            this.data.cHeight,
            res1 => {
              console.log('res1 = ');
              console.log(res1);
              this.setData({
                layoutCharts: [res1],
                isLayoutChartsModified: true
              });
            });
        });
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