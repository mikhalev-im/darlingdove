import React, { FunctionComponent } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

const Footer: FunctionComponent<{ sum: number }> = ({ sum }) => {
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

export default Footer;
