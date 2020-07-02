import React, { FunctionComponent } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { calcOrderSum } from '../../../shared/utils/cart';
import Head from './head';
import ItemRow from './item-row';
import ServiceRow from './service-row';
import Footer from './footer';
import { getServiceTypeTranslation } from '../../../shared/utils/cart';
import { CartItem } from '../../../shared/interfaces/cart-item';
import { Promocode } from '../../../shared/interfaces/promocode';
import { Service } from '../../../shared/interfaces/service';
import { AnyAction } from 'redux';

const MIN_WIDTH_MULTIPLIER = 87.5;
const MAX_WIDTH_MULTIPLIER = 125;

const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    margin: '0 auto',
    overflowX: 'auto',
    marginTop: theme.spacing(3),
    maxWidth: theme.spacing(MAX_WIDTH_MULTIPLIER)
  },
  table: {
    minWidth: theme.spacing(MIN_WIDTH_MULTIPLIER)
  }
}));

interface CartTable {
  items: CartItem[];
  services: Service[];
  promocodes: Promocode[];
  onQtyChange(productId: string, qty?: number): AnyAction;
  onItemDelete(productId: string): AnyAction;
}

const CartTable: FunctionComponent<CartTable> = ({
  items,
  services,
  promocodes,
  onQtyChange,
  onItemDelete
}) => {
  const classes = useStyles();
  const sum = calcOrderSum(items, promocodes, services);

  return (
    <Paper className={classes.paper}>
      <Toolbar>
        <Typography variant="h6">Корзина</Typography>
      </Toolbar>
      <Table className={classes.table}>
        <Head />
        <TableBody>
          {items.map(item => (
            <ItemRow
              item={item}
              key={item.product._id}
              onChange={onQtyChange}
              onDelete={onItemDelete}
            />
          ))}
          {promocodes.map(promo => (
            <ServiceRow
              key={promo.promocode}
              title={`Промокод ${promo.code}`}
              value={-promo.discount.total}
            />
          ))}
          {services.map(service => (
            <ServiceRow
              key={service.type}
              title={getServiceTypeTranslation(service.type) || ''}
              value={service.price}
            />
          ))}
        </TableBody>
        <Footer sum={sum} />
      </Table>
    </Paper>
  );
};

export default CartTable;
