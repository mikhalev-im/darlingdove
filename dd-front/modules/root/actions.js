import { createActions } from 'reduxsauce';

export default createActions({
  showModal: ['data'],
  closeModal: null,
  redirect: ['redirectTo', 'res']
});
