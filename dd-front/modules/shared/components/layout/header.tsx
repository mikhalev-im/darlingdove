import React, { useState, FunctionComponent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Hidden from '@material-ui/core/Hidden';
import Link from 'next/link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { MENU } from './constants';

const useStyles = makeStyles(theme => ({
  toolbar: {
    justifyContent: 'space-between'
  },
  menu: {
    display: 'flex',
    alignItems: 'center'
  },
  menuItem: {
    marginRight: '15px',
    cursor: 'pointer'
  },
  link: {
    textDecoration: 'none',
    color: '#fff'
  },
  sideMenuLink: {
    textDecoration: 'none',
    color: theme.palette.common.black
  }
}));

interface Header {
  cartItemsQty: number;
}

const Header: FunctionComponent<Header> = ({ cartItemsQty }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <div className={classes.menu}>
          <Hidden mdUp implementation="css">
            <IconButton
              className={classes.menuItem}
              color="inherit"
              aria-label="Menu"
              onClick={toggleMenu}
            >
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              open={open}
              onClose={toggleMenu}
              onOpen={toggleMenu}
            >
              <List>
                {MENU.map(({ title, href, hrefAs }) => (
                  <Link href={href} as={hrefAs} key={title}>
                    <a onClick={toggleMenu} className={classes.sideMenuLink}>
                      <ListItem button>
                        <ListItemText primary={title} />
                      </ListItem>
                    </a>
                  </Link>
                ))}
              </List>
            </SwipeableDrawer>
          </Hidden>

          <Link href="/">
            <a className={classes.link}>
              <Typography variant="h6" color="inherit">
                DarlingDove
              </Typography>
            </a>
          </Link>
        </div>

        <Hidden smDown implementation="css">
          <div className={classes.menu}>
            {MENU.map(({ title, href, hrefAs }) => (
              <Link href={href} as={hrefAs} key={title}>
                <a className={classes.link}>
                  <Typography
                    color="inherit"
                    variant="button"
                    className={classes.menuItem}
                  >
                    {title}
                  </Typography>
                </a>
              </Link>
            ))}
          </div>
        </Hidden>

        <div>
          <Link href="/profile">
            <a className={classes.link}>
              <IconButton color="inherit">
                <AccountCircle />
              </IconButton>
            </a>
          </Link>
          <Link href="/cart">
            <a className={classes.link}>
              <Badge color="secondary" badgeContent={cartItemsQty}>
                <IconButton color="inherit">
                  <ShoppingCart />
                </IconButton>
              </Badge>
            </a>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
