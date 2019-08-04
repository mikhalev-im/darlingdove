import React from 'react';
import Banner from './banner';
import Products from './products';
import Wrapper from './wrapper';

export const TYPES = {
  PRODUCT: 'products',
  BANNER: 'banner'
};

export default (block, index) => {
  switch (block.type) {
    case TYPES.BANNER:
      return (
        <Wrapper key={index}>
          <Banner {...block} />
        </Wrapper>
      );
    case TYPES.PRODUCT:
      return (
        <Wrapper key={index}>
          <Products {...block} />
        </Wrapper>
      );
    default:
      // eslint-disable-next-line no-console
      console.warn('block type not found');
      return;
  }
};
