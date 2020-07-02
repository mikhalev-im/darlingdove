import React, { useState, ChangeEvent } from 'react';
import Head from 'next/head';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Lightbox from 'react-images';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { NextPage } from 'next';

import ProductList from '../shared/components/product-list';
import ProductActions from './actions';
import RootActions from '../root/actions';
import CartActions from '../cart/actions';
import { getProduct, getRelatedProducts } from './selectors';
import { InitializedPageContex } from '../shared/interfaces/my-page-context';
import { Product } from '../shared/interfaces/product';
import ProductDetails from './components/details';

const CATEGORY_BASE_URL = '/category';

const useStyles = makeStyles(theme => ({
  infoWrapper: {
    textAlign: 'left'
  },
  img: {
    width: '100%',
    cursor: 'pointer'
  }
}));

interface ProductInterface {
  product: Product;
  relatedProducts: Product[];
  redirect(destination: string): void;
  addToCart(productId: string, qty: number): AnyAction;
}

const Product: NextPage<ProductInterface> = props => {
  const classes = useStyles();
  const [lightBoxOpen, setLightBoxOpen] = useState(false);

  const { product, relatedProducts, addToCart } = props;

  const onTagClick = (tag: string) => {
    const { product, redirect } = props;
    redirect(`${CATEGORY_BASE_URL}/${product.category}?tags=${tag}`);
  };

  const images = product.images
    .filter(({ type }) => type === 'big')
    .map(img => ({ src: img.url }));

  return (
    <>
      <Head>
        <title key="title">{`${product.name} - DarlgingDove`}</title>
        <meta
          key="description"
          name="description"
          content={product.description}
        />
      </Head>
      <Grid
        container
        spacing={3}
        itemScope
        itemType="http://schema.org/Product"
      >
        <Grid item sm={6}>
          <Grid container justify="flex-end">
            <Grid item>
              <img
                itemProp="image"
                onClick={() => setLightBoxOpen(true)}
                className={classes.img}
                src={images[0].src}
              />
              <Lightbox
                isOpen={lightBoxOpen}
                onClose={() => setLightBoxOpen(false)}
                images={images}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={6} className={classes.infoWrapper}>
          <ProductDetails
            product={product}
            onAddToCart={addToCart}
            onTagClick={onTagClick}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Вам также может понравиться
          </Typography>
          <ProductList products={relatedProducts} addToCart={props.addToCart} />
        </Grid>
      </Grid>
    </>
  );
};

Product.getInitialProps = async ({
  reduxStore,
  res,
  query: { sku }
}: InitializedPageContex) => {
  const { PRODUCT_PAGE_LOADED } = ProductActions.Types;
  const action = RootActions.Creators.waitFor(PRODUCT_PAGE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(ProductActions.Creators.loadProductPage(sku, res));
  return promise;
};

const mapState = state => ({
  product: getProduct(state),
  relatedProducts: getRelatedProducts(state)
});

const mapDispatch = {
  redirect: RootActions.Creators.redirect,
  addToCart: CartActions.Creators.addToCart
};

export default connect(mapState, mapDispatch)(Product);
