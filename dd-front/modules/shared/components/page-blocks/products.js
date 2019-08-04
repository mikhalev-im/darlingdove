import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';

import CartActions from '../../../cart/actions';
import ProductList from '../product-list';

const ProductsBlock = ({ title, data, addToCart }) => {
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

ProductsBlock.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  addToCart: PropTypes.func.isRequired
};

const mapState = () => ({});

const mapDispatch = {
  addToCart: CartActions.Creators.addToCart
};

export default connect(
  mapState,
  mapDispatch
)(ProductsBlock);
