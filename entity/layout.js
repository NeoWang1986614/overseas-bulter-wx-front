
function convertLayoutEntity(entity) {
  return {
    uid: entity.uid,
    value: entity.value,
    title: entity.title,
    content: entity.content,
    meta: entity.meta
  }
}

function convertLayoutObject(obj) {
  return {
    id: obj.uid,
    value: obj.value,
    title: obj.title,
    content: obj.content,
    meta: obj.meta
  }
}

function convertLayoutEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertLayoutEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

module.exports = {
  convertLayoutEntity: convertLayoutEntity,
  convertLayoutEntities: convertLayoutEntities,
  convertLayoutObject: convertLayoutObject
};