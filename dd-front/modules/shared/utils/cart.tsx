import { CartItem } from '../interfaces/cart-item';
import { Promocode } from '../interfaces/promocode';
import { Service } from '../interfaces/service';

const SERVICE_TYPES_MAPPING: { [key: string]: string | undefined } = {
  PAID_DELIVERY: 'Доставка',
  FREE_DELIVERY: 'Бесплатная доставка'
};

export const getServiceTypeTranslation = (type: string) =>
  SERVICE_TYPES_MAPPING[type];

export const calcOrderSum = (
  items: CartItem[],
  promocodes: Promocode[],
  services: Service[]
) => {
  let itemsSum = items.reduce(
    (sum: number, item) => sum + item.qty * item.product.price,
    0
  );

  itemsSum = promocodes.reduce((sum, promo) => {
    return sum - promo.discount.total;
  }, itemsSum);

  const servicesSum = services.reduce((sum, service) => sum + service.price, 0);

  return itemsSum + servicesSum;
};
