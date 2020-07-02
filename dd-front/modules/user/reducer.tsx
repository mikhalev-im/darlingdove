import Immutable, { ImmutableObject } from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions, { SetUserAction, SetTokenAction } from './actions';

interface UserState {
  _id: string;
  email: string;
  jwt: string;
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  postalCode: string;
}

export type ImmutableUserState = ImmutableObject<UserState>;

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

const setUser = (state: ImmutableUserState, { user }: SetUserAction) =>
  state
    .set('_id', user._id || '')
    .set('email', user.email || '')
    .set('firstName', user.firstName || '')
    .set('lastName', user.lastName || '')
    .set('country', user.country || '')
    .set('address', user.address || '')
    .set('postalCode', user.postalCode || '')
    .set('jwt', user.jwt || state.jwt || '');

const setToken = (state: ImmutableUserState, { token }: SetTokenAction) =>
  state.set('jwt', token);

const resetUser = () => INITIAL_STATE;

type Actions = SetUserAction & SetTokenAction;

export const HANDLERS = {
  [Actions.Types.SET_USER]: setUser,
  [Actions.Types.SET_TOKEN]: setToken,
  [Actions.Types.RESET_USER]: resetUser
};

export default createReducer<ImmutableUserState, Actions>(
  INITIAL_STATE,
  HANDLERS
);
