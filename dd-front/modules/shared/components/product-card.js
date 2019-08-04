import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Link from 'next/link';

const styles = {
  link: {
    display: 'block',
    position: 'relative'
  },
  image: {
    width: '100%',
    display: 'block'
  }
};

const ProductCard = ({ href, hrefAs, img, classes }) => {
  return (
    <Link href={href} as={hrefAs}>
      <a className={classes.link}>
        <img className={classes.image} src={img} />
      </a>
    </Link>
  );
};

ProductCard.propTypes = {
  classes: PropTypes.any,
  href: PropTypes.string.isRequired,
  hrefAs: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired
};

export default withStyles(styles)(ProductCard);
