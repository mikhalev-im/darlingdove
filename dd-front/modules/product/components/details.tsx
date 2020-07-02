import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import { Product } from '../../shared/interfaces/product';

const useStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(0.5)
  },
  qtyWrapper: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  buyBtn: {
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1)
  }
}));

interface ProductDetails {
  product: Product;
  onAddToCart(productId: string, qty: number): void;
  onTagClick(tag: string): void;
}

const ProductDetails: FunctionComponent<ProductDetails> = props => {
  const classes = useStyles();
  const [quantity, setQuantity] = useState(1);
  const { onAddToCart, onTagClick } = props;
  const {
    name,
    qty,
    sku,
    description,
    price,
    oldPrice,
    tags,
    _id
  } = props.product;

  return (
    <div>
      <Typography variant="h6" gutterBottom itemProp="name">
        {name}
      </Typography>
      <Typography variant="body2">{`Наличие: ${qty}`}</Typography>
      <Typography variant="body2">
        Артикул: <span itemProp="sku">{sku}</span>
      </Typography>
      <Typography variant="body2" itemProp="description">
        {description}
      </Typography>
      <Typography
        variant="h6"
        itemProp="offers"
        itemScope
        itemType="http://schema.org/Offer"
      >
        {!!oldPrice && (
          <Typography variant="body2" component="span">
            <s>{`${oldPrice} руб`}</s>{' '}
          </Typography>
        )}
        <span itemProp="price">{price}</span>{' '}
        <span itemProp="priceCurrency" {...{ content: 'RUB' }}>
          руб
        </span>
      </Typography>
      <div className={classes.qtyWrapper}>
        <TextField
          id="number"
          label="Количество"
          value={quantity}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setQuantity(Number(event.target.value))
          }
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{
            min: 1
          }}
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => onAddToCart(_id, quantity)}
          className={classes.buyBtn}
        >
          В корзину
        </Button>
      </div>
      <Typography variant="body2">Теги:</Typography>
      {tags.map(tag => (
        <Chip
          key={tag}
          label={tag}
          className={classes.chip}
          onClick={() => onTagClick(tag)}
        />
      ))}
    </div>
  );
};

export default ProductDetails;
