function convertPriceEntity(entity) {
  return {
    oldPrice: entity.old_price,
    discount: entity.discount,
    newPrice: entity.new_price,
  }
}

module.exports = {
  convertPriceEntity: convertPriceEntity
};