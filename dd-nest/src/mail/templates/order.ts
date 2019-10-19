const orderTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Заказ №{{_id}}</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #000000;">
  <div style="width: 680px; margin: 0 auto;">
    <a href="https://darlingdove.ru" title="Darlingdove" style="display: block; text-align: center;">
      <img src="http://darlingdove.ru/image/catalog/head.png" alt="Darlingdove" style="margin-bottom: 20px; border: none;" />
    </a>
    <p style="margin-top: 0px; margin-bottom: 20px;">Вы получили заказ.</p>

    <table style="border-collapse: collapse; width: 100%; border-top: 1px solid #DDDDDD; border-left: 1px solid #DDDDDD; margin-bottom: 20px;">
      <thead>
        <tr>
          <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: left; padding: 7px; color: #222222;" colspan="2">Детализация заказа</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: left; padding: 7px;">
            <b>№ заказа:</b> {{_id}}<br />
            <b>Дата заказа:</b> {{createdTime}}<br />
            <b>Способ оплаты:</b> Онлайн<br />
            <b>Способ доставки:</b> Бесплатная доставка
          </td>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: left; padding: 7px;">
            <b>E-mail:</b> {{user.email}}<br />
            <b>Статус заказа:</b> {{status}}<br />
          </td>
        </tr>
      </tbody>
    </table>
    <!-- if order.comment -->
    <table style="border-collapse: collapse; width: 100%; border-top: 1px solid #DDDDDD; border-left: 1px solid #DDDDDD; margin-bottom: 20px;">
      <thead>
        <tr>
          <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: left; padding: 7px; color: #222222;">Комментарий к заказу</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: left; padding: 7px;">{{comment}}</td>
        </tr>
      </tbody>
    </table>
    <table style="border-collapse: collapse; width: 100%; border-top: 1px solid #DDDDDD; border-left: 1px solid #DDDDDD; margin-bottom: 20px;">
      <thead>
        <tr>
          <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: left; padding: 7px; color: #222222;">Адрес доставки</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: left; padding: 7px;">{{user.address}}</td>
        </tr>
      </tbody>
    </table>
    <table style="border-collapse: collapse; width: 100%; border-top: 1px solid #DDDDDD; border-left: 1px solid #DDDDDD; margin-bottom: 20px;">
      <thead>
        <tr>
          <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: left; padding: 7px; color: #222222;">Товар</td>
          <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: left; padding: 7px; color: #222222;">Модель</td>
          <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: right; padding: 7px; color: #222222;">Количество</td>
          <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: right; padding: 7px; color: #222222;">Цена</td>
          <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: right; padding: 7px; color: #222222;">Итого:</td>
        </tr>
      </thead>
      <tbody>
        {{#each items}}
        <tr>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: left; padding: 7px;">{{product.name}}</td>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: left; padding: 7px;">{{product.sku}}</td>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;">{{qty}}</td>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;">{{price}}</td>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;">{{sum}}</td>
        </tr>
        {{/each}}
      </tbody>
      <tfoot>
        {{#each promocodes}}
        <tr>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;" colspan="4"><b>Промокод {{code}}:</b></td>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;">{{#if discount.total}}-{{/if}}{{discount.total}}</td>
        </tr>
        {{/each}}
        {{#each services}}
        <tr>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;" colspan="4"><b>Доставка:</b></td>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;">{{price}}</td>
        </tr>
        {{/each}}
        <tr>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;" colspan="4"><b>Итого:</b></td>
          <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;">{{total}}</td>
        </tr>
      </tfoot>
    </table>

    <p>Если у Вас есть какие-либо вопросы, просто ответьте на это письмо.</p>

    <a href="https://darlingdove.ru" target="_blank">https://darlingdove.ru</a>
    <br/>
    <a href="https://vk.com/darlingdove" target="_blank">https://vk.com/darlingdove</a>
  </div>
</body>
</html>
`;

export default orderTemplate;
