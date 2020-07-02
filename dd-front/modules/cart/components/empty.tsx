import React from 'react';
import Link from 'next/link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none'
  }
});

const Empty = () => {
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h5">Корзина пуста</Typography>
      <Link href="/">
        <a className={classes.link}>
          <Typography variant="subtitle1">В магазин</Typography>
        </a>
      </Link>
    </div>
  );
};

export default Empty;
