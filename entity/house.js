function convertHouseEntity(entity) {
  return {
    uid: entity.uid,
    name: entity.name,
    lat: entity.lat,
    lng: entity.lng,
    adLevel1: entity.ad_level_1,
    adLevel2: entity.ad_level_2,
    adLevel3: entity.ad_level_3,
    locality: entity.locality,
    nation: entity.nation,
    streetName: entity.street_name,
    streetNum: entity.street_num,
    buildingNum: entity.building_num,
    roomNum: entity.room_num,
    layout: entity.layout,
    ownerId: entity.owner_id,
  }
}

function convertHouseObject(obj) {
  return {
    uid: obj.uid,
    name: obj.name,
    lat: obj.lat,
    lng: obj.lng,
    ad_level_1: obj.adLevel1,
    ad_level_2: obj.adLevel2,
    ad_level_3: obj.adLevel3,
    locality: obj.locality,
    nation: obj.nation,
    street_name: obj.streetName,
    street_num: obj.streetNum,
    building_num: obj.buildingNum,
    room_num: obj.roomNum,
    layout: obj.layout,
    owner_Id: obj.ownerId,
  }
}

function convertHouseEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertHouseEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

module.exports = {
  convertHouseEntity: convertHouseEntity,
  convertHouseEntities: convertHouseEntities,
  convertHouseObject: convertHouseObject
};