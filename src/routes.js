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
import RegisterCoin from 'components';
import ForgotPassword from 'components';
import ResetPassword from 'components';
import MyPosts from 'components';
import EditCoin from 'components';
import SuggestionBox from 'components';
import Auth from './modules/auth.js';
import { Home, Add, SignUpPage, LoginPage, Post, AdminPage, RegisterPage, EditPage, ForgotPage, ResetPage, Profile, About } from 'containers';


// App routes
const Routes = (
  <Router>
    <Route path="/" component={Layout}>
      {/* IndexRoute renders Home container by default */}
      <IndexRoute component={Home} />
      <Route path="/Add" component={Add} />
      <Route path="/SignUp" component={SignUpPage} />
      <Route path="/Login" component={LoginPage} />
      <Route path="/coin/:name" component={Post} />
      <Route path="/Admin" component={AdminPage} />
      <Route path="/register" component= {RegisterPage} />
      <Route path="/edit/:name" component={EditPage} />
      <Route path="/profile" component={Profile} />
      <Route path="/reset/:token" component={ResetPage} />
      <Route path="/forgot" component={ForgotPage} />
      <Route path="/about" component={About} />
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
