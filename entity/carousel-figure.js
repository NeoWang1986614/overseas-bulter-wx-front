
function convertCarouselFigureEntity(entity) {
  return {
    uid: entity.uid,
    imageUrl: entity.image_url,
    location: entity.location,
    desc: entity.desc,
  }
}

function convertCarouselFigureObject(obj) {
  return {
    uid: obj.uid,
    image_url: obj.imageUrl,
    location: obj.location,
    desc: obj.desc
  }
}

function convertCarouselFigureEntities(entities) {
  var result = [];
  for (let i = 0; i < entities.length; i++) {
    var temp = convertCarouselFigureEntity(entities[i])
    result.push(temp)
  }
  console.log(result);
  return result;
}

module.exports = {
  convertCarouselFigureEntity: convertCarouselFigureEntity,
  convertCarouselFigureEntities: convertCarouselFigureEntities,
  convertCarouselFigureObject: convertCarouselFigureObject
};