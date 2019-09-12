import React from 'react';
import PropTypes from 'prop-types';

import HomeActions from './actions';
import RootActions from '../root/actions';
import Layout from '../shared/components/layout';
import renderBlock from '../shared/components/page-blocks';

const Home = ({ blocks }) => <Layout>{blocks.map(renderBlock)}</Layout>;

Home.getInitialProps = async ({ reduxStore }) => {
  const { HOME_PAGE_LOADED } = HomeActions.Types;
  const action = RootActions.Creators.waitFor(HOME_PAGE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(HomeActions.Creators.loadHomePage());
  return promise;
};

Home.propTypes = {
  blocks: PropTypes.array.isRequired
};

export default Home;
