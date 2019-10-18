import React from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none'
  }
});

const Error = ({ statusCode }) => {
  const classes = useStyles();

  let title;
  let message;
  if (statusCode === 404) {
    title = '404';
    message = 'Страница не существует!';
  } else {
    title = 'Ой!';
    message =
      'Возникла неизвестная ошибка... Пожалуйста, сообщите о ней на нашу почту info@darlingdove.ru!';
  }

  return (
    <>
      <Typography variant="h2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {message}
      </Typography>
      <Link href="/">
        <a className={classes.link}>
          <Typography component="span">В магазин</Typography>
        </a>
      </Link>
    </>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
