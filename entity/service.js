function convertServiceEntity(entity) {
  return {
    uid: entity.id,
    type: entity.type,
    layout: entity.layout,
    content: entity.content,
    price: entity.price,
    createTime: entity.create_time
  }
}

function convertServiceEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertServiceEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

module.exports = {
  convertServiceEntity: convertServiceEntity,
  convertServiceEntities: convertServiceEntities
};