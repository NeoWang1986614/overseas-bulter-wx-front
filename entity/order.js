function convertOrderEntity(entity) {
  return {
    uid: entity.id,
    type: entity.type,
    content: entity.content,
    houseCountry: entity.house_country,
    houseProvince: entity.house_province,
    houseCity: entity.house_city,
    houseAddress: entity.house_address,
    houseLayout: entity.house_layout,
    price: entity.price,
    status: entity.status,
    placerId: entity.placer_id,
    accepterId: entity.accepter_id,
    createTime: entity.create_time
  }
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
    house_country: obj.houseCountry,
    house_province: obj.houseProvince,
    house_city: obj.houseCity,
    house_address: obj.houseAddress,
    house_layout: obj.houseLayout,
    price: obj.price,
    status: obj.status,
    placer_id: obj.placerId,
    accepter_id: obj.accepterId
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