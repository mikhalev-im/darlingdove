import React, { FunctionComponent } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { AnyAction } from 'redux';

interface Modal {
  open: boolean;
  data: object;
  onClose(): AnyAction;
}

const Modal: FunctionComponent<Modal> = props => {
  const { open, data, onClose } = props;

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
};

export default Modal;
