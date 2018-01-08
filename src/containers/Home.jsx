import React, { Component } from 'react';
import { Footer } from 'components';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
//import RowRenderer from '../modules/rowRenderer.js';

export default class Home extends Component {

  constructor (props) {
    super(props);
    // Set the videoList to empty array
    this.state = { data: [] };
  }
  componentWillMount(){
    const req = new XMLHttpRequest();
    req.open('GET', '/api/dashboard/table', true);
    req.responseType = 'json';
    req.addEventListener('load', () => {
      var obj = req.response
      var data = []
      for(const i in obj){
        data.push({name:i,price:obj[i]})
      }
      data.map(a => {
        if(a.name.slice(-3) === 'BTC'){
          a.price = a.price * 17000
          a.name = a.name.slice(0, -3)
        }else if(a.name.slice(-3) === 'ETH'){
          a.price = a.price * 1100
          a.name = a.name.slice(0, -3)
        }

      })
      data = data.slice(1,11)
      this.setState({ data })
    });
    req.send();
    const bitcoin = new XMLHttpRequest();
    bitcoin.open('GET', 'https://blockchain.info/ticker', true);
    bitcoin.responseType = 'json'
    bitcoin.addEventListener('load', () => {
      console.log(bitcoin.response)
      
    })
    bitcoin.send();
  }

  priceFormatter(cell, row){
    return '<i class="glyphicon glyphicon-usd"></i> ' + cell;
  }
  render () {
    if(this.state.data === []){
      return null
    } else {

      const coins = this.state.data;
      console.log(this.state.data)
      const columns = [
        {
          name: 'Name',
          key: 'name',
          resizable: true,
        },

        {
          name: 'Last Update',
          key: 'price',
        },
      ]

    return (
      <main>
            <div className="homePage">
              <h1 className="homeHeader">The one stop shop guide to the new Blockchain Powered Economy </h1>
              <p className='pageDesc'> Our goal is to make investing into alt coins and access to information easier by collecting all the relevant information on one easy to read page </p>
              <div className='dataTable'>
              <h1 className="homeHeader" id="homeTable">Market Capitalizations </h1>
              <BootstrapTable data={coins} striped={true} hover={true}>
                <TableHeaderColumn dataField="name" isKey={true} dataSort={true}>Coin</TableHeaderColumn>
                <TableHeaderColumn dataField="marketcap" >Market Cap</TableHeaderColumn>
                <TableHeaderColumn dataField="price" dataFormat={this.priceFormatter}>Price</TableHeaderColumn>
                <TableHeaderColumn dataField="supply" >Circulating Supply</TableHeaderColumn>

              </BootstrapTable>
              </div>
              <div className='dataTable'>
                <h1 className="homeHeader" id="homeTable">Terminology</h1>
              </div>
            </div>

      </main>
    );
  }
  }
}
