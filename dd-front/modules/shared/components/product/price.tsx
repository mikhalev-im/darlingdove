import React, { FunctionComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  sale: {
    padding: '3px',
    borderRadius: '3px',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.main
  }
}));

interface ProductPrice {
  price: number;
  oldPrice?: number;
}

const ProductPrice: FunctionComponent<ProductPrice> = ({ price, oldPrice }) => {
  const classes = useStyles();

  if (!oldPrice)
    return (
      <Typography variant="body2" component="span">
        {`${price} руб`}
      </Typography>
    );

  return (
    <Grid>
      <Typography variant="body2" component="span">
        <s>{`${oldPrice} руб`}</s>
      </Typography>{' '}
      <Typography variant="body2" component="span" className={classes.sale}>
        {`${price} руб`}
      </Typography>
    </Grid>
  );
};

export default ProductPrice;
