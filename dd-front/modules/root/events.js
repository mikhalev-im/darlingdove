import Router from 'next/router';
import Actions from './actions';

const bindEvents = store => {
  Router.events.on('routeChangeStart', () => {
    store.dispatch(Actions.Creators.setIsLoading(true));
  });
  Router.events.on('routeChangeComplete', () => {
    store.dispatch(Actions.Creators.setIsLoading(false));
  });
  Router.events.on('routeChangeError', () => {
    store.dispatch(Actions.Creators.setIsLoading(false));
  });
};

export default bindEvents;
