function convertWxPublicAccountNewsItemEntity(entity) {
  return {
    title: entity.title,
    author: entity.author,
    digest: entity.digest,
    content: entity.content,
    needOpenComment: entity.need_open_comment,
    onlyFansCanComment: entity.only_fans_can_comment,
  }
}

function convertWxPublicAccountNewsItemEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertWxPublicAccountNewsItemEntity(entities[i])
    result.push(temp)
  }
  return result;
}

function convertWxPublicAccountContentNewsItemEntity(entity) {
  return {
    newsItem: convertWxPublicAccountNewsItemEntities(entity.news_item),
    createTime: entity.create_time,
    updateTime: entity.update_time,
  }
}

function convertWxPublicAccountMaterialItemEntity(entity) {
  return {
    mediaId: entity.media_id,
    content: convertWxPublicAccountContentNewsItemEntity(entity.content),
    updateTime: entity.update_time,
  }
}

function convertWxPublicAccountMaterialItemEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertWxPublicAccountMaterialItemEntity(entities[i])
    result.push(temp)
  }
  return result;
}

function convertWxPublicAccountMaterialEntity(entity) {
  return {
    item: convertWxPublicAccountMaterialItemEntities(entity.item),
    totalCount: entity.total_count,
    itemCount: entity.item_count,
  }
}

function convertWxPublicAccountDetailNewsItemEntity(entity) {
  return {
    title: entity.title,
    author: entity.author,
    digest: entity.digest,
    content: entity.content,
    contentSourceUrl: entity.content_source_url,
    thumbMediaId: entity.thumb_media_id,
    showCoverPic: entity.show_cover_pic,
    url: entity.url,
    thumbUrl: entity.thumb_url,
    needOpenComment: entity.need_open_comment,
    onlyFansCanComment: entity.only_fans_can_comment,
  }
}

function convertWxPublicAccountDetailNewsItemEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertWxPublicAccountDetailNewsItemEntity(entities[i])
    result.push(temp)
  }
  return result;
}

function convertWxPublicAccountMaterialDetailEntity(entity) {
  return {
    newsItem: convertWxPublicAccountDetailNewsItemEntities(entity.news_item),
    updateTime: entity.update_time,
    createTime: entity.create_time,
  }
}

module.exports = {
  convertWxPublicAccountMaterialEntity:                    convertWxPublicAccountMaterialEntity,
  convertWxPublicAccountMaterialDetailEntity: convertWxPublicAccountMaterialDetailEntity
};