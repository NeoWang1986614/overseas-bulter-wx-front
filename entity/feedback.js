function convertFeedbackEntity(entity) {
  return {
    uid: entity.id,
    orderId: entity.order_id,
    authorId: entity.author_id,
    content: entity.content,
    isRead: entity.is_read,
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