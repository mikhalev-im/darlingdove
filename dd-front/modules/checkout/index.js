import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { withStyles } from '@material-ui/core/styles';

import { CHECKOUT_STEPS } from './constants';
import Layout from '../shared/components/layout';
import ShippingForm from './components/shipping-form';
import OrderSummary from '../shared/components/order-summary';
import RootActions from '../root/actions';
import CheckoutActions from './actions';
import { getStep } from './selectors';
import { getUser } from '../user/selectors';
import { getCartItems, getCartServices } from '../cart/selectors';

import ItemType from '../cart/types/item';
import ServiceType from '../cart/types/service';
import UserType from '../profile/types/user';

const STEPS = ['Адрес доставки', 'Подтверждение заказа'];

const MAX_WIDTH_MULTIPLIER = 125;

const styles = theme => ({
  stepper: {
    maxWidth: theme.spacing(MAX_WIDTH_MULTIPLIER),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.padding
  }
});

class Checkout extends Component {
  constructor(props) {
    super(props);

    const { user } = props;

    this.state = {
      fname: user.firstName || '',
      lname: user.lastName || '',
      country: user.country || '',
      address: user.address || '',
      postCode: user.postalCode || ''
    };
  }

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleNextClick = () => {
    const { onNextClick } = this.props;
    const userData = {
      firstName: this.state.fname,
      lastName: this.state.lname,
      country: this.state.country,
      address: this.state.address,
      postalCode: this.state.postCode
    };
    onNextClick(userData);
  };

  handleBackClick = () => {
    this.props.changeStep(CHECKOUT_STEPS.ADDRESS_STEP_INTEX);
  };

  renderShippingForm() {
    const { fname, lname, country, address, postCode } = this.state;

    return (
      <ShippingForm
        fname={fname}
        lname={lname}
        country={country}
        address={address}
        postCode={postCode}
        onNext={this.handleNextClick}
        onChange={this.handleInputChange}
      />
    );
  }

  renderOrderSummary() {
    const items = this.props.items.map(item => {
      return { ...item, price: item.product.price };
    });

    const order = {
      items,
      user: this.props.user,
      services: this.props.services,
      status: 'notPaid'
    };

    return (
      <OrderSummary
        order={order}
        onBack={this.handleBackClick}
        onPay={this.props.onPayClick}
      />
    );
  }

  render() {
    const { classes, activeStep } = this.props;

    return (
      <Layout>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {STEPS.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === CHECKOUT_STEPS.ADDRESS_STEP_INTEX
          ? this.renderShippingForm()
          : this.renderOrderSummary()}
      </Layout>
    );
  }
}

Checkout.getInitialProps = async ({ res, reduxStore }) => {
  const { CHECKOUT_PAGE_LOADED } = CheckoutActions.Types;
  const action = RootActions.Creators.waitFor(CHECKOUT_PAGE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(CheckoutActions.Creators.loadCheckoutPage(res));
  return promise;
};

Checkout.propTypes = {
  classes: PropTypes.any.isRequired,
  user: UserType,
  items: PropTypes.arrayOf(ItemType).isRequired,
  services: PropTypes.arrayOf(ServiceType).isRequired,
  activeStep: PropTypes.number.isRequired,
  changeStep: PropTypes.func.isRequired,
  onPayClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired
};

const mapState = state => ({
  user: getUser(state),
  items: getCartItems(state),
  services: getCartServices(state),
  activeStep: getStep(state)
});

const mapDispatch = {
  changeStep: CheckoutActions.Creators.changeStep,
  onPayClick: CheckoutActions.Creators.createOrderAndPay,
  onNextClick: CheckoutActions.Creators.saveUserAndChangeStep
};

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(Checkout)
);
