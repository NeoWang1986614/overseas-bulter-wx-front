function convertPriceParamEntity(entity) {
  return {
    uid: entity.uid,
    serviceId: entity.service_id,
    layoutId: entity.layout_id,
    algorithmType: entity.algorithm_type,
    params: entity.params,
    meta: entity.meta
  }
}

function convertPriceParamObject(obj) {
  return {
    uid: obj.uid,
    service_id: obj.serviceId,
    layout_id: obj.layoutId,
    algorithm_type: obj.algorithmType,
    params: obj.params,
    meta: obj.meta
  }
}

function convertPriceParamEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertPriceParamEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

module.exports = {
  convertPriceParamEntity: convertPriceParamEntity,
  convertPriceParamEntities: convertPriceParamEntities,
  convertPriceParamObject: convertPriceParamObject
};