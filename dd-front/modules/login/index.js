import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import UserActions from '../user/actions';
import RootActions from '../root/actions';
import LoginActions from './actions';

const LOGIN_INDEX = 0;
const REGISTER_INDEX = 1;

const styles = theme => ({
  headline: {
    marginBottom: theme.spacing(3)
  },
  paper: {
    margin: '0 auto',
    maxWidth: 400
  },
  loginForm: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  field: {
    width: '100%'
  },
  button: {
    marginTop: theme.spacing(4)
  }
});

class Login extends Component {
  static async getInitialProps({ res, reduxStore, query }) {
    const { LOGIN_PAGE_LOADED } = LoginActions.Types;
    const action = RootActions.Creators.waitFor(LOGIN_PAGE_LOADED);
    const promise = reduxStore.dispatch(action);
    reduxStore.dispatch(LoginActions.Creators.loadLoginPage(query, res));
    return promise;
  }

  constructor(props) {
    super(props);

    this.state = {
      tab: LOGIN_INDEX,
      email: '',
      password: '',
      passwordRepeat: ''
    };
  }

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleTabChange = (event, tab) => {
    this.setState({
      tab,
      email: '',
      password: '',
      passwordRepeat: ''
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { tab, email, password, passwordRepeat } = this.state;
    const { login, register, redirectDestination } = this.props;

    // validate
    // login / register
    if (tab === LOGIN_INDEX) {
      login(email, password, redirectDestination);
    } else {
      if (password !== passwordRepeat) {
        alert('Пароли не совпадают!');
        this.setState({ password: '', passwordRepeat: '' });
        return;
      }
      register(email, password, redirectDestination);
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <Typography className={classes.headline} variant="h5" component="h3">
          Вход в систему
        </Typography>
        <Paper className={classes.paper} elevation={2}>
          <Tabs
            value={this.state.tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleTabChange}
            variant="fullWidth"
          >
            <Tab label="Вход" />
            <Tab label="Регистрация" />
          </Tabs>
          <form className={classes.loginForm} onSubmit={this.handleSubmit}>
            <div>
              <TextField
                id="email"
                type="email"
                name="email"
                label="Email адрес"
                value={this.state.email}
                onChange={this.handleInputChange}
                className={classes.field}
                margin="normal"
              />
            </div>
            <div>
              <TextField
                id="password"
                type="password"
                name="password"
                label="Пароль"
                value={this.state.password}
                className={classes.field}
                onChange={this.handleInputChange}
                margin="normal"
              />
            </div>
            {this.state.tab === REGISTER_INDEX && (
              <div>
                <TextField
                  id="passwordRepeat"
                  type="password"
                  name="passwordRepeat"
                  label="Повторите пароль"
                  value={this.state.passwordRepeat}
                  className={classes.field}
                  onChange={this.handleInputChange}
                  margin="normal"
                />
              </div>
            )}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
            >
              {this.state.tab === LOGIN_INDEX ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </form>
        </Paper>
      </>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.any,
  login: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  redirectDestination: PropTypes.string.isRequired
};

const mapState = () => ({});
const mapDispatch = {
  login: UserActions.Creators.login,
  register: UserActions.Creators.register
};

export default withStyles(styles)(connect(mapState, mapDispatch)(Login));
