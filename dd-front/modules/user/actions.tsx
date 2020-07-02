import { createActions } from 'reduxsauce';
import { User } from '../shared/interfaces/user';
import { RedirectTo } from '../root/actions';

interface UserTypes {
  readonly SET_USER: 'SET_USER';
  readonly SET_TOKEN: 'SET_TOKEN';
  readonly SAVE_USER_DATA: 'SAVE_USER_DATA';
  readonly LOGOUT: 'LOGOUT';
  readonly RESET_USER: 'RESET_USER';
  readonly LOGIN: 'LOGIN';
  readonly REGISTER: 'REGISTER';
  readonly CHANGE_PASSWORD: 'CHANGE_PASSWORD';
}

interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  postalCode: string;
  jwt: string;
}

export interface SetUserAction {
  readonly type: 'SET_USER';
  readonly user: UserData;
}

export interface SetTokenAction {
  readonly type: 'SET_TOKEN';
  readonly token: string;
}

export interface SaveUserDataAction {
  readonly type: 'SAVE_USER_DATA';
  readonly data: UserData;
}

export interface LogoutAction {
  readonly type: 'LOGOUT';
}

export interface ResetUserAction {
  readonly type: 'RESET_USER';
}

export interface LoginAction {
  readonly type: 'LOGIN';
  readonly email: string;
  readonly password: string;
  readonly redirectTo?: string;
}

export interface RegisterAction {
  readonly type: 'REGISTER';
  readonly email: string;
  readonly password: string;
  readonly redirectTo?: RedirectTo;
}

export interface ChangePasswordAction {
  readonly type: 'CHANGE_PASSWORD';
  readonly passwordOld: string;
  readonly passwordNew: string;
}

interface UserActionCreators {
  setUser(user: User): SetUserAction;
  setToken(token: string): SetTokenAction;
  saveUserData(data: UserData): SaveUserDataAction;
  logout(): LogoutAction;
  resetUser(): ResetUserAction;
  login(email: string, password: string, redirectTo?: string): LoginAction;
  register(
    email: string,
    password: string,
    redirectTo?: RedirectTo
  ): RegisterAction;
  changePassword(
    passwordOld: string,
    passwordNew: string
  ): ChangePasswordAction;
}

export default createActions<UserTypes, UserActionCreators>({
  setUser: ['user'],
  setToken: ['token'],
  saveUserData: ['data'],
  logout: null,
  resetUser: null,
  login: ['email', 'password', 'redirectTo'],
  register: ['email', 'password', 'redirectTo'],
  changePassword: ['passwordOld', 'passwordNew']
});
