import { createActions } from 'reduxsauce';

export default createActions({
  loadCategoryPage: ['query'],
  setTags: ['tags'],
  setProducts: ['products'],
  setFilters: ['filters'],
  categoryPageLoaded: ['error', 'query']
});
