import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions from './actions';
import { CHECKOUT_STEPS } from './constants';

export const INITIAL_STATE = Immutable({
  step: CHECKOUT_STEPS.ADDRESS_STEP_INTEX
});

const changeStep = (state, { step }) => state.set('step', step);

export const HANDLERS = {
  [Actions.Types.CHANGE_STEP]: changeStep
};

export default createReducer(INITIAL_STATE, HANDLERS);
