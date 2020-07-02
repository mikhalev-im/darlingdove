import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const HeadRow = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell />
        <TableCell align="right">Количество</TableCell>
        <TableCell align="right">Цена за шт.</TableCell>
        <TableCell align="right">Всего</TableCell>
        <TableCell />
      </TableRow>
    </TableHead>
  );
};

export default HeadRow;
