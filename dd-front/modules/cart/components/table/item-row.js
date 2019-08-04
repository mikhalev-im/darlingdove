import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Close';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import Link from 'next/link';
import { withStyles } from '@material-ui/core';

import ItemType from '../../types/item';

const INPUT_PROPS = { style: { textAlign: 'center' }, min: 1 };

const IMAGE_WIDTH = 72;
const IMAGE_HEIGHT = 50;
const INPUT_WIDTH = 35;

const styles = () => ({
  link: {
    textDecoration: 'none'
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT
  },
  imageCell: {
    width: IMAGE_WIDTH,
    paddingRight: 0
  },
  icon: {
    cursor: 'pointer'
  },
  input: {
    width: INPUT_WIDTH
  }
});
const ItemRow = ({ item, classes, onChange, onDelete }) => {
  const { product, qty } = item;

  const [image] = product.images;

  return (
    <TableRow key={product._id}>
      <TableCell className={classes.imageCell}>
        <Link href={`/product/${product._id}`}>
          <a className={classes.link}>
            <CardMedia image={image} className={classes.image} />
          </a>
        </Link>
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell align={'right'}>
        <TextField
          type="number"
          margin="none"
          value={item.qty}
          error={item.qty > product.qty}
          className={classes.input}
          inputProps={INPUT_PROPS}
          onChange={event => onChange(item.product._id, event.target.value)}
        />
      </TableCell>
      <TableCell align="right">{product.price}</TableCell>
      <TableCell align="right">{product.price * qty}</TableCell>
      <TableCell>
        <DeleteIcon
          className={classes.icon}
          onClick={() => onDelete(item.product._id)}
        />
      </TableCell>
    </TableRow>
  );
};

ItemRow.propTypes = {
  item: ItemType,
  classes: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default withStyles(styles)(ItemRow);
