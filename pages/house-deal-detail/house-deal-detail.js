// pages/house-deal-detail/house-deal-detail.js
const app = getApp()
const map = require('../../common/map.js')
const http = require('../../utils/http.js')
const utils = require('../../utils/util.js')
const constant = require('../../common/constant.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseDealType: '',
    source: '',
    houseId: '',
    isHouseSale: false,
    isHouseRent: false,
    isExistProxy: false,
    isExistSelf: false,
    isNew: false,

    isHouseExist: false,
    house: {},
    houseDeal:{
      property: '',
      area: '',
      address: '',
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
    imageArr: [],
    /*const*/
    invalidIndex: utils.invalidIndex,
    map: map,
    /*property*/
    propertyOptions: constant.propertyOptions,
    propertyTextOptions: [],
    propertyCurrentIndex: utils.invalidIndex,
    buttonTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  checkPageOrigin: function(){
    if(0==this.data.houseId.length){
      this.setData({
        isNew: true
      });
    }else{
      if('proxy'==this.data.source){
        this.setData({
          isExistProxy: true
        });
      } else if ('self' == this.data.source){
        this.setData({
          isExistSelf: true
        });
      }
    }
    
    console.log(this.data.isNew);
    console.log(this.data.isExistProxy);
    console.log(this.data.isExistSelf);

  },
  parseOptions: function(options) {
    if (options && options.hasOwnProperty('type')) {
      this.setData({
        houseDealType: options['type']
      });
      console.log('parseOptions type=');
      console.log(this.data.houseDealType);
      this.setData({
        isHouseRent: 'house-rent' == this.data.houseDealType,
        isHouseSale: 'house-sale' == this.data.houseDealType
      });
    }
    if (options && options.hasOwnProperty('houseId')) {
      this.setData({
        houseId: options['houseId'],
        isHouseExist: true
      });
      console.log('parseOptions houseId=');
      console.log(this.data.houseId);
    }
    if (options && options.hasOwnProperty('source')) {
      this.data.source = options['source'];
      console.log('parseOptions source=');
      console.log(this.data.source);
    }
    this.checkPageOrigin();
  },
  makeOptionArrToTextArr(fromArr, toArr, isMixed) {
    if (!fromArr || !toArr || 0 == fromArr.length) {
      return;
    }
    for (let i = 0; i < fromArr.length; i++) {
      toArr.push((isMixed ? fromArr[i] : '') + map.text[fromArr[i]]);
    }
  },
  makeTextOptions() {
    this.makeOptionArrToTextArr(this.data.propertyOptions, this.data.propertyTextOptions, false);

    this.setData({
      propertyTextOptions: this.data.propertyTextOptions
    });
  },
  getHouseAsync: function(){
    if(''==this.data.houseId){
      return;
    }
    http.getHouseAsync(this.data.houseId, res=>{
      console.log('house = ');
      console.log(res);
      this.data.house = res;
      this.convertHouseInfoToHouseDeal();
    });
  },
  convertHouseInfoToHouseDeal: function(){
    this.data.houseDeal.area = this.data.house.area;
    this.data.houseDeal.address = utils.getHouseAddress(this.data.house);
    console.log(this.data.houseDeal);
    // this.data.propertyCurrentIndex = this.data.propertyOptions.indexOf(this.data.houseDeal.property);
    this.setData({
      houseDeal: this.data.houseDeal,
      propertyCurrentIndex: this.data.propertyOptions.indexOf(this.data.house.property)
    });
    console.log(this.data.propertyOptions);
    console.log(this.data.propertyCurrentIndex);
  },
  initAction: function(){
    this.makeTextOptions();
  },
  setButtonTitle: function(){
    var title = '';
    if(this.data.isHouseRent){
      if(this.data.isExistProxy){
        title = '发布并委托菲洋管家出租';
      }else{
        title = '发 布 出 租';
      }
    } else if (this.data.isHouseSale){
      if (this.data.isExistProxy) {
        title = '发布并委托菲洋管家出售';
      } else {
        title = '发 布 出 售';
      }
    }
    this.setData({
      buttonTitle: title
    });
  },
  onLoad: function (options) {
    this.parseOptions(options);
    this.initAction();
    this.getHouseAsync();
    this.setButtonTitle();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  getNaviBarTitle: function () {
    if (this.data.isHouseRent) {
      return '房屋出租信息填写';
    } else if (this.data.isHouseSale) {
      return '二手房出售信息填写';
    }
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: this.getNaviBarTitle(),
    })
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
  onPropertyPickerChange(e) {
    var index = e.detail.value;
    this.setData({
      propertyCurrentIndex: index
    });
    this.data.houseDeal.property = this.data.propertyOptions[this.data.propertyCurrentIndex];
  },
  onAreaInput: function (e) {
    console.log(e);
    this.data.houseDeal.area = e.detail.value;
  },
  onNoteInput: function(e){
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
  onAddressInput: function (e) {
    console.log(e);
    this.data.houseDeal.address = e.detail.value;
  },
  onImageItemClick: function(e){
    console.log(e);
    var imgUrl = e.currentTarget.dataset.url;
    console.log(imgUrl);
    wx.previewImage({
      current: imgUrl,
      urls: [imgUrl]
    });
  },
  onImageDeleteClick: function(e){
    var index = e.currentTarget.dataset.index;
    this.data.imageArr.splice(index, 1);
    this.setData({
      imageArr: this.data.imageArr
    });
  },
  onChooseLocalImage: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log('images = ');
        console.log(res);
        this.setData({
          imageArr: this.data.imageArr.concat(res.tempFilePaths)
        });
        console.log(this.data.imageArr);
      }
    })
  },
  uploadImages: function(imgArr, callback){
    this.uploadImageOneByOne(imgArr, 0, res => {
      console.log('uploadImages = ');
      console.log(res);
      callback(res);
    });
  },
  uploadImageOneByOne: function (imgArr, index, callback){

    console.log('read to upload index = ');
    console.log(index);

    if ((0 == imgArr.length || index == imgArr.length)
        && callback){
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

        setTimeout(_=>{
          this.uploadImageOneByOne(imgArr, index + 1, res3 => {
            ret = ret.concat(res3);
            console.log('ret = ');
            console.log(ret);
            callback(ret);
          });
        },1000);
        
      },
      fail: res2 => {
        console.log('error: fail res=', res2);
        if (callback) {
          callback(null);
        }
      },
    });
  },
  makeImageArr: function(imgArr){
    if(0==imgArr.length){
      return;
    }
    this.data.houseDeal.image = JSON.stringify(imgArr);
  },
  makeHouseDeal: function(){
    if(0!=this.data.source.length){
      this.data.houseDeal.source = this.data.source;
    }
    this.data.houseDeal.property = this.data.propertyOptions[this.data.propertyCurrentIndex];
    this.data.houseDeal.dealType = this.data.houseDealType;
    this.data.houseDeal.area = '' + this.data.houseDeal.area;
    this.data.houseDeal.creator = app.globalData.loginInfo.userId;
    if(''!=this.data.houseId){
      var houseIdObj = {
        houseId: this.data.houseId
      }
      this.data.houseDeal.meta=JSON.stringify(houseIdObj);
    }
  },
  navigateBack: function(){
    if(this.data.isNew){
      wx.navigateBack({
      });
    }else{
      wx.navigateBack({
        delta: 2
      });
    }
  },
  checkValid: function(){
    if (utils.invalidIndex == this.data.propertyCurrentIndex){
      app.notifyMessage('未选择房源性质!');
      return false;  
    }
    if (0 == this.data.houseDeal.area.length) {
      app.notifyMessage('未填写面积!');
      return false;
    }
    if (0 == this.data.houseDeal.address.length) {
      app.notifyMessage('未填写具体地址!');
      return false;
    }
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
  getLoadingText: function(){
    if(this.data.isExistProxy){
      return '发布中...';
    }else{
      return '发布中...';
    }
  },
  getSuccessText: function () {
    if (this.data.isExistProxy) {
      return '发布成功!';
    } else {
      return '发布成功!';
    }
  },
  onPublishClick: function(){

    if (!this.checkValid()){
      return;
    }

    this.uploadImages(this.data.imageArr, res=>{
      console.log("upload images success");
      console.log(res);
      this.makeImageArr(res);
      this.makeHouseDeal();
      http.addHouseDealAsync(this.data.houseDeal, res => {
        console.log('add house async success!');
        wx.hideLoading();
        wx.showToast({
          title: this.getSuccessText()
        });
        setTimeout(_=>{
          this.navigateBack();
        }, 1500);
      });
    });
    wx.showLoading({
      title: this.getLoadingText(),
      mask: true
    });
  }
})