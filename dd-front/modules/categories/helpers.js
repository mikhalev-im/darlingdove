import { DEFAULT_FILTERS } from './constants';

/**
 * Builds product filters by query
 *
 *  @param {object} query - page query object
 */
export const buildProductFilters = query => {
  const filters = { ...DEFAULT_FILTERS };

  if (query.category) filters.category = query.category;

  if (query.tags) {
    // normalize tags
    query.tags = Array.isArray(query.tags) ? query.tags : [query.tags];

    filters.tagsOptional = query.tags;
  }

  if (query.skip) filters.skip = query.skip;

  if (query.sort) {
    const [orderBy, order] = query.sort.split(' ');
    filters.order = order.toLowerCase();
    filters.orderBy = orderBy;
  }

  return filters;
};
