import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { Link, Router, browserHistory } from 'react-router';
import Auth from '../modules/auth.js';
import Search from './searchbar';
import SearchBar from 'material-ui-search-bar';
import PropTypes from 'prop-types';

class Login extends Component {
  static muiName = 'FlatButton';

  render () {
    const state = window.innerWidth;
    let type = true;
    if (state < 540) {
      type = false;
    }
    return (
      <div>
        {type ? (
          <div style={{display: 'inline-block',marginTop:'-33px', float:'right'}}>
            <Link className="dotMenu" to="/login">Log in</Link>
            <Link className="dotMenu" to="/signup" id="roundedDot">Sign Up</Link>
          </div>
        ) : (
          <div style={{display: 'inline-flex',marginTop:'-40px', float:'right'}}>
            <IconMenu
              className="dotMenu"
              iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
              }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              iconStyle={{ fill: '#69626D' }}
            >
              <MenuItem>  <Link style={{horizontal: 'right', vertical: 'middle'}} to="/">Home</Link> </MenuItem>
              <MenuItem>  <Link style={{horizontal: 'right', vertical: 'middle'}} to="/login">Log in</Link> </MenuItem>
              <MenuItem> <Link style={{horizontal: 'right', vertical: 'bottom'}} to="/signup">Sign Up</Link> </MenuItem>
            </IconMenu>
          </div>

        )}

      </div>
    );
  }
}

const Logged = (props) => (
  <div style={{display: 'inline-flex', float:'right', marginTop:'-48px'}}>
    <IconMenu
      className="dotMenu"
      {...props}
      iconButtonElement={
        <IconButton><MoreVertIcon /></IconButton>
      }
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      iconStyle={{ fill: '#69626D' }}
    >
      <MenuItem>  <Link style={{horizontal: 'right', vertical: 'middle'}} to="/">Home</Link> </MenuItem>
      <MenuItem>  <Link style={{horizontal: 'right', vertical: 'middle'}} to="/profile">Profile</Link> </MenuItem>
      <MenuItem> <Link style={{horizontal: 'right', vertical: 'bottom'}} to="/register">Submit</Link> </MenuItem>
      <MenuItem> <Link style={{horizontal: 'right', vertical: 'bottom'}} to="/logout">Log out</Link> </MenuItem>
    </IconMenu>
  </div>
);

Logged.muiName = 'IconMenu';

/**
 * This example is taking advantage of the composability of the `AppBar`
 * to render different components depending on the application state.
 */
class Nav extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {width: window.innerWidth};
  }

  render () {

    const renderSearch = true;


    const styleNav =  '100%';
    let header = true;
    if (window.innerWidth < 800) {
      header = false;
    }
    let leftButtons = (
      <div>
        {header ? (
          <Link className="menuHeader" style={{width:240}} to="/">COINMARKETPEDIA</Link>) :
          (<div />)
        }
      </div>
    );
    let rightButtons = (
      <div >
        <Search />
        {Auth.isUserAuthenticated() ? (<Logged />) : (<Login />)}
      </div>
    );
    if (this.context.router.location.pathname === '/') {
      leftButtons = (
        <div />
      );
      rightButtons = (
        <div >
          <div style={{visibility:'hidden'}}> <Search /> </div>
          {Auth.isUserAuthenticated() ? (<Logged />) : (<Login />)}
        </div>
      );
    }
    return (
      <div>
        <AppBar
          style={{ backgroundColor: 'white' }}
          zDepth={0}
          iconElementLeft={leftButtons}
          iconElementRight={rightButtons}
          iconStyleRight={{width:styleNav}}
        />
      </div>
    );

  }
}

Nav.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default Nav;
