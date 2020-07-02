import React, { FunctionComponent, ChangeEvent } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Close';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core';
import { CartItem } from '../../../shared/interfaces/cart-item';

const INPUT_PROPS = { style: { textAlign: 'center' }, min: 1 };

const IMAGE_WIDTH = 72;
const IMAGE_HEIGHT = 50;
const INPUT_WIDTH = 35;

const useStyles = makeStyles({
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

interface ItemRow {
  item: CartItem;
  onChange(productId: string, qty: number): void;
  onDelete(productId: string): void;
}

const ItemRow: FunctionComponent<ItemRow> = ({ item, onChange, onDelete }) => {
  const classes = useStyles();
  const { product, qty } = item;

  const image = product.images.find(img => img.type === 'card');

  return (
    <TableRow key={product._id}>
      <TableCell className={classes.imageCell}>
        <Link href={`/product/[sku]`} as={`/product/${product.sku}`}>
          <a className={classes.link}>
            <CardMedia image={image.url} className={classes.image} />
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
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange(item.product._id, Number(event.target.value))
          }
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

export default ItemRow;
