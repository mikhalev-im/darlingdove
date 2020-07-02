import { createActions } from 'reduxsauce';
import { PageBlock } from '../shared/components/page-blocks';

interface PageTypes {
  readonly LOAD_PAGE: string;
  readonly PAGE_LOADED: string;
}

export interface LoadPageAction {
  readonly type: 'PAGE_LOADED';
  readonly query: any;
  readonly res: any;
}

export interface PageLoadedAction {
  readonly type: 'LOAD_PAGE';
  readonly error?: any;
  readonly blocks?: any;
}

interface PageActionCreators {
  loadPage(query: any, res: any): LoadPageAction;
  pageLoaded(error: any, blocks?: PageBlock[]): PageLoadedAction;
}

export default createActions<PageTypes, PageActionCreators>({
  loadPage: ['query', 'res'],
  pageLoaded: ['error', 'blocks']
});
