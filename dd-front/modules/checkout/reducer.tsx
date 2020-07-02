import Immutable, { ImmutableObject } from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions, { ChangeStepAction } from './actions';
import { CHECKOUT_STEPS } from './constants';

interface CheckoutState {
  step: number;
}

export type ImmutableCheckoutState = ImmutableObject<CheckoutState>;

export const INITIAL_STATE = Immutable({
  step: CHECKOUT_STEPS.ADDRESS_STEP_INTEX
});

const changeStep = (
  state: ImmutableCheckoutState,
  { step }: ChangeStepAction
) => state.set('step', step);

export const HANDLERS = {
  [Actions.Types.CHANGE_STEP]: changeStep
};

export default createReducer(INITIAL_STATE, HANDLERS);
