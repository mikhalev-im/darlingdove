import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';

import OrderActions from './actions';
import RootActions from '../root/actions';
import OrderSummary from '../shared/components/order-summary';
import { getOrder } from './selectors';
import { Order } from '../shared/interfaces/order';
import { NextPage } from 'next';
import { InitializedPageContex } from '../shared/interfaces/my-page-context';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none'
  }
});

interface Page {
  order?: Order;
  onBack(): void;
  onPay(order: string): void;
}

const Order: NextPage<Page> = ({ onBack, onPay, order }) => {
  const classes = useStyles();

  if (!order) {
    return (
      <>
        <div>
          <Typography variant="h5" id="tableTitle">
            Заказ не найден
          </Typography>
          <Link href="/">
            <a className={classes.link}>
              <Typography variant="subtitle1" id="tableTitle">
                В магазин
              </Typography>
            </a>
          </Link>
        </div>
      </>
    );
  }

  return (
    <OrderSummary
      order={order}
      onPay={() => onPay(order._id)}
      onBack={onBack}
    />
  );
};

Order.getInitialProps = async ({
  res,
  query,
  reduxStore
}: InitializedPageContex) => {
  const { ORDER_PAGE_LOADED } = OrderActions.Types;
  const action = RootActions.Creators.waitFor(ORDER_PAGE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(OrderActions.Creators.loadOrderPage(query, res));
  return promise;
};

const mapState = state => ({
  order: getOrder(state)
});
const mapDispatch = {
  onBack: () => RootActions.Creators.redirect('/profile'),
  onPay: OrderActions.Creators.onPay
};

export default connect(mapState, mapDispatch)(Order);
