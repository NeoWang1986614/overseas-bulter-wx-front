function convertHouseEntity(entity) {
  return {
    uid: entity.uid,
    name: entity.name,
    country: entity.country,
    province: entity.province,
    city: entity.city,
    address: entity.address,
    layout: entity.layout,
    ownerId: entity.owner_id,
  }
}

function convertHouseObject(obj) {
  return {
    uid: obj.uid,
    name: obj.name,
    country: obj.country,
    province: obj.province,
    city: obj.city,
    address: obj.address,
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