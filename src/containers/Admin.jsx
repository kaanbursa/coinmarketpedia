import React, { PropTypes, Component } from 'react';
import  { Table, AdminView, AddCoin, Footer } from 'components';
import Auth from '../modules/auth.js';
import update from 'react-addons-update';
import RaisedButton from 'material-ui/RaisedButton';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import RowRenderer from '../modules/rowRenderer.js';


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
      successMessage,
      results: [],
      coin: {
        coinname: '',
        ticker: '',
      },
    };
    this.processForm = this.processForm.bind(this);
    this.addCoin = this.addCoin.bind(this);
  }

  componentDidMount () {

    const req = new XMLHttpRequest();
    req.open('GET', '/api/coins', true);
    req.responseType = 'json'
    req.addEventListener('load', ()=> {
      let results = req.response
      console.log(results)
      this.setState({results})
    })
    req.send();

  }

  processForm (event) {
    event.preventDefault();
    // for every change in the datagrid send request to the server for the change

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
      } else {
        // failure

        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;
        console.log(errors)
        this.setState({
          errors,
        });
      }

    })
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

              {coins.map(coin => {
                <table>
                    <tr>
                      <td>{coin.coinname}</td>
                    </tr>
                    <tr>
                      <td>{coin.ticker}</td>
                    </tr>
                </table>
              })}

            </div>
        ) : (
          this.context.router.replace('/LoginPage')
        )}
        </main>

      );
    }
  }
}
