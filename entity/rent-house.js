const utils = require('../utils/util.js')
const imageEntity = require('./image.js')

function convertRentHouseEntity(entity) {
  var ret = {
    orderId: entity.order_id,
    houseLayout: entity.house_layout,
    houseAdLevel2: entity.house_ad_level_2,
    houseAdLevel3: entity.house_ad_level_3,
    houseName: entity.house_name
  }
  if ("" != entity.house_image){
    ret.houseImage = JSON.parse(entity.house_image);
  }
  if ("" != entity.order_meta) {
    ret.orderMeta = JSON.parse(entity.order_meta);
  }
  return ret;
}

function convertRentHouseEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    result.push(convertRentHouseEntity(entities[i]));
  }
  return result;
}

module.exports = {
  convertRentHouseEntity: convertRentHouseEntity,
  convertRentHouseEntities: convertRentHouseEntities,
};