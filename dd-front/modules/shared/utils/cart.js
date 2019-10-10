const SERVICE_TYPES_MAPPING = {
  PAID_DELIVERY: 'Доставка',
  FREE_DELIVERY: 'Бесплатная доставка'
};

export const getServiceTypeTranslation = type => SERVICE_TYPES_MAPPING[type];

export const calcOrderSum = (items, promocodes, services) => {
  let itemsSum = items.reduce(
    (sum, item) => sum + item.qty * item.product.price,
    0
  );

  itemsSum = promocodes.reduce((sum, promo) => {
    return sum - promo.discount.total;
  }, itemsSum);

  const servicesSum = services.reduce((sum, service) => sum + service.price, 0);

  return itemsSum + servicesSum;
};
