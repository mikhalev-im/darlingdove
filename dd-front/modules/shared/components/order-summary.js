import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import OrderType from '../../order/types/order';
import {
  getServiceTypeTranslation,
  calcOrderSum
} from '../../shared/utils/cart';

const MAX_WIDTH_MULTIPLIER = 125;
const MIN_WIDTH_MULTIPLIER = 87.5;

const styles = theme => ({
  wrapper: {
    maxWidth: theme.spacing(MAX_WIDTH_MULTIPLIER),
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  paper: {
    overflowX: 'auto',
    padding: theme.padding
  },
  item: {
    paddingTop: 0,
    paddingBottom: 0
  },
  price: {
    flexGrow: 0
  },
  total: {
    fontWeight: '500'
  },
  shipping: {
    padding: theme.spacing(3)
  },
  title: {
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(1)
  },
  table: {
    minWidth: theme.spacing(MIN_WIDTH_MULTIPLIER)
  },
  button: {
    marginLeft: theme.spacing(1)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

const OrderSummary = ({
  classes,
  order: {
    user,
    items,
    services,
    promocodes,
    trackingNumber,
    comment,
    createdTime
  },
  onPay,
  onBack
}) => {
  const ref = useRef(null);

  const total = calcOrderSum(items, promocodes, services);

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.paper}>
        <Typography align="left" variant="h6">
          Ваш заказ
        </Typography>
        <Grid container className={classes.shipping} spacing={2}>
          <Grid item>
            <Typography align="left" gutterBottom>
              <b>Статус:</b> Не оплачено
            </Typography>
            <Typography align="left" gutterBottom>
              <b>Клиент:</b> {`${user.firstName} ${user.lastName}`}
            </Typography>
            <Typography align="left" gutterBottom>
              <b>Доставка:</b>{' '}
              {`${user.postalCode}, ${user.country}, ${user.address}`}
            </Typography>
            {createdTime && comment && (
              <Typography align="left" gutterBottom>
                <b>Комментарий:</b> {comment}
              </Typography>
            )}
            {trackingNumber && (
              <Typography align="left" gutterBottom>
                <b>Трек номер:</b> {trackingNumber}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Товар</TableCell>
              <TableCell>Модель</TableCell>
              <TableCell align={'right'}>Количество</TableCell>
              <TableCell align={'right'}>Цена за единицу</TableCell>
              <TableCell align={'right'}>Итого</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!items.length && (
              <TableRow>
                <TableCell>Нет товаров</TableCell>
              </TableRow>
            )}
            {items.map(item => {
              return (
                <TableRow hover key={item.product._id}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.product.sku}</TableCell>
                  <TableCell align={'right'}>{item.qty}</TableCell>
                  <TableCell align={'right'}>{`${item.price} руб.`}</TableCell>
                  <TableCell align={'right'}>{`${item.price *
                    item.qty} руб.`}</TableCell>
                </TableRow>
              );
            })}
            {promocodes.map(promo => {
              return (
                <TableRow hover key={promo.promocode}>
                  <TableCell colSpan={4} align={'right'}>
                    {`Промокод ${promo.code}`}
                  </TableCell>
                  <TableCell align={'right'}>{`${-promo.discount
                    .total} руб.`}</TableCell>
                </TableRow>
              );
            })}
            {services.map(service => {
              return (
                <TableRow hover key={service.type}>
                  <TableCell colSpan={4} align={'right'}>
                    {getServiceTypeTranslation(service.type)}
                  </TableCell>
                  <TableCell
                    align={'right'}
                  >{`${service.price} руб.`}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell align={'right'}>Итого</TableCell>
              <TableCell align={'right'}>{`${total} руб.`}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        {!createdTime && (
          <TextField
            fullWidth
            inputRef={ref}
            label="Добавить комментарий"
            variant="outlined"
            margin={'normal'}
          />
        )}
      </Paper>

      <p className={classes.buttons}>
        <Button onClick={onBack} variant={'contained'}>
          Назад
        </Button>
        <Button
          className={classes.button}
          onClick={() => onPay(ref.current && ref.current.value)}
          color={'primary'}
          variant={'contained'}
        >
          Оплатить
        </Button>
      </p>
    </div>
  );
};

OrderSummary.propTypes = {
  classes: PropTypes.any,
  order: OrderType,
  onPay: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};

export default withStyles(styles)(OrderSummary);
