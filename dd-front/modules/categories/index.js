import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { stringify } from 'query-string';
import Typography from '@material-ui/core/Typography';
import Pagination from 'material-ui-flat-pagination';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import api from '../shared/utils/api';
import RootActions from '../root/actions';
import CartActions from '../cart/actions';
import Filters from './components/filters';
import Layout from '../shared/components/layout';
import ProductList from '../shared/components/product-list';
import ProductType from './types/product';

const TITLE_MAPPING = {
  postcards: 'Открытки',
  envelopes: 'Конверты'
};

/*
const sortVariants = [
  { label: 'Названию (А-Я)', value: 'name ASC' },
  { label: 'Названию (Я-А)', value: 'name DESC' },
  { label: 'Популярности (убывание)', value: 'ordersCount DESC' },
  { label: 'Популярности (возрастание)', value: 'ordersCount ASC' },
  { label: 'Новизне (сначала новые)', value: 'createdTime DESC' },
  { label: 'Новизне (сначала старые)', value: 'createdTime ASC' }
];
*/

const BASE_URL = '/category';
const PRODUCTS_PER_PAGE = 50;

const defaultFilters = {
  orderBy: 'createdTime',
  order: 'desc',
  limit: PRODUCTS_PER_PAGE,
  skip: 0,
  inStock: true
};

const buildProductFilters = query => {
  const filters = { ...defaultFilters };

  if (query.category) filters.category = query.category;

  if (query.tags) {
    // normalize tags
    query.tags = Array.isArray(query.tags) ? query.tags : [query.tags];

    filters.tagsOptional = query.tags;
  }

  if (query.skip) filters.skip = query.skip;

  if (query.sort) {
    const [orderBy, order] = query.sort.split(' ');
    filters.order = order.toLowerCase();
    filters.orderBy = orderBy;
  }

  return filters;
};

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

Category.getInitialProps = async ({ query }) => {
  const filters = buildProductFilters(query);

  const { count, data } = await api.getProducts(filters);
  const tags = await api.getTags(filters.category);

  return { products: data, tags, query, count };
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

const mapState = () => ({});
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
