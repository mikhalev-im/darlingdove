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
  title: {
    paddingLeft: theme.spacing.padding
  },
  filters: {
    flexGrow: 1
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
        <Grid container>
          <Grid item sm={2} className={classes.filters}>
            <Filters
              tags={tags}
              tagsValue={tagsValue}
              onChange={this.onTagChange}
            />
          </Grid>
          <Grid item sm={10}>
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
  // run saga to load tags and products
  reduxStore.dispatch(CategoryActions.Creators.loadPage(query));

  // wait until everything is loaded
  await reduxStore.dispatch(
    RootActions.Creators.waitFor(CategoryActions.Types.PAGE_LOADED)
  );

  return { query };
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
