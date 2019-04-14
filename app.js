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

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: config.generateFullUrl('/login'),
          method:'POST',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          success:  res => {
            console.log(res);
            var convertedUser = userEntity.convertUserEntity(res.data);
            this.globalData.loginInfo.userId = res.data.uid;
            this.globalData.loginInfo.phoneNumber = res.data.phoneNumber;
            this.globalData.loginInfo.idCardNumber = res.data.idCardNumber;
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
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
        }
      }
    })
  },
  globalData: {
    loginInfo: {},
    userInfo: null,
    recommendCases: [
      {
        image: '/images/case-1.jpg',
        title: '4.58万包含所有主材+辅料+人工+设计+家具/家电+灶具+洁具,避免装修采坑,',
        style: '家装-标准',
        price: '2,5000'
      },
      {
        image: '/images/case-2.jpg',
        title: '原木的边缘装饰，给人一种自然简洁的感觉。沙发背后采用通透的橱窗设计，让客厅的空间感更加开阔，背后的透明橱窗，可以装下主人平时喜欢的书籍和各种艺术品，不仅方便收纳和整理，也能够起到很好的装饰作用',
        style: '维护保养',
        price: '2000'
      },
      {
        image: '/images/case-3.jpg',
        title: '出租房户型比较简单,一室一厅一厨一卫。家具老旧,是改造的难点。 为了住的更舒心,屋主的改造顺序是:打扫卫生、整改',
        style: '出租',
        price: '2000'
      },

      {
        image: '/images/case-4.jpg',
        title: '客厅以高级灰色调为主。采用石材与柜体做电视墙的设计，突显层次之外让客厅更简洁品质大气。客厅并无集中大灯光照射，采用分散柔光设计，点、线、面的连接让空间“星光熠熠”会发光的元素',
        style: '家装—定制-现代风格',
        price: '2,5000'
      },
      {
        image: '/images/case-1.jpg',
        title: '美式风格的实木餐桌，看起来不仅舒服，也给人一种极大的安宁感。有家人在侧，有美食一餐，有花香环绕，这不就是美好生活最好的诠释吗',
        style: '维护保养',
        price: '2500'
      },
      {
        image: '/images/case-2.jpg',
        title: '家不用很大，温馨足矣。人不用很多，有你们就够。这是90后夫妻的第一套婚房，也是为即将出生的宝宝设计的第一个家。所以设计师采用现代美式的风格，将整体的营造出满满的温馨感，也表达两个年轻人对于美好未来的无限憧憬',
        style: '家装-定制-复古风格',
        price: '4,5000'
      }
    ],
    houses: [],
    countryValueArray: [
      'Republika ng Pilipinas'
    ],
    provinceValueArray: [
      'Metro Manila'
    ],
    cityValueArray: [
      'the City of Manila',
      'Quezon City',
      'Caloocan',
      'Las Pinas',
      'Makati',
      'Mandaluyong',
      'Marikina',
      'Muntinlupa',
      'Navotas',
      'Paranaque',
      'Pasay',
      'Pasig',
      'San Juan',
      'Taguig',
      'Valenzuela',
      'the municipality of Pateros',
    ],
    layoutValueArray: [
      'studio',
      'one-bedroom',
      'two-bedroom'
    ],
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
  getHousesAsync: function(offset, count, callback) {
    wx.request({
      url: config.generateFullUrl('/house/search'),
      method: 'POST',
      data: {
        offset: offset,
        length: count
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
        length: length
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
  }
})