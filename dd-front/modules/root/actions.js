import { createActions } from 'reduxsauce';
import { WAIT_FOR_TYPE } from './middlewares/wait-for';

export default createActions({
  showModal: ['data'],
  closeModal: null,
  setIsLoading: ['value'],
  redirect: ['redirectTo', 'res'],
  initialize: ['ctx'],
  waitFor: actionType => ({ type: WAIT_FOR_TYPE, actionType })
});
