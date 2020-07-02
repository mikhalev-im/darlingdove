export enum ServiceType {
  FreeDelivery = 'FREE_DELIVERY',
  PaidDelivery = 'PAID_DELIVERY'
}

export interface Service {
  type: ServiceType;
  price: number;
}
