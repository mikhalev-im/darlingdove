import React, { FunctionComponent } from 'react';
import Head from 'next/head';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Header from './header';
import Modal from './modal';
import Notifications, { MessageData } from './notifications';
import Progress from './progress';

import RootActions from '../../../root/actions';
import NotificationsActions from '../../../notifications/actions';
import {
  getMessageData,
  isNotificationOpen
} from '../../../notifications/selectors';
import { getModal, getIsLoading } from '../../../root/selectors';
import { getCartItemsQty } from '../../../cart/selectors';
import { META } from './constants';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center'
  },
  container: {
    padding: theme.spacing(3)
  }
}));

interface Layout {
  modal: { open: boolean; data: object };
  cartItemsQty: number;
  isNotificationOpen: boolean;
  notificationMessageData: MessageData;
  processNotifications(): AnyAction;
  closeNotification(): AnyAction;
  showDebugData(): AnyAction;
  closeModal(): AnyAction;
  isLoading: boolean;
}

const Layout: FunctionComponent<Layout> = props => {
  const classes = useStyles();

  const {
    modal,
    children,
    cartItemsQty,
    isNotificationOpen,
    notificationMessageData,
    processNotifications,
    closeNotification,
    showDebugData,
    closeModal,
    isLoading
  } = props;

  return (
    <>
      <Head>
        <title key="title">{META.title}</title>
        <meta key="description" name="description" content={META.description} />
        <meta key="keywords" name="keywords" content={META.keywords} />
      </Head>
      <div className={classes.root}>
        <Header cartItemsQty={cartItemsQty} />
        <Progress isLoading={isLoading} />
        <Notifications
          open={isNotificationOpen}
          showDebugData={showDebugData}
          handleClose={closeNotification}
          messageData={notificationMessageData}
          processNotifications={processNotifications}
        />
        <Modal open={modal.open} data={modal.data} onClose={closeModal} />
        <div className={classes.container}>{children}</div>
      </div>
    </>
  );
};

const mapState = state => ({
  cartItemsQty: getCartItemsQty(state),
  isNotificationOpen: isNotificationOpen(state),
  notificationMessageData: getMessageData(state),
  modal: getModal(state),
  isLoading: getIsLoading(state)
});

const mapDispatch = {
  closeNotification: NotificationsActions.Creators.closeNotification,
  processNotifications: NotificationsActions.Creators.processNotifications,
  closeModal: RootActions.Creators.closeModal,
  showDebugData: RootActions.Creators.showModal
};

export default connect(mapState, mapDispatch)(Layout);
