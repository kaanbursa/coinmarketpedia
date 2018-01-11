import React, { PropTypes, Component } from 'react';
import  { AddCoin, Footer } from 'components';
import Auth from '../modules/auth.js';
import update from 'react-addons-update';
import RaisedButton from 'material-ui/RaisedButton';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';

export default class AdminPage extends Component {

  constructor (props, context) {

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }
    super(props, context);
    // Set the videoList to empty array
    this.state = {
      errors: {},
      successMessage: '',
      results: [],
      coin: {
        coinname: '',
        ticker: '',
      },
      open: false,
    };
    this.processForm = this.processForm.bind(this);
    this.addCoin = this.addCoin.bind(this);
  }

  componentDidMount () {

    const req = new XMLHttpRequest();
    req.open('GET', '/api/coins', true);
    req.responseType = 'json';
    req.addEventListener('load', () => {
      const results = req.response;
      console.log(results)
      this.setState({results});
    });
    req.send();

  }

  processForm (event) {
    event.preventDefault();
    // set the object you want to send
    const coinname = encodeURIComponent(this.state.coin.coinname);
    const ticker = encodeURIComponent(this.state.coin.ticker);
    const formData = `name=${coinname}&ticker=${ticker}`;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/newcoin', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        // change the component-container state
        this.setState({
          errors: {},
        });
        // set a message
        localStorage.setItem('successMessage', xhr.response.message);
        // make a redirect
        window.location.reload();
      } else {
        // failure

        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;
        console.log(errors);
        this.setState({
          errors,
        });
      }
    });
    xhr.send(formData);
  }

  addCoin (event) {
    const field = event.target.name;
    const coin = this.state.coin;
    coin[field] = event.target.value;

    this.setState({
      coin,
    });
  }

  handleToggle = () => this.setState({open: !this.state.open});

  goTo (event) {
    console.log(event)
  }

  render () {
    if (this.state.results === []) {
      return null;
    } else {
      const coins = this.state.results;
      return (
        <main className="container" id="container">
          {Auth.isUserAuthenticated() ? (
            <div className="homePage">
              <AddCoin
              onSubmit={this.processForm}
              onChange={this.addCoin}
              errors={this.state.errors}
              successMessage={this.state.successMessage}
              coin={this.state.coin}
              />

              <div style={{marginTop:10}}>
                <RaisedButton
                label="Open Coin List"
                onClick={this.handleToggle}
                />
                <Drawer
                docked={false}
                open={this.state.open}
                onRequestChange={(open) => this.setState({open})}
                >
                {coins.map(a => (
                  <MenuItem onClick={this.goTo.bind(this)} key={a.coinname}>
                    <Link to={`/coin/${a.coinname}`}>{a.coinname}</Link>
                   </MenuItem>
                ))}

                </Drawer>
              </div>
            </div>
        ) : (
          this.context.router.replace('/LoginPage')
        )}
        </main>
      );
    }
  }
}
