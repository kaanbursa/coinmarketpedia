import React, { Component } from 'react';
import { Footer, GridListView } from 'components';
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
      market: {},
      coins: []
     };
  }
  componentWillMount () {
    const req = new XMLHttpRequest();
    req.open('GET', '/api/dashboard/table', true);
    req.responseType = 'json';
    req.addEventListener('load', () => {
      console.log(req.response)
      const coins = req.response[0];
      const data = req.response[1];
      data.map( a => {
        a.market_cap_usd = numberWithCommas(a.market_cap_usd)
        a.price_usd = numberWithCommas(a.price_usd)
        a.available_supply  = numberWithCommas(a.available_supply)
        a.rank = parseInt(a.rank)
      })
      this.setState({ data, coins });
    });
    req.send();

    fetch('https://api.coinmarketcap.com/v1/global/').then(result => {

      return result.json()
    }).then( market => {
      market.total_market_cap_usd = numberWithCommas(market.total_market_cap_usd)
      market.total_24h_volume_usd = numberWithCommas(market.total_24h_volume_usd)
      this.setState({market})
    })
  }

  priceFormatter (cell, row) {
    return '$' + cell;
  };

  colFormatter = (cell, row) => {
    let coin = cell.replace(/\s/g, '')
    return (
      <Link to={`/coin/${coin.toLowerCase()}`}>
        {cell}
      </Link>
    )
  }

  percFormatter = (cell, row) => {
    if(row.percent_change_24h.charAt(0) === '-'){
      return (
        <p className="red">${cell} ({row.percent_change_24h}%)  &darr;</p>
      )
    } else {
      return (
        <p className="green">${cell} ({row.percent_change_24h}%) &uarr;</p>
      )
    }
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render () {
    if (this.state.data === [] ) {
      return null;
    } else {
      let tilesData =[
        {image:'https://s3.eu-west-2.amazonaws.com/coinmarketpedia/bitcoinHome.png',
          coinname: 'Bitcoin',
          ticker: 'BTC'
        },
        {image:'https://s3.eu-west-2.amazonaws.com/coinmarketpedia/ethereumHome.png',
          coinname: 'Ethereum',
          ticker: 'ETH'
        },
        {image:'https://s3.eu-west-2.amazonaws.com/coinmarketpedia/cardanoHome.png',
          coinname: 'Cardano',
          ticker: 'ADA'
        },
        {image:'https://s3.eu-west-2.amazonaws.com/coinmarketpedia/nemHome.png',
          coinname: 'NEM',
          ticker: 'XEM'
        },
        {image:'https://s3.eu-west-2.amazonaws.com/coinmarketpedia/dashHome.png',
          coinname: 'Dash',
          ticker: 'DASH'
        },
        {image:'https://s3.eu-west-2.amazonaws.com/coinmarketpedia/rippleHome.png',
          coinname: 'Ripple',
          ticker: 'XRP'
        },
        {image:'https://s3.eu-west-2.amazonaws.com/coinmarketpedia/omisegoHome.png',
          coinname: 'OmiseGo',
          ticker: 'OMG'
        },

      ]


      const market = this.state.market
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
      const gridStyle = {
        image:{width:'100%', height:'280px',borderRadius:'5px'},
        text: {color: 'white'},
        linkStyle: {color:'white',marginRight:'10px'},
        head: {display:'none'}
      }
      return (
        <main>
          <div className="homePage">
            <h1 className="homeHeader">THE ONE STOP SHOP <br></br>GUIDE TO THE NEW BLOCKCHAIN POWERED ECONOMY</h1>
            <p className="pageDesc"> Our goal is to make investing into alt coins and access to information easier by collecting all the relevant information on one easy to read page </p>

            <div className="dataTable" id="marketCap">
              <h1 className="homeHeader" id="homeTable">Market Capitalizations</h1>
              <div className="homeMarket">
                <p className="homeData">Total Market Cap: ${market.total_market_cap_usd}</p>
                <p className="homeData"> Total Currencies: {market.active_currencies}</p>
                <p className="homeData"> Total Volume (24H): {market.total_24h_volume_usd}</p>
              </div>
              <BootstrapTable data={coins} striped={true} hover={true}>
                <TableHeaderColumn dataField="rank" dataSort={true} width='6%'>Rank</TableHeaderColumn>
                <TableHeaderColumn dataField="name" isKey={true} dataSort={true} dataFormat={this.colFormatter}>Coin</TableHeaderColumn>
                <TableHeaderColumn dataField="market_cap_usd" dataFormat={this.priceFormatter}>Market Cap</TableHeaderColumn>
                <TableHeaderColumn dataField="available_supply" >Circulating Supply</TableHeaderColumn>
                <TableHeaderColumn dataField="price_usd" dataFormat={this.percFormatter}>Price</TableHeaderColumn>
              </BootstrapTable>

            </div>
            <div className="dataTable" id="topCoins">
            <h1 className="homeHeader" id="homeTable">Get Started!</h1>
              <GridListView
              tilesData={tilesData}
              style={gridStyle}
              num={4}
              />
            </div>
          </div>
        </main>
      );
    }
  }
}
