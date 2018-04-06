import React, { Component } from 'react';
import { GridListView, Search } from 'components';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Link, browserHistory } from 'react-router';
import DocumentMeta from 'react-document-meta';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import fetch from 'isomorphic-fetch';
import Promise from 'promise-polyfill';


// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

function numberWithCommas (x) {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function lowercaseFirstLetter(string) {
    return (string.toLowerCase()).replace(/\s/g, '');
}

const categories = [
  {key: 0, url:'payments', name: 'Payments', image: 'https://storage.googleapis.com/coinmarketpedia/payments.png'},
  {key: 1, url:'3rd-generation', name: '3rd Generation', image: 'https://storage.googleapis.com/coinmarketpedia/3dgen.png'},
  {key: 2, url:'smart-contract', name: 'Smart Contract', image: 'https://storage.googleapis.com/coinmarketpedia/smart-contract.png'},
  {key: 3, url:'baas', name: 'BaaS', image: 'https://storage.googleapis.com/coinmarketpedia/baas.png'},
  {key: 4, url:'privacy', name: 'Privacy', image: 'https://storage.googleapis.com/coinmarketpedia/privacy.png'},
  {key: 6, url:'dex', name: 'Decentralized Exchange', image: 'https://storage.googleapis.com/coinmarketpedia/dex.png'},

]


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
        this.setState({coins});

      } else {
        // failure
        this.setState({coins:[]});
      }
    });
    xhr.send();



    fetch('https://api.coinmarketcap.com/v1/global/').then(result => {
      return result.json();
    }).then(market => {
      market.total_market_cap_usd = numberWithCommas(market.total_market_cap_usd);
      market.total_24h_volume_usd = numberWithCommas(market.total_24h_volume_usd);

      this.setState({market});
    }).catch(err => {
      return err;
    });

    fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=${this.state.value}`).then(coins => {
      return coins.json();
    }).then(market => {
      const data = market;
      data.map(a => {
        a.market_cap_usd = numberWithCommas(a.market_cap_usd);
        a.price_usd = numberWithCommas(a.price_usd);
        a.available_supply  = numberWithCommas(a.available_supply);
        a.rank = parseInt(a.rank);
      });
      this.setState({data});
    }).catch(err => {
      return err;
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
      data.map(a => {
        a.market_cap_usd = numberWithCommas(a.market_cap_usd);
        a.price_usd = numberWithCommas(a.price_usd);
        a.available_supply  = numberWithCommas(a.available_supply);
        a.rank = parseInt(a.rank);
      });
      this.setState({data,start});
    }).catch(err => {
      return err;
    });
  };

  onBack () {
    const start = this.state.start - 25;
    fetch(`https://api.coinmarketcap.com/v1/ticker/?start=${start}&limit=25`).then(coins => {
      return coins.json();
    }).then(market => {
      const data = market;
      data.map(a => {
        a.market_cap_usd = numberWithCommas(a.market_cap_usd);
        a.price_usd = numberWithCommas(a.price_usd);
        a.available_supply  = numberWithCommas(a.available_supply);
        a.rank = parseInt(a.rank);
      });
      this.setState({data,start});
    }).catch(err => {
      return err;
    });
  };




  priceFormatter (cell, row) {
    return '$' + cell;
  };

  colFormatter = (cell, row) => {

    const coin = cell.replace(/\s/g, '-');
    return (
      <Link to={`/coin/${coin.toLowerCase()}`}>
        <div style={{width:20,display:'inline'}}><img src={`https://storage.googleapis.com/coinmarketpedia/${lowercaseFirstLetter(cell)}.png`} style={{borderRadius:2, width:'auto',maxWidth:20,height:20, marginRight:10}} onError={(e)=>{e.target.src="https://storage.googleapis.com/coinmarketpedia/replace.png"}} /></div>
        {cell} ({row.symbol})
      </Link>
    );
  }

  percFormatter = (cell, row) => {
    if (row.percent_change_24h === null) {
      return (
        <p className="red">?</p>
      );
    } else if (row.percent_change_24h.charAt(0) === '-') {
      return (
        <p className="red">${cell} ({row.percent_change_24h}%)  &darr;</p>
      );
    } else {
      return (
        <p className="green">${cell} ({row.percent_change_24h}%) &uarr;</p>
      );
    }
  }
  onSubmit (value) {
    const target = value;
    browserHistory.push(`/coin/${target}`);
    return window.location.reload();
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render () {
    if (this.state.data === [] || this.state.coins.length === 0) {
      return null;
    } else {
      const topList = this.state.coins.slice(0,4)


      const meta = {
        title: 'Coinmarketpedia | Blockchain Powered Economy',
        description: 'Free Online Cryptorrency Information Center',
        canonical: 'https://www.coinmarketpedia.com/',
        meta: {
          charset: 'utf-8',
          name: {
            keywords: 'Latest cryptocurrency prices,ICO Price, cryptocurrency, blockchain, cryptoasset, coin',
          },
        },
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
      let col = true;
      let searchMarg = 100
      let imageWidth = '40%';

      let containerMargin = '10px'
      const marg = (window.innerWidth - 140) / 2 ;
      if (window.innerWidth <= 800) {
        searchMarg = 0
        imageWidth = '60%';
        colWidth = '130px';
        homeM = 'phoneHome';
        col = false;


      }
      if (window.innerWidth < 270) {
        containerMargin = marg

      };
      return (
        <main>
          <DocumentMeta {...meta} />
          <div className="homePage">
            <div className="homeSearch" style={{marginBottom:searchMarg}}>
              <div>
                <img src="https://storage.googleapis.com/coinmarketpedia/coinmarketpediaLogo.png"  className="homeImage" style={{width:imageWidth}}/>
                {col ? (<p className="summary" style={{paddingBottom:20}}>Free Guide to the Blockchain Powered Economy</p>) : (<span />)}
                <Search />
               </div>

                

            </div>
            <div className="dataTable" id="marketCap">
              <h1 style={{textAlign:'left'}} className="homeHeader" >Trending</h1>

              <div className="topCoins">
                {topList.map(coin => (
                  <div className="cardCont">
                    <Card key={coin.id} className="cardSt" style={{marginLeft:containerMargin}}>
                      <CardMedia
                        overlay={col ? (<CardTitle title='' subtitle={coin.name} subtitleStyle={{fontSize:14, color:'rgba(255, 255, 255, 0.90)'}} subtitleColor='rgba(255, 255, 255, 0.90)' />) : (<span />)}
                        overlayContentStyle={{backgroundColor:'transparent'}}
                      >
                        <img src={coin.homeImage} style={{width:120, height:'auto'}}/>
                      </CardMedia>

                      <CardActions>
                        <FlatButton label="See Page" fullWidth onClick={() => this.onSubmit(coin.coinname)}/>

                      </CardActions>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <div className="dataTable" id="marketCap">
              <h1 style={{textAlign:'left'}} className="homeHeader">Categories</h1>
              <div className="categoryHome">
                {categories.map(category => (
                  <div className="categotyHomeList">
                    <img src={category.image} style={{width:50,height:50}}/>
                    <Link to={`/category/${category.url}`} className="categoryL">{category.name}</Link>
                  </div>
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
              {this.state.start === 0 ? (<div />) : (<FlatButton style={{float:'left',marginBottom:10}} label="&larr; Previous 25" onClick={this.onBack} />)}
              {this.state.start === 175 ? (<div />) : (<FlatButton style={{float:'right',marginBottom:10}} label="Next 25 &rarr;" onClick={this.onClick} />)}
              {col ? (
                <BootstrapTable data={coins} striped hover
                bodyStyle={{overflow: 'scroll'}}
                >
                  <TableHeaderColumn dataField="rank" dataSort width="8%">Rank</TableHeaderColumn>
                  <TableHeaderColumn dataField="name" isKey dataSort
                  dataFormat={this.colFormatter}
                  width={colWidth}
                  >Coin</TableHeaderColumn>
                  <TableHeaderColumn dataField="market_cap_usd"

                  dataFormat={this.priceFormatter}
                  columnClassName="colAuto" width="23%"
                  >
                  Market Cap</TableHeaderColumn>
                  <TableHeaderColumn dataField="available_supply" width="23%"
                  columnClassName="colAuto"
                  >
                  Circulating Supply</TableHeaderColumn>
                  <TableHeaderColumn dataField="price_usd"
                  dataFormat={this.percFormatter}
                  width="23%"
                  columnClassName="colAuto"
                  >
                  Price</TableHeaderColumn>
                </BootstrapTable>) : (
                  <BootstrapTable data={coins} striped hover
                  bodyStyle={{overflow: 'scroll'}}
                  >
                    <TableHeaderColumn dataField="name" isKey dataSort
                    dataFormat={this.colFormatter}
                    width={colWidth}
                    >
                    Coin</TableHeaderColumn>
                    <TableHeaderColumn dataField="price_usd"
                    dataFormat={this.percFormatter}
                    width="30%"
                    columnClassName="colAuto"
                    >
                    Price</TableHeaderColumn>
                  </BootstrapTable>
              )}

            </div>

          </div>
        </main>
      );
    }
  }
}
