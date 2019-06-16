function convertPrepaymentObject(obj) {
  return {
    user_id: obj.userId,
    order_id: obj.orderId
  }
}

function convertPrepaymentResultEntity(entity) {
  return {
    nonceStr: entity.nonce_str,
    prepayId: entity.prepay_id,
    signType: entity.sign_type,
    sign: entity.sign,
    timeStamp: entity.timestamp,
    appId: entity.app_id
  }
}

module.exports = {
  convertPrepaymentObject: convertPrepaymentObject,
  convertPrepaymentResultEntity: convertPrepaymentResultEntity
};