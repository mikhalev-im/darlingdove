import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const countries = [
  {
    value: 'Россия',
    label: 'Россия'
  }
];

const MAX_WIDTH_MULTIPLIER = 125;

const useStyles = makeStyles(theme => ({
  wrapper: {
    maxWidth: theme.spacing(MAX_WIDTH_MULTIPLIER),
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  paper: {
    overflowX: 'auto',
    padding: theme.spacing(2)
  },
  grid: {
    padding: theme.spacing(2)
  },
  button: {
    marginLeft: theme.spacing(1)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));

interface ShippingForm {
  fname: string;
  lname: string;
  address: string;
  postCode: string;
  country: string;
  onChange(): void;
  onNext(): void;
}

const ShippingForm: FunctionComponent<ShippingForm> = props => {
  const classes = useStyles();

  const { fname, lname, address, postCode, country, onChange, onNext } = props;

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.paper}>
        <Typography align="left" variant="h6">
          Информация о доставке
        </Typography>
        <Grid className={classes.grid} container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              value={fname}
              name="fname"
              label="Имя"
              fullWidth
              autoComplete="fname"
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              value={lname}
              name="lname"
              label="Фамилия"
              fullWidth
              autoComplete="lname"
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              value={postCode}
              name="postCode"
              label="Индекс"
              fullWidth
              autoComplete="billing postal-code"
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="country"
              value={country}
              select
              required
              fullWidth
              label="Страна"
              onChange={onChange}
            >
              {countries.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              value={address}
              name="address"
              label="Адрес"
              fullWidth
              autoComplete="billing address-line1"
              onChange={onChange}
            />
          </Grid>
        </Grid>
      </Paper>
      <p className={classes.buttons}>
        <Button
          color={'primary'}
          variant={'contained'}
          className={classes.button}
          onClick={onNext}
        >
          Далее
        </Button>
      </p>
    </div>
  );
};

export default ShippingForm;
