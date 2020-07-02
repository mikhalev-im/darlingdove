import Immutable, { ImmutableObject } from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions, {
  SetCategoryTagsAction,
  SetCategoryProductsAction,
  SetCategoryFiltersAction
} from './actions';
import { Product } from '../shared/interfaces/product';

const PRODUCTS_PER_PAGE = 50;

interface CategoryState {
  tags: string[];
  products: {
    count: number;
    data: Product[];
  };
  filters: {
    orderBy: string;
    order: string;
    limit: number;
    skip: number;
    inStock: boolean;
  };
}

export type ImmutableCategoryState = ImmutableObject<CategoryState>;

export const INITIAL_STATE = Immutable({
  tags: [],
  products: {
    count: 0,
    data: []
  },
  filters: {
    orderBy: 'createdTime',
    order: 'desc',
    limit: PRODUCTS_PER_PAGE,
    skip: 0,
    inStock: true
  }
});

type Actions =
  | SetCategoryTagsAction
  | SetCategoryProductsAction
  | SetCategoryFiltersAction;

const setCategoryTags = (
  state: ImmutableCategoryState,
  { tags }: SetCategoryTagsAction
) => state.set('tags', tags);
const setCategoryProducts = (
  state: ImmutableCategoryState,
  { products }: SetCategoryProductsAction
) => state.set('products', products);
const setCategoryFilters = (
  state: ImmutableCategoryState,
  { filters }: SetCategoryFiltersAction
) => state.set('filters', filters);

export const HANDLERS = {
  [Actions.Types.SET_CATEGORY_TAGS]: setCategoryTags,
  [Actions.Types.SET_CATEGORY_PRODUCTS]: setCategoryProducts,
  [Actions.Types.SET_CATEGORY_FILTERS]: setCategoryFilters
};

export default createReducer<ImmutableCategoryState, Actions>(
  INITIAL_STATE,
  HANDLERS
);
