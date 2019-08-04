import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  link: {
    textDecoration: 'none'
  }
};
const Empty = ({ classes }) => {
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

Empty.propTypes = {
  classes: PropTypes.any
};

export default withStyles(styles)(Empty);
