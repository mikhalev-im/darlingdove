import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';

import Price from './price';
import ProductCard from './card';

const styles = {
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
  },
  sale: {
    padding: '3px',
    borderRadius: '3px',
    color: '#fff',
    backgroundColor: '#1bc586'
  }
};

const DEFAULT_QTY = 1;

class Product extends React.PureComponent {
  addToCart = () => {
    const { _id, addToCart } = this.props;
    addToCart(_id, DEFAULT_QTY);
  };

  render() {
    const { classes, price, oldPrice, name, images, sku } = this.props;
    const image = images.find(img => img.type === 'card');

    return (
      <Card className={classes.card}>
        <ProductCard
          img={image.url}
          href={`/product/[sku]`}
          hrefAs={`/product/${sku}`}
        />
        <CardActions disableSpacing className={classes.actionsBar}>
          <Grid item className={classes.text}>
            <Typography>{name}</Typography>
            <Price price={price} oldPrice={oldPrice} />
          </Grid>
          <Grid item>
            <Fab
              color="primary"
              size="small"
              aria-label="add"
              onClick={this.addToCart}
            >
              <AddIcon />
            </Fab>
          </Grid>
        </CardActions>
      </Card>
    );
  }
}

Product.propTypes = {
  classes: PropTypes.any,
  sku: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  addToCart: PropTypes.func.isRequired
};

export default withStyles(styles)(Product);
