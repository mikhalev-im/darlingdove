import { all, takeEvery, call, put } from 'redux-saga/effects';

import { getProductBySku, getRandomProducts } from '../shared/utils/api';
import Actions from './actions';

export function* loadProductPage({ sku, ...rest }) {
  // load and set product
  const product = yield call(getProductBySku, sku);
  yield put(Actions.Creators.setProduct(product));

  // load and set related products
  const relatedProducts = yield call(getRandomProducts, 4);
  yield put(Actions.Creators.setRelatedProducts(relatedProducts));

  // emit page is loaded
  yield put(Actions.Creators.productPageLoaded());
}

export default function* productSagas() {
  yield all([takeEvery(Actions.Types.LOAD_PRODUCT_PAGE, loadProductPage)]);
}
