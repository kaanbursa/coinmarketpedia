import React, { PropTypes, Component } from 'react';
import  { Table, AdminView, NoteForm, Footer } from 'components';
import Auth from '../modules/auth.js';
import ReactDataGrid from 'react-data-grid';
const { Toolbar } = require('react-data-grid-addons');
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

// to set the updated values to state
  handleGridRowsUpdated ({ fromRow, toRow, updated }) {
    const formulas = this.state.formulas;
    const ids = this.state.ids;
    if (this.typeChecker(updated)) {
      for (let i = fromRow; i <= toRow; i += 1) {
        const rowToUpdate = formulas[i];
        const updatedRow = update(rowToUpdate, {$merge: updated});
        formulas[i] = updatedRow;
        ids[i] = updatedRow.id;
      }
      this.setState({
        formulas,
        ids: ids.filter((v, i, a) => a.indexOf(v) === i),
      });
      this.rowGetter()
    } else {
      this.createNotification('error');
      console.log('this is not an integer');
    }
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
      const columns = [{
        name: 'Name',
        key: 'materialname',
        resizable: true,
      },

      {
        name: 'Last Update',
        key: 'updatedAt',
      },
      {
        name: 'F*',
        key: 'formula',
        editable: true,
      },
      {
        name: 'VK',
        key: 'vk',
        editable: true,
      },
      {
        name: 'Transport',
        key: 'transport',
        editable: true,
      },
      {
        name: 'Verwerking',
        key: 'verwerking',
        editable: true,
      },
      {
        name: 'Marge',
        key: 'marge',
        editable: true,
      },
      {
        name: 'Afslag',
        key: 'afslag',
      },
      ];
      // const {formulas} = this.state.formulas.map(a => {
      //   if (a.formula === 0){
      //     a.formula = 0
      //   } else {
      //     a.formula = a.formula * this.state.euroPrice[0]
      //   }
      // });


      const {formulas} = this.state.formulas.map(element => {
        if (element.formula === 0){
          element.formula = 0
        } else {
          if (element.tablename === 'KABELSOORTEN!') {
            element.vk = Math.ceil(element.formula * parseInt(this.state.euroPrice[1]) / 5) * 5;
          } else if (element.tablename === 'KOPER, MESSING EN BRONSSOORTEN') {
            element.vk = Math.ceil(element.formula * parseInt(this.state.euroPrice[0]) / 5) * 5;
          } else if (element.tablename === 'MOTOREN') {
            element.vk = Math.ceil(element.formula * parseInt(this.state.euroPrice[2]) / 5) * 5;
          } else if (element.tablename === 'ALUMINIUM SOORTEN') {
            element.vk = Math.ceil(element.formula * parseInt(this.state.euroPrice[3]) / 5) * 5;
          } else if (element.tablename === 'LOOD/ZINK SOORTEN') {
            element.vk = Math.ceil(element.formula * parseInt(this.state.euroPrice[4]) / 5) * 5;
          }  else {
            element.vk = Math.ceil(element.formula * parseInt(this.state.euroPrice[5]) / 5) * 5;
          }
        }

      });
      return (
        <main className="container" id="container">
          {Auth.isUserAuthenticated() ? (
            <div>
              <div className="table-responsive">
                <h1> Data Table </h1>
                <ReactDataGrid
                enableCellSelect
                onGridSort={this.handleGridSort}
                columns={columns}
                rowGetter={this.rowGetter}
                rowsCount={this.state.formulas.length}
                minHeight={600}
                toolbar={<Toolbar><form className="noteForm" onSubmit={this.processForm}>
                  <RaisedButton type="submit" label="Save Changes" primary />
                </form></Toolbar>}
                onGridRowsUpdated={this.handleGridRowsUpdated}
                rowRenderer={RowRenderer}
                />
                <div>
                  <div className="koper"> <p className="productDesc">Koper</p></div>
                  <div className="kabel"><p className="productDesc">Kabel</p></div>
                  <div className="motoren"><p className="productDesc">Motoren</p></div>
                  <div className="aliminum"><p className="productDesc">Aliminum</p></div>
                  <div className="zink"><p className="productDesc">Lood/Zink</p></div>
                  <div className="nikkel"><p className="productDesc">Nikkel</p></div>
                </div>
              </div>

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
