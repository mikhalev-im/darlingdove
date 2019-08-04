import { Injectable } from '@nestjs/common';
import { ExternalPayment } from 'yandex-money-sdk';
import qs from 'querystring';
import { Order } from './interfaces/order.interface';
import { YANDEX_INSTANCE_ID, YANDEX_WALLET } from './constants';
import {
  PaymentRequest,
  PaymentRequestStatus,
  PaymentProcess,
  PaymentProcessStatus,
} from './interfaces/yandex.interface';

@Injectable()
export class YandexService {
  private externalPayment: any;

  constructor() {
    this.externalPayment = new ExternalPayment(YANDEX_INSTANCE_ID);
  }

  async requestPayment(amount: number): Promise<PaymentRequest> {
    const options = {
      amount,
      pattern_id: 'p2p',
      to: YANDEX_WALLET,
      instance_id: YANDEX_INSTANCE_ID,
      message: `Darlingdove: Оплата заказа`,
    };

    return new Promise((resolve, reject) => {
      this.externalPayment.request(options, (err, data: PaymentRequest) => {
        if (err) return reject(err);
        if (data.status !== PaymentRequestStatus.Success) return reject(data);

        resolve(data);
      });
    });
  }

  async processPayment(
    requestId: string,
    successUrl: string,
    failureUrl: string,
  ): Promise<PaymentProcess> {
    const options = {
      request_id: requestId,
      instance_id: YANDEX_INSTANCE_ID,
      ext_auth_success_uri: successUrl,
      ext_auth_fail_uri: failureUrl,
    };

    return new Promise((resolve, reject) => {
      this.externalPayment.process(options, (err, data: PaymentProcess) => {
        if (err) return reject(err);
        if (data.status !== PaymentProcessStatus.Success) return reject(data);

        resolve(data);
      });
    });
  }
}
