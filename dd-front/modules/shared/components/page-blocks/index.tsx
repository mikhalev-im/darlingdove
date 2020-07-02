import React from 'react';
import Wrapper from './wrapper';
import ProductsBlock, {
  ProductsBlock as ProductsBlockInterface
} from './products';
import TextBlock, { TextBlock as TextBlockInterface } from './text';
import BannerBlock, { BannerBlock as BannerBlockInterface } from './banner';

export enum BlockType {
  PRODUCTS = 'products',
  BANNER = 'banner',
  TEXT = 'text',
  HTML = 'html'
}

export type PageBlock =
  | ({
      type: BlockType.BANNER;
    } & BannerBlockInterface)
  | ({ type: BlockType.TEXT } & TextBlockInterface)
  | ({ type: BlockType.PRODUCTS } & ProductsBlockInterface)
  | { type: BlockType.HTML; content: string };

export default (block: PageBlock, index: number) => {
  switch (block.type) {
    case BlockType.BANNER:
      return (
        <Wrapper key={index}>
          <BannerBlock {...block} />
        </Wrapper>
      );
    case BlockType.PRODUCTS:
      return (
        <Wrapper key={index}>
          <ProductsBlock {...block} />
        </Wrapper>
      );
    case BlockType.TEXT:
      return (
        <Wrapper key={index}>
          <TextBlock {...block} />
        </Wrapper>
      );
    case BlockType.HTML:
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
