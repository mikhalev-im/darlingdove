import React, { FunctionComponent } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const ServiceRow: FunctionComponent<{ title: string; value: number }> = ({
  title,
  value
}) => {
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

export default ServiceRow;
