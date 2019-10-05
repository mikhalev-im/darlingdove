export const BASE_URL = '/category';

export const PRODUCTS_PER_PAGE = 50;

export const DEFAULT_FILTERS = {
  orderBy: 'createdTime',
  order: 'desc',
  limit: PRODUCTS_PER_PAGE,
  skip: 0,
  inStock: true
};

export const CATEGORY_META_MAPPING = {
  postcards: {
    header: 'Открытки',
    meta: {
      title: 'Открытки - DarlingDove',
      description: 'Открытки для посткроссинга'
    }
  },
  envelopes: {
    header: 'Конверты',
    meta: {
      title: 'Конверты - DarlingDove',
      description: 'Конверты для посткроссинга'
    }
  }
};
