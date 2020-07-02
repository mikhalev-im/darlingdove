import React, { FunctionComponent } from 'react';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  paragraph: {
    maxWidth: 1000,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});

export interface TextBlock extends TypographyProps {
  text: string;
}

const TextBlock: FunctionComponent<TextBlock> = ({ text, ...rest }) => {
  const classes = useStyles();

  return (
    <Typography className={classes.paragraph} {...rest}>
      {text}
    </Typography>
  );
};

export default TextBlock;
