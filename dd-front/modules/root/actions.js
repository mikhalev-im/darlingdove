import { createActions } from 'reduxsauce';
import { WAIT_FOR_TYPE } from './middlewares/waitFor';

export default createActions({
  showModal: ['data'],
  closeModal: null,
  setIsLoading: ['value'],
  redirect: ['redirectTo', 'res'],
  waitFor: actionType => ({ type: WAIT_FOR_TYPE, actionType })
});
