import React, { PropTypes } from 'react';
import { GridListView } from 'components';
import Auth from '../modules/auth.js';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import draftToHtml from 'draftjs-to-html';
import YouTube from 'react-youtube';
import { Link } from 'react-router';
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
      data: {},
      pctChange: '',
      coin: {},
      render: true,
      videoId: '',
      edit: true,
    };
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.xmlReq = this.xmlReq.bind(this);
  }

  xmlReq (params) {

    const req = new XMLHttpRequest();
    req.open('GET', `/api/coin/${params}`, true);
    req.responseType = 'json';
    req.setRequestHeader('Content-type', 'application/json');
    req.addEventListener('load', () => {
      if (req.status === 400) {
        this.setState({render:true});
      } else {
        const coin = req.response;
        let jsonData = '';
        const videoId = coin.videoId;
        if (req.response.htmlcode === null) {
          jsonData = '{"entityMap":{},"blocks":[{"key":"ftlv9","text":"No Information Available","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}';
        } else {
          jsonData = req.response.htmlcode;
          this.state.render = true;
        }
        let data = {}
        let pctChange = ''
        let raw = null;
        try {
          raw = JSON.parse(jsonData);
        } catch (e) {
          // You can read e for more info
          // Let's assume the error is that we already have parsed the payload
          // So just return that
          raw = jsonData;
        }
        document.title = coin.coinname.toLocaleUpperCase() + ' | COINMARKETPEDIA';
        const contentState = convertFromRaw(raw);
        const editorState = EditorState.createWithContent(contentState);
        fetch(`https://api.coinmarketcap.com/v1/ticker/${coin.name}/`).then(result => {

          return result.json()
        }).then( market => {
          if (market.error === 'id not found'){
             data = {};
            data.market_cap_usd = 'NaN';
            data['24h_volume_usd'] = 'NaN';
            data.price_usd = 'NaN';
            data.rank = 'NaN';
             pctChange = 'NaN';
            this.setState({data, pctChange})
          } else {

             data = market[0];
            data.market_cap_usd = numberWithCommas(data.market_cap_usd);
            data['24h_volume_usd'] = numberWithCommas(data['24h_volume_usd']);
             pctChange = data.percent_change_24h;
             console.log(data)
             this.setState({editorState, coin, videoId, render:false, data, pctChange});
          }

        })



      }
    });
    req.send();
  }

  componentDidMount () {
    window.scrollTo(0, 0)
    return this.xmlReq(this.props.routeParams.name)
  };

  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
    return this.xmlReq(nextProps.routeParams.name)

  }

  processForm (event) {
    event.preventDefault();
    const content = this.state.editorState.getCurrentContent();
    const raw = JSON.stringify(convertToRaw(content));
    const post = new XMLHttpRequest();
    post.open('POST', `/admin/coin/${this.props.routeParams.name}`, true);
    post.setRequestHeader('Content-type', 'application/json');
    post.responseType = 'json';
    post.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    post.addEventListener('load', () => {
      if (post.status === 200) {
        // success
        // change the component-container state
        this.setState({
          errors: {},
        });
        // Refresh the page /
        window.location.reload();
      } else {
        // failure
        // change the component state
        console.log('error happened sorry');
      }
    });
    post.send(raw);
  }



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

  render () {
    if(this.state.coin === {}){

      return null
    } else {


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
    let p = true
    if (pctChange.charAt(0) === '-') {
      myColor = 'red';
      way = '↓';
    } else if (pctChange === 'NaN') {
      p = false
    }
    const componentClasses = 'coinText';
    if (this.state.data === {} || this.state.coin === {}) {
      return null;
    } else {
      const data = this.state.data;
      const coin = this.state.coin;
      const actions = [
        <FlatButton
          label="Done"
          primary={true}
          onClick={this.handleClose}
        />,
      ];
      const iconStyle = {
        display: 'inline-block',
      };
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
      tilesData = tilesData.filter(function(item) {
          return item.coinname.toLowerCase() !== coin.coinname
      })
      const gridStyle = {
        image: {width:'98%', height:'125px',borderRadius:'5px'},
        text: {display:'none'},
        linkStyle: {},
        head: {fontSize:12,display:'center',textAlign:'center',position:'relative'},
        height: '210px'
        }
      return (
        <main>
          <div style={{minHeight:1000}}>
            {this.state.render ? (
              <div>
                <p className="pageDesc">Coin Does Not Exist <br /> <Link to={'/register'}>
                  Register Your Coin!</Link>
                </p>
              </div>
                ) : (
                  <div>
                    <div className="coinTop">
                      <div className="logos">
                        <FacebookShareButton style={iconStyle} url={window.location.href}><FacebookIcon  size={32} round={true} /> </FacebookShareButton>
                        <TwitterShareButton style={iconStyle} url={window.location.href}><TwitterIcon  size={32} round={true} /> </TwitterShareButton>
                        <RedditShareButton style={iconStyle} url={window.location.href}><RedditIcon  size={32} round={true} /> </RedditShareButton>
                        <TelegramShareButton style={iconStyle} url={window.location.href}><TelegramIcon  size={32} round={true} /> </TelegramShareButton>
                        <WhatsappShareButton style={iconStyle} url={window.location.href}><WhatsappIcon  size={32} round={true} /> </WhatsappShareButton>
                        <LinkedinShareButton style={iconStyle} url={window.location.href}><LinkedinIcon  size={32} round={true} /> </LinkedinShareButton>
                        <EmailShareButton style={iconStyle} url={window.location.href}><EmailIcon  size={32} round={true} /> </EmailShareButton>
                      </div>
                      <div className="coinInfo">
                        <h2 className="coinHead">{coin.coinname.toLocaleUpperCase()}</h2>
                        <img src={coin.image} className="coinImage" />
                        <a href={'https://'+coin.website} style={{fontSize:'14px',margin:'5px',marginLeft:'10px'}} className={componentClasses}> {coin.website}</a>
                        <p className={componentClasses}>Ticker: {coin.ticker.toLocaleUpperCase()}</p>
                        <p className={componentClasses}>Rank: {data.rank}</p>
                        <p className={componentClasses}>Market Cap: ${data.market_cap_usd} </p>
                        <p className={componentClasses}>Volume (24H): {data['24h_volume_usd']} </p>

                        {p ? (<div><p className={componentClasses} style={{display:'inline'}}>Price:</p><p className={componentClasses} style={{color:myColor, display:'inline'}}>${data.price_usd} ({data.percent_change_24h}% 24H)  {way}</p></div>):(<div />)}

                      </div>
                      {this.state.videoId === null || this.state.videoId === 'null' ? (
                        <div/> ):(
                          <YouTube
                          videoId={this.state.videoId}
                          opts={opts}
                          onReady={this._onReady}
                          style={{marginTop:50}}
                          />)}
                          <div style={{width: '100%', height:200}}>
                            <p style={{fontSize:18,textAlign:'center'}}>Learn More!</p>
                            <GridListView
                            tilesData={tilesData}
                            style={gridStyle}
                            num={3}
                            />
                          </div>
                    </div>
                    <div  className="postHtml" dangerouslySetInnerHTML={this.createMarkup()} />
                  </div>
              )}
          </div>
        </main>
      );
    }
    }
  }
}
