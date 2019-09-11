export const WAIT_FOR_TYPE = '__WAIT_FOR_ACTION_REDUX_MIDDLEWARE__';

const waitForAction = () => next => {
  const callbacks = {};

  return action => {
    // nothing to do if it's not possible to extract type
    if (!action || typeof action.type !== 'string') return next(action);

    // resolve promises if we are waiting for this action
    if (callbacks[action.type]) {
      // eslint-disable-next-line no-unused-vars
      const { type, ...payload } = action;
      // let other middlewares to process this action
      const result = next(action);
      callbacks[action.type].forEach(cb => cb(payload));
      delete callbacks[action.type];
      return result;
    }

    // skip action if it has nothing to do with this middleware
    if (action.type !== WAIT_FOR_TYPE || !action.actionType) {
      return next(action);
    }

    const promise = new Promise(resolve => {
      callbacks[action.actionType] = callbacks[action.actionType] || [];
      callbacks[action.actionType].push(resolve);
    });

    return promise;
  };
};

export default waitForAction;
