import React, { useReducer } from 'react';
import { connect } from 'react-redux';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { makeStyles } from '@material-ui/core/styles';

import { CHECKOUT_STEPS } from './constants';
import ShippingForm from './components/shipping-form';
import OrderSummary from '../shared/components/order-summary';
import RootActions from '../root/actions';
import CheckoutActions from './actions';
import { getStep } from './selectors';
import { getUser } from '../user/selectors';
import {
  getCartItems,
  getCartServices,
  getCartPromocodes
} from '../cart/selectors';
import { NextPage } from 'next';
import { InitializedPageContex } from '../shared/interfaces/my-page-context';

const STEPS = ['Адрес доставки', 'Подтверждение заказа'];

const MAX_WIDTH_MULTIPLIER = 125;

const useStyles = makeStyles(theme => ({
  stepper: {
    maxWidth: theme.spacing(MAX_WIDTH_MULTIPLIER),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(2)
  }
}));

const reducer = (state, action) => {
  const { type, ...rest } = action;

  switch (action.type) {
    case 'CHANGE_INPUT':
      return {
        ...state,
        ...rest
      };
    default:
      return state;
  }
};

interface Checkout {}

const Checkout: NextPage<Checkout> = props => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, {
    fname: props.user.firstName || '',
    lname: props.user.lastName || '',
    country: props.user.country || '',
    address: props.user.address || '',
    postCode: props.user.postalCode || ''
  });

  const { items, activeStep, onNextClick, changeStep } = props;

  const handleInputChange = event => {
    dispatch({
      type: 'CHANGE_INPUT',
      [event.target.name]: event.target.value
    });
  };

  const handleNextClick = () => {
    onNextClick({
      firstName: state.fname,
      lastName: state.lname,
      country: state.country,
      address: state.address,
      postalCode: state.postCode
    });
  };

  const onBackClick = () => {
    changeStep(CHECKOUT_STEPS.ADDRESS_STEP_INTEX);
  };

  return (
    <>
      <Stepper activeStep={activeStep} className={classes.stepper}>
        {STEPS.map(label => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === CHECKOUT_STEPS.ADDRESS_STEP_INTEX ? (
        <ShippingForm
          fname={state.fname}
          lname={state.lname}
          country={state.country}
          address={state.address}
          postCode={state.postCode}
          onNext={handleNextClick}
          onChange={handleInputChange}
        />
      ) : (
        <OrderSummary
          order={{
            items: items.map(item => ({
              ...item,
              price: item.product.price
            })),
            user: props.user,
            services: props.services,
            promocodes: props.promocodes,
            status: 'notPaid'
          }}
          onBack={onBackClick}
          onPay={props.onPayClick}
        />
      )}
    </>
  );
};

Checkout.getInitialProps = async ({
  res,
  reduxStore
}: InitializedPageContex) => {
  const { CHECKOUT_PAGE_LOADED } = CheckoutActions.Types;
  const action = RootActions.Creators.waitFor(CHECKOUT_PAGE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(CheckoutActions.Creators.loadCheckoutPage(res));
  return promise;
};

const mapState = state => ({
  user: getUser(state),
  items: getCartItems(state),
  services: getCartServices(state),
  promocodes: getCartPromocodes(state),
  activeStep: getStep(state)
});

const mapDispatch = {
  changeStep: CheckoutActions.Creators.changeStep,
  onPayClick: CheckoutActions.Creators.createOrderAndPay,
  onNextClick: CheckoutActions.Creators.saveUserAndChangeStep
};

export default connect(mapState, mapDispatch)(Checkout);
