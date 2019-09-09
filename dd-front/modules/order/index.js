import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';

import * as api from '../shared/utils/api';
import RootActions from '../root/actions';
import { getUser } from '../user/selectors';
import Layout from '../shared/components/layout';
import OrderSummary from '../shared/components/order-summary';
import OrderType from './types/order';

const styles = () => ({
  link: {
    textDecoration: 'none'
  }
});

class Order extends Component {
  static async getInitialProps({ res, reduxStore, query: { id } }) {
    const user = getUser(reduxStore.getState());

    if (!user.jwt)
      return reduxStore.dispatch(RootActions.Creators.redirect('/login', res));

    const order = await api.getOrder(id).catch(err => {
      if (err.statusCode === 404) return;
      throw err;
    });

    return { order };
  }

  onPayClick = () => {};
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
      <Layout>
        {this.props.order ? this.renderSummary() : this.renderNotFound()}
      </Layout>
    );
  }
}

Order.propTypes = {
  classes: PropTypes.any,
  order: OrderType,
  redirect: PropTypes.func
};

const mapState = () => ({});
const mapDispatch = {
  redirect: RootActions.Creators.redirect
};

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(Order)
);
