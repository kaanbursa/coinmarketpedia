import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { Link } from 'react-router';
import Auth from '../modules/auth.js';

class Login extends Component {
  static muiName = 'FlatButton';

  render () {
    return (
      <Link className="dotMenu" to="/login">Log in</Link>
    );
  }
}

const Logged = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    iconStyle={{ fill: '#337ab7' }}
  >
    <MenuItem>  <Link style={{horizontal: 'right', vertical: 'middle'}} to="/dashboard">Non-Ferrous</Link> </MenuItem>
    <MenuItem> <Link style={{horizontal: 'right', vertical: 'bottom'}} to="/logout">Log out</Link> </MenuItem>
  </IconMenu>
);

Logged.muiName = 'IconMenu';

/**
 * This example is taking advantage of the composability of the `AppBar`
 * to render different components depending on the application state.
 */
class Nav extends Component {

  render () {
    return (
      <div>
        <AppBar
          style={{ backgroundColor: 'white' }}
          iconElementLeft={<Link className="menuHeader" to="/">HKS Metals</Link>}
          iconElementRight={Auth.isUserAuthenticated() ? (<Logged />) : (<Login />)}
        />
      </div>
    );
  }
}

export default Nav;
