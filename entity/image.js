/* image item */
function convertImageEntity(entity) {
  return {
    title: entity.title,
    desc: entity.desc,
    urls: entity.urls,
  }
}

function convertImageEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertImageEntity(entities[i])
    result.push(temp)
  }
  return result;
}

module.exports = {
  convertImageEntity: convertImageEntity,
  convertImageEntities: convertImageEntities
};