import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import ServiceType from '../../types/service';
import { getServiceTypeTranslation } from '../../../shared/utils/cart';

const ServiceRow = ({ service }) => {
  return (
    <TableRow key={service.type}>
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell align="right">
        {getServiceTypeTranslation(service.type)}
      </TableCell>
      <TableCell align="right">{service.price}</TableCell>
      <TableCell />
    </TableRow>
  );
};

ServiceRow.propTypes = {
  service: ServiceType.isRequired
};

export default ServiceRow;
