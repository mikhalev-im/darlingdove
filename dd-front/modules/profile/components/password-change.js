import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = () => ({
  field: {
    width: '100%'
  }
});

class PasswordChange extends Component {
  state = {
    passwordOld: '',
    passwordNew: '',
    passwordRepeat: ''
  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onClose = () => {
    this.resetState();
    this.props.onClose();
  };

  onSubmit = () => {
    const { passwordOld, passwordNew, passwordRepeat } = this.state;

    if (passwordNew !== passwordRepeat) {
      return alert('Пароли не совпадают');
    }

    this.props.onSubmit(passwordOld, passwordNew);
    this.onClose();
  };

  resetState() {
    this.setState({
      passwordOld: '',
      passwordNew: '',
      passwordRepeat: ''
    });
  }

  render() {
    const { open, classes, onClose } = this.props;

    return (
      <Dialog open={open} maxWidth={'xs'} fullWidth onClose={this.onClose}>
        <DialogTitle id="simple-dialog-title">Сменить пароль</DialogTitle>
        <DialogContent>
          <Grid>
            <Grid xs item>
              <TextField
                id="password"
                type="password"
                name="passwordOld"
                label="Старый пароль"
                className={classes.field}
                value={this.state.passwordOld}
                onChange={this.handleInputChange}
              />
            </Grid>
            <Grid xs item>
              <TextField
                id="passwordNew"
                type="password"
                name="passwordNew"
                label="Новый пароль"
                className={classes.field}
                value={this.state.passwordNew}
                onChange={this.handleInputChange}
              />{' '}
            </Grid>
            <Grid xs item>
              <TextField
                id="passwordRepeat"
                type="password"
                name="passwordRepeat"
                label="Повторите новый пароль"
                className={classes.field}
                value={this.state.passwordRepeat}
                onChange={this.handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onSubmit} color="primary">
            Сменить
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

PasswordChange.propTypes = {
  classes: PropTypes.any,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default withStyles(styles)(PasswordChange);
