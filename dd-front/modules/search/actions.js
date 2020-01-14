import { createActions } from 'reduxsauce';

export default createActions({
  loadSearchPage: ['query'],
  setProducts: ['products'],
  searchPageLoaded: ['error', 'query']
});
