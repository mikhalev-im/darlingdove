import { AnyAction } from 'redux';

export const WAIT_FOR_TYPE = '__WAIT_FOR_ACTION_REDUX_MIDDLEWARE__';

interface Callbacks {
  [type: string]: {
    resolve: (payload: any) => void;
    reject: (err: any) => void;
  }[];
}

const waitForAction = () => (next: (action?: AnyAction) => void) => {
  const callbacks: Callbacks = {};

  return (action: AnyAction) => {
    // nothing to do if it's not possible to extract type
    if (!action || typeof action.type !== 'string') return next(action);

    // resolve promises if we are waiting for this action
    if (callbacks[action.type]) {
      // eslint-disable-next-line no-unused-vars
      const { type, error, ...payload } = action;
      // let other middlewares to process this action
      const result = next(action);
      callbacks[action.type].forEach(({ reject, resolve }) =>
        error ? reject(error) : resolve(payload)
      );
      delete callbacks[action.type];
      return result;
    }

    // skip action if it has nothing to do with this middleware
    if (action.type !== WAIT_FOR_TYPE || !action.actionType) {
      return next(action);
    }

    const promise = new Promise((resolve, reject) => {
      callbacks[action.actionType] = callbacks[action.actionType] || [];
      callbacks[action.actionType].push({ resolve, reject });
    });

    return promise;
  };
};

export default waitForAction;
