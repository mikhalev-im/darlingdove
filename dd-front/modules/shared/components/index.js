import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Close';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import Link from 'next/link';

import CartActions from './actions';
import RootActions from '../root/actions';
import Layout from '../shared/components/layout';
import { getCartItems, getCartId } from './selectors';
import CartItemType from '../../cart/types/item';

const MAX_WIDTH_MULTIPLIER = 125;
const MIN_WIDTH_MULTIPLIES = 87.5;
const IMAGE_WIDTH = 72;
const IMAGE_HEIGHT = 50;
const INPUT_WIDTH = 35;
const INPUT_PROPS = { style: { textAlign: 'center' }, min: 1 };

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    maxWidth: theme.spacing.unit * MAX_WIDTH_MULTIPLIER,
    margin: '0 auto'
  },
  table: {
    minWidth: theme.spacing.unit * MIN_WIDTH_MULTIPLIES
  },
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
  buttons: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
    maxWidth: theme.spacing.unit * MAX_WIDTH_MULTIPLIER
  },
  input: {
    width: INPUT_WIDTH
  }
});

class Cart extends Component {
  render() {
    const {
      classes,
      cartItems,
      onMakeOrder,
      onQtyChange,
      onProductDelete
    } = this.props;

    const sum = cartItems.reduce(
      (sum, item) => sum + item.qty * item.product.price,
      0
    );

    if (!cartItems.length) {
      return (
        <Layout>
          <div>
            <Typography variant="h5" id="tableTitle">
              Корзина пуста
            </Typography>
            <Link href="/">
              <a className={classes.link}>
                <Typography variant="subtitle1" id="tableTitle">
                  В магазин
                </Typography>
              </a>
            </Link>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <Paper className={classes.root}>
          <Toolbar>
            <Typography variant="h6" id="tableTitle">
              Корзина
            </Typography>
          </Toolbar>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell numeric>Количество</TableCell>
                <TableCell numeric>Цена за шт.</TableCell>
                <TableCell numeric>Всего</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map(item => {
                const [imageSrc] = item.product.images;
                return (
                  <TableRow key={item.product._id}>
                    <TableCell className={classes.imageCell}>
                      <CardMedia image={imageSrc} className={classes.image} />
                    </TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell numeric>
                      <TextField
                        className={classes.input}
                        value={item.qty}
                        inputProps={INPUT_PROPS}
                        onChange={event =>
                          onQtyChange(item.product._id, event.target.value)
                        }
                        type="number"
                        margin="none"
                      />
                    </TableCell>
                    <TableCell numeric>{item.product.price}</TableCell>
                    <TableCell numeric>
                      {item.product.price * item.qty}
                    </TableCell>
                    <TableCell>
                      <DeleteIcon
                        className={classes.icon}
                        onClick={() => onProductDelete(item.product._id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell numeric>Итого</TableCell>
                <TableCell numeric>{sum}</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>

        <p className={classes.buttons}>
          <Button
            onClick={() => onMakeOrder('/checkout')}
            color={'primary'}
            variant={'contained'}
          >
            Оформить заказ
          </Button>
        </p>
      </Layout>
    );
  }
}

Cart.propTypes = {
  classes: PropTypes.any,
  cartItems: PropTypes.arrayOf(CartItemType).isRequired,
  onMakeOrder: PropTypes.func.isRequired,
  onQtyChange: PropTypes.func.isRequired,
  onProductDelete: PropTypes.func.isRequired
};

const mapState = state => ({
  cartItems: getCartItems(state),
  cartId: getCartId(state)
});

const mapDispatch = {
  onMakeOrder: RootActions.Creators.redirect,
  onProductDelete: CartActions.Creators.removeFromCart,
  onQtyChange: CartActions.Creators.debouncedCartQtyUpdate
};

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(Cart)
);
