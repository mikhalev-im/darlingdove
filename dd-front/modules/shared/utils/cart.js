const SERVICE_TYPES_MAPPING = {
  PAID_DELIVERY: 'Доставка',
  FREE_DELIVERY: 'Бесплатная доставка'
};

export const getServiceTypeTranslation = type => SERVICE_TYPES_MAPPING[type];

export const calcOrderSum = (items, services) => {
  const itemsSum = items.reduce(
    (sum, item) => sum + item.qty * item.product.price,
    0
  );
  const servicesSum = services.reduce((sum, service) => sum + service.price, 0);

  return itemsSum + servicesSum;
};
