import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import { stringify } from 'query-string';
import Typography from '@material-ui/core/Typography';
import Pagination from 'material-ui-flat-pagination';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import RootActions from '../root/actions';
import CartActions from '../cart/actions';
import CategoryActions from './actions';

import {
  BASE_URL,
  CATEGORY_META_MAPPING,
  PRODUCTS_PER_PAGE,
  DEFAULT_FILTERS,
  SORT_OPTIONS
} from './constants';
import Filters from './components/filters';
import ProductList from '../shared/components/product-list';
import {
  getCategoryProductsData,
  getCategoryProductsCount,
  getCategoryTags
} from './selectors';
import Sorting from './components/sorting';
import { Product } from '../shared/interfaces/product';
import { NextPage } from 'next';
import { InitializedPageContex } from '../shared/interfaces/my-page-context';
import { AnyAction } from 'redux';

const useStyles = makeStyles(theme => ({
  container: {
    flexWrap: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap'
    }
  },
  filters: {
    minWidth: 250,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: theme.spacing(2)
    }
  },
  sort: {
    marginBottom: theme.spacing(1)
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(2)
  }
}));

interface Category {
  products: Product[];
  tags: string[];
  query: any;
  count: number;
  addToCart(id: string, qty: number): AnyAction;
  redirect(location: string | { url: string; as: string }): void;
}

const Category: NextPage<Category> = props => {
  const classes = useStyles();
  const { products, tags, query, count, addToCart, redirect } = props;

  const tagsValue = query.tags || [];
  const orderBy = query.orderBy || DEFAULT_FILTERS.orderBy;
  const order = query.order || DEFAULT_FILTERS.order;
  const selectedSort = `${orderBy} ${order}`;
  const { header, meta } = CATEGORY_META_MAPPING[
    query.category.toLowerCase()
  ] as { header: string; meta: { title: string; description: string } };

  const onFilterChange = (event, merge?) => {
    const { category, ...newQuery } = query;

    newQuery[event.target.name] = event.target.value;
    const querystring = stringify({ ...newQuery, ...merge });

    redirect({
      url: `${BASE_URL}/[category]?${querystring}`,
      as: `${BASE_URL}/${category}?${querystring}`
    });
  };

  const onPageChange = (event, offset: number) => {
    onFilterChange({ target: { name: 'skip', value: offset } });
  };

  const onTagChange = (value: string[]) => {
    onFilterChange({ target: { name: 'tags', value } }, { skip: 0 });
  };

  const onSortChange = (value: string) => {
    const { category, ...newQuery } = query;

    const [orderBy, order] = value.split(' ');

    newQuery.orderBy = orderBy;
    newQuery.order = order;
    newQuery.skip = 0;

    redirect(`${BASE_URL}/${category}?${stringify(newQuery)}`);
  };

  return (
    <>
      <Head>
        <title key="title">{meta.title}</title>
        <meta key="description" name="description" content={meta.description} />
      </Head>
      <Grid container className={classes.container}>
        <Grid item className={classes.filters}>
          <Sorting
            className={classes.sort}
            options={SORT_OPTIONS}
            selected={selectedSort}
            onChange={onSortChange}
          />
          <Filters tags={tags} tagsValue={tagsValue} onChange={onTagChange} />
        </Grid>
        <Grid item className={classes.content}>
          <Typography align="left" variant="h2" gutterBottom>
            {header}
          </Typography>
          {!products.length && (
            <Typography variant="h6" gutterBottom>
              Нет товаров по данным фильтрам
            </Typography>
          )}
          <ProductList products={products} addToCart={addToCart} />
          <Pagination
            limit={PRODUCTS_PER_PAGE}
            offset={query.skip}
            total={count}
            onClick={onPageChange}
          />
        </Grid>
      </Grid>
    </>
  );
};

Category.getInitialProps = async ({
  query,
  reduxStore,
  res
}: InitializedPageContex) => {
  const { CATEGORY_PAGE_LOADED } = CategoryActions.Types;
  const action = RootActions.Creators.waitFor(CATEGORY_PAGE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(CategoryActions.Creators.loadCategoryPage(query, res));
  return promise;
};

const mapState = state => ({
  products: getCategoryProductsData(state),
  count: getCategoryProductsCount(state),
  tags: getCategoryTags(state)
});

const mapDispatch = {
  redirect: RootActions.Creators.redirect,
  addToCart: CartActions.Creators.addToCart
};

export default connect(mapState, mapDispatch)(Category);
