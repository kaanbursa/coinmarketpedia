import React, { PropTypes } from 'react';
import { GridListView, SuggestionBox } from 'components';
import Auth from '../modules/auth.js';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import draftToHtml from 'draftjs-to-html';
import YouTube from 'react-youtube';
import { Link } from 'react-router';
import {Tabs, Tab} from 'material-ui/Tabs';
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
import { Document, Page } from 'react-pdf';


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
        from: '',
        to: '',
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
    };
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.xmlReq = this.xmlReq.bind(this);
    this.onChange = this.onChange.bind(this);
    this.processForm = this.processForm.bind(this);
    this.onDocumentLoad = this.onDocumentLoad.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  xmlReq (params) {
    window.scrollTo(0,0)
    const xhr = new XMLHttpRequest ();
    xhr.open('GET','/api/home/coins', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        const gridView = xhr.response;
        // change the component-container state
        this.setState({gridView})

      } else {
        // failure
        this.setState({gridView:[]})
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
        let jsonData = '';
        const videoId = coin.videoId;
        if (req.response.htmlcode === null) {
          jsonData = '{"entityMap":{},"blocks":[{"key":"ftlv9","text":"No Information Available","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}';
        } else {
          jsonData = req.response.htmlcode;
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
        document.title = coin.name.toLocaleUpperCase() + ' | COINMARKETPEDIA';
        const contentState = convertFromRaw(raw);
        const editorState = EditorState.createWithContent(contentState);

        fetch(`https://api.coinmarketcap.com/v1/ticker/${coin.coinname}/`).then(result => {

          return result.json()
        }).then( market => {
          console.log(market)
          if (market.error === 'id not found'){
             data = {};
            data.market_cap_usd = 'NaN';
            data['24h_volume_usd'] = 'NaN';
            data.price_usd = 'NaN';
            data.rank = 'NaN';
            data.available_supply = 'NaN';
             pctChange = 'NaN';
            this.setState({editorState, coin, videoId, render:true, data, pctChange, update:true,suggestion: {
              from: '',
              to: '',
            }});
          } else {
             data = market[0];
            data.market_cap_usd = numberWithCommas(data.market_cap_usd);
            data.available_supply = numberWithCommas(data.available_supply);
            data['24h_volume_usd'] = numberWithCommas(data['24h_volume_usd']);
             pctChange = data.percent_change_24h;
             this.setState({editorState, coin, videoId, render:true, data, pctChange, update:true, suggestion: {
               from: '',
               to: '',
             }});
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
    return this.xmlReq(nextProps.routeParams.name)
  }



  processForm (event) {
    event.preventDefault();

    const from = encodeURIComponent(this.state.suggestion.from);
    const to = encodeURIComponent(this.state.suggestion.to);
    const dataGrid = `from=${from}&to=${to}`;
    const post = new XMLHttpRequest();
    post.open('POST', `/user/suggestion/${this.props.routeParams.name}`, true);
    post.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    post.responseType = 'json';
    post.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    post.addEventListener('load', () => {
      if (post.status === 200) {
        // success
        const success = post.response.success
        // change the component-container state
        this.setState({
          errors: '',
          success,
          suggestion: {
            from: '',
            to: '',
          }
        });
        // Refresh the page /

      } else {
        // failure
        const errors = post.response.errors
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
    if(this.state.error === 'no coin founded'){
      console.log(this.state.error)
      return (<div>
        <p className="pageDesc">Coin Does Not Exist <br /> <Link to={'/register'}>
          Register Your Coin!</Link>
        </p>
      </div>)
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
    let p = true
    if (pctChange.charAt(0) === '-') {
      myColor = 'red';
      way = '↓';
    } else if (pctChange === 'NaN') {
      p = false
    }
    const componentClasses = 'coinText';
    if (Object.keys(this.state.coin).length === 0 || this.state.gridView.length === 0) {
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
      let tilesData = this.state.gridView

      const path = window.location.href
      const meta = {
      title: `What is ${coin.name}?`,
      description: `${coin.name} information & technology & history & team & investors & vision`,
      canonical: path,
      meta: {
        charset: 'utf-8',
        name: {
          keywords: `${coin.name},ICO Price,cryptocurrency,blockchain,cryptoasset `
        }
      }
    };


      tilesData = tilesData.filter(function(item) {
          return item.coinname !== coin.coinname
      })
      const gridStyle = {
        image: {minWidth:'98%', height:'125px',borderRadius:'5px'},
        text: {display:'none'},
        linkStyle: {},
        head: {fontSize:12,display:'center',textAlign:'center',position:'relative'},
        height: '210px'
        }
        let gridPlace = true
        if(window.innerWidth < 500){
          gridPlace = false
        } else {
          gridPlace = true
        }


      return (
        <main>
          <div style={{minHeight:1775}}>
            {this.state.render ? (
                                <div>
                                <DocumentMeta {...meta} />
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
                                      <p className={componentClasses}>Circulating Supply: {data.available_supply} </p>
                                      <p className={componentClasses}>Volume (24H): {data['24h_volume_usd']} </p>

                                      {coin.github === 'undefined' ? (<div />):(<div style={{marginBottom:5}}><p className={componentClasses} style={{display:'inline',width:'30'}}>Github: </p><a href={'https://'+coin.github} className={componentClasses} style={{display:'inline',fontSize:'14px',marginBottom:'5px'}}> {coin.github}</a></div>)}
                                      {coin.icoPrice === 'undefined' ? (<div />):(<p className={componentClasses}>ICO Price: {coin.icoPrice}</p>)}
                                      {coin.paper == null ? (<div />):(<div style={{marginLeft:7}}><i class="material-icons">&#xE53B;</i><a href={coin.paper} style={{fontSize:'14px',display:'inline',paddingBottom:'15px',position:'absolute'}} className={componentClasses}> White Paper</a></div>)}
                                      {p ? (<div><p className={componentClasses} style={{display:'inline', marginBottom:2}}>Price:</p><p className={componentClasses} style={{color:myColor, display:'inline'}}>${data.price_usd} ({data.percent_change_24h}% 24H)  {way}</p></div>):(<div />)}


                                    </div>
                                    {this.state.videoId === null || this.state.videoId === 'null' ? (
                                      <div/> ):(
                                        <YouTube
                                        videoId={this.state.videoId}
                                        opts={opts}
                                        onReady={this._onReady}
                                        style={{marginTop:50}}
                                        />)}

                                        {coin.tweeter === 'null' ? (<div />):(
                                          <Timeline
                                            dataSource={{
                                              sourceType: coin.tweeter,
                                              screenName: coin.tweeter
                                            }}
                                            options={{
                                              username: coin.tweeter,
                                              height: '400',
                                              maxWidth:432
                                            }}
                                            onLoad={() => console.log('Timeline is loaded!')}
                                          />)}
                                          {gridPlace ? (<div style={{width: '100%', height:200}}>
                                            <p style={{fontSize:18,textAlign:'left'}}>Explore!</p>
                                            <GridListView
                                            tilesData={tilesData}
                                            style={gridStyle}
                                            num={3}
                                            update={this.state.update}
                                            />
                                          </div>):(<div />)}


                                        {Auth.isUserAuthenticated() ? (
                                          <SuggestionBox
                                          onSubmit={this.processForm}
                                          onChange={this.onChange}
                                          coin={this.state.suggestion}
                                          success={this.state.success}
                                          error={this.state.errors}
                                          />
                                        ):(
                                          <p className="pageDesc">Sign In to  <br /> <Link to={'/register'}>
                                            Suggest an Edit!</Link>
                                          </p>
                                        )}


                                  </div>
                                  
                                  <div className="postHtml"  dangerouslySetInnerHTML={this.createMarkup()} />
                                  {gridPlace ? (<div />):(<div style={{width: '100%', height:200}}>
                                    <p style={{fontSize:18,textAlign:'left'}}>Explore!</p>
                                    <GridListView
                                    tilesData={tilesData}
                                    style={gridStyle}
                                    num={3}
                                    update={this.state.update}
                                    />
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
