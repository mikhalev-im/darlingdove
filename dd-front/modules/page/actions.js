import { createActions } from 'reduxsauce';

export default createActions({
  loadPage: ['query', 'res'],
  pageLoaded: ['error', 'blocks']
});
