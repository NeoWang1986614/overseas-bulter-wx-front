//app.js
const config = require('common/config.js')
const util = require('utils/util.js')
const map = require('common/map.js')
const caseEntity = require('entity/case.js')
const houseEntity = require('entity/house.js')
const orderEntity = require('entity/order.js')
const userEntity = require('entity/user.js')
const feedbackEntity = require('entity/feedback.js')
const serviceEntity = require('entity/service.js')
const publicAccountEntity = require('entity/public-account.js')
const rentRecordEntity = require('entity/rent-record.js')
const inspectRecordEntity = require('entity/inspect-record.js')
const repairRecordEntity = require('entity/repair-record.js')

App({
  onLaunch: function (options) {
    console.log('app.onLaunch : options =',options);

    if(1044 == options.scene && options.shareTicket && options.query.hasOwnProperty('uid')){
      wx.getShareInfo({
        shareTicket: options.shareTicket,
        success: res => {
          console.log('wx.getShareInfo res=', res);
          this.sendShareDataAsync(options.query.uid, res.encryptedData, res.iv, res => {
            console.log('send share data to server ok !');
          });
        }
      });
    }
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.loginAsync(res => {
            wx.getUserInfo({
              success: res => {
                console.log('wx.getUserInfo res=', res);
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                console.log(res.userInfo);
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          });
        }
      }
    })
  },
  loginAsync: function(callback){
    // 登录
    wx.login({
      success: res => {
        console.log('wx.login res =', res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: config.generateFullUrl('/login'),
          method: 'POST',
          data: {
            code: res.code,
            app_id: config.appId,
            app_secret: config.appSecret
          },
          header: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          success: res => {
            console.log(res);
            var convertedUser = userEntity.convertUserEntity(res.data);
            this.globalData.loginInfo.userId = res.data.uid;
            this.globalData.loginInfo.phoneNumber = res.data.phoneNumber;
            this.globalData.loginInfo.idCardNumber = res.data.idCardNumber;
            if(callback){
              callback();
            }
          }
        })
      }
    });
  },
  globalData: {
    material: {},
    loginInfo: {},
    userInfo: null,
    houses: [],
    layoutOptionsArray:[
      {
        name: 'studio',
        value: '单间',
      },
      {
        name: 'one-bedroom',
        value: '一室一厅',
      },
      {
        name: 'two-bedroom',
        value: '二室一厅',
      },
    ],
    homeDecorationOptions:{
      standardDesign:{
        title: '标准布置设计',
        description: '室内装饰风格是以不同的文化背景及不同的地域特色作依据，通过各种设计元素来营造一种特有的装饰风格。随着设计师根据市场规律总结而提出的轻装修重装饰的理念，风格的体现多在软装上来体现'
      },
      fullHousePurchase:{
        title: '全屋家私电器采购',
        description: '<请选择当前房产>'
      },
      goodsTransport: {
        title: '货品运输服务',
        description: '委托方应支付给货运代理人因货物的运送、保管、投保、保关、签证、办理单据等，以及为其提供其他服务而引起的一切费用，同时还因支付由于货运代理人不能控制的原因致使合同无法履行而产生的其它费用。如货物灭失或损坏系属于保险人承包范围之内，货运代理人赔偿后，从货物所有人那里取得代位求偿权，从其他责任人那里得到补偿或偿还。当货运代理人对货物全部赔偿后，有关货物的所有权便转为货运代理人所有'
      },
      fieldInstallation: {
        title: '现场安装装配服务',
        description: '织专人负责检查设备和配件、附件、工具及图纸、资料等是否齐安；由技术人员、质检人员、安装人员等，根据所承担的设备安装调试特点和技术要求，编制施工的组织设计方案、安装调试方案和制订相应的技术措施，明确重点工艺环节和作业进度，建立专机专项质量检查卡片'
      }
            
    },
    fullHousePurchase:{
      'studio':{
        name: '单间',
        items: [
          {
            name: '灯',
            content: ['全屋顶灯*3','床头落地灯']
          },
          {
            name: '空调',
            content: ['箱式空调']
          },
          {
            name: '洗手间',
            content: ['热水器', '浴帘', '梳洗镜', '梳洗台', '洗衣机']
          },
          {
            name: '厨房',
            content: ['冰箱(小型)','电磁炉','两人组餐座椅','垃圾桶']
          },
          {
            name: '客厅',
            content: ['空调','窗帘','1.5米双人床','挂画','五斗橱/单人衣柜']
          },
          {
            name: '卧室',
            content: ['<无>']
          },
          {
            name: '次卧',
            content: ['<无>']
          },
          {
            name: '床品',
            content: ['床垫','枕头*2','薄被','床单','枕套*2']
          },
          {
            name: '灭火器',
            content: ['喷雾灭火器']
          },
          {
            name: '备选',
            content: ['<无>']
          },
          {
            name: '赠品',
            content: ['大叶绿植一盆','空气除味净化品']
          },
        ]
      },
      'one-bedroom': {
        name: '一室一厅',
        items: [
          {
            name: '灯',
            content: ['全屋顶灯*(4-5)', '台灯']
          },
          {
            name: '空调',
            content: ['箱式空调*2/挂式空调一拖一']
          },
          {
            name: '洗手间',
            content: ['热水器', '浴帘', '梳洗镜', '梳洗台', '洗衣机']
          },
          {
            name: '厨房',
            content: ['冰箱', '微波炉','一体炉具', '四人组餐座椅', '垃圾桶']
          },
          {
            name: '客厅',
            content: ['空调', '窗帘', '沙发','菜几', '电视', '电视柜', '挂画']
          },
          {
            name: '卧室',
            content: ['空调', '窗帘', '1.5米双人床', '床头柜', '双开门衣橱']
          },
          {
            name: '次卧',
            content: ['<无>']
          },
          {
            name: '床品',
            content: ['床垫', '枕头*2', '薄被', '床单', '枕套*2']
          },
          {
            name: '灭火器',
            content: ['喷雾灭火器']
          },
          {
            name: '备选',
            content: ['<无>']
          },
          {
            name: '赠品',
            content: ['大叶绿植一盆', '空气除味净化品']
          },
        ]
      },
      'two-bedroom': {
        name: '一室二厅',
        items: [
          {
            name: '灯',
            content: ['全屋顶灯*(5-8)', '台灯*2']
          },
          {
            name: '空调',
            content: ['挂式空调一拖二']
          },
          {
            name: '洗手间',
            content: ['热水器', '浴帘', '梳洗镜', '梳洗台', '洗衣机']
          },
          {
            name: '厨房',
            content: ['冰箱', '微波炉', '一体炉具', '四人组餐座椅', '垃圾桶']
          },
          {
            name: '客厅',
            content: ['空调', '窗帘', '沙发', '菜几', '电视', '电视柜', '挂画']
          },
          {
            name: '卧室',
            content: ['空调', '窗帘', '1.5米双人床', '床头柜', '双开门衣橱']
          },
          {
            name: '次卧',
            content: ['空调', '窗帘', '1.5米双人床/单人床', '床头柜', '五斗橱/单人衣柜']
          },
          {
            name: '床品',
            content: ['(床垫, 枕头*2, 薄被, 床单, 枕套*2)*2']
          },
          {
            name: '灭火器',
            content: ['喷雾灭火器']
          },
          {
            name: '备选',
            content: ['多一个卫生间: 热水器, 浴帘, 梳洗镜, 梳洗台','佣人房: 单人床(床垫, 枕头, 薄被, 床单, 枕套), 五斗橱, 热水器']
          },
          {
            name: '赠品',
            content: ['大叶绿植一盆', '空气除味净化品']
          },
        ]
      }
    },
    ordersArray:[]
  },
  getLayoutTextByName: function (name) {
    for (let i=0; i < this.globalData.layoutOptionsArray.length; i++){
      if (name === this.globalData.layoutOptionsArray[i].name){
        return this.globalData.layoutOptionsArray[i].value;
      }
    }
  },
  getUserAsync: function (userId, callback) {
    wx.request({
      url: config.generateFullUrl('/user?uid=' + userId),
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log(res);
        var convertedEntity = userEntity.convertUserEntity(res.data)
        if(callback){
          callback(convertedEntity)
        }
      }
    });
  },
  getHouseAsync: function (id, callback) {
    wx.request({
      url: config.generateFullUrl('/house?id=' + id),
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        var convertedHouse = houseEntity.convertHouseEntity(res.data)
        if (callback) {
          callback(convertedHouse);
        }
      }
    })
  },
  getHousesByOwnerIdAsync: function(ownerId, offset, count, callback) {
    wx.request({
      url: config.generateFullUrl('/house/search'),
      method: 'POST',
      data: {
        offset: offset,
        length: count,
        owner_id: ownerId
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log(res.data);
        var convertedHouses = houseEntity.convertHouseEntities(res.data)
        this.globalData.houses = convertedHouses;
        if(callback){
          callback(convertedHouses);
        }
      }
    })
  },
  getCasesAsync: function (offset, count, level, callback) {
    wx.request({
      url: config.generateFullUrl('/case/search'),
      method: 'POST',
      data: {
        offset: offset,
        length: count,
        level: level
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log(res.data);
        var convertedCases = caseEntity.convertCaseEntities(res.data);
        if (callback) {
          callback(convertedCases);
        }
      }
    })
  },
  getCaseAsync: function (id, callback) {
    wx.request({
      url: config.generateFullUrl('/case?id=') + id,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log(res.data);
        var convertedCase = caseEntity.convertCaseEntity(res.data);
        if (callback) {
          callback(convertedCase);
        }
      }
    })
  },
  getOrdersAsync: function (offset, count, status, callback) {
    wx.request({
      url: config.generateFullUrl('/order/search'),
      method: 'POST',
      data: {
        offset: offset,
        length: count,
        status: status,
        placer_id: this.globalData.loginInfo.userId
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('getOrdersAsync');
        console.log(res.data);
        var convertedOrders = orderEntity.convertOrderEntities(res.data);
        if (callback) {
          callback(convertedOrders);
        }
      }
    })
  },
  getDefaultHouseUid: function () {
    return wx.getStorageSync('default-house-uid');
  },
  setDefaultHouseUid: function(uid) {
    wx.setStorageSync('default-house-uid', uid);
  },
  submitOrderAsync: function(orderObj, callback) {
    wx.request({
      url: config.generateFullUrl('/order'),
      method: 'POST',
      data: orderEntity.convertOrderObject(orderObj),
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('submit order async res');
        console.log(res.data);
        var convertedResult = orderEntity.convertSubmitOrderResult(res.data);
        if (callback) {
          callback(convertedResult);
        }
      }
    })
  },
  getOrderAsync: function (orderId, callback) {
    wx.request({
      url: config.generateFullUrl('/order?id=' + orderId),
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('getOrderAsync');
        var convertedOrder = orderEntity.convertOrderEntity(res.data);
        if(callback){
          callback(convertedOrder);
        }
      }
    })
  },
  checkUserInfoValid: function (callback) {
    console.log('check user info', this.globalData.loginInfo.userId);
    this.getUserAsync(this.globalData.loginInfo.userId, data => {
      console.log('check user info response', data);
      var result = false;
      if (0 != data.name.length 
      && 0 != data.phoneNumber.length 
      && 0 != data.idCardNumber.length){
        result = true;
      }
      if(callback){
        callback(result)
      }
    });
  },
  getFeedbacksAsync: function (offset, length, orderId, callback) {
    wx.request({
      url: config.generateFullUrl('/feedback/search'),
      method: 'POST',
      data:{
        order_id: orderId,
        offset: offset,
        length: length,
        is_from_back_end: 0
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        // console.log('getFeedbacksAsync');
        var convertedFeedbacks = feedbackEntity.convertFeedbackEntities(res.data);
        if (callback) {
          callback(convertedFeedbacks);
        }
      }
    })
  },
  getFeedbacksUnreadAsync: function (offset, length, orderId, callback) {
    wx.request({
      url: config.generateFullUrl('/feedback/search'),
      method: 'POST',
      data: {
        order_id: orderId,
        is_read: 1,
        offset: offset,
        length: length
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('getFeedbacksUnreadAsync');
        var convertedFeedbacks = feedbackEntity.convertFeedbackEntities(res.data);
        if (callback) {
          callback(convertedFeedbacks);
        }
      }
    })
  },
  generateHouseFullAddress: function (house) {
    return map.text[house.country]
      + map.text[house.province]
      + map.text[house.city]
      + map.text[house.city]
      + house.address
  },
  deleteOrderAsync: function (orderId, callback) {
    wx.request({
      url: config.generateFullUrl('/order?id=' + orderId),
      method: 'DELETE',
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('deleteOrderAsync');
        if (callback) {
          callback();
        }
      }
    })
  },
  getServicesByTypeAsync: function (serviceType, callback) {
    wx.request({
      url: config.generateFullUrl('/service/search'),
      method: 'POST',
      data: {
        type: serviceType
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('getServicesByTypeAsync');
        var convertedServices = serviceEntity.convertServiceEntities(res.data);
        if (callback) {
          callback(convertedServices);
        }
      }
    })
  },
  getServicesByTypeLayoutAsync: function (serviceType, layout, callback) {
    wx.request({
      url: config.generateFullUrl('/service/search'),
      method: 'POST',
      data: {
        type: serviceType,
        layout: layout
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('getServicesByTypeLayoutAsync res = ', res);
        var convertedServices = serviceEntity.convertServiceEntities(res.data);
        if (callback) {
          callback(convertedServices);
        }
      }
    })
  },
  getServiceAsync: function (id, callback) {
    wx.request({
      url: config.generateFullUrl('/service?id=' + id),
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('getServiceAsync');
        var convertedService = serviceEntity.convertServiceEntity(res.data);
        if (callback) {
          callback(convertedService);
        }
      }
    })
  },
  sendShareDataAsync: function (uid, encryptedData, iv, callback){
    wx.request({
      url: config.generateFullUrl('/share'),
      method: 'POST',
      data: {
        uid: uid,
        encrypted_data: encryptedData,
        iv: iv
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('sendShareAsync res=', res);
        if (callback) {
          callback();
        }
      }
    })
  },
  queryPublicAccountMaterialAsync: function(mType, offset, count, callback){
    wx.request({
      url: config.generateFullUrl('/public-account/material/search'),
      method: 'POST',
      data: {
        type: mType,
        offset: offset,
        count: count
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('queryPublicAccountMaterialAsync res=', res);
        var convertedMaterial = null;
        if(0 != res.data.item_count){
          convertedMaterial = publicAccountEntity.convertWxPublicAccountMaterialEntity(res.data);
        }
        console.log('convertedMaterial=', convertedMaterial);
        this.globalData.material = convertedMaterial;
        if (callback) {
          callback(convertedMaterial);
        }
      }
    })
  },
  getPublicAccountMaterialDetailAsync: function (mediaId, callback) {
    wx.request({
      url: config.generateFullUrl('/public-account/material?media_id=' + mediaId),
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('getPublicAccountMaterialDetailAsync res=', res);
        var convertedMaterialDetail = publicAccountEntity.convertWxPublicAccountMaterialDetailEntity(res.data);
        if (callback) {
          callback(convertedMaterialDetail);
        }
      }
    })
  },
  getRecordsAsync: function (recordType, orderId, offset, count, callback) {
    wx.request({
      url: config.generateFullUrl('/' + recordType + '/search'),
      method: 'POST',
      data: {
        order_id: orderId,
        offset: offset,
        count: count
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        // console.log('getRecordsAsync res=', res);
        var convertedRecords = [];
        if('rent-record' == recordType){
          convertedRecords = rentRecordEntity.convertRentRecordEntities(res.data.entities);
        } else if ('inspect-record' == recordType){
          convertedRecords = inspectRecordEntity.convertInspectRecordEntities(res.data.entities);
        } else if ('repair-record' == recordType) {
          convertedRecords = repairRecordEntity.convertRepairRecordEntities(res.data.entities);
        }
        // console.log('converted records = ', convertedRecords);
        if (callback) {
          callback(convertedRecords);
        }
      }
    })
  },
  getRecordAsync: function (recordType, recordId, callback) {
    wx.request({
      url: config.generateFullUrl('/' + recordType + '?uid=' + recordId),
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('get record raw data =' , res);
        var convertedRecord = {};
        if ('rent-record' == recordType) {
          convertedRecord = rentRecordEntity.convertRentRecordEntity(res.data);;
        } else if ('inspect-record' == recordType) {
          convertedRecord = inspectRecordEntity.convertInspectRecordEntity(res.data);
        } else if ('repair-record' == recordType) {
          convertedRecord = repairRecordEntity.convertRepairRecordEntity(res.data);
        }
        if(callback){
          callback(convertedRecord);
        }
      }
    })
  }
})