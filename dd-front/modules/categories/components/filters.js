import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Collapse
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const styles = theme => ({
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
    padding: theme.spacing.padding / 3
  }
});

class Filters extends PureComponent {
  state = { open: true };

  toggleTag = val => {
    const { tagsValue, onChange } = this.props;

    const value = tagsValue.includes(val)
      ? tagsValue.filter(tag => tag !== val)
      : [...tagsValue, val];

    onChange(value);
  };

  toggleOpen = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  render() {
    const { open } = this.state;
    const { tags, classes, tagsValue } = this.props;

    return (
      <Paper className={classes.root}>
        <List disablePadding>
          <ListItem dense button onClick={this.toggleOpen}>
            <ListItemText primary={'Категории'} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open}>
            <List disablePadding>
              {tags.map(tag => (
                <ListItem
                  dense
                  button
                  key={tag}
                  className={classes.listItem}
                  onClick={() => this.toggleTag(tag)}
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
  }
}

Filters.propTypes = {
  classes: PropTypes.any.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  tagsValue: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(Filters);
