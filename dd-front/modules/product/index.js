import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import Lightbox from 'react-images';
import { connect } from 'react-redux';

import Layout from '../shared/components/layout';
import ProductList from '../shared/components/product-list';
import ProductActions from './actions';
import RootActions from '../root/actions';
import CartActions from '../cart/actions';
import ProductType from './types/product';
import { getProduct, getRelatedProducts } from './selectors';

const CATEGORY_BASE_URL = '/category';

const styles = theme => ({
  infoWrapper: {
    textAlign: 'left'
  },
  chip: {
    margin: theme.spacing.unit / 2
  },
  qtyWrapper: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  buyBtn: {
    marginBottom: theme.spacing.unit,
    marginLeft: theme.spacing.unit
  },
  img: {
    width: '100%',
    cursor: 'pointer'
  }
});

class Product extends Component {
  static async getInitialProps({ reduxStore, query: { id } }) {
    // run saga to load product page
    reduxStore.dispatch(ProductActions.Creators.loadProductPage(id));
    // wait until everything is loaded
    await reduxStore.dispatch(
      RootActions.Creators.waitFor(ProductActions.Types.PRODUCT_PAGE_LOADED)
    );

    return {};
  }

  state = {
    qty: 1,
    lightboxIsOpen: false
  };

  onTagClick = tag => {
    const { product, redirect } = this.props;
    redirect(`${CATEGORY_BASE_URL}/${product.category}?tags=${tag}`);
  };

  onQtyChange = event => this.setState({ qty: event.target.value });

  onAddToCartClick = () => {
    const { product, addToCart } = this.props;
    addToCart(product._id, this.state.qty);
  };

  openLightBox = () => {
    this.setState({ lightboxIsOpen: true });
  };

  closeLightBox = () => {
    this.setState({ lightboxIsOpen: false });
  };

  render() {
    const { lightboxIsOpen } = this.state;
    const { classes, product, relatedProducts } = this.props;

    // console.log('RENDER');
    // console.log(product);

    return (
      <Layout>
        <Grid container spacing={24}>
          <Grid item sm={6}>
            <Grid container justify="flex-end">
              <Grid item>
                <img
                  onClick={this.openLightBox}
                  className={classes.img}
                  src={product.images[0]}
                />
                <Lightbox
                  isOpen={lightboxIsOpen}
                  onClose={this.closeLightBox}
                  images={product.images.map(src => ({ src }))}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={6} className={classes.infoWrapper}>
            <Typography variant="h6" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="body2">Артикул: card-01</Typography>
            <Typography variant="body2">{`Наличие: ${product.qty}`}</Typography>
            <Typography variant="h6">{`${product.price} руб`}</Typography>
            <div className={classes.qtyWrapper}>
              <TextField
                id="number"
                label="Количество"
                value={this.state.qty}
                onChange={this.onQtyChange}
                type="number"
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  min: 1
                }}
                margin="normal"
              />

              <Button
                variant="contained"
                color="primary"
                onClick={this.onAddToCartClick}
                className={classes.buyBtn}
              >
                В корзину
              </Button>
            </div>
            <Typography variant="body2">Теги:</Typography>
            {product.tags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                className={classes.chip}
                onClick={() => this.onTagClick(tag)}
              />
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Вам также может понравиться
            </Typography>
            <ProductList
              products={relatedProducts}
              addToCart={this.props.addToCart}
            />
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

Product.propTypes = {
  classes: PropTypes.any,
  product: ProductType.isRequired,
  redirect: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  relatedProducts: PropTypes.arrayOf(ProductType)
};

const mapState = state => ({
  product: getProduct(state),
  relatedProducts: getRelatedProducts(state)
});
const mapDispatch = {
  redirect: RootActions.Creators.redirect,
  addToCart: CartActions.Creators.addToCart
};

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(Product)
);
