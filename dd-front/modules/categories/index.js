import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { stringify } from 'query-string';
import Typography from '@material-ui/core/Typography';
import Pagination from 'material-ui-flat-pagination';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import RootActions from '../root/actions';
import CartActions from '../cart/actions';
import CategoryActions from './actions';

import { BASE_URL, TITLE_MAPPING, PRODUCTS_PER_PAGE } from './constants';

import Filters from './components/filters';
import Layout from '../shared/components/layout';
import ProductList from '../shared/components/product-list';
import ProductType from './types/product';
import { getProductsData, getProductsCount, getTags } from './selectors';

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
  content: {
    flexGrow: 1,
    paddingLeft: theme.padding
  }
});

class Category extends Component {
  onFilterChange = event => {
    const {
      redirect,
      query: { category, ...newQuery }
    } = this.props;

    newQuery[event.target.name] = event.target.value;

    redirect(`${BASE_URL}/${category}?${stringify(newQuery)}`);
  };

  onPageChange = (event, offset) => {
    this.onFilterChange({ target: { name: 'skip', value: offset } });
  };

  onTagChange = value => {
    this.onFilterChange({ target: { name: 'tags', value } });
  };

  render() {
    const { products, tags, query, count, classes, addToCart } = this.props;

    const tagsValue = query.tags || [];
    const title = TITLE_MAPPING[query.category.toLowerCase()];

    return (
      <Layout>
        <Grid container className={classes.container}>
          <Grid item className={classes.filters}>
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
              {title}
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
      </Layout>
    );
  }
}

Category.getInitialProps = async ({ query, reduxStore }) => {
  const { CATEGORY_PAGE_LOADED } = CategoryActions.Types;
  const action = RootActions.Creators.waitFor(CATEGORY_PAGE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(CategoryActions.Creators.loadCategoryPage(query));
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
  products: getProductsData(state),
  count: getProductsCount(state),
  tags: getTags(state)
});

const mapDispatch = {
  redirect: RootActions.Creators.redirect,
  addToCart: CartActions.Creators.addToCart
};

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(Category)
);
