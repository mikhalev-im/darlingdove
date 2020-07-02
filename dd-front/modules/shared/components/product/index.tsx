import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import { AnyAction } from 'redux';

import Price from './price';
import ProductCard from './card';
import { Product, ProductImageType } from '../../interfaces/product';

const useStyles = makeStyles({
  card: {
    maxWidth: 260
  },
  media: {
    height: 0,
    paddingTop: '56.25%'
  },
  text: {
    flexGrow: 1,
    textAlign: 'left'
  }
});

interface ProductProps extends Product {
  addToCart(id: string, qty: number): AnyAction;
}

const DEFAULT_QTY = 1;

const Product: FunctionComponent<ProductProps> = props => {
  const classes = useStyles();

  const { _id, price, oldPrice, name, images, sku, addToCart } = props;
  const image = images.find(img => img.type === ProductImageType.CARD) || {
    url: ''
  };

  return (
    <Card className={classes.card}>
      <ProductCard
        img={image.url}
        href={`/product/[sku]`}
        hrefAs={`/product/${sku}`}
      />
      <CardActions disableSpacing>
        <Grid item className={classes.text}>
          <Typography>{name}</Typography>
          <Price price={price} oldPrice={oldPrice} />
        </Grid>
        <Grid item>
          <Fab
            color="primary"
            size="small"
            aria-label="add"
            onClick={() => addToCart(_id, DEFAULT_QTY)}
          >
            <AddIcon />
          </Fab>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default Product;
