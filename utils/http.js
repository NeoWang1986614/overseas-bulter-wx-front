const config = require('../common/config.js')
const app = getApp()
const userEntity = require('../entity/user.js')
const servicePrimaryEntity = require('../entity/service-primary.js')
const layoutEntity = require('../entity/layout.js')
const orderEntity = require('../entity/order.js')
const rentHouseEntity = require('../entity/rent-house.js')
const billingRecordEntity = require('../entity/billing-record.js')
const inspectRecordEntity = require('../entity/inspect-record.js')
const repairRecordEntity = require('../entity/repair-record.js')
const houseEntity = require('../entity/house.js')
const priceParamEntity = require('../entity/price-param.js')
const carouselFigureEntity = require('../entity/carousel-figure.js')
const houseDealEntity = require('../entity/house-deal.js')
const messageEntity = require('../entity/message.js')

const consHttpHeader = {
  'content-type': 'application/json',
  'Accept': 'application/json'
}

function loginAsync(code, appId, appSecret, callback) {
  console.log('loginAsync func: ');
  var url = config.generateFullUrl('/login');
  var method = 'POST';
  var data = {
    code: code,
    app_id: appId,
    app_secret: appSecret
  };
  console.log('url = ' + url + ', method = ' + method + ', data = ' + JSON.stringify(data));
  wx.request({
    url: url,
    method: method,
    data: data,
    header: consHttpHeader,
    success: res => {
      console.log('',res);
      var convertedUser = userEntity.convertUserEntity(res.data);
      if (callback) {
        callback(user, );
      }
    }
  })
}

function querySearchServicePrimaryAsync(offset, count, callback) {
  wx.request({
    url: config.generateFullUrl('/service-primary/search'),
    method: 'POST',
    data: {
      offset: offset,
      count: count,
    },
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      if(200 != res.statusCode){
        app.notifyMessage('网络错误!');
        return;
      }
      var ret = servicePrimaryEntity.convertServicePrimaryEntities(res.data);
      if (callback) {
        callback(ret);
      }
    }
  })
}

function getServicePrimaryAsync(uid, callback) {
  wx.request({
    url: config.generateFullUrl('/service-primary') + '?uid=' + uid,
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var ret = servicePrimaryEntity.convertServicePrimaryEntity(res.data);
      if (callback) {
        callback(ret);
      }
    }
  })
}

function querySearchLayoutAsync(offset, count, callback) {
  wx.request({
    url: config.generateFullUrl('/layout/search'),
    method: 'POST',
    data: {
      offset: offset,
      count: count,
    },
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var ret = layoutEntity.convertLayoutEntities(res.data);
      if (callback) {
        callback(ret);
      }
    }
  })
}

function querySearchOrderByOrderTypeAsync(orderType, offset, length, callback) {
  wx.request({
    url: config.generateFullUrl('/order/search/advanced?type=order_type_group'),
    method: 'POST',
    data: {
      type_group: [orderType],
      offset: offset,
      length: length,
    },
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var ret = orderEntity.convertOrderEntities(res.data.entities);
      if (callback) {
        callback(res.data.total,ret);
      }
    }
  })
}

function querySearchRentHouseAsync(offset, count, callback) {
  wx.request({
    url: config.generateFullUrl('/rent-house/search'),
    method: 'POST',
    data: {
      offset: offset,
      count: count,
    },
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var ret = rentHouseEntity.convertRentHouseEntities(res.data.entities);
      if (callback) {
        callback(res.data.total, ret);
      }
    }
  })
}

function getOrderAsync(orderId, callback) {
  wx.request({
    url: config.generateFullUrl('/order?id=' + orderId),
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      console.log('getOrderAsync');
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var convertedOrder = orderEntity.convertOrderEntity(res.data);
      if (callback) {
        callback(convertedOrder);
      }
    }
  })
}

function getRecordsAsync(recordType, orderId, offset, count, callback) {
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
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var convertedRecords = [];
      if ('billing-record' == recordType) {
        convertedRecords = billingRecordEntity.convertBillingRecordEntities(res.data.entities);
      } else if ('inspect-record' == recordType) {
        convertedRecords = inspectRecordEntity.convertInspectRecordEntities(res.data.entities);
      } else if ('repair-record' == recordType) {
        convertedRecords = repairRecordEntity.convertRepairRecordEntities(res.data.entities);
      }
      if (callback) {
        callback(convertedRecords);
      }
    }
  })
}

function getHouseAsync(id, callback) {
  wx.request({
    url: config.generateFullUrl('/house?id=' + id),
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var convertedHouse = houseEntity.convertHouseEntity(res.data)
      if (callback) {
        callback(convertedHouse);
      }
    }
  })
}

function queryPriceParamAsync(serviceId, layoutId, callback) {
  wx.request({
    url: config.generateFullUrl('/price-params/search?queryType=service-layout'),
    method: 'POST',
    data:{
      service_id: serviceId,
      layout_id: layoutId
    },
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      console.log(res);
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var convertedPriceParams = priceParamEntity.convertPriceParamEntities(res.data)
      if (callback) {
        callback(convertedPriceParams);
      }
    }
  })
}

function queryCarouselFigureAsync(offset, count, callback) {
  wx.request({
    url: config.generateFullUrl('/carousel-figure/search?queryType=range'),
    method: 'POST',
    data: {
      offset: offset,
      count: count
    },
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      console.log('queryCarouselFigureAsync');
      console.log(res);
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var convertedCarouselFigure = carouselFigureEntity.convertCarouselFigureEntities(res.data)
      if (callback) {
        callback(convertedCarouselFigure);
      }
    }
  })
}

function queryHouseDealAsync(dealType, offset, count, callback) {
  wx.request({
    url: config.generateFullUrl('/house-deal/search?queryType=deal_type'),
    method: 'POST',
    data: {
      deal_type: dealType,
      offset: offset,
      count: count
    },
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      console.log('queryHouseDealAsync');
      console.log(res);
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var convertedHouseDeal = houseDealEntity.convertHouseDealEntities(res.data.entities)
      if (callback) {
        callback(res.data.total,convertedHouseDeal);
      }
    }
  })
}

function addHouseDealAsync(obj, callback) {
  wx.request({
    url: config.generateFullUrl('/house-deal'),
    method: 'POST',
    data: houseDealEntity.convertHouseDealObject(obj),
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      console.log('addHouseDealAsync = ');
      if (callback) {
        callback();
      }
    }
  })
}

function getHouseDealAsync(uid, callback) {
  wx.request({
    url: config.generateFullUrl('/house-deal?uid=' + uid),
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      console.log('getHouseDealAsync = ');
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var convertedHouseDeal = houseDealEntity.convertHouseDealEntity(res.data)
      if (callback) {
        callback(convertedHouseDeal);
      }
    }
  })
}

function getHousesByUidsAsync(uids, callback) {
  wx.request({
    url: config.generateFullUrl('/house/search?queryType=uids'),
    method: 'POST',
    data: {
      uids: uids
    },
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      console.log(res.data);
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var convertedHouses = houseEntity.convertHouseEntities(res.data)
      if (callback) {
        callback(convertedHouses);
      }
    }
  })
}

function queryMessagesAsync(offset, count, callback) {
  wx.request({
    url: config.generateFullUrl('/message/search?queryType=range'),
    method: 'POST',
    data: {
      offset: offset,
      count: count
    },
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      console.log('queryMessagesAsync');
      console.log(res);
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      var convertedRet = messageEntity.convertMessageEntities(res.data.entities)
      if (callback) {
        callback(res.data.total, convertedRet);
      }
    }
  })
}

function addMessageAsync(obj, callback) {
  wx.request({
    url: config.generateFullUrl('/message'),
    method: 'POST',
    data: messageEntity.convertMessageObject(obj),
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    },
    success: res => {
      console.log('adaMessageAsync = ');
      if (200 != res.statusCode) {
        app.notifyMessage('网络错误!');
        return;
      }
      if (callback) {
        callback(res);
      }
    }
  })
}

module.exports = {
  loginAsync: loginAsync,
  querySearchServicePrimaryAsync: querySearchServicePrimaryAsync,
  querySearchLayoutAsync: querySearchLayoutAsync,
  getServicePrimaryAsync: getServicePrimaryAsync,
  querySearchOrderByOrderTypeAsync: querySearchOrderByOrderTypeAsync,
  querySearchRentHouseAsync: querySearchRentHouseAsync,
  getOrderAsync: getOrderAsync,
  getRecordsAsync: getRecordsAsync,
  getHouseAsync: getHouseAsync,
  queryPriceParamAsync: queryPriceParamAsync,
  queryCarouselFigureAsync: queryCarouselFigureAsync,
  queryHouseDealAsync: queryHouseDealAsync,
  addHouseDealAsync: addHouseDealAsync,
  getHouseDealAsync: getHouseDealAsync,
  getHousesByUidsAsync: getHousesByUidsAsync,
  addMessageAsync: addMessageAsync,
  queryMessagesAsync: queryMessagesAsync
}