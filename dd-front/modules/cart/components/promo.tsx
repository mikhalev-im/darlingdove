import React, { useState, FunctionComponent, ChangeEvent } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  field: {
    width: '100%'
  }
});

interface PromoModal {
  open: boolean;
  onClose(): void;
  onSubmit(promo: string): void;
}

const PromoModal: FunctionComponent<PromoModal> = ({
  open,
  onClose,
  onSubmit
}) => {
  const classes = useStyles();
  const [promo, setPromo] = useState('');

  const handleSubmit = () => {
    onSubmit(promo);
    setPromo('');
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPromo(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Введите промокод</DialogTitle>
      <DialogContent>
        <DialogContent>
          <Grid>
            <Grid xs item>
              <TextField
                id="promo"
                name="promo"
                label="Промокод"
                className={classes.field}
                value={promo}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Ввести
        </Button>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromoModal;
