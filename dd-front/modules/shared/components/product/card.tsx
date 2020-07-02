import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  link: {
    display: 'block',
    position: 'relative'
  },
  image: {
    width: '100%',
    display: 'block'
  }
});

interface ProductCard {
  href: string;
  hrefAs: string;
  img: string;
}

const ProductCard: FunctionComponent<ProductCard> = ({ href, hrefAs, img }) => {
  const classes = useStyles();

  return (
    <Link href={href} as={hrefAs}>
      <a className={classes.link}>
        <img className={classes.image} src={img} />
      </a>
    </Link>
  );
};

export default ProductCard;
