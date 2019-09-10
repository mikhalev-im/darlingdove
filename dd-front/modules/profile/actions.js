import { createActions } from 'reduxsauce';

export default createActions({
  loadProfile: ['res'],
  profileLoaded: null,
  setOrders: ['orders']
});
