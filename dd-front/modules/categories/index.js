import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { connect } from 'react-redux';
import { stringify } from 'query-string';
import Typography from '@material-ui/core/Typography';
import Pagination from 'material-ui-flat-pagination';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import RootActions from '../root/actions';
import CartActions from '../cart/actions';
import CategoryActions from './actions';

import {
  BASE_URL,
  CATEGORY_META_MAPPING,
  PRODUCTS_PER_PAGE,
  DEFAULT_FILTERS
} from './constants';

import Filters from './components/filters';
import ProductList from '../shared/components/product-list';
import ProductType from './types/product';
import {
  getCategoryProductsData,
  getCategoryProductsCount,
  getCategoryTags
} from './selectors';
import Sorting from './components/sorting';

const SORT_OPTIONS = [
  { name: 'По новизне (>)', value: 'createdTime desc' },
  { name: 'По новизне (<)', value: 'createdTime asc' },
  { name: 'По названию А-Я', value: 'name asc' },
  { name: 'По названию Я-А', value: 'name desc' },
  { name: 'Популярные (>)', value: 'ordersCount desc' },
  { name: 'Популярные (<)', value: 'ordersCount asc' }
];

const styles = theme => ({
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
      marginBottom: theme.padding
    }
  },
  sort: {
    marginBottom: theme.spacing(1)
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.padding
  }
});

class Category extends Component {
  onFilterChange = (event, merge) => {
    const {
      redirect,
      query: { category, ...newQuery }
    } = this.props;

    newQuery[event.target.name] = event.target.value;

    const querystring = stringify({ ...newQuery, ...merge });

    redirect({
      url: `${BASE_URL}/[category]?${querystring}`,
      as: `${BASE_URL}/${category}?${querystring}`
    });
  };

  onPageChange = (event, offset) => {
    this.onFilterChange({ target: { name: 'skip', value: offset } });
  };

  onTagChange = value => {
    this.onFilterChange({ target: { name: 'tags', value } }, { skip: 0 });
  };

  onSortChange = value => {
    const {
      redirect,
      query: { category, ...newQuery }
    } = this.props;

    const [orderBy, order] = value.split(' ');

    newQuery.orderBy = orderBy;
    newQuery.order = order;
    newQuery.skip = 0;

    redirect(`${BASE_URL}/${category}?${stringify(newQuery)}`);
  };

  render() {
    const { products, tags, query, count, classes, addToCart } = this.props;

    const tagsValue = query.tags || [];
    const orderBy = query.orderBy || DEFAULT_FILTERS.orderBy;
    const order = query.order || DEFAULT_FILTERS.order;
    const selectedSort = `${orderBy} ${order}`;
    const { header, meta } = CATEGORY_META_MAPPING[
      query.category.toLowerCase()
    ];

    return (
      <>
        <Head>
          <title key="title">{meta.title}</title>
          <meta
            key="description"
            name="description"
            content={meta.description}
          />
        </Head>
        <Grid container className={classes.container}>
          <Grid item className={classes.filters}>
            <Sorting
              className={classes.sort}
              options={SORT_OPTIONS}
              selected={selectedSort}
              onChange={this.onSortChange}
            />
            <Filters
              tags={tags}
              tagsValue={tagsValue}
              onChange={this.onTagChange}
            />
          </Grid>
          <Grid item className={classes.content}>
            <Typography
              align="left"
              variant="h2"
              gutterBottom
              className={classes.title}
            >
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
              onClick={this.onPageChange}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

Category.getInitialProps = async ({ query, reduxStore, res }) => {
  const { CATEGORY_PAGE_LOADED } = CategoryActions.Types;
  const action = RootActions.Creators.waitFor(CATEGORY_PAGE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(CategoryActions.Creators.loadCategoryPage(query, res));
  return promise;
};

Category.propTypes = {
  products: PropTypes.arrayOf(ProductType).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  query: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  classes: PropTypes.any.isRequired,
  redirect: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired
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

export default withStyles(styles)(connect(mapState, mapDispatch)(Category));
