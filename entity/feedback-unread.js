function convertFeedbackUnreadEntity(entity) {
  return {
    orderId: entity.order_id,
    count: entity.count
  }
}

function convertFeedbackUnreadEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertFeedbackUnreadEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

module.exports = {
  convertFeedbackUnreadEntity: convertFeedbackUnreadEntity,
  convertFeedbackUnreadEntities: convertFeedbackUnreadEntities
};