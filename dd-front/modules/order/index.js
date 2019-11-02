import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';

import OrderActions from './actions';
import RootActions from '../root/actions';
import OrderSummary from '../shared/components/order-summary';
import OrderType from './types/order';
import { getOrder } from './selectors';

const styles = () => ({
  link: {
    textDecoration: 'none'
  }
});

class Order extends Component {
  static async getInitialProps({ res, query, reduxStore }) {
    const { ORDER_PAGE_LOADED } = OrderActions.Types;
    const action = RootActions.Creators.waitFor(ORDER_PAGE_LOADED);
    const promise = reduxStore.dispatch(action);
    reduxStore.dispatch(OrderActions.Creators.loadOrderPage(query, res));
    return promise;
  }

  onPayClick = () => {
    const { order, onPay } = this.props;
    onPay(order._id);
  };

  onBackClick = () => this.props.redirect('/profile');

  renderSummary() {
    return (
      <OrderSummary
        order={this.props.order}
        onPay={this.onPayClick}
        onBack={this.onBackClick}
      />
    );
  }

  renderNotFound() {
    return (
      <div>
        <Typography variant="h5" id="tableTitle">
          Заказ не найден
        </Typography>
        <Link href="/">
          <a className={this.props.classes.link}>
            <Typography variant="subtitle1" id="tableTitle">
              В магазин
            </Typography>
          </a>
        </Link>
      </div>
    );
  }

  render() {
    return (
      <>{this.props.order ? this.renderSummary() : this.renderNotFound()}</>
    );
  }
}

Order.propTypes = {
  classes: PropTypes.any,
  order: OrderType,
  redirect: PropTypes.func
};

const mapState = state => ({
  order: getOrder(state)
});
const mapDispatch = {
  redirect: RootActions.Creators.redirect,
  onPay: OrderActions.Creators.onPay
};

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(Order)
);
