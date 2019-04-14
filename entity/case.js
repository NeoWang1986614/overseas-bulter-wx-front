function convertCaseEntity(entity) {
  return {
    uid: entity.uid,
    title: entity.title,
    imageUrl: entity.image_url,
    content: entity.content,
    price: entity.price,
    level: entity.level
  }
}

function convertCaseEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertCaseEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

module.exports = {
  convertCaseEntity: convertCaseEntity,
  convertCaseEntities: convertCaseEntities
};