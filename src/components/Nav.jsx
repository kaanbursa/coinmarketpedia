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
import ReactTooltip from 'react-tooltip';

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
          <div style={{display: 'inline-block',marginTop:'-37px', float:'right'}}>
            <Link className="dotMenu" style={{width:'100%'}} to="/login">Log in</Link>
            <Link className="dotMenu" to="/signup" id="roundedDot">Sign Up</Link>
          </div>
        ) : (
          <div style={{display: 'inline-flex',marginTop:'-40px', float:'right'}}>
            <IconMenu
              className="dotMenu"
              iconButtonElement={
                <IconButton style={{color:'#69626D'}}><i className="material-icons">&#xE5D2;</i></IconButton>
              }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              iconStyle={{ fill: '#69626D' }}
            >
              <MenuItem>  <Link className="menuItemLink" to="/"><i style={{fontSize:18, top:4, right:5, position:'relative'}} className="material-icons">&#xE88A;</i>Home</Link> </MenuItem>
              <MenuItem>  <Link className="menuItemLink" to="/login"><i style={{fontSize:18, top:4, right:5, position:'relative'}} className="material-icons">&#xE0DA;</i>Log in</Link> </MenuItem>
              <MenuItem> <Link className="menuItemLink" to="/signup"><i style={{fontSize:18, top:4, right:5, position:'relative'}} className="material-icons">&#xE8D3;</i>Sign Up</Link> </MenuItem>
            </IconMenu>
          </div>

        )}

      </div>
    );
  }
}

const Logged = (props) => (
  <div style={{display: 'inline-flex', float:'right', marginTop:'-48px'}}>

      {window.innerWidth < 420 ? (<span />) : (
        <div style={{marginTop:11}}>
          <ReactTooltip id="verify" effect="solid">
            <span>Create A Page</span>
        </ReactTooltip>
        <Link style={{marginTop:10}} to="/register">
          <i data-tip data-for="verify" className="material-icons"
            style={{color:'#69626D', fontSize:20,paddingTop:3.3, marginRight:10 }}
          >&#xE147;</i>
        </Link>
        </div>
    )}
    <IconMenu
      className="dotMenu"
      {...props}
      iconButtonElement={
        <IconButton style={{color:'#69626D'}}><i  className="material-icons">&#xE5D2;</i></IconButton>
      }
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      iconStyle={{ fill: '#69626D' }}
    >
      <MenuItem>  <Link className="menuItemLink" to="/"> <i style={{fontSize:18, top:4, right:5, position:'relative'}} className="material-icons">&#xE88A;</i> Home</Link> </MenuItem>
      <MenuItem>  <Link className="menuItemLink" to="/profile"><i style={{fontSize:18, top:4, right:5, position:'relative'}} className="material-icons">&#xE56A;</i>Profile</Link> </MenuItem>
      <MenuItem> <Link className="menuItemLink" to="/register"><i style={{fontSize:18, top:4, right:5, position:'relative'}} className="material-icons">&#xE895;</i>Submit</Link> </MenuItem>
      <MenuItem> <Link className="menuItemLink" to="/logout"><i style={{fontSize:18, top:4, right:5, position:'relative'}} className="material-icons">&#xE15D;</i>Log out</Link> </MenuItem>
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

    let marginRight  = 'none'
    const styleNav =  '100%';
    let headerStyle = {
      fontSize:24,
      width:240,
    };
    let header = true;
    if (window.innerWidth < 1050) {
      headerStyle = {
        fontSize:14,
        width:240,
        marginTop:10,
      };
    };
    if (window.innerWidth < 690) {
      header = false;
      marginRight = '60px';
    }
    let leftButtons = (
      <div>
        {header ? (
          <Link className="menuHeader" style={headerStyle} to="/">COINMARKETPEDIA</Link>) :
          (<div>
            <Link to="/">
            <img style={{borderRadius:10, width:35,height:35, marginLeft:13,marginTop:10}} src='https://storage.googleapis.com/coinmarketpedia/cmpicon.png' />
            </Link>
          </div>)
        }
      </div>
    );
    let rightButtons = (
      <div >
        <div style={{marginRight}}>
          <Search />
        </div>
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
