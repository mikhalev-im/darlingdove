import { all, takeEvery, call, put } from 'redux-saga/effects';

import { getProducts } from '../shared/utils/api';
import Actions, { LoadSearchPage } from './actions';

interface SearchFilters {
  search: string;
  skip?: number;
}

export function* loadSearchPage({ query }: LoadSearchPage) {
  try {
    // no need to load products
    if (!query.search) {
      yield put(Actions.Creators.setSearchProducts({ count: 0, products: [] }));
      yield put(Actions.Creators.searchPageLoaded(null, query));
      return;
    }

    // build and set filters
    const filters: SearchFilters = { search: query.search };
    if (query.skip) filters.skip = query.skip;

    // load products
    const products = yield call(getProducts, filters);
    yield put(Actions.Creators.setSearchProducts(products));

    // emit page is loaded
    yield put(Actions.Creators.searchPageLoaded(null, query));
  } catch (err) {
    yield put(Actions.Creators.searchPageLoaded(err));
  }
}

export default function* searchSagas() {
  yield all([takeEvery(Actions.Types.LOAD_SEARCH_PAGE, loadSearchPage)]);
}
