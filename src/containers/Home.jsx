import React, { Component } from 'react';
import { Footer } from 'components';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

function numberWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export default class Home extends Component {

  constructor (props) {
    super(props);
    // Set the videoList to empty array
    this.state = {
      data: [],
      btc: 0  };
  }
  componentWillMount () {
    const req = new XMLHttpRequest();
    req.open('GET', '/api/dashboard/table', true);
    req.responseType = 'json';
    req.addEventListener('load', () => {
      const data = req.response;
      console.log(data)
      data.map( a => {
        a.market_cap_usd = numberWithCommas(a.market_cap_usd)
        a.price_usd = numberWithCommas(a.price_usd)
        a.available_supply  = numberWithCommas(a.available_supply)
        a.rank = parseInt(a.rank)
      })
      this.setState({ data });
    });
    req.send();
    const bitcoin = new XMLHttpRequest();
    bitcoin.open('GET', 'https://blockchain.info/ticker', true);
    bitcoin.responseType = 'json';
    bitcoin.addEventListener('load', () => {
      const btc = bitcoin.response['USD'].last;
      this.setState({ btc });
    });
    bitcoin.send();
  }

  priceFormatter (cell, row) {
    return '$' + cell;
  };

  colFormatter = (cell, row) => {
    return (
      <Link to={`/coin/${cell}`}>
        {cell}
      </Link>
    )
  }

  percFormatter = (cell, row) => {
    if(row.percent_change_24h.charAt(0) === '-'){
      return (
        <p className="red">{cell} ({row.percent_change_24h}%)  &darr;</p>
      )
    } else {
      return (
        <p className="green">{cell} ({row.percent_change_24h}%) &uarr;</p>
      )
    }
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render () {
    if (this.state.data === [] & this.state.btc == 0) {
      return null;
    } else {
      const coins = this.state.data
      const columns = [
        {
          name: 'Rank',
          key: 'rank',

        },
        {
          name: 'Name',
          key: 'name',
          resizable: true,
        },
        {
          name: 'Market Cap',
          key: 'market_cap_usd',
          resizable: true,
        },

        {
          name: 'Last Update',
          key: 'price_usd',
        },
        {
          name: 'Circulating Supply',
          key: 'available_supply',
          resizable: true,
        },
      ];

      return (
        <main>
          <div className="homePage">
            <h1 className="homeHeader">The one stop shop guide to the new Blockchain Powered Economy </h1>
            <p className="pageDesc"> Our goal is to make investing into alt coins and access to information easier by collecting all the relevant information on one easy to read page </p>
            <div className="dataTable">
              <h1 className="homeHeader" id="homeTable">Market Capitalizations </h1>
              <BootstrapTable data={coins} striped={true} hover={true}>
                <TableHeaderColumn dataField="rank" dataSort={true} width='6%'>Rank</TableHeaderColumn>
                <TableHeaderColumn dataField="name" isKey={true} dataSort={true} dataFormat={this.colFormatter}>Coin</TableHeaderColumn>
                <TableHeaderColumn dataField="market_cap_usd" dataFormat={this.priceFormatter}>Market Cap</TableHeaderColumn>
                <TableHeaderColumn dataField="available_supply" >Circulating Supply</TableHeaderColumn>
                <TableHeaderColumn dataField="price_usd" dataFormat={this.percFormatter}>Price</TableHeaderColumn>
              </BootstrapTable>
            </div>
            <div className="dataTable">
              <h1 className="homeHeader" id="homeTable">Terminology</h1>
            </div>
          </div>
        </main>
      );
    }
  }
}
