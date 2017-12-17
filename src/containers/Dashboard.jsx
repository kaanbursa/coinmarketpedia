import React, { PropTypes } from 'react';
import { Table, TableList, Footer } from 'components';
import Auth from '../modules/auth.js';
import XLSX from 'xlsx';
import ReactDataGrid from 'react-data-grid';
import RowRenderer from '../modules/rowRenderer.js';

export default class Dashboard extends React.Component {

  constructor (props) {
    super(props);
    // Set the table list to empty array
    this.state = {
      data: [], /* Array of Arrays e.g. [["a","b"],[1,2]] */
      cols: [],  /* Array of column objects e.g. { name: "C", K: 2 } */
      prices: [],
      formulas: [],
    };
    this.rowGetter2 = this.rowGetter2.bind(this);
  }

  componentDidMount () {
    const req = new XMLHttpRequest();
    req.open('GET', '/api/dashboard/table', true);
    req.responseType = 'json';
    req.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    req.addEventListener('load', () => {
      /* parse the data when it is received */
      const workbook = req.response[0];
      const ws = req.response[1];
      // Get the euro prices from the excel data
      const euroP = [];
      for (let i = 5;i < 11; i += 1) {
        const metal = workbook[i][3].slice(2);
        euroP.push(parseFloat(metal.replace(/,/g,'')));
      };

      // push the afslag from the
      // find asolution for chaining
      const formulas = [];
      req.response[2][0].forEach(element => {
        formulas.push(element);
      });
      // create an object with lme price and recPrice
      // push them into array. make array of objects
      let arr = [];
      const rows2 = formulas.map(element => {
        if (element.tablename === 'KABELSOORTEN!') {
          element.lme = parseInt(euroP[1]);
          element.wanted = element.lme - parseInt(element.afslag);
        } else if (element.tablename === 'KOPER, MESSING EN BRONSSOORTEN') {
          element.lme = parseInt(euroP[0]);
          element.wanted = element.lme - parseInt(element.afslag);
        } else if (element.tablename === 'MOTOREN') {
          element.lme = parseInt(euroP[2]);
          element.wanted = element.lme - parseInt(element.afslag);
        } else if (element.tablename === 'ALUMINIUM SOORTEN') {
          element.lme = parseInt(euroP[3]);
          element.wanted = element.lme - parseInt(element.afslag);
        } else if (element.tablename === 'LOOD/ZINK SOORTEN') {
          element.lme = parseInt(euroP[4]);
          element.wanted = element.lme - parseInt(element.afslag);
        }  else {
          element.lme = parseInt(euroP[5]);
          element.wanted = element.lme - parseInt(element.afslag);
        }
        arr.push(element);
      });


      arr = arr.sort((a,b) => {
        return parseFloat(a.id) - parseFloat(b.id);
      });
      console.log(arr)

      this.setState({
        data: workbook,
        cols: makeCols(ws['!ref']),
        prices: euroP,
        formulas: arr,
      });
    });
    req.send();
  };

  rowGetter2 (i) {
    return this.state.data[i];
  }


  render () {
    if (this.state.data === undefined || this.state.formulas === []) {
      return null;
    } else {

      const columns = [{
        name: 'Soort',
        key: 'materialname',
      },
      {
        name: 'LME',
        key: 'lme',
        // Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      },
      {
        name: 'Afslag',
        key: 'afslag',
      },
      {
        name: 'Recommended Price',
        key: 'wanted',
        // accessor: d => d.friend.name // Custom value accessors!
      }];
      const rowGetter = rowNumber => this.state.formulas[rowNumber];
      return (
        <main className="container" id="container">
          {Auth.isUserAuthenticated() ? (
            <div>
              <h1> LME Prices </h1>
              <ReactDataGrid
              columns={this.state.cols}
              rowGetter={this.rowGetter2}
              rowsCount={this.state.data.length}
              minHeight={630}
              />
              <h1> Recomended Prices </h1>
              <ReactDataGrid
              columns={columns}
              onGridSort={this.handleGridSort}
              rowGetter={rowGetter}
              rowsCount={this.state.formulas.length}
              minHeight={500}
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
    ) : (
      <div>
        <h1> Sorry you need to login</h1>
      </div>
    )}
          <Footer />
        </main>
      );
    }
  }

};


const makeCols = refstr => Array(XLSX.utils.decode_range(refstr).e.c + 1).fill(0).map((x,i) => ({name:XLSX.utils.encode_col(i), key:i}));
