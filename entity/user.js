function convertUserEntity(entity) {
  return {
    uid: entity.uid,
    name: entity.name,
    level: entity.level,
    phoneNumber: entity.phone_number,
    idCardNumber: entity.id_card_number
  }
}

function convertUserObject(obj) {
  return {
    uid: obj.uid,
    name: obj.name,
    phone_number: obj.phoneNumber,
    id_card_number: obj.idCardNumber
  }
}

function convertUserEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertUserEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

module.exports = {
  convertUserEntity: convertUserEntity,
  convertUserEntities: convertUserEntities,
  convertUserObject: convertUserObject
};