import { all, takeEvery, call, put } from 'redux-saga/effects';

import { getProductBySku, getRandomProducts } from '../shared/utils/api';
import Actions from './actions';
import RootActions from '../root/actions';

export function* loadProductPage({ sku, res }) {
  try {
    // load and set product
    const product = yield call(getProductBySku, sku);
    if (!product) {
      // redirect to login if there is no user
      yield put(RootActions.Creators.redirect('/404', res));
    } else {
      yield put(Actions.Creators.setProduct(product));

      // load and set related products
      const relatedProducts = yield call(getRandomProducts, 4);
      yield put(Actions.Creators.setRelatedProducts(relatedProducts));
    }

    // emit page is loaded
    yield put(Actions.Creators.productPageLoaded());
  } catch (err) {
    yield put(Actions.Creators.productPageLoaded(err));
  }
}

export default function* productSagas() {
  yield all([takeEvery(Actions.Types.LOAD_PRODUCT_PAGE, loadProductPage)]);
}
