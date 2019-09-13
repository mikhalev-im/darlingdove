import isServer from '../shared/utils/isServer';
import * as api from '../shared/utils/api';
import Actions from './actions';
import { initializeStore } from './store';
import { __NEXT_REDUX_STORE__ } from './constants';
import { getToken } from '../user/selectors';

export const initialize = (serverState, ctx) => {
  let store;
  if (isServer) {
    // server - always fresh store
    store = initializeStore(serverState);
    api.configure(getToken(store.getState()));
    // it is app.getInitialProps - parse cookie, etc.
    if (ctx) store.dispatch(Actions.Creators.initialize(ctx));
  } else if (window[__NEXT_REDUX_STORE__]) {
    // already initialized client
    store = window[__NEXT_REDUX_STORE__];
  } else {
    // just loaded client - reuse server state
    store = initializeStore(serverState);
    window[__NEXT_REDUX_STORE__] = store;
    api.configure(getToken(store.getState()));
  }

  return store;
};
