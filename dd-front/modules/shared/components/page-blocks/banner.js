import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  img: { maxWidth: '100%' },
  fullScreen: { margin: -theme.padding }
});

const BannerBlock = ({ classes, src, fullScreen }) => {
  const className = fullScreen ? classes.fullScreen : '';
  return (
    <div className={className}>
      <img src={src} className={classes.img} />
    </div>
  );
};

BannerBlock.propTypes = {
  classes: PropTypes.any,
  src: PropTypes.string.isRequired,
  fullScreen: PropTypes.bool
};

export default withStyles(styles)(BannerBlock);
