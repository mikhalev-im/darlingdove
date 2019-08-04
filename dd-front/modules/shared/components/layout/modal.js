import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

class Modal extends PureComponent {
  render() {
    const { open, data, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle id="simple-dialog-title">Подробности ошибки</DialogTitle>
        <DialogContent>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  data: PropTypes.object,
  onClose: PropTypes.func.isRequired
};

export default Modal;
