import { all, takeEvery, call, put } from 'redux-saga/effects';

import { getProducts, getTags } from '../shared/utils/api';
import Actions from './actions';

import { buildProductFilters } from './helpers';

export function* loadCategoryPage({ query }) {
  // build and set filters
  const filters = yield call(buildProductFilters, query);
  yield put(Actions.Creators.setFilters(filters));

  // load products
  const products = yield call(getProducts, filters);
  yield put(Actions.Creators.setProducts(products));

  // load tags
  const tags = yield call(getTags, query.category);
  yield put(Actions.Creators.setTags(tags));

  // emit page is loaded
  yield put(Actions.Creators.categoryPageLoaded(query));
}

export default function* categorySagas() {
  yield all([takeEvery(Actions.Types.LOAD_CATEGORY_PAGE, loadCategoryPage)]);
}
