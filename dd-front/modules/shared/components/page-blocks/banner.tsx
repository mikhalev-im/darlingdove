import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';

export interface BannerBlock {
  src: string;
  fullScreen?: boolean;
}

const useStyles = makeStyles(theme => ({
  img: { maxWidth: '100%' },
  fullScreen: { margin: -theme.spacing(2) }
}));

const BannerBlock: FunctionComponent<BannerBlock> = ({ src, fullScreen }) => {
  const classes = useStyles();
  const className = fullScreen ? classes.fullScreen : '';

  return (
    <div className={className}>
      <img src={src} className={classes.img} />
    </div>
  );
};

export default BannerBlock;
