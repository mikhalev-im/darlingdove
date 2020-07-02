import React from 'react';
import { NextPage } from 'next';
import PropTypes from 'prop-types';

import PageActions from './actions';
import RootActions from '../root/actions';
import renderBlock, { PageBlock } from '../shared/components/page-blocks';
import { InitializedPageContex } from '../shared/interfaces/my-page-context';

interface PageProps {
  blocks: PageBlock[];
}

const Page: NextPage<PageProps> = ({ blocks }) => (
  <>{blocks.map(renderBlock)}</>
);

Page.getInitialProps = async ({
  reduxStore,
  query,
  res
}: InitializedPageContex) => {
  const { PAGE_LOADED } = PageActions.Types;
  const action = RootActions.Creators.waitFor(PAGE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(PageActions.Creators.loadPage(query, res));
  return promise;
};

Page.propTypes = {
  blocks: PropTypes.array.isRequired
};

export default Page;
