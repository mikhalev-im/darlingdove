import { OrderStatusTypes } from 'orders/interfaces/order.interface';

export const MAIL_FROM = process.env.MAIL_FROM;
export const MAIL_TRANSPORT = process.env.MAIL_TRANSPORT;

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export const ORDER_STATUS_TRANSLATION_MAP = {
  [OrderStatusTypes.NotPaid]: 'Ожидает оплаты',
  [OrderStatusTypes.Paid]: 'Оплачен',
  [OrderStatusTypes.Shipped]: 'Отправлен',
  [OrderStatusTypes.Done]: 'Завершен',
};
