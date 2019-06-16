const utils = require('../utils/util.js')

function convertHouseDealEntity(entity) {
  var ret = {
    uid: entity.uid,
    dealType: entity.deal_type,
    source: entity.source,
    property: entity.property,
    area: entity.area,
    address: entity.address,
    decoration: entity.decoration,
    cost: entity.cost,
    linkman: entity.linkman,
    contactNum: entity.contact_num,
    mail: entity.mail,
    weixin: entity.weixin,
    image: entity.image,
    note: entity.note,
    creator: entity.creator, 
    meta: entity.meta,
    createTime: entity.create_time
  };
  console.log('ret = ');
  console.log(ret);
  utils.convertTimeToCnText(ret, 'createTime');
  return ret;
}

function convertHouseDealObject(obj) {
  return {
    uid: obj.uid,
    deal_type: obj.dealType,
    source: obj.source,
    property: obj.property,
    area: obj.area,
    address: obj.address,
    decoration: obj.decoration,
    cost: obj.cost,
    linkman: obj.linkman,
    contact_num: obj.contactNum,
    mail: obj.mail,
    weixin: obj.weixin,
    image: obj.image,
    note: obj.note,
    creator: obj.creator,
    meta: obj.meta
  }
}

function convertHouseCreateTimeCnText(obj) {
  utils.convertTimeToCnText(obj, "createTime");
}

function convertHouseDealEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertHouseDealEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

module.exports = {
  convertHouseDealEntity: convertHouseDealEntity,
  convertHouseDealEntities: convertHouseDealEntities,
  convertHouseDealObject: convertHouseDealObject
};