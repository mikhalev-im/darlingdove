import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  paragraph: {
    maxWidth: 1000,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});

const ParagraphBlock = ({ text, ...rest }) => {
  const classes = useStyles();

  return (
    <Typography className={classes.paragraph} {...rest}>
      {text}
    </Typography>
  );
};

ParagraphBlock.propTypes = {
  text: PropTypes.string.isRequired
};

export default ParagraphBlock;
