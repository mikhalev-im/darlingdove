import { createActions } from 'reduxsauce';

export default createActions({
  loadCategoryPage: ['query'],
  setCategoryTags: ['tags'],
  setCategoryProducts: ['products'],
  setCategoryFilters: ['filters'],
  categoryPageLoaded: ['error', 'query']
});
