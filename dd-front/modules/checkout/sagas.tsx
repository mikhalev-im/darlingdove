import { call, put, takeEvery, all, select } from 'redux-saga/effects';

import { createOrder } from '../shared/utils/api';
import Actions, {
  LoadCheckoutPageAction,
  SaveUserAndChangeStepAction,
  CreateOrderAndPayAction
} from './actions';
import RootActions from '../root/actions';
import CartActions from '../cart/actions';
import NotificationsActions from '../notifications/actions';
import OrderActions from '../order/actions';
import { CHECKOUT_STEPS, ERROR_CODE_MESSAGES } from './constants';
import { PROMO_ERROR_CODE_MESSAGES } from '../shared/constants';
import { saveUserData } from '../user/sagas';
import { getUserId } from '../user/selectors';
import { getCartItems, getCartId } from '../cart/selectors';

export function* loadCheckoutPage({ res }: LoadCheckoutPageAction) {
  const userId = yield select(getUserId);
  const items = yield select(getCartItems);

  try {
    if (!userId) {
      // redirect to login if no user
      yield put(
        RootActions.Creators.redirect('/login?redirect=/checkout', res)
      );
    } else if (!items.length) {
      // redirect back to cart if no items
      yield put(RootActions.Creators.redirect('/cart', res));
    } else {
      // set step to address information
      yield put(Actions.Creators.changeStep(CHECKOUT_STEPS.ADDRESS_STEP_INTEX));
    }

    // resolve waitFor promise
    yield put(Actions.Creators.checkoutPageLoaded());
  } catch (err) {
    yield put(Actions.Creators.checkoutPageLoaded(err));
  }
}

export function* saveUserAndChangeStep({ data }: SaveUserAndChangeStepAction) {
  try {
    yield call(saveUserData, { data });
    yield put(
      Actions.Creators.changeStep(CHECKOUT_STEPS.ORDER_SUMMARY_STEP_INDEX)
    );
  } catch (err) {
    yield put(
      NotificationsActions.Creators.addNotification({
        key: 'saveUserAndChangeStepError',
        message: `Ошибка!`,
        debug: err
      })
    );
  }
}

export function* createOrderAndPay({ comment }: CreateOrderAndPayAction) {
  const cartId = yield select(getCartId);

  let order;
  try {
    order = yield call(createOrder, cartId, comment);
  } catch (err) {
    let redirect;
    let message =
      ERROR_CODE_MESSAGES[err.code] || PROMO_ERROR_CODE_MESSAGES[err.code];

    if (message) {
      redirect = '/cart';
    } else {
      message = `Неизвестная ошибка: ${err.message}`;
    }

    yield put(
      NotificationsActions.Creators.addNotification({
        key: 'orderCreationError',
        message
      })
    );

    if (redirect) yield put(RootActions.Creators.redirect(redirect));

    return;
  }

  // reset cart items
  yield put(CartActions.Creators.resetCartItems());
  // pay for order
  yield put(OrderActions.Creators.onPay(order._id));
}

export default function* checkoutSagas() {
  yield all([
    takeEvery(Actions.Types.LOAD_CHECKOUT_PAGE, loadCheckoutPage),
    takeEvery(Actions.Types.CREATE_ORDER_AND_PAY, createOrderAndPay),
    takeEvery(Actions.Types.SAVE_USER_AND_CHANGE_STEP, saveUserAndChangeStep)
  ]);
}
