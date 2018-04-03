import React from 'react';
import ReactDom from 'react-dom';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { browserHistory, Router } from 'react-router';
import routes from './routes.js';
import Auth from './modules/auth.js';
import ReactGA from 'react-ga';
import 'react-notifications/lib/notifications.css';

ReactGA.initialize('UA-42431162-3');

function fireTracking () {
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: 'rgb(104, 121, 140)',
    accent1Color: 'rgb(0, 84, 129)',
    secondary2color: 'rgb(0, 84, 129)',
  },
});

// remove tap delay, essential for MaterialUI to work properly
// injectTapEventPlugin();

ReactDom.render((
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router onUpdate={fireTracking} history={browserHistory} routes={routes} />
  </MuiThemeProvider>), document.getElementById('app'));
