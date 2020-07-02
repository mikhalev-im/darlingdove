import React, { useState, FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Collapse,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core';
import { ExpandLess, ExpandMore, Close } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  listHeader: {
    textAlign: 'left'
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0
  },
  checkbox: {
    padding: theme.spacing(2) / 3
  }
}));

interface Filters {
  tagsValue: string[];
  tags: string[];
  onChange(value: string[]): void;
}

const Filters: FunctionComponent<Filters> = props => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const { tags, tagsValue, onChange } = props;

  const reset = () => {
    if (!tagsValue || !tagsValue.length) return;
    onChange([]);
  };

  const onToggle = (val: string) => {
    const value = tagsValue.includes(val)
      ? tagsValue.filter(tag => tag !== val)
      : [...tagsValue, val];

    onChange(value);
  };

  return (
    <Paper className={classes.root}>
      <List disablePadding>
        <ListItem dense button onClick={() => setOpen(!open)}>
          {open ? <ExpandLess /> : <ExpandMore />}
          <ListItemText primary={'Категории'} />
          <ListItemSecondaryAction>
            <IconButton size="small" onClick={reset}>
              <Close fontSize="inherit" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={open}>
          <List disablePadding>
            {tags.map(tag => (
              <ListItem
                dense
                button
                key={tag}
                className={classes.listItem}
                onClick={() => onToggle(tag)}
              >
                <Checkbox
                  checked={tagsValue.includes(tag)}
                  tabIndex={-1}
                  disableRipple
                  className={classes.checkbox}
                />
                <ListItemText
                  primary={`${tag.charAt(0).toUpperCase()}${tag.substr(1)}`}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Paper>
  );
};

export default Filters;
