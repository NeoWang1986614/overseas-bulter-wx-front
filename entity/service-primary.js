
function convertServicePrimaryEntity(entity) {
  return {
    uid: entity.uid,
    value: entity.value,
    title: entity.title,
    iconUrl: entity.icon_url,
    content: entity.content,
    basePrice: entity.base_price,
    meta: entity.meta
  }
}

function convertServicePrimaryObject(obj) {
  return {
    uid: obj.uid,
    value: obj.value,
    title: obj.title,
    icon_url: obj.iconUrl,
    content: obj.content,
    base_price: entity.basePrice,
    meta: obj.meta
  }
}

function convertServicePrimaryEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertServicePrimaryEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

module.exports = {
  convertServicePrimaryEntity: convertServicePrimaryEntity,
  convertServicePrimaryEntities: convertServicePrimaryEntities,
  convertServicePrimaryObject: convertServicePrimaryObject
};