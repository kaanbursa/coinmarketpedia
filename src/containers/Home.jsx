import React, { Component } from 'react';
import { GridListView, Search } from 'components';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Link, browserHistory } from 'react-router';
import DocumentMeta from 'react-document-meta';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import 'whatwg-fetch';




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
      chipData: [
        {key: 0, label: 'Payments'},
        {key: 1, label: '3rd Generation'},
        {key: 2, label: 'Smart Contract'},
        {key: 3, label: 'BaaS'},
        {key: 4, label: 'Privacy'},
      ],
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
        console.log(coins)
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
    }).then(market => {
      market.total_market_cap_usd = numberWithCommas(market.total_market_cap_usd);
      market.total_24h_volume_usd = numberWithCommas(market.total_24h_volume_usd);
      this.setState({market});
    }).catch(err => {
      return err
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
    }).catch(err => {
      return err
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
    }).catch(err => {
      return err
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
  }).catch(err => {
    return err
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
    if (row.percent_change_24h === null){
      return (
        <p className="red">?</p>
      );
    }
    else if (row.percent_change_24h.charAt(0) === '-') {
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
      const category = this.state.chipData
      let colWidth = '23%';
      let homeM = 'homeMarket';
      let leftClass = "mainTrend";
      let rightClass = "cardSt";
      let cardClass = "cards";
      let col = true;
      let minH = 300
      let topChar = '50%'

      if(window.innerWidth < 800){
        leftClass = "phoneTrend"
        rightClass = "phoneCard"
        cardClass = "phoneCards"
        colWidth = '130px';
        homeM = 'phoneHome';
        col = false;
        minH = 100;
        topChar = '100%'

      };
      return (
        <main>
          <DocumentMeta {...meta} />
          <div className="homePage">
            <div className="homeSearch" style={{minHeight:minH}}>
              {col ? (<div><h1 className="homeMainHead" >COINMARKETPEDIA</h1> <Search /></div>) : (
                <div style={{height:180}}><h1 className="homeMainHead" id="phoneHead">COINMARKETPEDIA</h1><Search /></div>
              )}

              {col ? (<div className="category">
                {category.map(name => (
                  <Link key={name.key} to={`/category/${name.label.toLowerCase().split(' ').join('-')}`} className="categoryName">{name.label}</Link>
                ))}
              </div>) : (<div />)}

            </div>
            <div className="dataTable" id="marketCap">
              <h1 style={{textAlign:'left'}} className="homeHeader" >Trending</h1>
              <div className={leftClass}>
                <Link to={`/coin/${topCoin[0].coinname}`}><img className="topImage" src={topCoin[0].homeImage}  /></Link>
                <div className="topChart" style={{width:topChar}}>
                  <h1 className="topName">{topCoin[0].name}</h1>
                  <p className="summary" id="home"> "{topCoin[0].summary}"</p>
                  <h3 className="topHead"> Price </h3>
                  <p className="summary" id="home">$ {topCoin[1].price_usd}  </p>
                  <h3 className="topHead"> Market Cap </h3>
                  <p className="summary" id="home">$ {numberWithCommas(topCoin[1].market_cap_usd)} </p>
                  <h3 className="topHead"> 24 Hour Volume </h3>
                  <p className="summary" id="home">$ {numberWithCommas(topCoin[1]['24h_volume_usd'])} </p>
                  <h3 className="topHead"> Circulating Supply </h3>
                  <p className="summary" id="home"> {numberWithCommas(topCoin[1].available_supply)} </p>



                </div>
              </div>
              <div className={rightClass}>
              {topList.map(coin => (
                <Card key={coin[0].id} className={cardClass}>
                  <CardHeader
                    title={coin[0].name}
                    subtitle={coin[0].ticker}
                    avatar={<Avatar src={coin[0].homeImage} backgroundColor='white' />}
                  />

                  <CardActions>
                    <FlatButton label="See Page" onClick={() => this.onSubmit(coin[0].coinname)}/>
                    <p style={{float:'right',marginTop:7}}> Price: $ {coin[1].price_usd} </p>
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
              {col ? (
                <BootstrapTable data={coins} striped={true} hover={true} bodyStyle={{overflow: 'scroll'}}>
                  <TableHeaderColumn dataField="rank" dataSort={true} width='8%'>Rank</TableHeaderColumn>
                  <TableHeaderColumn dataField="name" isKey={true} dataSort={true} dataFormat={this.colFormatter} width={colWidth}>Coin</TableHeaderColumn>
                  <TableHeaderColumn dataField="market_cap_usd" dataFormat={this.priceFormatter} columnClassName='colAuto' width='23%'>Market Cap</TableHeaderColumn>
                  <TableHeaderColumn dataField="available_supply" width='23%' columnClassName='colAuto'>Circulating Supply</TableHeaderColumn>
                  <TableHeaderColumn dataField="price_usd" dataFormat={this.percFormatter} width='23%' columnClassName='colAuto'>Price</TableHeaderColumn>
                </BootstrapTable> ) : (
                <BootstrapTable data={coins} striped={true} hover={true} bodyStyle={{overflow: 'scroll'}}>
                  
                  <TableHeaderColumn dataField="name" isKey={true} dataSort={true} dataFormat={this.colFormatter} width={colWidth}>Coin</TableHeaderColumn>
                  <TableHeaderColumn dataField="price_usd" dataFormat={this.percFormatter} width='30%' columnClassName='colAuto'>Price</TableHeaderColumn>
                </BootstrapTable>
              )}

            </div>

          </div>
        </main>
      );
    }
  }
}
