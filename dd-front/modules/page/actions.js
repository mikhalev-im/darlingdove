import { createActions } from 'reduxsauce';

export default createActions({
  loadPage: ['query'],
  pageLoaded: ['blocks']
});
