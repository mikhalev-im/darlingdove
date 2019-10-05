import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Head from 'next/head';

import Header from './header';
import Modal from './modal';
import Notifications from './notifications';
import Progress from './progress';

import RootActions from '../../../root/actions';
import NotificationsActions from '../../../notifications/actions';

import {
  getMessageData,
  isNotificationOpen
} from '../../../notifications/selectors';
import { getModal, getIsLoading } from '../../../root/selectors';
import { getCartItemsQty } from '../../../cart/selectors';

const styles = theme => ({
  root: {
    textAlign: 'center'
  },
  container: {
    padding: theme.padding
  }
});

const META = {
  title: 'Интернет магазин почтовых открыток для посткроссинга DarlingDove',
  keywords:
    'Купить почтовые открытки карточки почта посткроссинг postcrossing интернет магазин',
  description:
    'Чудесный магазин почтовых открыток! Здесь вы можете купить качественные почтовые открытки для посткроссинга и сопутствующие товары!'
};

class Layout extends PureComponent {
  render() {
    const {
      modal,
      classes,
      children,
      cartItemsQty,
      isNotificationOpen,
      notificationMessageData,
      processNotifications,
      closeNotification,
      showDebugData,
      closeModal,
      isLoading
    } = this.props;

    return (
      <>
        <Head>
          <title key="title">{META.title}</title>
          <meta
            key="description"
            name="description"
            content={META.description}
          />
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
  }
}

Layout.propTypes = {
  classes: PropTypes.any,
  modal: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    data: PropTypes.object
  }).isRequired,
  children: PropTypes.node,
  cartItemsQty: PropTypes.number.isRequired,
  isNotificationOpen: PropTypes.bool.isRequired,
  notificationMessageData: PropTypes.object,
  processNotifications: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  closeNotification: PropTypes.func.isRequired,
  showDebugData: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
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

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(Layout)
);
