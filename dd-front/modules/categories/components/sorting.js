import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Radio,
  makeStyles
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  radio: {
    padding: theme.padding / 3
  }
}));

const Sorting = ({ options, selected, onChange, className }) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Paper className={className}>
      <List disablePadding>
        <ListItem dense button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ExpandLess /> : <ExpandMore />}
          <ListItemText primary={'Сортировка'} />
        </ListItem>
        <Collapse in={isOpen}>
          <List disablePadding>
            {options.map(({ name, value }) => (
              <ListItem dense button key={name} onClick={() => onChange(value)}>
                <Radio className={classes.radio} checked={value === selected} />
                <ListItemText
                  primary={`${name.charAt(0).toUpperCase()}${name.substr(1)}`}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Paper>
  );
};

Sorting.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired
};

export default Sorting;
