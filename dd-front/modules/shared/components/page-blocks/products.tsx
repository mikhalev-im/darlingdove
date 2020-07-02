import React, { FunctionComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

import CartActions from '../../../cart/actions';
import ProductList from '../product-list';
import { Product } from '../../interfaces/product';

export interface ProductsBlock {
  title: string;
  data: Product[];
  addToCart(id: string, qty: number): AnyAction;
}

const ProductsBlock: FunctionComponent<ProductsBlock> = ({
  title,
  data,
  addToCart
}) => {
  return (
    <>
      {title && (
        <Typography variant="h6" id="tableTitle">
          {title}
        </Typography>
      )}
      <ProductList products={data} addToCart={addToCart} />
    </>
  );
};

const mapState = () => ({});

const mapDispatch = {
  addToCart: CartActions.Creators.addToCart
};

export default connect(mapState, mapDispatch)(ProductsBlock);
