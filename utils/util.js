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

function generateHouseDescription(house) {
  if(!house){
    return null;
  }
  return map.text[house.layout] + '-' +
    [house.area] + 'm²' + '-' +
    'Room ' + house.roomNum + ', ' +
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
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

function convertDateToCnText(object, pro) {
  object[pro + 'Cn'] = getDateCnText(object[pro]);
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


module.exports = {
  formatTime: formatTime,
  intToBool: intToBool,
  invalidIndex: invalidIndex,
  maxIndex: maxIndex,
  generateHouseDescription: generateHouseDescription,
  generateHousesDescriptions: generateHousesDescriptions,
  generateHouseInOrderDescription: generateHouseInOrderDescription,
  getDateCnText: getDateCnText,
  convertDateToCnText: convertDateToCnText,
  computeHomeDecorationPrice: computeHomeDecorationPrice
}
