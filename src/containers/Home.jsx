import React, { Component } from 'react';
import { GridListView, Search } from 'components';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Link, browserHistory } from 'react-router';
import DocumentMeta from 'react-document-meta';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import fetch from 'isomorphic-fetch';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Slider from "react-slick";
import { GridList, GridTile } from 'material-ui/GridList';
import 'whatwg-fetch';
import axios from 'axios';



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
      value: 200,
      start: 0,
      money: 'EUR',
      menuVal: [],

    };
  }

  componentDidMount () {

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

    axios({
      method:'get',
      url:'https://api.coinmarketcap.com/v1/global/',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      let market = {};
      market.total_market_cap_usd = numberWithCommas(response.data.total_market_cap_usd);
      market.total_24h_volume_usd = numberWithCommas(response.data.total_24h_volume_usd);
      market.active_currencies = response.data.active_currencies;
      this.setState({market});
    })
    .catch(err => {
      console.log(err);
    });


    axios({
      method:'get',
      url:`https://api.coinmarketcap.com/v1/ticker/?limit=${this.state.value}`
    }).then(response => {
      const data = response.data
      data.map(a => {
        a.market_cap_usd = numberWithCommas(a.market_cap_usd);
        a.price_usd = numberWithCommas(a.price_usd);
        a.available_supply  = numberWithCommas(a.available_supply);
        a.rank = parseInt(a.rank);
      });
      this.setState({data});

    }).catch(err => {
      return err
    })

  }


  menuHandleChange = (event, index, value) => this.setState({menuVal:value});

  handleOpenMenu = () => {
    this.setState({
      openMenu: true,
    });
  }

  handleOnRequestChange = (value) => {
    this.setState({
      openMenu: value,
    });
  }

  menuItems(values) {
    return categories.map((name) => (
      <MenuItem
        key={name.key}
        insetChildren
        checked={values && values.indexOf(name.name) > -1}
        value={name.name}
        primaryText={name.name}
      />
    ));
  }


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
      const searchCoins = coins.slice(0,5);

      let settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2
      }

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
      let options = {
        page: 1,  // which page you want to show as default
        sizePerPageList: [ {
          text: '25', value: 25
        }, {
          text: '50', value: 50
        } ], // you can change the dropdown list for size per page
        sizePerPage: 25,  // which size per page you want to locate as default
        pageStartIndex: 1, // where to start counting the pages
        paginationSize: 3,  // the pagination bar size.
        prePage: 'Prev', // Previous page button text
        nextPage: 'Next', // Next page button text
        firstPage: 'First', // First page button text
        lastPage: 'Last', // Last page button text
        //paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
        paginationPosition: 'both'  // default is bottom, top and both is all available
      };


      let colWidth = '23%';
      let homeM = 'homeMarket';
      let col = true;
      let searchMarg = 100;
      let imageWidth = '40%';
      let cardWidth = '23%';

      let containerMargin = '10px'
      const marg = (window.innerWidth - 140) / 2 ;
      if (window.innerWidth <= 800) {
        searchMarg = 0
        imageWidth = '70%';
        colWidth = '130px';
        homeM = 'phoneHome';
        col = false;
        cardWidth = '43%';
        options = {
          page: 1,  // which page you want to show as default
          hideSizePerPage: true,
          sizePerPage: 25,  // which size per page you want to locate as default
          pageStartIndex: 1, // where to start counting the pages
          paginationSize: 3,  // the pagination bar size.
          prePage: 'Prev', // Previous page button text
          nextPage: 'Next', // Next page button text
          firstPage: 'First', // First page button text
          lastPage: 'Last', // Last page button text
          //paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
          paginationPosition: 'both'  // default is bottom, top and both is all available
        };
      }
      if (window.innerWidth < 480) {
        cardWidth = '100%';
        settings = {
          dots: true,
          infinite: false,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }

      if (window.innerWidth < 270) {
        containerMargin = marg;

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
                <div style={{display:'block',margin:'auto',width:224,marginTop:10}}>
                  <IconMenu
                    iconButtonElement={
                      <FlatButton
                        fullWidth
                        backgroundColor='#E2E2E2'
                        label="Quick Search"
                        labelPosition="before"
                        labelStyle={{color:'white'}}
                        icon={<i style={{color:'white'}} className="material-icons">&#xE313;</i>}
                       />}
                    style={{width:224}}
                    open={this.state.openMenu}
                    onRequestChange={this.handleOnRequestChange}
                    listStyle={{width:200}}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  >
                    <MenuItem primaryText="Top Cryptocurrencies"
                    style={{width:224}}
                    rightIcon={<ArrowDropRight />}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    menuItems={[
                      searchCoins.map(coin => (
                        <MenuItem style={{width:224}}> <Link className="menuItemLink" to={`/coin/${coin.id}`}>{coin.name.toLocaleUpperCase()}</Link></MenuItem>
                      ))
                    ]} />
                    <MenuItem primaryText="Category"
                    style={{width:224}}
                    rightIcon={<ArrowDropRight />}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    menuItems={[
                      categories.map(category => (
                        <MenuItem ><Link className="menuItemLink" to={`/category/${category.url}`}>{category.name.toLocaleUpperCase()}</Link> </MenuItem>
                      ))

                    ]}
                    />

                  </IconMenu>

                </div>
               </div>



            </div>
            <div className="dataTable" id="marketCap">
              <h1 style={{textAlign:'left'}} className="homeHeader" >Trending</h1>

              <div className="topCoins">
              {col ?  (
                <div>
                {topList.map(coin => (
                <div className="cardCont" style={{width:cardWidth}}>
                  <Card key={coin.id} className="cardSt" style={{marginLeft:containerMargin}}>
                    <CardMedia
                      overlay={col ? (<CardTitle title='' subtitle={coin.name} subtitleStyle={{fontSize:14, color:'rgba(255, 255, 255, 0.90)'}} subtitleColor='rgba(255, 255, 255, 0.90)' />) : (<span />)}
                      overlayContentStyle={{backgroundColor:'transparent'}}
                    >
                      <img src={coin.homeImage} style={{width:120, height:'auto'}} onClick={() => this.onSubmit(coin.coinname)} />
                    </CardMedia>
                    <CardText style={{padding:4}}>
                      <p className="categorySum">{coin.summary}</p>
                    </CardText>
                    <CardActions>
                      <FlatButton label="See Page" fullWidth onClick={() => this.onSubmit(coin.coinname)} />

                    </CardActions>
                  </Card>
                </div>
              ))}</div>) : (
                <Slider {...settings}>
                  {topList.map(coin => (
                    <div className="cardCont" style={{width:cardWidth}}>
                      <Card key={coin.id} className="cardSt" style={{marginLeft:containerMargin}}>
                        <CardMedia
                          overlay={<CardTitle title='' subtitle={coin.name} subtitleStyle={{fontSize:14, color:'rgba(255, 255, 255, 0.90)'}} subtitleColor='rgba(255, 255, 255, 0.90)' />}
                          overlayContentStyle={{backgroundColor:'transparent'}}
                        >
                          <img src={coin.homeImage} style={{width:120, height:'auto'}} onClick={() => this.onSubmit(coin.coinname)} />
                        </CardMedia>
                        <CardText style={{padding:4}}>
                          <p className="categorySum" style={{height:'50px'}}>{coin.summary}</p>
                        </CardText>
                        <CardActions style={{textAlign:'center'}}>
                          <Link to={`/coin/${coin.coinname}`} className='phoneLinkDesign'>SEE PAGE</Link>

                        </CardActions>
                      </Card>
                    </div>
                  ))}

              </Slider>)}


              </div>
            </div>
            <div className="dataTable" id="marketCap">
              <h1 style={{textAlign:'left'}} className="homeHeader">Categories</h1>
              <div className="categoryHome">
                {categories.map(category => (
                  <div key={category.key} className="categotyHomeList">
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

              {col ? (
                <BootstrapTable data={coins} striped hover
                pagination options={options}
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
                  pagination options={options}
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
