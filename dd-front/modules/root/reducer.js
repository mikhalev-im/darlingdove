import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions from './actions';

export const INITIAL_STATE = Immutable({
  isLoading: false,
  modal: {
    open: false,
    data: null
  }
});

const showModal = (state, { data }) => state.set('modal', { open: true, data });
const closeModal = state => state.set('modal', { open: false, data: null });

export const HANDLERS = {
  [Actions.Types.SHOW_MODAL]: showModal,
  [Actions.Types.CLOSE_MODAL]: closeModal
};

export default createReducer(INITIAL_STATE, HANDLERS);
