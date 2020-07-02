import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Empty from './components/empty';
import CartTable from './components/table';
import CartActions from './actions';
import RootActions from '../root/actions';
import { getCartItems, getCartServices, getCartPromocodes } from './selectors';
import NotificationsActions from '../notifications/actions';
import PromoModal from './components/promo';
import { CartItem } from '../shared/interfaces/cart-item';
import { Promocode } from '../shared/interfaces/promocode';
import { Service } from '../shared/interfaces/service';
import { NextPage } from 'next';
import { NotificationData } from '../shared/components/layout/notifications';
import { AnyAction } from 'redux';

const MAX_WIDTH_MULTIPLIER = 125;

const useStyles = makeStyles(theme => ({
  buttons: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
    maxWidth: theme.spacing(MAX_WIDTH_MULTIPLIER)
  },
  button: {
    marginLeft: theme.spacing(1)
  }
}));

interface Cart {
  items: CartItem[];
  services: Service[];
  promocodes: Promocode[];
  onMakeOrder(): AnyAction;
  onQtyChange(productId: string, qty?: number): AnyAction;
  onProductDelete(productId: string): AnyAction;
  addNotification(date: NotificationData): AnyAction;
  addPromocode(code: string): AnyAction;
}

const Cart: NextPage<Cart> = ({
  items,
  services,
  promocodes,
  onMakeOrder,
  onQtyChange,
  onProductDelete,
  addNotification,
  addPromocode
}) => {
  const classes = useStyles();
  const [isPromoOpen, setPromoOpen] = useState(false);

  if (!items.length) {
    return <Empty />;
  }

  const onSubmit = () => {
    const isValid = items.every(item => item.qty <= item.product.qty);
    if (!isValid) {
      addNotification({
        key: 'notEnoughInStock',
        message: 'Нет нужного количества товара в наличии'
      });
      return;
    }

    onMakeOrder();
  };

  const onAddPromocode = (code: string) => {
    setPromoOpen(false);
    addPromocode(code);
  };

  return (
    <>
      <CartTable
        items={items}
        services={services}
        promocodes={promocodes}
        onQtyChange={onQtyChange}
        onItemDelete={onProductDelete}
      />
      <PromoModal
        open={isPromoOpen}
        onClose={() => setPromoOpen(false)}
        onSubmit={onAddPromocode}
      />
      <p className={classes.buttons}>
        <Button variant={'contained'} onClick={() => setPromoOpen(true)}>
          Ввести промокод
        </Button>
        <Button
          onClick={onSubmit}
          className={classes.button}
          color={'primary'}
          variant={'contained'}
        >
          Оформить заказ
        </Button>
      </p>
    </>
  );
};

const mapState = state => ({
  items: getCartItems(state),
  services: getCartServices(state),
  promocodes: getCartPromocodes(state)
});

const mapDispatch = {
  onMakeOrder: () => RootActions.Creators.redirect('/checkout'),
  onProductDelete: CartActions.Creators.removeFromCart,
  onQtyChange: CartActions.Creators.debouncedCartQtyUpdate,
  addNotification: NotificationsActions.Creators.addNotification,
  addPromocode: CartActions.Creators.addPromocode
};

export default connect(mapState, mapDispatch)(Cart);
