import React, { FunctionComponent, ChangeEvent, useReducer } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  field: {
    width: '100%'
  }
});

enum FormFields {
  OLD_PASSWORD = 'oldPassword',
  NEW_PASSWORD = 'newPassword',
  REPEAT_NEW_PASSWORD = 'repeatNewPassword'
}

interface ChangePasswordFormState {
  [FormFields.OLD_PASSWORD]: string;
  [FormFields.NEW_PASSWORD]: string;
  [FormFields.REPEAT_NEW_PASSWORD]: string;
}

interface ChangePasswordActions extends Partial<ChangePasswordFormState> {
  type: 'CHANGE_FIELD' | 'RESET';
}

const INITIAL_STATE = {
  oldPassword: '',
  newPassword: '',
  repeatNewPassword: ''
};

const reducer = (
  state: ChangePasswordFormState,
  action: ChangePasswordActions
) => {
  const { type, ...rest } = action;

  switch (type) {
    case 'CHANGE_FIELD':
      return {
        ...state,
        ...rest
      };
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
};

const FIELDS = [
  FormFields.OLD_PASSWORD,
  FormFields.NEW_PASSWORD,
  FormFields.REPEAT_NEW_PASSWORD
];

const LABELS = {
  [FormFields.OLD_PASSWORD]: 'Старый пароль',
  [FormFields.NEW_PASSWORD]: 'Новый пароль',
  [FormFields.REPEAT_NEW_PASSWORD]: 'Повторите новый пароль'
};

interface ChangePasswordForm {
  open: boolean;
  onClose(): void;
  onSubmit(oldPassword: string, newPassword: string): void;
}

const ChangePasswordForm: FunctionComponent<ChangePasswordForm> = props => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const { open } = props;
  const { oldPassword, newPassword, repeatNewPassword } = state;

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'CHANGE_FIELD',
      [event.target.name]: event.target.value
    });
  };

  const onClose = () => {
    dispatch({ type: 'RESET' });
    props.onClose();
  };

  const onSubmit = () => {
    // TODO: move to saga?
    if (newPassword !== repeatNewPassword) {
      return alert('Пароли не совпадают');
    }

    props.onSubmit(oldPassword, newPassword);
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth onClose={onClose}>
      <DialogTitle id="simple-dialog-title">Сменить пароль</DialogTitle>
      <DialogContent>
        <Grid>
          {FIELDS.map(name => (
            <Grid key={name} xs item>
              <TextField
                id={name}
                type="password"
                name={name}
                label={LABELS[name]}
                className={classes.field}
                value={state[name]}
                onChange={onInputChange}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit} color="primary">
          Сменить
        </Button>
        <Button onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordForm;
