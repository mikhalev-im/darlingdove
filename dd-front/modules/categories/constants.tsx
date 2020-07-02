export const BASE_URL = '/category';

export const PRODUCTS_PER_PAGE = 50;

export const DEFAULT_FILTERS = {
  orderBy: 'createdTime',
  order: 'desc',
  limit: PRODUCTS_PER_PAGE,
  skip: 0,
  inStock: true
};

interface Meta {
  header?: string;
  meta?: {
    title?: string;
    description?: string;
  };
}

export const CATEGORY_META_MAPPING: { [key: string]: Meta | undefined } = {
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

export const SORT_OPTIONS = [
  { name: 'По новизне (>)', value: 'createdTime desc' },
  { name: 'По новизне (<)', value: 'createdTime asc' },
  { name: 'По названию А-Я', value: 'name asc' },
  { name: 'По названию Я-А', value: 'name desc' },
  { name: 'Популярные (>)', value: 'ordersCount desc' },
  { name: 'Популярные (<)', value: 'ordersCount asc' }
];
