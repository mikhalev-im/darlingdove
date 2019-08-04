import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import ProductCard from './product-card';

const styles = {
  card: {
    maxWidth: 260
  },
  media: {
    height: 0,
    paddingTop: '56.25%'
  },
  actionsBar: {
    justifyContent: 'space-between'
  }
};

const DEFAULT_QTY = 1;

class Product extends React.PureComponent {
  addToCart = () => {
    const { _id, addToCart } = this.props;
    addToCart(_id, DEFAULT_QTY);
  };

  render() {
    const { classes, price, name, _id, images } = this.props;
    const priceStr = `${price} руб`;
    const coverImg = images[0];

    return (
      <Card className={classes.card}>
        <ProductCard
          img={coverImg}
          title={priceStr}
          href={`/product?id=${_id}`}
          hrefAs={`/product/${_id}`}
        />
        <CardActions disableActionSpacing className={classes.actionsBar}>
          <Typography>{priceStr}</Typography>
          <Typography>{name}</Typography>
          <Fab
            color="primary"
            size="small"
            aria-label="add"
            onClick={this.addToCart}
          >
            <AddIcon />
          </Fab>
        </CardActions>
      </Card>
    );
  }
}

Product.propTypes = {
  classes: PropTypes.any,
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  addToCart: PropTypes.func.isRequired
};

export default withStyles(styles)(Product);
