import React from 'react';
import Banner from './banner';
import Products from './products';
import Wrapper from './wrapper';
import Text from './text';

export const TYPES = {
  PRODUCTS: 'products',
  BANNER: 'banner',
  TEXT: 'text',
  HTML: 'html'
};

export default (block, index) => {
  switch (block.type) {
    case TYPES.BANNER:
      return (
        <Wrapper key={index}>
          <Banner {...block} />
        </Wrapper>
      );
    case TYPES.PRODUCTS:
      return (
        <Wrapper key={index}>
          <Products {...block} />
        </Wrapper>
      );
    case TYPES.TEXT:
      return (
        <Wrapper key={index}>
          <Text {...block} />
        </Wrapper>
      );
    case TYPES.HTML:
      return (
        <Wrapper key={index}>
          <div dangerouslySetInnerHTML={{ __html: block.content }} />
        </Wrapper>
      );
    default:
      // eslint-disable-next-line no-console
      console.warn('block type not found');
      return;
  }
};
