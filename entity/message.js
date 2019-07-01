const utils = require('../utils/util.js')

function convertMessageEntity(entity) {
  var ret = {
    uid: entity.uid,
    category: entity.category,
    title: entity.title,
    content: entity.content,
    creatorId: entity.creator_id,
    level: entity.level,
    meta: entity.meta,
    createTime: entity.create_time
  };
  console.log('ret = ');
  console.log(ret);
  utils.convertTimeToCnText(ret, 'createTime');
  return ret;
}

function convertMessageObject(obj) {
  return {
    uid: obj.uid,
    category: obj.category,
    title: obj.title,
    content: obj.content,
    creator_id: obj.creatorId,
    level: obj.level,
    meta: obj.meta
  }
}

function convertHouseCreateTimeCnText(obj) {
  utils.convertTimeToCnText(obj, "createTime");
}

function convertMessageEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertMessageEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

module.exports = {
  convertMessageEntity: convertMessageEntity,
  convertMessageEntities: convertMessageEntities,
  convertMessageObject: convertMessageObject
};