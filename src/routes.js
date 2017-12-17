import React from 'react';
import {
  Router,
  Route,
  IndexRoute,
  hashHistory,
} from 'react-router';
import Layout from 'components';
import SignUpForm from 'components';
import LoginForm from 'components';
import TableList from 'components';
import AdminView from 'components';
import Auth from './modules/auth.js';
import { Home, Add, SignUpPage, LoginPage, Dashboard, AdminPage } from 'containers';


// App routes
const Routes = (
  <Router>
    <Route path="/" component={Layout}>
      {/* IndexRoute renders Home container by default */}
      <IndexRoute component={Home} />
      <Route path="/Add" component={Add} />
      <Route path="/SignUp" component={SignUpPage} />
      <Route path="/Login" component={LoginPage} />
      <Route path="/Dashboard" component={Dashboard} />
      <Route path="/Admin" component={AdminPage} />
      <Route path="/logout" onEnter= {logout} />
    </Route>
  </Router>
);
export function logout (nextState, replace) {
  Auth.deauthenticateUser();
         // change the current URL to /
  replace('/');
}

export default Routes;
