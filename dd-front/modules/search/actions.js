import { createActions } from 'reduxsauce';

export default createActions({
  loadSearchPage: ['query'],
  setSearchProducts: ['products'],
  searchPageLoaded: ['error', 'query']
});
