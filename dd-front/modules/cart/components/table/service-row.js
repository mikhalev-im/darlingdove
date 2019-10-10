import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const ServiceRow = ({ title, value }) => {
  return (
    <TableRow>
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell align="right">{title}</TableCell>
      <TableCell align="right">{value}</TableCell>
      <TableCell />
    </TableRow>
  );
};

ServiceRow.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ServiceRow;
