import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import Product from './product';

const styles = {
  root: {
    flexGrow: 1
  }
};

const ProductList = ({ classes, products = [], addToCart }) => {
  return (
    <Grid container spacing={16} className={classes.root} justify="center">
      {products.map(product => (
        <Grid item key={product._id}>
          <Product {...product} addToCart={addToCart} />
        </Grid>
      ))}
    </Grid>
  );
};

ProductList.propTypes = {
  classes: PropTypes.any,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  addToCart: PropTypes.func.isRequired
};

export default withStyles(styles)(ProductList);
