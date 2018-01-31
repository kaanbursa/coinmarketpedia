import React from 'react';
import ReactDom from 'react-dom';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { hashHistory, Router } from 'react-router';
import routes from './routes.js';
import Auth from './modules/auth.js';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-42431162-3');

function fireTracking() {
    ReactGA.pageview(window.location.hash);
}


// remove tap delay, essential for MaterialUI to work properly
// injectTapEventPlugin();

ReactDom.render((
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Router onUpdate={fireTracking} history={hashHistory} routes={routes} />
  </MuiThemeProvider>), document.getElementById('app'));
