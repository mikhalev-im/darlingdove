import { createActions } from 'reduxsauce';
import { WAIT_FOR_TYPE } from './middlewares/wait-for';
import { NotificationData } from '../shared/components/layout/notifications';
import { ServerResponse } from 'http';
import { PageContext } from '../shared/interfaces/my-page-context';

interface RootTypes {
  readonly SHOW_MODAL: 'SHOW_MODAL';
  readonly CLOSE_MODAL: 'CLOSE_MODAL';
  readonly SET_IS_LOADING: 'SET_IS_LOADING';
  readonly REDIRECT: 'REDIRECT';
  readonly INITIALIZE: 'INITIALIZE';
  readonly INITIALIZED: 'INITIALIZED';
  readonly WAIT_FOR: typeof WAIT_FOR_TYPE;
}

export interface ShowModalAction {
  readonly type: 'SHOW_MODAL';
  readonly data: NotificationData;
}

export interface CloseModalAction {
  readonly type: 'CLOSE_MODAL';
}

export interface SetIsLoadingAction {
  readonly type: 'SET_IS_LOADING';
  readonly value: boolean;
}

export type RedirectTo = string | { url: string; as: string };

export interface RedirectAction {
  readonly type: 'REDIRECT';
  readonly redirectTo: RedirectTo;
  readonly res?: ServerResponse;
}

export interface InitializeAction {
  readonly type: 'INITIALIZE';
  readonly ctx: PageContext;
}

export interface InitializedAction {
  readonly type: 'INITIALIZED';
}

export interface WaitForAction {
  readonly type: typeof WAIT_FOR_TYPE;
  readonly actionType: string;
}

interface RootActionCreators {
  showModal(data: NotificationData): ShowModalAction;
  closeModal(): CloseModalAction;
  setIsLoading(value: boolean): SetIsLoadingAction;
  redirect(redirectTo: RedirectTo, res?: ServerResponse): RedirectAction;
  initialize(ctx: PageContext): InitializeAction;
  initialized(): InitializedAction;
  waitFor(actionType: string): WaitForAction;
}

export default createActions<RootTypes, RootActionCreators>({
  showModal: ['data'],
  closeModal: null,
  setIsLoading: ['value'],
  redirect: ['redirectTo', 'res'],
  initialize: ['ctx'],
  initialized: null,
  waitFor: (actionType: string) => ({ type: WAIT_FOR_TYPE, actionType })
});
