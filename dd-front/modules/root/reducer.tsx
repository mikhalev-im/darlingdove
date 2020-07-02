import Immutable, { ImmutableObject } from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions, { ShowModalAction, SetIsLoadingAction } from './actions';

interface RootState {
  isLoading: boolean;
  modal: {
    open: boolean;
    data: any;
  };
}

export type ImmutableRootState = ImmutableObject<RootState>;

export const INITIAL_STATE = Immutable({
  isLoading: false,
  modal: {
    open: false,
    data: null
  }
});

const showModal = (state: ImmutableRootState, { data }: ShowModalAction) =>
  state.set('modal', { open: true, data });

const closeModal = (state: ImmutableRootState) =>
  state.set('modal', { open: false, data: null });

const setIsLoading = (
  state: ImmutableRootState,
  { value }: SetIsLoadingAction
) => state.set('isLoading', !!value);

type Actions = ShowModalAction | SetIsLoadingAction;

export const HANDLERS = {
  [Actions.Types.SHOW_MODAL]: showModal,
  [Actions.Types.CLOSE_MODAL]: closeModal,
  [Actions.Types.SET_IS_LOADING]: setIsLoading
};

export default createReducer<ImmutableRootState, Actions>(
  INITIAL_STATE,
  HANDLERS
);
