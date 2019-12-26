import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Hidden from '@material-ui/core/Hidden';
import Link from 'next/link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
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
});

const menu = [
  {
    title: 'Открытки',
    href: '/category/[category]',
    hrefAs: '/category/postcards'
  },
  { title: 'О нас', href: '/page/[slug]', hrefAs: '/page/about' }
];

class Header extends Component {
  state = {
    open: false
  };

  toggleMenu = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { classes, cartItemsQty } = this.props;

    return (
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <div className={classes.menu}>
            <Hidden mdUp implementation="css">
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
                onClick={this.toggleMenu}
              >
                <MenuIcon />
              </IconButton>
              <SwipeableDrawer
                open={this.state.open}
                onClose={this.toggleMenu}
                onOpen={this.toggleMenu}
              >
                <List>
                  {menu.map(({ title, href, hrefAs }) => (
                    <Link href={href} as={hrefAs} key={title}>
                      <a
                        onClick={this.toggleMenu}
                        className={classes.sideMenuLink}
                      >
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
              {menu.map(({ title, href, hrefAs }) => (
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
  }
}

Header.propTypes = {
  classes: PropTypes.any,
  cartItemsQty: PropTypes.number.isRequired
};

export default withStyles(styles)(Header);
