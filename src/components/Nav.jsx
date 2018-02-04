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
    let state = window.innerWidth;
    let type = true;
    if(state < 540){
      type = false;
    }
    return (
      <div>
        {type ? (
          <div style={{display: 'inline-block',marginTop:'-33px', float:'right'}}>
            <Link className="dotMenu" to="/login">Log in</Link>
            <Link className="dotMenu" to="/signup">Sign Up</Link>
          </div>
        ):(
          <div style={{display: 'inline-flex',marginTop:'-40px', float:'right'}}>
            <IconMenu
              className='dotMenu'
              iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
              }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              iconStyle={{ fill: '#69626D' }}
            >
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
  <div style={{display: 'inline-flex',marginTop:'-40px', float:'right'}}>
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
      <MenuItem> <Link style={{horizontal: 'right', vertical: 'bottom'}} to="/register">Register Coin</Link> </MenuItem>
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
  constructor(props) {
    super(props);
    this.state = {width: window.innerWidth};
  }


  render () {
    let width = this.state.width - (this.state.width / 2.5)
    let marginLeft =  30;
    let header = true
    if (this.state.width < 580 ){
      marginLeft = 30;
      header = false
    }
    const leftButtons = (
      <div>
      { header ? (
        <Link className="menuHeader" style={{width:240}} to="/">COINMARKETPEDIA</Link>):
        (<Link className="menuHeader" style={{width:120}} to="/">CMP</Link>)
      }
      </div>
      )
    const rightButtons = (
    <div style={{width:width}}>
      <Search/>
      {Auth.isUserAuthenticated() ? (<Logged />) : (<Login />)}
    </div>
  );
    return (
      <div>
        <AppBar
          style={{ backgroundColor: 'white' }}
          zDepth={0}
          iconElementLeft={leftButtons}
          iconElementRight={rightButtons}
        />
      </div>
    );
  }
}

export default Nav;
