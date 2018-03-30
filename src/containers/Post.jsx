import React, { PropTypes } from 'react';
import { GridListView, SuggestionBox, Contribute } from 'components';
import Auth from '../modules/auth.js';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import draftToHtml from 'draftjs-to-html';
import YouTube from 'react-youtube';
import { Link } from 'react-router';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import Recaptcha from 'react-recaptcha';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  LinkedinIcon,
  RedditIcon,
  EmailIcon,
} from 'react-share';
import { Timeline } from 'react-twitter-widgets';
import DocumentMeta from 'react-document-meta';
import ReactTooltip from 'react-tooltip';
import 'whatwg-fetch';
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




export default class Post extends React.Component {

  constructor (props) {

    super(props);
    // Set the table list to empty array
    this.state = {
      editorState: EditorState.createEmpty(),
      open: false,
      suggestion: {
        sum: '',
        technology: '',
        upcoming: '',
        ico: '',
        other: '',
      },
      data: {},
      pctChange: '',
      coin: {},
      render: false,
      videoId: '',
      edit: true,
      update: true,
      errors: '',
      success: '',
      gridView: [],
      numPages: null,
      pageNumber: 1,
      tab: 'a',
      users: [],
      recapca: true,

    };
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.xmlReq = this.xmlReq.bind(this);
    this.onChange = this.onChange.bind(this);
    this.processForm = this.processForm.bind(this);
    this.onDocumentLoad = this.onDocumentLoad.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }

  verifyCallback () {
    this.setState({recapca: false});
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  xmlReq (params) {
    window.scrollTo(0,0);
    const xhr = new XMLHttpRequest ();
    xhr.open('GET','/api/home/coins', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        const gridView = xhr.response;

        // change the component-container state
        this.setState({gridView});

      } else {
        // failure
        this.setState({gridView:[]});
      }
    });
    xhr.send();

    const req = new XMLHttpRequest();
    req.open('GET', `/api/coin/${params}`, true);
    req.responseType = 'json';
    req.setRequestHeader('Content-type', 'application/json');
    req.addEventListener('load', () => {
      if (req.status === 404) {
        this.setState({render:false, error:req.response.error});

      } else {
        const coin = req.response;
        console.log(coin);
        const users = coin.users;
        let jsonData = '';
        const videoId = coin.videoId;
        if (req.response.htmlcode === null) {
          jsonData = '{"entityMap":{"0":{"type":"LINK","mutability":"MUTABLE","data":{"url":"http://www.coinmarketpedia.com/register","title":"<span ,=\"\" helvetica,=\"\" arial,=\"\" sans-serif;\"=\"\" style=\"box-sizing: border-box; color: rgb(51, 122, 183); background-color: transparent; font-size: 14px; font-family: &quot;Helvetica Neue&quot;;\">here</span>","targetOption":"_self","_map":{"type":"LINK","mutability":"MUTABLE","data":{"url":"http://www.coinmarketpedia.com/register","title":"<span ,=\"\" helvetica,=\"\" arial,=\"\" sans-serif;\"=\"\" style=\"box-sizing: border-box; color: rgb(51, 122, 183); background-color: transparent; font-size: 14px; font-family: &quot;Helvetica Neue&quot;;\">here</span>","targetOption":"_self"}}}}},"blocks":[{"key":"ftlv9","text":"No Information Available. Register information here ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":46,"style":"color-rgb(51,51,51)"},{"offset":0,"length":46,"style":"bgcolor-rgb(255,255,255)"},{"offset":47,"length":4,"style":"bgcolor-rgb(255,255,255)"},{"offset":0,"length":46,"style":"fontsize-14"},{"offset":47,"length":4,"style":"fontsize-14"},{"offset":0,"length":46,"style":"fontfamily-Helvetica Neue"},{"offset":47,"length":4,"style":"fontfamily-Helvetica Neue"},{"offset":47,"length":4,"style":"color-rgb(51,122,183)"},{"offset":47,"length":4,"style":"fontfamily-proxima-nova, sans-serif"},{"offset":47,"length":4,"style":"bgcolor-transparent"}],"entityRanges":[{"offset":47,"length":4,"key":0}],"data":{}}]}';
        } else {
          jsonData = req.response.htmlcode;
        }
        let data = {};
        let pctChange = '';
        let raw = null;
        try {
          raw = JSON.parse(jsonData);
        } catch (e) {
          // You can read e for more info
          // Let's assume the error is that we already have parsed the payload
          // So just return that
          raw = jsonData;
        }
        document.title = coin.name.toLocaleUpperCase() + ' | COINMARKETPEDIA';
        const contentState = convertFromRaw(raw);
        const editorState = EditorState.createWithContent(contentState);


        fetch(`https://api.coinmarketcap.com/v1/ticker/${coin.coinname}/`).then(result => {
          return result.json();
        }).then(market => {

          if (market.error === 'id not found') {
            data = {};
            data.market_cap_usd = 'NaN';
            data['24h_volume_usd'] = 'NaN';
            data.price_usd = 'NaN';
            data.rank = 'NaN';
            data.available_supply = 'NaN';
            pctChange = 'NaN';
            this.setState({editorState, coin, videoId, render:true, data, pctChange, update:true, users,});
          } else {
            data = market[0];
            data.market_cap_usd = numberWithCommas(data.market_cap_usd);
            data.available_supply = numberWithCommas(data.available_supply);
            data['24h_volume_usd'] = numberWithCommas(data['24h_volume_usd']);
            pctChange = data.percent_change_24h;
            this.setState({editorState, coin, videoId, render:true, data, pctChange, update:true, users,});
          }

        }).catch(err => {
          if (err) {
            data = {};
            data.market_cap_usd = 'NaN';
            data['24h_volume_usd'] = 'NaN';
            data.price_usd = 'NaN';
            data.rank = 'NaN';
            data.available_supply = 'NaN';
            pctChange = 'NaN';
            this.setState({editorState, coin, videoId, render:true, data, pctChange, update:true, users,});
          };
        });



      }
    });
    req.send();
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    return this.xmlReq(this.props.routeParams.name);


  };

  componentWillReceiveProps (nextProps) {
    return this.xmlReq(nextProps.routeParams.name);
  }



  processForm (event) {
    event.preventDefault();
    console.log(this.state.suggestion);
    const information = this.state.suggestion;
    const sum = encodeURIComponent(this.state.suggestion.sum);
    const technology = encodeURIComponent(this.state.suggestion.technology);
    const ico = encodeURIComponent(this.state.suggestion.ico);
    const upcoming = encodeURIComponent(this.state.suggestion.upcoming);
    const other = encodeURIComponent(this.state.suggestion.other);
    const dataGrid = `id=${this.state.coin.id}&summary=${sum}&technology=${technology}&ico=${ico}&upcoming=${upcoming}&other=${other}`;
    console.log(dataGrid)
    const post = new XMLHttpRequest();
    post.open('POST', `/user/contribution/${this.props.routeParams.name}`, true);
    post.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    post.responseType = 'json';
    post.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    post.addEventListener('load', () => {
      if (post.status === 200) {
        // success
        const success = post.response.success;
        // change the component-container state
        this.setState({
          errors: '',
          success,
          suggestion: {
            sum: '',
            technology: '',
            upcoming: '',
            ico: '',
            other: '',
          },
        });
        // Refresh the page /

      } else {
        // failure
        const errors = post.response.errors;
        // change the component state
        this.setState({
          errors,
        });
        console.log('error happened sorry');
      }
    });
    post.send(dataGrid);
  }

  onChange (event) {
    const field = event.target.name;
    const suggestion = this.state.suggestion;
    suggestion[field] = event.target.value;
    this.setState({
      suggestion,
      update:false,
    });
  }
  handleChange = (value) => {
    this.setState({
      tab: value,
    });
  };



  createMarkup () {
    return {__html: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))};
  }

  onEditorStateChange (editorState)  {
    this.setState({
      editorState,
    });
  };

  _onReady (event) {
    // access to player in all event handlers via event.target
    event.target.stopVideo();
  }

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  }

  render () {
    if (this.state.error === 'no coin founded') {

      return (<div>
        <p className="pageDesc">Coin Does Not Exist <br /> <Link to={'/register'}>
          Register Your Coin!</Link>
        </p>
      </div>);
    } else {
      const { pageNumber, numPages } = this.state;

      let myColor = 'green';
      let way = '↑';
      const pctChange = this.state.pctChange;
      const opts = {
        height: '300',
        width: '100%',
        playerVars: { // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };
      let p = true;
      if (pctChange.charAt(0) === '-') {
        myColor = 'red';
        way = '↓';
      } else if (pctChange === 'NaN') {
        p = false;
      }
      const componentClasses = 'coinText';
      if (Object.keys(this.state.coin).length === 0 || this.state.gridView.length === 0) {
        return null;
      } else {
        const data = this.state.data;
        const coin = this.state.coin;
        const user = this.state.coin.user;
        const users = this.state.users;

        const actions = [
          <FlatButton
            label="Close"
            primary
            onClick={this.handleClose}
          />,
          <FlatButton
            label="Submit"
            primary
            keyboardFocused
            onClick={this.processForm}
            disabled={this.state.recapca}
          />,
        ];
        const iconStyle = {
          display: 'inline-block',
        };
        let tilesData = this.state.gridView;

        const path = window.location.href;
        const meta = {
          title: `What is ${coin.name}?`,
          description: `Information about cryptocurrency ${coin.name} `,
          canonical: path,
          meta: {
            charset: 'utf-8',
            name: {
              keywords: `${coin.name},ICO Price,cryptocurrency,blockchain,cryptoasset `,
            },
          },
        };
        let coinTopMargin = '50px';
        let coinWidth = '30%';
        let minWidth = 'none';
        let coinTopClass = 'coinTop';
        console.log(coin)
        if (window.innerWidth < 1030 && window.innerWidth > 570) {
          coinTopMargin = '25%';
          coinWidth = '50%';
          minWidth = window.innerWidth - window.innerWidth * 0.10;
          coinTopClass = 'coinTopPhone';
        } else if (window.innerWidth < 570) {
          coinTopMargin = '0px';
          coinWidth = '100%';
          minWidth = window.innerWidth - window.innerWidth * 0.10;
          coinTopClass = 'coinTopPhone';
        }

        tilesData = tilesData.filter(item => {
          return item.coinname !== coin.coinname;
        });
        const gridStyle = {
          image: {minWidth:'98%', width:'120px', height:'120px',borderRadius:'5px'},
          text: {display:'none'},
          linkStyle: {},
          head: {fontSize:12,display:'center',textAlign:'center',position:'relative'},
          height: '210px',
        };
        let gridPlace = true;
        if (window.innerWidth < 500) {
          gridPlace = false;
        } else {
          gridPlace = true;
        }
        return (
          <main>
            <div style={{minHeight:1775, width:'90%', margin:'auto'}}>
              {this.state.render ? (
                <div>
                  <DocumentMeta {...meta} />
                  <div>
                    <Dialog
                    title="Share Your Knowledge"
                    titleClassName="homeHeader"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent
                    >
                    {Auth.isUserAuthenticated() ? (
                      <div>
                        <p className="summary">Please share relevant information and you don't have to fill all the fields! Good Luck!</p>
                        <Contribute
                        onSubmit={this.processForm}
                        onChange={this.onChange}
                        coin={this.state.suggestion}
                        success={this.state.success}
                        error={this.state.errors}
                        />
                        <div className="recapca" style={{float:'right'}}>
                          <Recaptcha
                          sitekey="6LfnnEAUAAAAAGNV4hfoE3kz4DAP1NqgZW2ZetFu"
                          render="explicit"
                          verifyCallback={this.verifyCallback}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="pageDesc">Please Sign Up to contribute! <br /> <Link to={'/signup'}>
                          Sign Up</Link>
                        </p>
                      </div>
                    )}

                    </Dialog>
                  </div>
                  <div className={coinTopClass} style={{marginLeft:coinTopMargin, width:coinWidth}}>
                    <div className="logos">
                    <FlatButton
                      label="Share your knowladge"
                      primary
                      onClick={this.handleOpen}
                      fullWidth
                      backgroundColor="#2274A5"
                      hoverColor="#4392F1"
                      style={{marginBottom:5,color:'white'}}
                      icon={<i style={{color:'white'}} className="material-icons">&#xE147;</i>}
                    />
                    </div>
                    <div className="coinInfo">
                      <div className="userBox">
                        <h2 className="coinHead">{coin.name.toLocaleUpperCase()}</h2>
                      </div>
                      <img src={coin.image} className="coinImage" />
                      <p className="summary">"{coin.summary}"</p>
                      <a href={'https://' + coin.website} style={{fontSize:'14px',margin:'5px',marginLeft:'10px'}} className={componentClasses}> {coin.website}</a>
                      <p className={componentClasses}>Ticker: {coin.ticker.toLocaleUpperCase()}</p>
                      <p className={componentClasses}>Rank: {data.rank}</p>
                      <p className={componentClasses}>Market Cap: ${data.market_cap_usd} </p>
                      <p className={componentClasses}>Circulating Supply: {data.available_supply} </p>
                      <p className={componentClasses}>Volume (24H): {data['24h_volume_usd']} </p>
                      {coin.github === 'undefined' ? (<div />) : (<div style={{marginBottom:5}}><p className={componentClasses} style={{display:'inline',width:'30'}}>Code: </p><a href={'https://' + coin.github} className={componentClasses} style={{display:'inline',fontSize:'14px',marginBottom:'5px'}}> {coin.github}</a></div>)}
                      {coin.icoPrice === 'undefined' ? (<div />) : (<p className={componentClasses}>ICO Price: {coin.icoPrice}</p>)}
                      {coin.paper === null ? (<div />) : (<div style={{marginLeft:7}}><i className="material-icons">&#xE53B;</i><a href={coin.paper} style={{fontSize:'14px',display:'inline',paddingBottom:'15px',position:'absolute'}} className={componentClasses}> White Paper</a></div>)}
                      {p ? (<div><p className={componentClasses} style={{display:'inline'}}>Price:</p><p className={componentClasses} style={{color:myColor, display:'inline'}}>${data.price_usd} ({data.percent_change_24h}% 24H)  {way}</p></div>) : (<div />)}
                    </div>

                    {this.state.videoId === null || this.state.videoId === 'null' ? (
                      <div /> ) : (
                        <YouTube
                        videoId={this.state.videoId}
                        opts={opts}
                        onReady={this._onReady}
                        style={{marginTop:50}}
                        />)}

                    {coin.tweeter === 'null' ? (<div />) : (
                      <Timeline
                      dataSource={{
                        sourceType: coin.tweeter,
                        screenName: coin.tweeter,
                      }}
                      options={{
                        username: coin.tweeter,
                        height: '400',
                        maxWidth:432,
                      }}
                      onLoad={() => console.log('Timeline is loaded!')}
                      />)}
                    {gridPlace ? (
                      <div>
                        <div style={{width: '100%', height:200, display:'inline-block'}}>
                          <p style={{fontSize:18,textAlign:'left'}}>Explore!</p>
                          <GridListView
                          tilesData={tilesData}
                          style={gridStyle}
                          num={3}
                          update={this.state.update}
                          />
                        </div>
                      </div>
                      ) : (<div />)}

                  </div>

                  <div className="postHtml" style={{minWidth}} dangerouslySetInnerHTML={this.createMarkup()} />
                  {users.length === 0 ?
                    (
                      <div />
                    ) : (
                      <div className="contMenu" style={{minWidth}}>
                        <h2 className="contHead">CONTRIBUTORS</h2>
                        <div className="contributions">

                          {users.map(user => (
                            <div className="contributorsList">
                              <img src={`https://storage.googleapis.com/coinmarketpedia/rank${user.rank}.png`} style={{borderRadius:10, width:25,height:25}}/>
                              <Link to={`/users/${user.id}`} className="contributor">{user.username}</Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}


                  {gridPlace ? (<div />) : (<div>
                    <div style={{width: '100%', height:200, display:'inline-block'}}>
                      <p style={{fontSize:18,textAlign:'left'}}>Explore!</p>
                      <GridListView
                      tilesData={tilesData}
                      style={gridStyle}
                      num={3}
                      update={this.state.update}
                      />
                    </div>
                     </div>)}
                </div>
                  ) : (
                    <div>
                      <p className="pageDesc">Coin Does Not Exist <br /> <Link to={'/register'}>
                        Register Your Coin!</Link>
                      </p>
                    </div>
                    )}
            </div>
          </main>
        );
      }
    }
  }
}
