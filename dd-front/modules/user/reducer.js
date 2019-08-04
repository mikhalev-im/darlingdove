import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions from './actions';

export const INITIAL_STATE = Immutable({
  _id: '',
  email: '',
  jwt: '',
  firstName: '',
  lastName: '',
  country: '',
  address: '',
  postalCode: ''
});

const setUser = (state, { user }) =>
  state
    .set('_id', user._id || '')
    .set('email', user.email || '')
    .set('firstName', user.firstName || '')
    .set('lastName', user.lastName || '')
    .set('country', user.country || '')
    .set('address', user.address || '')
    .set('postalCode', user.postalCode || '')
    .set('jwt', user.jwt || state.jwt || '');

const setToken = (state, { token }) => state.set('jwt', token);

const resetUser = () => INITIAL_STATE;

export const HANDLERS = {
  [Actions.Types.SET_USER]: setUser,
  [Actions.Types.SET_TOKEN]: setToken,
  [Actions.Types.RESET_USER]: resetUser
};

export default createReducer(INITIAL_STATE, HANDLERS);
