import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

const Footer = ({ sum }) => {
  return (
    <TableFooter>
      <TableRow>
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell align="right">Итого</TableCell>
        <TableCell align="right">{sum}</TableCell>
        <TableCell />
      </TableRow>
    </TableFooter>
  );
};

Footer.propTypes = {
  sum: PropTypes.number.isRequired
};

export default Footer;
