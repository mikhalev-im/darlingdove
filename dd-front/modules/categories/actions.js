import { createActions } from 'reduxsauce';

export default createActions({
  loadPage: ['query'],
  setTags: ['tags'],
  setProducts: ['products'],
  setFilters: ['filters'],
  pageLoaded: null
});
