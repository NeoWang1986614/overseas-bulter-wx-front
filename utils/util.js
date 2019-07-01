const map = require('../common/map.js')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const intToBool = n => {
  return 0 != n;
}

const invalidIndex = 0xFFFF;
const maxIndex = 10000;

function getHouseAddress(house) {
  if (!house) {
    return null;
  }
  var roomTitle = (0==house.roomNum.length)?'':('Room ' + house.roomNum + ', ');
  return roomTitle +
    'Building ' + house.buildingNum + ', ' +
    house.streetNum + ' ' + house.streetName + ' Street, ' +
    house.adLevel3 + ', ' +
    house.adLevel2 + ', ' +
    house.adLevel1 + ', ' +
    house.nation;
}

function generateHouseDescription(house) {
  if(!house){
    return null;
  }
  var roomTitle = (0 == house.roomNum.length) ? '' : ('Room ' + house.roomNum + ', ');
  return map.text[house.layout] + '-' +
    [house.area] + 'm²' + '-' +
    roomTitle +
    'Building ' + house.buildingNum + ', ' +
    house.streetNum + ' ' + house.streetName + ' Street, ' +
    house.adLevel3 + ', ' +
    house.adLevel2 + ', ' +
    house.adLevel1 + ', ' +
    house.nation;
}

function generateHouseInOrderDescription(orderObj) {
  if (!orderObj) {
    return null;
  }
  
  return 'Room ' + orderObj.houseRoomNum + ', ' +
  'Building ' + orderObj.houseBuildingNum + ', ' +
  orderObj.houseStreetNum + ' ' + orderObj.houseStreetName + ' Street, ' +
  orderObj.houseAdLevel3 + ', ' +
  orderObj.houseAdLevel2 + ', ' +
  orderObj.houseAdLevel1 + ', ' +
  orderObj.houseNation;
}

function generateHousesDescriptions(houses) {
  if (!houses || 0 == houses.length) {
    return [];
  }
  var result = [];
  for(let i=0; i < houses.length; i++){
    result.push(generateHouseDescription(houses[i]));
  }
  return result;
}

function getDateCnText(dateStr) {
  var d = new Date(dateStr.replace(/-/g, '/'));
  var ret = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  console.log(ret);
  return ret;
}

function getTimeCnText(dateStr) {
  var d = new Date(dateStr.replace(/-/g, '/'));
  var timeStr = dateStr.split(' ')[1];
  var ret = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + timeStr;
  return ret;
}

function convertDateToCnText(object, pro) {
  object[pro + 'Cn'] = getDateCnText(object[pro]);
}

function convertTimeToCnText(object, pro) {
  object[pro + 'Cn'] = getTimeCnText(object[pro]);
}

/*家装布置*/
/*
  studio, 小于20平, 20000CNY; 每大于1平, 增加500CNY
*/
function computeHomeDecorationPrice(area, minArea, basePrice, priceStep) {
  if (area <= minArea) {
    return basePrice;
  } else {
    return basePrice + Math.ceil(area - minArea) * priceStep;
  }
}

function isIPhoneModel(){
//判断机型
  var model = "";
  wx.getSystemInfo({
    success: function (res) {
      model = res.model;
    }
  })
  console.log('get phone model');
  console.log(model);
  if (model.indexOf("iPhone") <= 0) {
    return true;
  } else {
    return false;
  }
}

function compressImage(imgPath, canvasId, width, height, callback){

  wx.getImageInfo({
    src: imgPath,
    success: res => {
      console.log('get image info');
      console.log(res);

      //---------利用canvas压缩图片--------------
      var ratio = 2;
      var canvasWidth = res.width //图片原始长宽
      var canvasHeight = res.height
      while (canvasWidth > width || canvasHeight > height) {// 保证宽高在400以内
        canvasWidth = Math.trunc(res.width / ratio)
        canvasHeight = Math.trunc(res.height / ratio)
        ratio++;
      }

      //----------绘制图形并取出图片路径--------------
      var ctx = wx.createCanvasContext(canvasId)
      ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
      ctx.draw(false, setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: canvasId,
          fileType: 'jpg',
          destWidth: canvasWidth,
          destHeight: canvasHeight,
          success: function (res) {
            console.log('最终图片:');
            console.log(res.tempFilePath)//最终图片路径
            console.log(res);
            callback(res.tempFilePath);
          },
          fail: function (res) {
            console.log(res.errMsg)
          }
        })
      }, 100))    //留一定的时间绘制canvas

    },
    fail: res => {
      console.log(res.errMsg);
    }
  });

}

function calculateCompressImageSize(imagePath, maxWidth, maxHeight, callback) {
  wx.getImageInfo({
    src: imagePath,
    success: res => {
      console.log('get image info');
      console.log(res);

      //---------利用canvas压缩图片--------------
      var ratio = 2;
      var canvasWidth = res.width //图片原始长宽
      var canvasHeight = res.height
      while (canvasWidth > maxWidth || canvasHeight > maxHeight) {// 保证宽高在指定以内
        canvasWidth = Math.trunc(res.width / ratio)
        canvasHeight = Math.trunc(res.height / ratio)
        ratio++;
      }

      if (callback) {
        callback(canvasWidth, canvasHeight)
      }

    },
    fail: res => {
      console.log(res.errMsg);
    }
  });
}

function filterEmoji(content) {

  if(0==content.length){
    return content;
  }
  var str = content.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");

  return str;

}

module.exports = {
  formatTime: formatTime,
  intToBool: intToBool,
  invalidIndex: invalidIndex,
  maxIndex: maxIndex,
  getHouseAddress: getHouseAddress,
  generateHouseDescription: generateHouseDescription,
  generateHousesDescriptions: generateHousesDescriptions,
  generateHouseInOrderDescription: generateHouseInOrderDescription,
  getDateCnText: getDateCnText,
  convertDateToCnText: convertDateToCnText,
  convertTimeToCnText: convertTimeToCnText,
  computeHomeDecorationPrice: computeHomeDecorationPrice,
  compressImage: compressImage,
  isIPhoneModel: isIPhoneModel,
  calculateCompressImageSize: calculateCompressImageSize,
  filterEmoji: filterEmoji
}
