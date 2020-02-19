import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  sale: {
    padding: '3px',
    borderRadius: '3px',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.main
  }
}));

const Price = ({ price, oldPrice }) => {
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
        <strike>{`${oldPrice} руб`}</strike>
      </Typography>{' '}
      <Typography variant="body2" component="span" className={classes.sale}>
        {`${price} руб`}
      </Typography>
    </Grid>
  );
};

export default Price;
