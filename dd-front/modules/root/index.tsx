import isServer from '../shared/utils/isServer';
import * as api from '../shared/utils/api';
import Actions from './actions';
import { initializeStore } from './store';
import { __NEXT_REDUX_STORE__ } from './constants';
import { getToken } from '../user/selectors';
import { Store } from 'redux';
import { PageContext } from '../shared/interfaces/my-page-context';

interface ServerState {}

interface MyWindow extends Window {
  __NEXT_REDUX_STORE__?: object | Store;
}

declare var window: MyWindow;

export const initialize = (
  serverState: ServerState,
  ctx?: PageContext
): Promise<Store> | Store => {
  let store: Store;
  if (isServer) {
    // server - always fresh store
    store = initializeStore(serverState);
    api.configure(getToken(store.getState()));
    // it is app.getInitialProps - parse cookie, etc.
    if (ctx) {
      const { INITIALIZED } = Actions.Types;
      const action = Actions.Creators.waitFor(INITIALIZED);
      const promise = store.dispatch(action);
      store.dispatch(Actions.Creators.initialize(ctx));
      return promise.then(() => store);
    }
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
