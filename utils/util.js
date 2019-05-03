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
    'Room ' + house.roomNum + ', ' +
    'Building ' + house.buildingNum + ', ' +
    house.streetNum + ' ' + house.streetName + ' Street, ' +
    house.adLevel3 + ', ' +
    house.adLevel2 + ', ' +
    house.adLevel1 + ', ' +
    house.nation;
  // return house.name + 
  //   '-' + map.text[house.layout]
  //   + '-' + map.text[house.nation]
  //   + map.text[house.adLevel1]
  //   + map.text[house.adLevel2]
  //   + house.adLevel3
  //   + house.streetName
  //   + house.streetNum + '号'
  //   + house.buildingNum + '栋'
  //   + house.roomNum + '室';
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
  var d = new Date(dateStr);
  var ret = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  console.log(ret);
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

function convertDateToCnText(object, pro) {
  object[pro + 'Cn'] = getDateCnText(object[pro]);
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
  convertDateToCnText: convertDateToCnText
}
