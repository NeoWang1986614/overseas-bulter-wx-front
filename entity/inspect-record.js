const imageEntity = require('./image.js')
const utils = require('../utils/util.js')

function convertInspectRecordEntity(entity) {
  var ret = {
    uid: entity.uid,
    orderId: entity.order_id,
    inspectDate: entity.inspect_date,
    inspector: entity.inspector,
    comment: entity.comment,
    config: convertConfigEntities(JSON.parse(entity.config)),
    area: imageEntity.convertImageEntities(JSON.parse(entity.area)),
    updateTime: entity.update_time,
    createTime: entity.create_time,
  };
  convertInspectRecordsDateCnText(ret);
  return ret;
}

function convertInspectRecordEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertInspectRecordEntity(entities[i]);
    convertInspectRecordsDateCnText(temp);
    result.push(temp)
  }
  return result;
}

/* config */
function convertConfigEntity(entity) {
  return {
    title: entity.title,
    isInstalled: entity.is_installed,
  }
}

function convertConfigEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    result.push(convertConfigEntity(entities[i]));
  }
  return result;
}

/* chinese format*/
function convertInspectRecordsDateCnText(obj) {
  utils.convertDateToCnText(obj, "inspectDate");
}

module.exports = {
  convertInspectRecordEntity: convertInspectRecordEntity,
  convertInspectRecordEntities: convertInspectRecordEntities
};