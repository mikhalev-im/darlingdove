export const BASE_URL = '/category';

export const PRODUCTS_PER_PAGE = 50;

export const DEFAULT_FILTERS = {
  orderBy: 'createdTime',
  order: 'desc',
  limit: PRODUCTS_PER_PAGE,
  skip: 0,
  inStock: true
};

export const TITLE_MAPPING = {
  postcards: 'Открытки',
  envelopes: 'Конверты'
};
