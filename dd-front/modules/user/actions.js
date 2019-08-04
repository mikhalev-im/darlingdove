import { createActions } from 'reduxsauce';

export default createActions({
  setUser: ['user'],
  setToken: ['token'],
  saveUserData: ['data'],
  logout: null,
  resetUser: null,
  login: ['email', 'password'],
  register: ['email', 'password'],
  changePassword: ['passwordOld', 'passwordNew']
});
