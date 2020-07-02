import React, { useState, FunctionComponent } from 'react';
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
    // TODO: use theme.spacing
    padding: '5px'
  }
}));

interface Sorting {
  options: { name: string; value: string }[];
  selected: string;
  onChange(value: string): void;
  className?: string;
}

const Sorting: FunctionComponent<Sorting> = ({
  options,
  selected,
  onChange,
  className
}) => {
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

export default Sorting;
