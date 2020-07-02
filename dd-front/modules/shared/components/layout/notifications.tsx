import React, { FunctionComponent } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { AnyAction } from 'redux';

const HIDE_DURATION = 2000;

export interface NotificationData {
  key: string;
  debug?: object;
  message: string;
}

interface Notifications {
  open: boolean;
  messageData?: NotificationData;
  handleClose(): AnyAction;
  showDebugData(debug: object): AnyAction;
  processNotifications(): AnyAction;
}

const Notifications: FunctionComponent<Notifications> = props => {
  const showDebugData = () => {
    const { messageData, showDebugData } = props;
    if (!messageData) return;
    showDebugData(messageData.debug);
  };

  const getActions = (debug?: object) => {
    const actions = !debug
      ? []
      : [
          <Button
            key="more"
            color="secondary"
            size="small"
            onClick={showDebugData}
          >
            Подробности
          </Button>
        ];

    actions.push(
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={props.handleClose}
      >
        <CloseIcon />
      </IconButton>
    );

    return actions;
  };

  const { open, messageData } = props;
  const { key, message, debug } = messageData || {};

  return (
    <Snackbar
      key={key}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      open={open}
      autoHideDuration={HIDE_DURATION}
      onClose={props.handleClose}
      onExited={props.processNotifications}
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
      message={<span id="message-id">{message}</span>}
      action={getActions(debug)}
    />
  );
};

export default Notifications;
