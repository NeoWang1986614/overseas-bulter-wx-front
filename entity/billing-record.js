
const utils = require('../utils/util.js')

function convertBillingRecordEntity(entity) {
   var ret = {
    uid: entity.uid,
    orderId: entity.order_id,
    income: convertFeeEntities(JSON.parse(entity.income)),
    outgoings: convertFeeEntities(JSON.parse(entity.outgoings)),
    balance: entity.balance,
    comment: entity.comment,
    timeRange: convertTimeRangeEntity(JSON.parse(entity.time_range)),
    accountingDate: entity.accounting_date,
    updateTime: entity.update_time,
    createTime: entity.create_time,
  }
  convertBillingRecordsDateCnText(ret);
  return ret;
}

function convertBillingRecordEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertBillingRecordEntity(entities[i]);
    result.push(temp)
  }
  return result;
}

/* fee item */
function convertFeeEntity(entity) {
  return {
    title: entity.title,
    amount: entity.amount
  }
}

function convertFeeEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertFeeEntity(entities[i])
    result.push(temp)
  }
  return result;
}

/* time range */
function convertTimeRangeEntity(entity) {
  return {
    "from": entity["from"],
    "to": entity.to
  }
}

/* chinese format*/
function convertBillingRecordsDateCnText(obj) {
  utils.convertDateToCnText(obj, "accountingDate");
  utils.convertDateToCnText(obj.timeRange, "from");
  utils.convertDateToCnText(obj.timeRange, "to");
}



module.exports = {
  convertBillingRecordEntity: convertBillingRecordEntity,
  convertBillingRecordEntities: convertBillingRecordEntities
};