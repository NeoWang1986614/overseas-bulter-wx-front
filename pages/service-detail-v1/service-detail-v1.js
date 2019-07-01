// pages/service-detail-v1/service-detail-v1.js
const app = getApp()
const utils = require('../../utils/util.js')
const http = require('../../utils/http.js')
const map = require('../../common/map.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*const*/
    map: map,
    serviceType: '',
    serviceUid: '',
    servicePrimary: {
      content: '没有内容',
      basePrice: '0'
    },
    isHomeDecoration: false,
    isHouseMaintain: false,
    isOthers: false,
    isHouseRent: false,
    isHouseSale: false,
    constInvalidIndex: utils.invalidIndex,
    /*price*/
    priceParam: {
      params: ''
    },
    priceParamMinPrice: 0,
    minPriceForDisplay: 0,

    /*house data*/
    houses: [],
    filtedHouses: [],
    housesDescriptions: [],
    isHousesEmpty: true,
    modalConfirmTitle: '',
    filtedHouseCurrentIndex: utils.invalidIndex,
    isShowHouseModal: false,
    /* modal*/
    houseMaintainYear: 1,
    houseRentYear: 1,
    houseRentPrice: {
      "from": 0.0,
      "to": 0.0
    },
    houseRentAccountCountryOptions: [
      {
        title: '中国'
      },
      {
        title: '菲律宾'
      }
    ],
    houseRentAccountCountryOptionsCurrent: '',
    houseRentAccountBank: '',
    houseRentAccountNumber: '',

    priceResult: {
      oldPrice: 0.0,
      newPrice: 0.0,
      discount: 1.0
    },

    /*service data*/
    services: [],
    service: {},
    layoutOptions: [],
    layoutOptionsCurrentIndex: 0,
    homeDecorationAttachment: '',
    houseMaintainAttachment: '',
    attachments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  parseOptions: function (options) {
    if (options && options.hasOwnProperty('type')) {
      this.setData({
        serviceType: options['type'],
        isHomeDecoration: 'home-decoration' == options['type'],
        isHouseMaintain: 'house-maintain' == options['type'],
        isHouseRent: 'house-rent' == options['type'],
        isHouseSale: 'house-sale' == options['type'],
        isOthers: 'others' == options['type'],
      });
      console.log('parseOptions serviceType=');
      console.log(this.data.serviceType);
    }
    if (options && options.hasOwnProperty('uid')) {
      this.data.serviceUid = options['uid'];
      console.log('parseOptions uid=');
      console.log(this.data.serviceUid);
    }
  },
  getCurrentLayoutOption:function(){
    for (let i = 0; i < this.data.layoutOptions.length; i++){
      if (this.data.layoutOptions[i].isChecked){
        return this.data.layoutOptions[i].value;
      }
    }
  },
  getCurrentLayoutMeta: function () {
    for (let i = 0; i < this.data.layoutOptions.length; i++) {
      if (this.data.layoutOptions[i].isChecked) {
        return this.data.layoutOptions[i].meta;
      }
    }
  },
  clearLayoutOptionsToFalse: function(){
    for (let i = 0; i < this.data.layoutOptions.length; i++) {
      if (this.data.layoutOptions[i].isChecked) {
        this.data.layoutOptions[i].isChecked = false;
      }
    }
  },
  housesFilter: function (houses){
    var ret = [];
    if(this.data.isHomeDecoration && 0 != houses.length){
      var currentLayoutOption = this.getCurrentLayoutOption();
      console.log('currentLayoutOption = ', currentLayoutOption);
      for(let i=0; i< houses.length; i++){
        if (currentLayoutOption == houses[i].layout){
          ret.push(houses[i]);
        }
      }
    } else if (this.data.isHouseMaintain && 0 != houses.length){
      for (let i = 0; i < houses.length; i++) {
        if ('home-decoration#completed' == houses[i].status) {
          ret.push(houses[i]);
        }
      }
    } else {
      ret = houses;
    }

    console.log('housesFilter = ', ret);
    return ret;
  },
  /*当前服务类型判断*/
  checkIsHomeDecoration:function(){
    return 'home-decoration' == this.data.serviceType;
  },
  checkIsHouseMaintain: function () {
    return 'house-maintain' == this.data.serviceType;
  },
  forbiddenService: function () {
    return 'house-sale' == this.data.serviceType;
  },
  updateFiltedHouses: function(){
    var filtedHouses = this.housesFilter(this.data.houses);
    var isEmpty = 0 == filtedHouses.length;
    var modalConfirmTitle = '确定';
    if(!isEmpty){
      modalConfirmTitle = '提交订单';
    }else if(this.data.isHomeDecoration){
      modalConfirmTitle = '添加房产';
    }

    this.setData({
      filtedHouses: filtedHouses,
      housesDescriptions: utils.generateHousesDescriptions(filtedHouses),
      isHousesEmpty: isEmpty,
      modalConfirmTitle: modalConfirmTitle
    });
    console.log(this.data.housesDescriptions);
    console.log('select index = ', this.data.filtedHouseCurrentIndex);
  },
  getHousesAsync: function (callback) {
    app.getHousesByOwnerIdAsync(app.globalData.loginInfo.userId, 0, this.data.constInvalidIndex, houses => {
      console.log('getHousesAsync', houses);
      this.setData({
        houses: houses
      });
      if (callback) {
        callback();
      }
    });
  },
  onLoad: function (options) {
    this.parseOptions(options);
    this.onUpdateServicePrimary();
    this.querySearchLayout(_ => {
      this.setLayoutCurrentSelection("0");
      this.updatePriceParamMinPrice();
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  setLayoutIsChecked: function(layout){
    if(0==this.data.layoutOptions.length){
      return;
    }
    for (var i = 0; i < this.data.layoutOptions.length; i++){
      this.data.layoutOptions[i].isChecked = false;
      if (layout == this.data.layoutOptions[i].value){
        this.data.layoutOptions[i].isChecked = true;
      }
    }
  },
  getAttachmentFilePath: function () {
    if (0 == this.data.layoutOptions.length) {
      return;
    }
    for (var i = 0; i < this.data.layoutOptions.length; i++) {
      if (this.data.layoutOptions[i].isChecked) {
        return 'https://bulter.mroom.com.cn:8008/overseas-bulter/v1/image?src=image-upload/' + this.data.layoutOptions[i].attachmentFilePath;
      }
    }
  },
  getLayoutIsChecked: function(){
    if(!this.data.isHomeDecoration){
      return 'all';
    }
    if (0 == this.data.layoutOptions.length) {
      return;
    }
    for (var i = 0; i < this.data.layoutOptions.length; i++) {
      if (this.data.layoutOptions[i].isChecked) {
        return this.data.layoutOptions[i].value;
      }
    }
  },
  onLayoutRadioChange: function(e){
    console.log('onLayoutRadioChange e= ');
    console.log(e);
    var index = e.detail.value;
    this.setLayoutCurrentSelection(index);
    this.updatePriceParamMinPrice();
  },
  updateServices: function (callback) {
    app.getServicesByTypeLayoutAsync(this.data.serviceType, this.getLayoutIsChecked(), serviceData => {
      console.log('getServicesAsync', serviceData);
      if (0 != serviceData.length){
        this.setData({
          services: serviceData,
          service: serviceData[0]
        });
      }
      if (callback) {
        callback();
      }
    });
  },
  setNavigationBarTitle: function () {
    var title = '';
    if (this.data.isHomeDecoration){
      title = '全屋家装采购安装服务';
    }else if(this.data.isHouseMaintain){
      title = '全屋维修保养服务';
    } else if (this.data.isHouseMaintain){
      title = '其他服务';
    } else if (this.data.isHouseRent) {
      title = '房屋出租服务';
    } else if (this.data.isHouseSale) {
      title = '房产出售服务';
    }
    wx.setNavigationBarTitle({
      title: title
    });
  },
  updateMinPriceForDisplay: function(){

    var ret = 0;
    if(0==this.data.servicePrimary.basePrice){
      ret = this.data.priceParamMinPrice; 
    }else if(0==this.data.priceParamMinPrice){
      ret = this.data.servicePrimary.basePrice;
    }else{
      ret = this.data.priceParamMinPrice < this.data.servicePrimary.basePrice ? this.data.priceParamMinPrice : this.data.servicePrimary.basePrice;
    }

    this.setData({
      minPriceForDisplay: ret
    });

    console.log(this.data.minPriceForDisplay);
  },
  updatePriceParamMinPrice: function(){
    var layoutId = this.data.layoutOptions[this.data.layoutOptionsCurrentIndex].uid;
    var serviceUid = this.data.serviceUid;
    http.queryPriceParamAsync(serviceUid, layoutId, res => {
      if(0 != res.length){
        this.data.priceParam = res[0];
      }
      this.setData({
        priceParamMinPrice: this.getMinPrice()
      });
      this.updateMinPriceForDisplay();
    });
  },
  getMinPrice: function(){
    if ('' == this.data.priceParam.params){
      return 0;
    }
    var priceParams = JSON.parse(this.data.priceParam.params);
    if (0 == this.data.priceParam.algorithmType) {
      return priceParams.baseFee;
    } else if (1 == this.data.priceParam.algorithmType) {
      return priceParams.feePerYear;
    }
    return 0;
  },
  onShow: function () {
    this.setNavigationBarTitle();
    
    this.getHousesAsync(_ => {
      if (this.data.isShowHouseModal){
        this.updateFiltedHouses();
      }
    });
    console.log('filtedHouseCurrentIndex = ', this.data.filtedHouseCurrentIndex);
  },
  parseMeta: function(){
    if(0 == this.data.servicePrimary.meta.length){
      return;
    }
    this.setData({
      attachments: JSON.parse(this.data.servicePrimary.meta)
    });
    console.log('+++++ meta ==');
    console.log(this.data.attachments);
  },
  onUpdateServicePrimary: function(){
    http.getServicePrimaryAsync(this.data.serviceUid, res=>{
      console.log('get service primary = ');
      console.log(res);
      this.setData({
        servicePrimary: res
      });
      this.parseMeta();
      this.updateMinPriceForDisplay();
    });
  },
  querySearchLayout: function(callback){
    http.querySearchLayoutAsync(0, 10000, res => {
      console.log('query search layouts = ');
      console.log(res);
      this.parseLayouts(res);
      if(callback){
        callback();
      }
    });
  },
  parseLayouts: function(layouts){
    // layoutOptions
    if(0 == layouts.length){
      return;
    }
    for(var i=0; i<layouts.length;i++){
      layouts[i].isChecked = false;
    }
    this.setData({
      layoutOptions: layouts
    });
  },
  setLayoutCurrentSelection: function(index) {
    this.clearLayoutOptionsToFalse();
    this.data.layoutOptions[index].isChecked = true;
    this.setData({
      layoutOptions: this.data.layoutOptions,
      layoutOptionsCurrentIndex: parseInt(index),
    });
    var metaObj = JSON.parse(this.getCurrentLayoutMeta());
    this.data.homeDecorationAttachment = metaObj.homeDecorationAttachment;
    this.data.houseMaintainAttachment = metaObj.houseMaintainAttachment;
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
  // onShareAppMessage: function () {

  // },
  /*save*/
  checkHouseValid: function () {
    console.log('房产是否选择');
    console.log(this.data.filtedHouseCurrentIndex);
    if (utils.invalidIndex == this.data.filtedHouseCurrentIndex) {
      wx.showToast({
        title: '请选择房产!',
      });
      return false;
    }
    console.log('2');
    return true;
  },
  checkInputParamsValid: function(){
    if(this.data.isHouseRent){
      if (this.data.houseRentPrice["from"] >= this.data.houseRentPrice["to"])
      {
        this.notifyMessage('价格范围不合理!');  
        return false;
      } else if ('' == this.data.houseRentAccountCountryOptionsCurrent) {
        this.notifyMessage('请选择账户国家!');
        return false;
      } else if ('' == this.data.houseRentAccountBank) {
        this.notifyMessage('请输入银行名称!');
        return false;
      } else if ('' == this.data.houseRentAccountNumber) {
        this.notifyMessage('请输入账户号码!');
        return false;
      }
    }
    return true;
  },
  submitOrder: function () {
    console.log('submitOrder');
    if (this.data.isHouseMaintain
      && !this.checkSelectHouseIsAllowHousemain()) {
      wx.showModal({
        content: '您的房产不是我们负责的全屋家装服务，暂时不能直接下单，请联系客服咨询!',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#0f0',
        success: res => {
          console.log('confirm');
        }
      })
      return;
    }
    if (!this.checkInputParamsValid()) {
      return;
    }

    console.log('checkUserInfoValid');
    app.checkUserInfoValid(res => {
      if (!res) {
        wx.showModal({
          content: '提交订单前,请先完善个人资料!',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#0f0',
          success: res => {
            console.log('confirm');
            wx.navigateTo({
              url: '../user-info/user-info',
            });
          }
        })
      } else {
        wx.showModal({
          content: '确定提交订单?',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000',
          confirmText: '确定',
          confirmColor: '#0f0',
          success: res => {
            console.log(res)
            if (true == res.confirm) {
              this.setData({
                isShowHouseModal: false
              });
              this.submitOrderAsync(ret => {
                console.log('order sumited :', ret);
                setTimeout(_ => {
                  wx.navigateTo({
                    url: '../../pages/order-detail/order-detail?uid=' + ret.id,
                  })
                }, 1500);
                this.notifyMessage('订单已提交!');
                this.setData({
                  filtedHouseCurrentIndex: this.data.constInvalidIndex,
                  houseMaintainYear: 1
                });
              });
            }
          }
        })
      }
    });
  },
  notifyMessage: function(msg){
    wx.showToast({
      title: msg,
    }, 1500);
  },
  makeOrderMetaData: function(){
    var ret = '';
    if(this.data.isHouseMaintain){
      ret = JSON.stringify({
        year: this.data.houseMaintainYear,
        attachment: this.data.houseMaintainAttachment,
        houseMeta: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].meta
      });
    } else if(this.data.isHomeDecoration){
      ret = JSON.stringify({
        attachment: this.data.homeDecorationAttachment,
        houseMeta: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].meta
      });
    } else if (this.data.isHouseRent) {
      ret = JSON.stringify({
        year: parseInt(this.data.houseRentYear),
        houseMeta: this.data.filtedHouses[this.data.filtedHouseCurrentIndex].meta,
        priceRange: this.data.houseRentPrice,
        accountCountry: this.data.houseRentAccountCountryOptions[this.data.houseRentAccountCountryOptionsCurrent].title,
        accountBank: this.data.houseRentAccountBank,
        accountNumber: this.data.houseRentAccountNumber,
      });
    } 
    console.log('meta = ');
    console.log(ret);
    return ret;
  },
  getPayStatus: function(){
    if(this.data.isHouseRent){
      return 'paid';
    }
    return 'non-payment';
  },
  submitOrderAsync: function (callback) {
    var selectHouse = this.data.filtedHouses[this.data.filtedHouseCurrentIndex];
    console.log('selectHouse=');
    console.log(selectHouse);
    app.submitOrderAsync({
      type: this.data.serviceType,
      content: this.data.servicePrimary.content,
      houseId: selectHouse.uid,
      houseNation: selectHouse.nation,
      houseAdLevel1: selectHouse.adLevel1,
      houseAdLevel2: selectHouse.adLevel2,
      houseAdLevel3: selectHouse.adLevel3,
      houseStreetName: selectHouse.streetName,
      houseStreetNum: selectHouse.streetNum,
      houseBuildingNum: selectHouse.buildingNum,
      houseRoomNum: selectHouse.roomNum,
      houseAddress: selectHouse.address,
      houseLayout: selectHouse.layout,
      houseArea: selectHouse.area,
      price: this.data.priceResult.newPrice,
      status: this.getPayStatus(),
      placerId: app.globalData.loginInfo.userId,
      accepterId: 'root',
      meta: this.makeOrderMetaData(),
    }, data => {
      console.log('submit success', data);
      if (callback) {
        callback(data);
      }
    });
  },
  onSelectHouseClick: function(){
    this.getHousesAsync(_ => {
      if(!this.data.servicePrimary.hasOwnProperty('uid') ||
        this.forbiddenService()){//暂时未开通
        wx.showToast({
          title: '暂时没有服务!',
        },1500);
        return;
      }
      this.updateFiltedHouses();
      this.setData({
        isShowHouseModal: true
      });
    });
  },
  onHouseModalCancel: function(){
    console.log('cancel');
    this.setData({
      houseMaintainYear: 1,
      filtedHouseCurrentIndex: this.data.constInvalidIndex,
      isShowHouseModal: false
    });
  },
  checkSelectHouseIsAllowHousemain: function(){
    var selectHouse = this.data.filtedHouses[this.data.filtedHouseCurrentIndex];
    if('home-decoration#completed' == selectHouse.status){
      return true;
    }
    return false;
  },
  checkRoomNumAndLayoutChartsValid: function(){
    if (utils.invalidIndex == this.data.filtedHouseCurrentIndex) {
      return;
    }

    var house = this.data.filtedHouses[this.data.filtedHouseCurrentIndex];

    console.log('checkRoomNumAndLayoutChartsValid');
    console.log(house.roomNum);
    console.log(house.meta);
   
   var isValid = true;
   var noRoomNum = true;
   var noLayouChart = true;
    if (0 != house.roomNum.length){
      noRoomNum = false;
    }

    if (0 != house.meta.length) {
      var meta = JSON.parse(house.meta);
      if (meta.hasOwnProperty("layoutChart") && 0 < meta.layoutChart.length) {
        noLayouChart = false;
      }
    }
    
    var modalTitle = '';
    if(noRoomNum && noLayouChart){
      modalTitle = '请补充完整该房产的房号和户型图!';
      isValid = false;
    }
    if(noRoomNum && !noLayouChart){
      modalTitle = '请补充完整该房产的房号!';
      isValid = false;
    }
    if (!noRoomNum && noLayouChart) {
      modalTitle = '请补充完整该房产的户型图!';
      isValid = false;
    }
    if (!isValid){
      wx.showModal({
        content: modalTitle,
        showCancel: true,
        confirmText: '去补充',
        confirmColor: '#0f0',
        success: res => {
          if (true==res.confirm){
            console.log('去填!');
            this.navigateToEditHouse();
          }
        }
      })
    }
    return isValid;
  },
  onHouseModalConfirmClick: function(){
    if(this.data.isHouseMaintain && this.data.isHousesEmpty){
      this.setData({
        isShowHouseModal: false
      });
      return;
    }

    console.log(this.data.filtedHouses.length);
    if(0 == this.data.filtedHouses.length){
      this.navigateToAddHouse();
    }else{
      if (this.checkHouseValid() && 
          this.checkRoomNumAndLayoutChartsValid()){
        this.submitOrder();
      }
    }
  },
  onHouseMaintainYearInput: function(e){
    console.log('onHouseMaintainYearInput e= ',e);
    this.data.houseMaintainYear = (0 == e.detail.value.length) ? '1': e.detail.value;
    if (this.data.constInvalidIndex != this.data.filtedHouseCurrentIndex){
      this.computePrice();
    }
  },
  onHouseRentPriceFromInput: function (e) {
    console.log('onHouseRentPriceFromInput e= ');
    console.log(e);

    var priceFrom = parseFloat((0 == e.detail.value.length) ? '0' : e.detail.value);
    this.setData({
      houseRentPrice: {
        "from": priceFrom,
        "to": this.data.houseRentPrice["to"]
      }
    });

  },
  onHouseRentPriceToInput: function (e) {
    console.log('onHouseRentPriceToInput e= ');
    console.log(e);
    var priceTo = parseFloat((0 == e.detail.value.length) ? '0' : e.detail.value);
    this.setData({
      houseRentPrice: {
        "to": priceTo,
        "from": this.data.houseRentPrice["from"]
      }
    });
  },
  onHouseRentYearInput: function (e) {
    console.log('onHouseRentYearInput e= ');
    console.log(e);
    var year = parseFloat((0 == e.detail.value.length) ? '0' : e.detail.value);
    this.setData({
      houseRentYear: year
    });
  },
  onHouseRentAccountBankInput: function (e) {
    console.log('onHouseRentAccountBankInput e= ');
    console.log(e);
    this.data.houseRentAccountBank = e.detail.value;
  },
  onHouseRentAccountNumberInput: function (e) {
    console.log('onHouseRentAccountNumberInput e= ');
    console.log(e);
    this.data.houseRentAccountNumber = e.detail.value;
  },
  onHouseRentAccountCountryRadioChange: function(e){
    console.log('onHouseRentAccountCountryRadioChange e= ');
    console.log(e);
    this.data.houseRentAccountCountryOptionsCurrent = e.detail.value;
  },
  getUidByLayoutValue: function(v){
    console.log('layoutOptions = ');
    console.log(this.data.layoutOptions);
    if (0 == this.data.layoutOptions.length){
      return '';
    }
    for (var i = 0; i < this.data.layoutOptions.length; i++){
      console.log(v);
      console.log(this.data.layoutOptions[i].value)
      if (v == this.data.layoutOptions[i].value){
        return this.data.layoutOptions[i].uid;
      }
    }
  },
  getComputePriceParam: function(){
    var selectedHouse = this.data.filtedHouses[this.data.filtedHouseCurrentIndex];
    if ('home-decoration' == this.data.serviceType){
      var param = {
        area: selectedHouse.area
      }
      return {
        service_id: this.data.serviceUid,
        layout_id: this.getUidByLayoutValue(selectedHouse.layout),
        param: JSON.stringify(param)
      };
    } else if('house-maintain' == this.data.serviceType){
      var param = {
        year: parseInt(this.data.houseMaintainYear)
      }
      return {
        service_id: this.data.serviceUid,
        layout_id: this.getUidByLayoutValue(selectedHouse.layout),
        param: JSON.stringify(param)
      };
    }
  },
  computePrice: function(){
    app.queryPriceAsync(this.getComputePriceParam(), ret=>{
      console.log('query price result = ');
      console.log(ret);
      this.setData({
        priceResult: ret
      });
    });
  },
  onHouseRadioChange: function(e){
    console.log('onHouseRadioChange e=', e);
    var clickedIndex = e.detail.value;
    this.setData({
      filtedHouseCurrentIndex: clickedIndex
    });
    if(!this.data.isHouseRent){
      this.computePrice();
    }
  },
  onNavigateToAddHouse: function(){
    this.navigateToAddHouse();
  },
  navigateToAddHouse: function () {
    wx.navigateTo({
      url: '../../pages/house-edit/house-edit?editType=add',
    });
  },
  navigateToEditHouse: function () {
    if (utils.invalidIndex == this.data.filtedHouseCurrentIndex) {
      return;
    }

    var house = this.data.filtedHouses[this.data.filtedHouseCurrentIndex];

    wx.navigateTo({
      url: '../../pages/house-edit/house-edit?houseId=' + house.uid + '&editType=edit',
    });
  },
  onOthersAttachmentClick: function(e){
    var index = e.currentTarget.dataset.index;
    var item = this.data.attachments[index];
    this.openOnlineFile(item.fileUrl);
  },
  onAttachmentClick: function(){
    console.log('onAttachmentClick');
    var attachmentUrl = '';
    if(this.data.isHomeDecoration){
      attachmentUrl = this.data.homeDecorationAttachment;
    }else if(this.data.isHouseMaintain){
      attachmentUrl = this.data.houseMaintainAttachment;
    }
    console.log(attachmentUrl);
    this.openOnlineFile(attachmentUrl);
  },
  openOnlineFile: function(fileUrl){
    wx.downloadFile({
      url: fileUrl,
      success: function (res) {
        console.log('download file = ');
        console.log(res);
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType: 'xlsx',
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: res => {
            console.log('open document fail');
            console.log(res);
          }
        })
      }
    });
  }
})