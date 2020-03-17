import { createActions } from 'reduxsauce';

export default createActions({
  loadCategoryPage: ['query', 'res'],
  setCategoryTags: ['tags'],
  setCategoryProducts: ['products'],
  setCategoryFilters: ['filters'],
  categoryPageLoaded: ['error', 'query']
});
