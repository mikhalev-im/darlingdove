import { createActions } from 'reduxsauce';

interface LoginTypes {
  readonly LOAD_LOGIN_PAGE: string;
  readonly LOGIN_PAGE_LOADED: string;
}

export interface LoadLoginPageAction {
  readonly type: 'LOAD_LOGIN_PAGE';
  readonly query: any;
  readonly res: any;
}

export interface LoginPageLoadedAction {
  readonly type: 'LOGIN_PAGE_LOADED_PAGE';
  readonly error?: any;
  readonly blocks?: any;
}

interface LoginActionCreators {
  loadLoginPage(query: any, res: any): LoadLoginPageAction;
  loginPageLoaded(
    error: any,
    redirectDestination?: string
  ): LoginPageLoadedAction;
}

export default createActions<LoginTypes, LoginActionCreators>({
  loadLoginPage: ['query', 'res'],
  loginPageLoaded: ['error', 'redirectDestination']
});
