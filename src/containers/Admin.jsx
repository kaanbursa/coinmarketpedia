import React, { PropTypes, Component } from 'react';
import  { Table, AdminView, NoteForm, Footer } from 'components';
import Auth from '../modules/auth.js';
import update from 'react-addons-update';
import RaisedButton from 'material-ui/RaisedButton';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import RowRenderer from '../modules/rowRenderer.js';

export default class AdminPage extends Component {

  constructor (props, context) {
    super(props, context);
    // Set the videoList to empty array
    this.state = {
      formulas: [],
      formula: String,
      ids: [],
      errors: false,
      tables: [],
      euroPrice: [],
    };
    this.rowGetter = this.rowGetter.bind(this);
    this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);
    this.processForm = this.processForm.bind(this);
    this.typeCheckher = this.typeChecker.bind(this);
  }

  componentDidMount () {

    const req = new XMLHttpRequest();
    req.open('GET', '/admin/formula', true);
    req.responseType = 'json';
    req.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    req.addEventListener('load', () => {

      // this is for sorting according to the id number
      const formulas = req.response.sort((a,b) => {
        return parseFloat(a.id) - parseFloat(b.id);
      });

      // setting what afslag value is
      formulas.map(a => {
        //a.afslag = Math.ceil((a.marge + a.transport + a.verwerking + a.vk) / 5) * 5 ;
        if(a.formula === null){
            a.formula = 0;
        }
      });

      this.setState({ formulas });
    });
    req.send();

    const lme = new XMLHttpRequest();
    lme.open('GET', '/api/lme', true);
    lme.responseType = 'json';
    lme.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    lme.addEventListener('load', () => {
      const workbook = lme.response;
      const euroPrice = [];
      for (let i = 5;i < 11; i += 1) {
        const metal = workbook[i][3].slice(2);
        euroPrice.push(parseFloat(metal.replace(/,/g,'')));
      };
      this.setState({ euroPrice });
    });
    lme.send();
  }

  processForm (event) {
    event.preventDefault();
    // for every change in the datagrid send request to the server for the change
    this.state.ids.forEach(id => {

      const formula = this.state.formulas.find(o => o.id === id);
      formula.afslag = (Math.ceil((parseInt(formula.marge) + parseInt(formula.transport) + parseInt(formula.verwerking) + parseInt(formula.vk)) / 5) * 5) ;
      const dataGrid = `formula=${formula.formula}&marge=${formula.marge}&transport=${formula.transport}&verwerking=${formula.verwerking}&vk=${formula.vk}&afslag=${formula.afslag}`;
      const req = new XMLHttpRequest();
      req.open('POST', `/admin/formula/${id}`, true);
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      req.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
      req.responseType = 'json';
      req.addEventListener('load', () => {
        if (req.status === 200) {
          // success
          // change the component-container state
          this.setState({
            errors: {},
          });
          // Refresh the page /
          window.location.reload();
        } else {
          // failure
          // change the component state
          console.log('error happened sorry');
          this.setState({
            errors: 'an error',
          });
        }
      });
      req.send(dataGrid);
    });
  }

  saveNote (event) {
    return true;
  }

  createNotification (type) {
    return () => {
      switch (type) {
        case 'warning':
          NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
          break;
        case 'error':
          NotificationManager.error('Error message', 'Click me!', 5000, () => {
            alert('callback');
          });
          break;
      }
    };
  }
// get row values
  rowGetter (i) {
    return this.state.formulas[i];
  }



// make sure the user does not enter string
  typeChecker (n)  {
    if (Number.isInteger(parseInt(Object.values(n)[0]))) {
      return true;
    } else {
      return false;
      setState({errors:True});
      this.createNotification('warning');
    }
  }

  render () {
    if (this.state.formulas === undefined && this.state.data === undefined && this.state.tables === undefined) {
      return null;
    } else {

      return (
        <main className="container" id="container">
          {Auth.isUserAuthenticated() ? (
            <div>

            </div>
        ) : (
          this.context.router.replace('/LoginPage')
        )}
          <Footer />
        </main>

      );
    }
  }
}
