import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const HIDE_DURATION = 2000;

class Notifications extends PureComponent {
  handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    this.props.handleClose();
  };

  handleExited = () => {
    this.props.processNotifications();
  };

  showDebugData = () => {
    const {
      messageData: { debug },
      showDebugData
    } = this.props;
    showDebugData(debug);
  };

  getActions(debug) {
    const actions = !debug
      ? []
      : [
          <Button
            key="more"
            color="secondary"
            size="small"
            onClick={this.showDebugData}
          >
            Подробности
          </Button>
        ];

    actions.push(
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={this.handleClose}
      >
        <CloseIcon />
      </IconButton>
    );

    return actions;
  }

  render() {
    const { open, messageData = {} } = this.props;
    const { key, message, debug } = messageData;

    return (
      <Snackbar
        key={key}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={open}
        autoHideDuration={HIDE_DURATION}
        onClose={this.handleClose}
        onExited={this.props.processNotifications}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={<span id="message-id">{message}</span>}
        action={this.getActions(debug)}
      />
    );
  }
}

Notifications.propTypes = {
  open: PropTypes.bool.isRequired,
  messageData: PropTypes.object,
  messageInfo: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  showDebugData: PropTypes.func.isRequired,
  processNotifications: PropTypes.func.isRequired
};

export default Notifications;
