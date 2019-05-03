function convertFeedbackEntity(entity) {
  return {
    uid: entity.id,
    orderId: entity.order_id,
    authorId: entity.author_id,
    content: entity.content,
    isRead: entity.is_read,
    income: entity.income,
    outgoings: entity.outgoings,
    accountingDate: entity.account_date,
    updateTime: entity.update_time,
    createTime: entity.create_time
  }
}

function convertFeedbackEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertFeedbackEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

module.exports = {
  convertFeedbackEntity: convertFeedbackEntity,
  convertFeedbackEntities: convertFeedbackEntities
};