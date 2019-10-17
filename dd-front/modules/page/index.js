import React from 'react';
import PropTypes from 'prop-types';

import PageActions from './actions';
import RootActions from '../root/actions';
import renderBlock from '../shared/components/page-blocks';

const Page = ({ blocks }) => <>{blocks.map(renderBlock)}</>;

Page.getInitialProps = async ({ reduxStore, query }) => {
  const { PAGE_LOADED } = PageActions.Types;
  const action = RootActions.Creators.waitFor(PAGE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(PageActions.Creators.loadPage(query));
  return promise;
};

Page.propTypes = {
  blocks: PropTypes.array.isRequired
};

export default Page;
