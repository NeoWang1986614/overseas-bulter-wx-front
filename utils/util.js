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
  return house.name + 
    '-' + map.text[house.layout] + 
    '-' + map.text[house.country] +
    '-' + map.text[house.province] +
    '-' + map.text[house.city] +
    '-' + house.address;
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

module.exports = {
  formatTime: formatTime,
  intToBool: intToBool,
  invalidIndex: invalidIndex,
  maxIndex: maxIndex,
  generateHouseDescription: generateHouseDescription,
  generateHousesDescriptions: generateHousesDescriptions,
}
