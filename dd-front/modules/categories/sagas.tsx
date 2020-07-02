import { all, takeEvery, call, put } from 'redux-saga/effects';

import { getProducts, getTags } from '../shared/utils/api';
import Actions, { LoadCategoryPageAction } from './actions';
import RootActions from '../root/actions';
import { CATEGORY_META_MAPPING } from './constants';

import { buildProductFilters } from './helpers';

export function* loadCategoryPage({ res, query }: LoadCategoryPageAction) {
  try {
    // build and set filters
    const filters = yield call(buildProductFilters, query);

    if (!CATEGORY_META_MAPPING[filters.category]) {
      yield put(RootActions.Creators.redirect('/404', res));
    } else {
      yield put(Actions.Creators.setCategoryFilters(filters));

      // load products
      const products = yield call(getProducts, filters);
      yield put(Actions.Creators.setCategoryProducts(products));

      // load tags
      const tags = yield call(getTags, query.category);
      yield put(Actions.Creators.setCategoryTags(tags));
    }

    // emit page is loaded
    yield put(Actions.Creators.categoryPageLoaded(null, query));
  } catch (err) {
    yield put(Actions.Creators.categoryPageLoaded(err));
  }
}

export default function* categorySagas() {
  yield all([takeEvery(Actions.Types.LOAD_CATEGORY_PAGE, loadCategoryPage)]);
}
