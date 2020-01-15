import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { stringify } from 'query-string';
import Pagination from 'material-ui-flat-pagination';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';

import RootActions from '../root/actions';
import CartActions from '../cart/actions';
import SearchActions from './actions';
import { getSearchProductsCount, getSearchProductsData } from './selectors';
import ProductList from '../shared/components/product-list';
import { Typography } from '@material-ui/core';

const PRODUCTS_PER_PAGE = 50;

const useStyles = makeStyles(theme => ({
  search: {
    borderRadius: '30px',
    padding: '10px 20px',
    margin: '0 auto',
    maxWidth: '800px',
    boxShadow: theme.shadows[5],
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    flexGrow: 1
  },
  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '1rem'
  },
  icon: {
    position: 'absolute',
    top: '8px',
    right: '20px',
    '&:hover': {
      cursor: 'pointer'
    }
  }
}));

const Search = ({ query, products, count, addToCart, redirect }) => {
  const classes = useStyles();
  const inputRef = useRef();

  const onSearch = () => {
    if (!inputRef.current) return;

    const querystring = stringify({
      search: inputRef.current.value,
      skip: 0
    });

    redirect(`/search?${querystring}`);
  };

  const onPageChange = (e, offset) => {
    const querystring = stringify({
      search: query.search,
      skip: offset
    });

    redirect(`/search?${querystring}`);
  };

  const onKeyPress = e => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <div className={classes.search}>
          <input
            className={classes.input}
            placeholder="Введите фразу"
            onKeyPress={onKeyPress}
            ref={inputRef}
            defaultValue={query.search}
          />
          <SearchIcon className={classes.icon} onClick={onSearch} />
        </div>
      </Grid>
      <Grid item xs={12}>
        {!!count ? (
          <>
            <ProductList products={products} addToCart={addToCart} />
            <Pagination
              limit={PRODUCTS_PER_PAGE}
              offset={query.skip}
              total={count}
              onClick={onPageChange}
            />
          </>
        ) : (
          query.search && <Typography>Товары не найдены</Typography>
        )}
      </Grid>
    </Grid>
  );
};

Search.getInitialProps = async ({ query, reduxStore }) => {
  const { SEARCH_PAGE_LOADED } = SearchActions.Types;
  const action = RootActions.Creators.waitFor(SEARCH_PAGE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(SearchActions.Creators.loadSearchPage(query));
  return promise;
};

const mapState = state => ({
  count: getSearchProductsCount(state),
  products: getSearchProductsData(state)
});

const mapDispatch = {
  redirect: RootActions.Creators.redirect,
  addToCart: CartActions.Creators.addToCart
};

export default connect(mapState, mapDispatch)(Search);
