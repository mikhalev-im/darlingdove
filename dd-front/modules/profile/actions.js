import { createActions } from 'reduxsauce';

export default createActions({
  loadProfile: ['res'],
  profileLoaded: ['error'],
  setOrders: ['orders']
});
