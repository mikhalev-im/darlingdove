import React, { useState } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { NextPage } from 'next';

import UserActions from '../user/actions';
import RootActions from '../root/actions';
import ProfileActions from './actions';
import PasswordModal from './components/change-password-form';
import { getOrders } from './selectors';
import { InitializedPageContex } from '../shared/interfaces/my-page-context';
import { Order } from '../shared/interfaces/order';
import OrdersTable from './components/orders';
import { MAX_WIDTH_MULTIPLIER } from "./constants";

const useStyles = makeStyles(theme => ({
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
}));

interface Profile {
  orders: Order[];
  onLogout(): void;
  onPasswordChange(oldPassword: string, newPassword: string): void;
}

const Profile: NextPage<Profile> = (props) => {
  const classes = useStyles();
  const { orders, onLogout, onPasswordChange } = props;
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <>
      <Paper className={classes.root}>
        <Toolbar>
          <Typography variant="h6" id="tableTitle">
            Заказы
          </Typography>
        </Toolbar>
        <OrdersTable orders={orders} />
      </Paper>
      <p className={classes.buttons}>
      <Button variant={'contained'} onClick={() => setChangePasswordOpen(true)}>
        Сменить пароль
      </Button>
      <Button
        onClick={onLogout}
        variant={'contained'}
        className={classes.button}
      >
        Выйти
      </Button>
    </p>
      <PasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSubmit={onPasswordChange}
      />
    </>
  );
}

Profile.getInitialProps = async ({ res, reduxStore }: InitializedPageContex) {
  const { PROFILE_LOADED } = ProfileActions.Types;
  const action = RootActions.Creators.waitFor(PROFILE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(ProfileActions.Creators.loadProfile(res));
  return promise;
}

const mapState = state => ({
  orders: getOrders(state)
});
const mapDispatch = {
  logout: UserActions.Creators.logout,
  changePassword: UserActions.Creators.changePassword
};

export default connect(mapState, mapDispatch)(Profile);
