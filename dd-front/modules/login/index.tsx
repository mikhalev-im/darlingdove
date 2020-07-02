import React, { useReducer, ChangeEvent, SyntheticEvent } from 'react';
import { NextPage } from 'next';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import UserActions from '../user/actions';
import RootActions from '../root/actions';
import LoginActions from './actions';
import { InitializedPageContex } from '../shared/interfaces/my-page-context';

const useStyles = makeStyles(theme => ({
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
}));

enum LoginTab {
  LOGIN = 0,
  REGISTER = 1
}

enum InputFields {
  EMAIL = 'email',
  PASSWORD = 'password',
  PASSWORD_REPEAT = 'passwordRepeat'
}

interface LoginState {
  tab: LoginTab;
  [InputFields.EMAIL]: string;
  [InputFields.PASSWORD]: string;
  [InputFields.PASSWORD_REPEAT]: string;
}

interface InputChangeAction {
  type: 'CHANGE_INPUT';
  [InputFields.EMAIL]?: string;
  [InputFields.PASSWORD]?: string;
  [InputFields.PASSWORD_REPEAT]?: string;
}

interface TabChangeAction {
  type: 'CHANGE_TAB';
  tab: LoginTab;
}

type LoginAction = InputChangeAction | TabChangeAction;

const initialState = {
  tab: LoginTab.LOGIN,
  [InputFields.EMAIL]: '',
  [InputFields.PASSWORD]: '',
  [InputFields.PASSWORD_REPEAT]: ''
};

const reducer = (state: LoginState, action: LoginAction) => {
  const { type, ...rest } = action;

  switch (type) {
    case 'CHANGE_TAB':
      // reset fields
      return {
        ...initialState,
        ...rest
      };
    case 'CHANGE_INPUT':
      // change field
      return {
        ...state,
        ...rest
      };
    default:
      return state;
  }
};

const LABELS = {
  [InputFields.EMAIL]: 'Email адрес',
  [InputFields.PASSWORD]: 'Пароль',
  [InputFields.PASSWORD_REPEAT]: 'Повторите пароль'
};

interface Login {
  redirectDestination: string;
  login(
    email: string,
    password: string,
    redirectDestination: string
  ): AnyAction;
  register(
    email: string,
    password: string,
    redirectDestination: string
  ): AnyAction;
}

const Login: NextPage<Login> = props => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'CHANGE_INPUT',
      [event.target.name]: event.target.value
    });
  };

  const handleTabChange = (event: ChangeEvent<{}>, tab: LoginTab) => {
    dispatch({
      type: 'CHANGE_TAB',
      tab
    });
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    if (state.tab === LoginTab.LOGIN) {
      props.login(state.email, state.password, props.redirectDestination);
    } else {
      if (state.password !== state.passwordRepeat) {
        alert('Пароли не совпадают!');
        dispatch({
          type: 'CHANGE_INPUT',
          password: '',
          passwordRepeat: ''
        });
        return;
      }
      props.register(state.email, state.password, props.redirectDestination);
    }
  };

  let buttonText = 'Войти';
  const fields: InputFields[] = [InputFields.EMAIL, InputFields.PASSWORD];
  if (state.tab === LoginTab.REGISTER) {
    fields.push(InputFields.PASSWORD_REPEAT);
    buttonText = 'Зарегистрироваться';
  }

  return (
    <>
      <Typography className={classes.headline} variant="h5" component="h3">
        Вход в систему
      </Typography>
      <Paper className={classes.paper} elevation={2}>
        <Tabs
          value={state.tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Вход" />
          <Tab label="Регистрация" />
        </Tabs>
        <form className={classes.loginForm} onSubmit={handleSubmit}>
          {fields.map(field => (
            <div>
              <TextField
                id={field}
                type={field}
                name={field}
                label={LABELS[field]}
                value={state[field]}
                onChange={handleInputChange}
                className={classes.field}
                margin="normal"
              />
            </div>
          ))}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.button}
          >
            {buttonText}
          </Button>
        </form>
      </Paper>
    </>
  );
};

Login.getInitialProps = async ({
  res,
  reduxStore,
  query
}: InitializedPageContex) => {
  const { LOGIN_PAGE_LOADED } = LoginActions.Types;
  const action = RootActions.Creators.waitFor(LOGIN_PAGE_LOADED);
  const promise = reduxStore.dispatch(action);
  reduxStore.dispatch(LoginActions.Creators.loadLoginPage(query, res));
  return promise;
};

const mapState = () => ({});
const mapDispatch = {
  login: UserActions.Creators.login,
  register: UserActions.Creators.register
};

export default connect(mapState, mapDispatch)(Login);
