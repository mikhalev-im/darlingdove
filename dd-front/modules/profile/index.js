import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import { withStyles } from '@material-ui/core/styles';

import UserActions from '../user/actions';
import RootActions from '../root/actions';
import ProfileActions from './actions';
import Layout from '../shared/components/layout';
import PasswordModal from './components/password-change';
import OrderType from '../order/types/order';
import UserType from './types/user';
import { getOrders } from './selectors';

const MAP_STATUS = {
  notPaid: 'Ожидает оплаты',
  paid: 'Оплачен',
  sent: 'Отправлен',
  completed: 'Завершен',
  cancelled: 'Отменен'
};

const MAX_WIDTH_MULTIPLIER = 125;
const MIN_WIDTH_MULTIPLIER = 87.5;

const styles = theme => ({
  buttons: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
    maxWidth: theme.spacing(MAX_WIDTH_MULTIPLIER)
  },
  button: {
    marginLeft: theme.spacing(1)
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    maxWidth: theme.spacing(MAX_WIDTH_MULTIPLIER),
    margin: '0 auto'
  },
  table: {
    minWidth: theme.spacing(MIN_WIDTH_MULTIPLIER)
  }
});

class Profile extends Component {
  static async getInitialProps({ res, reduxStore }) {
    const { PROFILE_LOADED } = ProfileActions.Types;
    const action = RootActions.Creators.waitFor(PROFILE_LOADED);
    const promise = reduxStore.dispatch(action);
    reduxStore.dispatch(ProfileActions.Creators.loadProfile(res));
    return promise;
  }

  state = {
    passwordChangeOpen: false
  };

  onLogout = () => {
    const { logout, user } = this.props;
    logout(user.jwt);
  };

  passwordChangeToggle = () => {
    this.setState(state => {
      return { passwordChangeOpen: !state.passwordChangeOpen };
    });
  };

  onPasswordChange = (oldPassword, newPassword) => {
    const { changePassword } = this.props;
    changePassword(oldPassword, newPassword);
  };

  renderTableHead() {
    return (
      <TableHead>
        <TableRow>
          <TableCell>№ п/п</TableCell>
          <TableCell align="right">Дата</TableCell>
          <TableCell align="right">Количество товаров</TableCell>
          <TableCell align="right">Сумма</TableCell>
          <TableCell>Статус</TableCell>
          <TableCell>Действия</TableCell>
        </TableRow>
      </TableHead>
    );
  }

  renderTableBody() {
    const { orders } = this.props;

    return (
      <TableBody>
        {!orders.length && (
          <TableRow>
            <TableCell>Нет заказов</TableCell>
          </TableRow>
        )}
        {orders.map((order, index) => {
          const { qty, sum } = order.items.reduce(
            (acc, item) => {
              acc.qty += item.qty;
              acc.sum += item.qty * item.product.price;
              return acc;
            },
            { qty: 0, sum: 0 }
          );

          const date = new Date(order.createdTime);
          return (
            <TableRow hover key={order._id}>
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell align="right">{date.toLocaleString()}</TableCell>
              <TableCell align="right">{qty}</TableCell>
              <TableCell align="right">{`${sum} руб.`}</TableCell>
              <TableCell>{MAP_STATUS[order.status]}</TableCell>
              <TableCell>
                <Link
                  href={`/order?id=${order._id}`}
                  as={`/order/${order._id}`}
                >
                  <a>Просмотр</a>
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  }

  renderButtons() {
    const { classes } = this.props;

    return (
      <p className={classes.buttons}>
        <Button variant={'contained'} onClick={this.passwordChangeToggle}>
          Сменить пароль
        </Button>
        <Button
          onClick={this.onLogout}
          variant={'contained'}
          className={classes.button}
        >
          Выйти
        </Button>
      </p>
    );
  }

  render() {
    const { classes } = this.props;
    const { passwordChangeOpen } = this.state;
    return (
      <Layout>
        <Paper className={classes.root}>
          <Toolbar>
            <Typography variant="h6" id="tableTitle">
              Заказы
            </Typography>
          </Toolbar>
          <Table className={classes.table}>
            {this.renderTableHead()}
            {this.renderTableBody()}
          </Table>
        </Paper>
        {this.renderButtons()}
        <PasswordModal
          open={passwordChangeOpen}
          onClose={this.passwordChangeToggle}
          onSubmit={this.onPasswordChange}
        />
      </Layout>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.any,
  user: UserType,
  orders: PropTypes.arrayOf(OrderType),
  logout: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired
};

const mapState = state => ({
  orders: getOrders(state)
});
const mapDispatch = {
  logout: UserActions.Creators.logout,
  changePassword: UserActions.Creators.changePassword
};

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(Profile)
);
