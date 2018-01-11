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
import Search from './searchbar'
import SearchBar from 'material-ui-search-bar'

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
    className='dotMenu'
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    iconStyle={{ fill: '#69626D' }}
  >
    <MenuItem>  <Link style={{horizontal: 'right', vertical: 'middle'}} to="/admin">Profile</Link> </MenuItem>
    <MenuItem> <Link style={{horizontal: 'right', vertical: 'bottom'}} to="/logout">Log out</Link> </MenuItem>
  </IconMenu>
);

Logged.muiName = 'IconMenu';

/**
 * This example is taking advantage of the composability of the `AppBar`
 * to render different components depending on the application state.
 */
class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {width: window.innerWidth};
    console.log(this.state.width)
  }


  render () {
    const width = this.state.width - (this.state.width / 2.5)
    const rightButtons = (
    <div style={{width:width}}>
      <Search />
      {Auth.isUserAuthenticated() ? (<Logged />) : (<Login />)}
    </div>
  );
    return (
      <div>
        <AppBar
          style={{ backgroundColor: 'white' }}
          zDepth={0}
          iconElementLeft={<Link className="menuHeader" to="/">COINMARKETPEDIA</Link>}
          iconElementRight={rightButtons}
        />
      </div>
    );
  }
}

export default Nav;
