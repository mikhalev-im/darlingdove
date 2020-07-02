import React, { FunctionComponent } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';

import { ORDER_STATUS_MAP } from '../../shared/constants';
import { MIN_WIDTH_MULTIPLIER } from '../constants';
import { Order } from '../../shared/interfaces/order';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: theme.spacing(MIN_WIDTH_MULTIPLIER)
  }
}));

interface Orders {
  orders: Order[];
}

const Orders: FunctionComponent<Orders> = ({ orders }) => {
  const classes = useStyles();

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell align="right">Дата</TableCell>
          <TableCell align="right">Количество товаров</TableCell>
          <TableCell align="right">Сумма</TableCell>
          <TableCell>Статус</TableCell>
          <TableCell>Действия</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {!orders.length && (
          <TableRow>
            <TableCell>Нет заказов</TableCell>
          </TableRow>
        )}
        {orders.map(order => {
          const qty = order.items.reduce((acc, item) => acc + item.qty, 0);

          const date = new Date(order.createdTime);
          return (
            <TableRow hover key={order._id}>
              <TableCell component="th" scope="row">
                {order.shortId}
              </TableCell>
              <TableCell align="right">{date.toLocaleString()}</TableCell>
              <TableCell align="right">{qty}</TableCell>
              <TableCell align="right">{`${order.total} руб.`}</TableCell>
              <TableCell>{ORDER_STATUS_MAP[order.status]}</TableCell>
              <TableCell>
                <Link href={`/order/[is]`} as={`/order/${order._id}`}>
                  <a>Просмотр</a>
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default Orders;
