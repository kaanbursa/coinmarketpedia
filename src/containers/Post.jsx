import React, { PropTypes } from 'react';
import { GridListView, Contribute, Contribution, Chart } from 'components';
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
import { Timeline } from 'react-twitter-widgets';
import DocumentMeta from 'react-document-meta';
import ReactTooltip from 'react-tooltip';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { SyncLoader } from 'react-spinners';




function numberWithCommas (x) {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
let tabStyle = {}

if (window.innerWidth < 500) {
   tabStyle = {
    default_tab:{color:'#69626D',width:window.innerWidth / 3,fontSize:10},
    active_tab:{
        color: '#6E75A8',
        border: '1px solid',
        borderBottom: 'none',
        borderColor: '#F4F4EF',
        borderRadius: 2,
        width: window.innerWidth / 3,
        fontSize: 12
    }
  }
} else {
   tabStyle = {
  default_tab:{color:'#69626D',width:120,fontSize:10},
  active_tab:{
      color: '#6E75A8',
      border: '1px solid',
      borderBottom: 'none',
      borderColor: '#F4F4EF',
      borderRadius: 2,
      width: 120,
      fontSize: 12
  }
}

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
        reference: '',
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
      recapca: !true,
      isLoading: false,
      contributions: [],
      page: 10,
      id: 0,
      chart: [],

    };
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.xmlReq = this.xmlReq.bind(this);
    this.onChange = this.onChange.bind(this);
    this.processForm = this.processForm.bind(this);
    this.onDocumentLoad = this.onDocumentLoad.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.getContributions = this.getContributions.bind(this);
    this.getData = this.getData.bind(this);
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

    const req = new XMLHttpRequest();
    req.open('GET', `/api/coin/${params}`, true);
    req.responseType = 'json';
    req.setRequestHeader('Content-type', 'application/json');
    req.addEventListener('load', () => {
      if (req.status === 404) {
        console.log(req.response)
        this.setState({render:false, error:req.response.error, isLoading:false});

      } else {
        const coin = req.response;
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
        console.log('0x')
        // fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coin.ticker}&tsyms=USD`).then(result => {
        //   return result.json();
        // }).then(market => {
        //   console.log(market)
        // })
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
            this.setState({editorState, coin, videoId, render:true, data, pctChange, update:true, users,isLoading:false,});
          } else {
            data = market[0];
            data.market_cap_usd = numberWithCommas(data.market_cap_usd);
            data.available_supply = numberWithCommas(data.available_supply);
            data['24h_volume_usd'] = numberWithCommas(data['24h_volume_usd']);
            pctChange = data.percent_change_24h;
            this.setState({editorState, coin, videoId, render:true, data, pctChange, update:true, users,isLoading:false,});
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
            this.setState({editorState, coin, videoId, render:true, data, pctChange, update:true, users,isLoading:false,});
          };
        });



      }
    });
    req.send();

    const xhr = new XMLHttpRequest ();
    xhr.open('GET', `/api/similar/${params}`, true);
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
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    return this.xmlReq(this.props.routeParams.name);


  };

  componentWillReceiveProps (nextProps) {
    this.setState({contributions:[],chart:[]})
    return this.xmlReq(nextProps.routeParams.name);
  }

  getContributions () {

    if (this.state.contributions.length  === 0) {
      this.setState({isLoading:true})
      const params = this.props.routeParams.name;
      const page = this.state.page;
      const req = new XMLHttpRequest();
      req.open('GET', `/api/contribution/${params}/${page}`, true);
      req.responseType = 'json';
      req.setRequestHeader('Content-type', 'application/json');
      req.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
      req.addEventListener('load', () => {
        if (req.status === 200) {
          // success
          const contributions = req.response[0].contributions;
          const id = req.response[1]


          // change the component-container state
           this.setState({contributions, isLoading:false, id});

        } else {
          // failure
          this.setState({contributions:[], isLoading:false});
        }
      });
      req.send()
    } else {
      return true
    }


  }



  upVote (contId,userId) {

    const dataGrid = `userId=${userId}&contributionId=${contId}`;
    const xhr = new XMLHttpRequest ();
    xhr.open('POST', `/user/upvote` , true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        NotificationManager.create({
          id: 1,
          type: "success",
          message: "Your have upvoted!",
          title: "Success!",
          timeOut: 3000,
        });

      } else {
        // failure
        NotificationManager.create({
          id: 1,
          type: "error",
          message: "Something went wrong!",
          title: "Error!",
          timeOut: 3000,
        });
      }
    });
    xhr.send(dataGrid);
  }

  downVote (contId,userId) {
    const dataGrid = `userId=${userId}&contributionId=${contId}`;
    const xhr = new XMLHttpRequest ();
    xhr.open('POST', `/user/downvote` , true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        NotificationManager.create({
          id: 1,
          type: "success",
          message: "Your have downvoted!",
          title: "Success!",
          timeOut: 3000,
        });

      } else {
        // failure
        NotificationManager.create({
          id: 1,
          type: "error",
          message: "Something went wrong!",
          title: "Error!",
          timeOut: 3000,
        });
      }
    });
    xhr.send(dataGrid);
  }


  // for chart
  getData (){
    if(this.state.chart.length === 0){
      const ticker = this.state.coin.ticker;
      this.setState({isLoading:true})
      fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=${ticker}&tsym=USD`).then(result => {
        return result.json();
      }).then(market => {
        this.setState({chart:market.Data, isLoading:false})
      }).catch(err => {
        this.setState({chart:[], isLoading:false})
        console.log(err);
      });
    } else {
      return null
    }

  }


  processForm (event) {
    this.setState({isLoading:true})
    event.preventDefault();

    const information = this.state.suggestion;
    const sum = encodeURIComponent(this.state.suggestion.sum);
    const technology = encodeURIComponent(this.state.suggestion.technology);
    const ico = encodeURIComponent(this.state.suggestion.ico);
    const upcoming = encodeURIComponent(this.state.suggestion.upcoming);
    const other = encodeURIComponent(this.state.suggestion.other);
    const dataGrid = `id=${this.state.coin.id}&summary=${sum}&technology=${technology}&ico=${ico}&upcoming=${upcoming}&other=${other}`;
    const post = new XMLHttpRequest();
    post.open('POST', `/user/contribution/${this.props.routeParams.name}`, true);
    post.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    post.responseType = 'json';
    post.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    post.addEventListener('load', () => {
      if (post.status === 200) {
        // success
        const success = post.response.success;
        const rank = post.response.first;

        // change the component-container state
        this.setState({
          errors: '',
          success,
          isLoading:false,
          suggestion: {
            sum: '',
            technology: '',
            upcoming: '',
            ico: '',
            other: '',
            reference: '',
          },
          success: 'Thank you for sharing your knowledge',
        });
        // Create norification and close drawer /
        this.handleClose();
        NotificationManager.create({
          id: 1,
          type: "success",
          message: "Your contribution is submitted successfuly!",
          title: "Success!",
          timeOut: 3000,
        });
        if(rank){
          NotificationManager.create({
            id: 2,
            type: "success",
            message: rank,
            title: "Congrats!",
            timeOut: 3000,
          });
        }

      } else {
        // failure
        const errors = post.response.errors;

        NotificationManager.create({
          id: 1,
          type: "error",
          message: errors,
          title: "Error!",
          timeOut: 3000,
        });
        // change the component state
        this.setState({
          errors,
          isLoading:false
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

  getStyle (isActive) {
    return isActive ? tabStyle.active_tab : tabStyle.default_tab
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
    event.target.stopVideo()
  }

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  }

  render () {
    if (this.state.error === 'No coin founded') {

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
          autoplay: 0,
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
        let tabClass = {backgroundColor:'white',borderBottom:'1px solid',width:'100%',borderColor:'#F4F4EF'}
        if (window.innerWidth < 1030 && window.innerWidth > 570) {
          coinTopMargin = '25%';
          coinWidth = '50%';
          minWidth = window.innerWidth - window.innerWidth * 0.11;
          coinTopClass = 'coinTopPhone';
        } else if (window.innerWidth < 570) {
          coinTopMargin = '0px';
          coinWidth = '100%';
          minWidth = window.innerWidth - window.innerWidth * 0.11;
          coinTopClass = 'coinTopPhone';
        }
        const ranks = ['Novice','Astronaut','Crypto King','Roman Ruler','Einstein','Human-Level-AI'];
        tilesData = tilesData.filter(item => {
          return item.coinname !== coin.coinname;
        });
        const gridStyle = {

          text: {display:'none'},
          linkStyle: {fontSize:10,wordWrap:'break-word',maxWidth:100},
          head: {fontSize:10,wordWrap:'break-word',maxWidth:100,textOverflow:'ellipsis',display:'block',overflow:'hidden'},
          height: '210px',
        };
        let gridPlace = true;
        if (window.innerWidth < 500) {
          gridPlace = false;
          tabClass = {backgroundColor:'white',borderTop:'1px solid',width:'100%',borderColor:'#F4F4EF',position:'fixed',bottom:0,zIndex:999,left:0}
        } else {
          gridPlace = true;
        }


      let { tab } = this.state
        return (
          <main>
            <div style={{minHeight:1775, width:'90%', margin:'auto'}}>
              {this.state.render ? (
                <div>
                    <Tabs
                    value={this.state.tab}
                    onChange={this.handleChange}
                    tabItemContainerStyle={tabClass}
                    inkBarStyle={{backgroundColor:'none',}}
                    >
                      <Tab
                        icon={<i style={{color:'#69626D'}} className="material-icons">&#xE8D2;</i>}
                        label="Summary"
                        value="a"
                        style={ this.getStyle(tab === 'a') }
                      >

                      <NotificationContainer />
                      <div className='sweet-loading' style={{width:60,marginTop:30,margin:'auto'}}>
                        <SyncLoader
                          color={'#7D8A98'}
                          loading={this.state.isLoading}
                        />
                      </div>

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
                                {this.state.success && <p className="success-message" >{this.state.success}</p>}
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
                              label="Edit or Add New Information"
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
                              <h2 className="coinHead">{coin.name.toLocaleUpperCase()}</h2>
                              <img src={coin.image} className="coinImage" />
                              <p className="summary">"{coin.summary}"</p>
                              <p className={componentClasses}><a href={'https://' + coin.website} style={{fontSize:'14px'}}> {coin.website}</a></p>
                              <p className={componentClasses}>Ticker: {coin.ticker.toLocaleUpperCase()}</p>
                              <p className={componentClasses}>Rank: {data.rank}</p>
                              <p className={componentClasses}>Market Cap: ${data.market_cap_usd} </p>
                              <p className={componentClasses}>Circulating Supply: {data.available_supply} </p>
                              <p className={componentClasses}>Volume (24H): {data['24h_volume_usd']} </p>
                              {coin.github === 'undefined' ? (<div />) : (<div style={{margin:'auto',width:'90%'}}><p className={componentClasses} style={{display:'inline',width:'30px'}}>Code: </p><a href={'https://' + coin.github} className={componentClasses} style={{display:'inline',fontSize:'14px',marginBottom:'5px'}}> {coin.github}</a></div>)}
                              {coin.icoPrice === 'undefined' ? (<div />) : (<p className={componentClasses}>ICO Price: {coin.icoPrice}</p>)}
                              {coin.paper === null ? (<div />) : (<div style={{marginLeft:10}}><i className="material-icons" style={{marginTop:10,marginLeft:5}}>&#xE53B;</i><a href={coin.paper} style={{fontSize:'14px',display:'inline',paddingBottom:'15px',position:'absolute',width:100}} className={componentClasses}> White Paper</a></div>)}
                              {p ? (<div style={{margin:'auto',width:'90%',marginBottom:10}}><p className={componentClasses} style={{display:'inline'}}>Price:</p><p className={componentClasses} style={{color:myColor, display:'inline'}}> ${data.price_usd} ({data.percent_change_24h}% 24H)  {way}</p></div>) : (<div />)}
                            </div>
                            {users.length === 0 ?
                              (
                                <div />
                              ) : (
                                <div className="contMenu" style={{width:'100%'}}>
                                  <h2 className="contHead">CONTRIBUTORS</h2>
                                  <div className="contributions">

                                    {users.map(user => (
                                      <div className="contributorsList">


                                        <img src={`https://storage.googleapis.com/coinmarketpedia/rank${user.rank}.png`} style={{borderRadius:10, width:25,height:25}}/>
                                        {user.username === null ? (<Link  to={`/users/${user.id}`} className="contributor">{ranks[user.rank]}</Link>) : (<Link  to={`/users/${user.id}`} className="contributor">{user.username}</Link>)}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
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
                                  <p style={{fontSize:18,textAlign:'left'}}>Similar Coins</p>
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

                    {gridPlace ? (<div />) : (<div>
                      <div style={{width: '100%', height:200, display:'inline-block'}}>
                        <p style={{fontSize:18,textAlign:'left'}}>Similar Coins</p>
                        <GridListView
                        tilesData={tilesData}
                        style={gridStyle}
                        num={3}
                        update={this.state.update}
                        />
                      </div>
                       </div>)}
                  </div>
                    </Tab>
                    <Tab
                      icon={<i style={{color:'#69626D'}} className="material-icons">&#xE877;</i>}
                      label="Contributions"
                      value="b"
                      style={ this.getStyle(tab === 'b') }
                      onActive={this.getContributions}
                    >
                      <Contribution
                        contributions={this.state.contributions}
                        isLoading={this.state.isLoading}
                        onSubmit={this.upVote}
                        userId={this.state.id}
                        downVote={this.downVote}
                      />
                    </Tab>
                    <Tab
                      icon={<i style={{color:'#69626D'}} className="material-icons">&#xE6E1;</i>}
                      label="Charts"
                      value="c"
                      style={ this.getStyle(tab === 'c') }
                      onActive={this.getData}
                    >
                    <Chart
                    isLoading={this.state.isLoading}
                    data={this.state.chart}
                    coindetail={coin}
                    />
                    </Tab>
                  </Tabs>
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
