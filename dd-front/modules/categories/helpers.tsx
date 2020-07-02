import { DEFAULT_FILTERS } from './constants';

interface Filters {
  category?: string;
  order?: string;
  orderBy?: string;
  skip?: number;
  tags?: string[];
  tagsOptional?: string[];
  inStock?: boolean;
  limit?: number;
}

/**
 * Builds product filters by query
 *
 *  @param {object} query - page query object
 */
export const buildProductFilters = (query: any) => {
  const filters: Filters = { ...DEFAULT_FILTERS };

  if (query.category) filters.category = query.category;

  if (query.tags) {
    // normalize tags
    query.tags = Array.isArray(query.tags) ? query.tags : [query.tags];

    filters.tagsOptional = query.tags;
  }

  if (query.skip) filters.skip = query.skip;

  if (query.order) filters.order = query.order;
  if (query.orderBy) filters.orderBy = query.orderBy;

  return filters;
};
