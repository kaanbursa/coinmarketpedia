import React, { Component } from 'react';
import { Footer, GridListView } from 'components';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';
import DocumentMeta from 'react-document-meta';
import FlatButton from 'material-ui/FlatButton';



function numberWithCommas (x) {
  let parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}


export default class Home extends Component {

  constructor (props) {
    super(props);
    // Set the videoList to empty array
    this.state = {
      data: [],
      market: {},
      coins: [],
      value: 25,
      start: 0,
      money: 'EUR',
    };
    this.onClick = this.onClick.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  componentWillMount () {
    const xhr = new XMLHttpRequest ();
    xhr.open('GET','/api/home/coins', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        const coins = xhr.response;
        // change the component-container state
        this.setState({coins})

      } else {
        // failure
        this.setState({coins:[]})
      }
    });
    xhr.send();



    fetch('https://api.coinmarketcap.com/v1/global/').then(result => {

      return result.json();
    }).then( market => {
      market.total_market_cap_usd = numberWithCommas(market.total_market_cap_usd);
      market.total_24h_volume_usd = numberWithCommas(market.total_24h_volume_usd);
      this.setState({market});
    });

    fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=${this.state.value}`).then(coins => {
      return coins.json();
    }).then(market => {
      const data = market;
      data.map( a => {
        a.market_cap_usd = numberWithCommas(a.market_cap_usd);
        a.price_usd = numberWithCommas(a.price_usd);
        a.available_supply  = numberWithCommas(a.available_supply);
        a.rank = parseInt(a.rank);
      });
      this.setState({data});
    });
  }

  onClick  (event) {
    event.preventDefault();
    const money = this.state.money;
    const start = this.state.start + 25;
    fetch(`https://api.coinmarketcap.com/v1/ticker/?start=${start}&limit=25`).then(coins => {
      return coins.json();
    }).then(market => {
      const data = market;
      data.map( a => {
        a.market_cap_usd = numberWithCommas(a.market_cap_usd);
        a.price_usd = numberWithCommas(a.price_usd);
        a.available_supply  = numberWithCommas(a.available_supply);
        a.rank = parseInt(a.rank);
      });
      this.setState({data,start});
    });

};

onBack () {
  const start = this.state.start - 25;
  fetch(`https://api.coinmarketcap.com/v1/ticker/?start=${start}&limit=25`).then(coins => {
    return coins.json();
  }).then(market => {
    const data = market;
    data.map( a => {
      a.market_cap_usd = numberWithCommas(a.market_cap_usd);
      a.price_usd = numberWithCommas(a.price_usd);
      a.available_supply  = numberWithCommas(a.available_supply);
      a.rank = parseInt(a.rank);
    });
    this.setState({data,start});
  });
};




  priceFormatter (cell, row) {
    return '$' + cell;
  };

  colFormatter = (cell, row) => {

    const coin = cell.replace(/\s/g, '-');
    return (
      <Link to={`/coin/${coin.toLowerCase()}`}>
        {cell} ({row.symbol})
      </Link>
    )
  }

  percFormatter = (cell, row) => {
    if (row.percent_change_24h.charAt(0) === '-') {
      return (
        <p className="red">${cell} ({row.percent_change_24h}%)  &darr;</p>
      );
    } else {
      return (
        <p className="green">${cell} ({row.percent_change_24h}%) &uarr;</p>
      );
    }
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render () {
    if (this.state.data === [] || this.state.coins.length === 0) {
      return null;
    } else {
      let tilesData = this.state.coins;
      const meta = {
      title: `Coinmarketpedia | Blockchain Powered Economy?`,
      description: 'Cryptorrency information center',
      canonical: 'https://www.coinmarketpedia.com/',
      meta: {
        charset: 'utf-8',
        name: {
          keywords: `Latest cryptocurrency prices,ICO Price, cryptocurrency, blockchain, cryptoasset, coin`
        }
      }
    };

      const market = this.state.market;
      const coins = this.state.data;
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
        head: {display:'none'},
        height: '320px'
      }
      return (
        <main>
          <DocumentMeta {...meta} />
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
              {this.state.start === 0 ? (<div />):(<FlatButton style={{float:'left',marginBottom:10}} label="&larr; Previous 25" onClick={this.onBack}/>)}
              {this.state.start === 175 ? (<div />):(<FlatButton style={{float:'right',marginBottom:10}} label="Next 25 &rarr;" onClick={this.onClick}/>)}
              <BootstrapTable data={coins} striped={true} hover={true}>
                <TableHeaderColumn dataField="rank" dataSort={true} width='6%'>Rank</TableHeaderColumn>
                <TableHeaderColumn dataField="name" isKey={true} dataSort={true} dataFormat={this.colFormatter}>Coin</TableHeaderColumn>
                <TableHeaderColumn dataField="market_cap_usd" dataFormat={this.priceFormatter}>Market Cap</TableHeaderColumn>
                <TableHeaderColumn dataField="available_supply" >Circulating Supply</TableHeaderColumn>
                <TableHeaderColumn dataField="price_usd" dataFormat={this.percFormatter} >Price</TableHeaderColumn>
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
