import { Injectable } from '@nestjs/common';
import {
  createTransport,
  SentMessageInfo,
  Transporter,
  SendMailOptions,
} from 'nodemailer';

import {
  MAIL_TRANSPORT,
  MAIL_FROM,
  ORDER_STATUS_TRANSLATION_MAP,
  ADMIN_EMAIL,
} from './constants';
import { compileTemplates } from './templates';
import { MailTemplatesMap } from './interfaces/mailTemplatesMap.interace';
import { User } from '../users/interfaces/user.interface';
import { Order } from '../orders/interfaces/order.interface';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private templates: MailTemplatesMap;

  constructor() {
    console.log(MAIL_TRANSPORT);
    this.transporter = createTransport(MAIL_TRANSPORT, { from: MAIL_FROM });
    this.templates = compileTemplates();
  }

  async sendMail(sendMailOptions: SendMailOptions): Promise<SentMessageInfo> {
    return await this.transporter.sendMail(sendMailOptions);
  }

  async sendNewOrderMail(user: User, order: Order) {
    const items = order.items.map(({ product, qty, price }) => {
      const sum = qty * price;
      return { product, sum, price, qty };
    });

    const { postalCode, country, address, firstName, lastName } = order.user;

    const day = ('0' + order.createdTime.getDate()).slice(-2);
    const month = ('0' + (order.createdTime.getMonth() + 1)).slice(-2);

    const data = {
      _id: order._id,
      shortId: order.shortId,
      total: order.total,
      user: {
        email: user.email,
        name: `${firstName} ${lastName}`,
        address: `${postalCode}, ${country}, ${address}`,
      },
      comment: order.comment,
      status: ORDER_STATUS_TRANSLATION_MAP[order.status],
      createdTime: `${day}.${month}.${order.createdTime.getFullYear()}`,
      items,
      services: order.services,
      promocodes: order.promocodes,
    };

    // need to send 2 mails - one to customer and one to admin
    await this.sendMail({
      to: `${user.email} ${ADMIN_EMAIL}`,
      subject: `Заказ от ${data.createdTime} (${order.shortId})`,
      html: this.templates.order(data),
    });
  }

  async sendRegisterMail(user: User) {
    await this.sendMail({
      to: `${user.email}`,
      subject: `DarlingDove - Благодарим за регистрацию`,
      html: this.templates.register(),
    });
  }
}
