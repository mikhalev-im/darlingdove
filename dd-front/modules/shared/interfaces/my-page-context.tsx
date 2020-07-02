import { Store } from 'redux';
import { NextPageContext } from 'next';

export interface PageContext extends NextPageContext {
  reduxStore?: Store;
}

export interface InitializedPageContex extends NextPageContext {
  reduxStore: Store;
}
