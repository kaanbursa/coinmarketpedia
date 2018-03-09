import React, { Component } from 'react';
import { Footer, GridListView } from 'components';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link, browserHistory } from 'react-router';
import DocumentMeta from 'react-document-meta';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';



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
      latest: [],
      value: 25,
      start: 0,
      money: 'EUR',
    };
    this.onClick = this.onClick.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  componentWillMount () {
    const xhr = new XMLHttpRequest ();
    xhr.open('GET','/api/home/topcoins', true);
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
  onSubmit( value) {
    const target = value;
    browserHistory.push(`/coin/${target}`);
    return window.location.reload();
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render () {
    if (this.state.data === [] || this.state.coins.length === 0) {
      return null;
    } else {
      const topList = this.state.coins.slice(1,4);
      const topCoin = this.state.coins[0]
      const meta = {
      title: `Coinmarketpedia | Blockchain Powered Economy`,
      description: 'Free Online Cryptorrency Information Center',
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


      let colWidth = '23%';
      let homeM = 'homeMarket';
      let leftClass = "mainTrend";
      let rightClass = "cardSt";
      let cardClass = "cards";
      if(window.innerWidth < 500){
        leftClass = "phoneTrend"
        rightClass = "phoneCard"
        cardClass = "phoneCards"
        colWidth = '130px';
        homeM = 'phoneHome';
      };
      console.log(topCoin)
      return (
        <main>
          <DocumentMeta {...meta} />
          <div className="homePage">
            <h1 className="homeHeader">THE ONE STOP SHOP <br />GUIDE TO THE NEW BLOCKCHAIN POWERED ECONOMY</h1>
            <p style={{lineHeight:2}} className="pageDesc"> Easy to read pages to global, borderless, decentralized, open organizations & currencies which powers the new economy. </p>
            <div className="dataTable">
              <h1 style={{textAlign:'left'}} className="homeHeader" >Trending</h1>
              <div className={leftClass}>
                <Link to={`/coin/${topCoin[0].coinname}`}><img className="topImage" src={topCoin[0].homeImage}  /></Link>
                <div className="topChart">
                  <h1 className="topName">{topCoin[0].name}</h1>
                  <h3 className="topHead"> Price </h3>
                  <p> {topCoin[1].price_usd} $ </p>
                  <h3 className="topHead"> Market Cap </h3>
                  <p> {numberWithCommas(topCoin[1].market_cap_usd)} $ </p>
                  <h3 className="topHead"> 24 Hour Volume </h3>
                  <p> {numberWithCommas(topCoin[1]['24h_volume_usd'])} $</p>
                  <h3 className="topHead"> Circulating Supply </h3>
                  <p> {numberWithCommas(topCoin[1].available_supply)} </p>
                  <h3 className="topHead"> Total Supply </h3>
                  {topCoin[1].max_supply === null ? (<p> N/A </p>) : (<p> {numberWithCommas(topCoin[1].max_supply)} </p>)}


                </div>
              </div>
              <div className={rightClass}>
              {topList.map(coin => (
                <Card className={cardClass}>
                  <CardHeader
                    title={coin[0].name}
                    subtitle={coin[0].ticker}
                    avatar={<Avatar src={coin[0].homeImage} backgroundColor='white' />}
                  />

                  <CardActions>
                    <FlatButton label="See Page" onClick={() => this.onSubmit(coin[0].coinname)}/>
                    <p style={{float:'right',marginTop:7}}> Price: {coin[1].price_usd} $ </p>
                  </CardActions>
                </Card>
              ))}
              </div>
            </div>

            <div className="dataTable" id="marketCap">
              <h1 style={{textAlign:'left'}} className="homeHeader" id="homeTable">Market Capitalizations</h1>
              <div className={homeM}>
                <p className="homeData">Total Market Cap: ${market.total_market_cap_usd}</p>
                <p className="homeData"> Total Currencies: {market.active_currencies}</p>
                <p className="homeData"> Total Volume (24H): {market.total_24h_volume_usd}</p>
              </div>
              {this.state.start === 0 ? (<div />):(<FlatButton style={{float:'left',marginBottom:10}} label="&larr; Previous 25" onClick={this.onBack}/>)}
              {this.state.start === 175 ? (<div />):(<FlatButton style={{float:'right',marginBottom:10}} label="Next 25 &rarr;" onClick={this.onClick}/>)}
              <BootstrapTable data={coins} striped={true} hover={true} bodyStyle={{overflow: 'scroll'}}>
                <TableHeaderColumn dataField="rank" dataSort={true} width='8%'>Rank</TableHeaderColumn>
                <TableHeaderColumn dataField="name" isKey={true} dataSort={true} dataFormat={this.colFormatter} width={colWidth}>Coin</TableHeaderColumn>
                <TableHeaderColumn dataField="market_cap_usd" dataFormat={this.priceFormatter} columnClassName='colAuto' width='23%'>Market Cap</TableHeaderColumn>
                <TableHeaderColumn dataField="available_supply" width='23%' columnClassName='colAuto'>Circulating Supply</TableHeaderColumn>
                <TableHeaderColumn dataField="price_usd" dataFormat={this.percFormatter} width='23%' columnClassName='colAuto'>Price</TableHeaderColumn>
              </BootstrapTable>
            </div>

          </div>
        </main>
      );
    }
  }
}
