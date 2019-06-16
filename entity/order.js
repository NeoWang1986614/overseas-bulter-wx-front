const utils = require('../utils/util.js')

function convertOrderEntity(entity) {
  var ret = {
    uid: entity.id,
    type: entity.type,
    content: entity.content,
    houseId: entity.house_id,
    houseNation: entity.house_nation,
    houseAdLevel1: entity.house_ad_level_1,
    houseAdLevel2: entity.house_ad_level_2,
    houseAdLevel3: entity.house_ad_level_3,
    houseStreetName: entity.house_street_name,
    houseStreetNum: entity.house_street_num,
    houseBuildingNum: entity.house_building_num,
    houseRoomNum: entity.house_room_num,
    houseLayout: entity.house_layout,
    houseArea: entity.house_area,
    price: entity.price,
    status: entity.status,
    placerId: entity.placer_id,
    accepterId: entity.accepter_id,
    meta: entity.meta,
    createTime: entity.create_time
  }
  convertOrderTimeCnText(ret);
  return ret;
}

/* chinese format*/
function convertOrderTimeCnText(obj) {
  utils.convertTimeToCnText(obj, "createTime");
}

function convertOrderEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertOrderEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

function convertOrderObject(obj) {
  return {
    id: obj.uid,
    type: obj.type,
    content: obj.content,
    house_id: obj.houseId,
    house_nation: obj.houseNation,
    house_ad_level_1: obj.houseAdLevel1,
    house_ad_level_2: obj.houseAdLevel2,
    house_ad_level_3: obj.houseAdLevel3,
    house_street_name: obj.houseStreetName,
    house_street_num: obj.houseStreetNum,
    house_building_num: obj.houseBuildingNum,
    house_room_num: obj.houseRoomNum,
    house_layout: obj.houseLayout,
    house_area: obj.houseArea,
    price: obj.price,
    status: obj.status,
    placer_id: obj.placerId,
    accepter_id: obj.accepterId,
    meta: obj.meta
  }
}

function convertSubmitOrderResult(result) {
  return {
    id: result.id
  }
}

module.exports = {
  convertOrderEntity: convertOrderEntity,
  convertOrderEntities: convertOrderEntities,
  convertOrderObject: convertOrderObject,
  convertSubmitOrderResult: convertSubmitOrderResult
};