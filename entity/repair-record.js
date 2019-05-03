const imageEntity = require('./image.js')
const utils = require('../utils/util.js')

function convertRepairRecordEntity(entity) {
  var ret = {
    uid: entity.uid,
    orderId: entity.order_id,
    reportTime: entity.report_time,
    repairTime: entity.repair_time,
    completeTime: entity.complete_time,
    comment: entity.comment,
    cost: entity.cost,
    status: entity.status,
    relatedImage: imageEntity.convertImageEntities(JSON.parse(entity.related_image)),
    updateTime: entity.update_time,
    createTime: entity.create_time,
  };
  convertRepairRecordsDateCnText(ret);
  return ret;
}

function convertRepairRecordEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertRepairRecordEntity(entities[i]);
    result.push(temp)
  }
  return result;
}

/* chinese format*/
function convertRepairRecordsDateCnText(obj) {
  utils.convertDateToCnText(obj, "reportTime");
  utils.convertDateToCnText(obj, "repairTime");
  utils.convertDateToCnText(obj, "completeTime");
}

module.exports = {
  convertRepairRecordEntity: convertRepairRecordEntity,
  convertRepairRecordEntities: convertRepairRecordEntities
};