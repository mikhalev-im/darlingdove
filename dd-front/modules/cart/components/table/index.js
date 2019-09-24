import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import ItemType from '../../types/item';
import ServiceType from '../../types/service';
import { calcOrderSum } from '../../../shared/utils/cart';

import Head from './head';
import ItemRow from './item-row';
import ServiceRow from './service-row';
import Footer from './footer';

const MIN_WIDTH_MULTIPLIER = 87.5;
const MAX_WIDTH_MULTIPLIER = 125;

const styles = theme => ({
  paper: {
    width: '100%',
    margin: '0 auto',
    overflowX: 'auto',
    marginTop: theme.spacing(3),
    maxWidth: theme.spacing(MAX_WIDTH_MULTIPLIER)
  },
  table: {
    minWidth: theme.spacing(MIN_WIDTH_MULTIPLIER)
  }
});
const CartTable = ({ items, services, classes, onQtyChange, onItemDelete }) => {
  const sum = calcOrderSum(items, services);

  return (
    <Paper className={classes.paper}>
      <Toolbar>
        <Typography variant="h6">Корзина</Typography>
      </Toolbar>
      <Table className={classes.table}>
        <Head />
        <TableBody>
          {items.map(item => (
            <ItemRow
              item={item}
              key={item.product._id}
              onChange={onQtyChange}
              onDelete={onItemDelete}
            />
          ))}
          {services.map(service => (
            <ServiceRow key={service.type} service={service} />
          ))}
        </TableBody>
        <Footer sum={sum} />
      </Table>
    </Paper>
  );
};

CartTable.propTypes = {
  classes: PropTypes.any,
  services: PropTypes.arrayOf(ServiceType),
  items: PropTypes.arrayOf(ItemType),
  onQtyChange: PropTypes.func.isRequired,
  onItemDelete: PropTypes.func.isRequired
};

export default withStyles(styles)(CartTable);
