import { createActions } from 'reduxsauce';

export default createActions({
  loadLoginPage: ['query', 'res'],
  loginPageLoaded: ['error', 'redirectDestination']
});
