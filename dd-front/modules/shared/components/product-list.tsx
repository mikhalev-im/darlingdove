import React, { FunctionComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { AnyAction } from 'redux';

import Product from './product';
import { Product as ProductInterface } from '../interfaces/product';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

interface ProductListProps {
  products: ProductInterface[];
  addToCart(id: string, qty: number): AnyAction;
}

const ProductList: FunctionComponent<ProductListProps> = ({
  products = [],
  addToCart
}) => {
  const classes = useStyles();

  return (
    <Grid
      container
      spacing={2}
      className={classes.root}
      justify="center"
      wrap="wrap"
    >
      {products.map(product => (
        <Grid item key={product._id}>
          <Product {...product} addToCart={addToCart} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
