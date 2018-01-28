import React, { PropTypes } from 'react';
import { Footer } from 'components';
import Auth from '../modules/auth.js';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Link } from 'react-router';

function numberWithCommas (x) {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'Blockquote') {
    return 'superFancyBlockquote';
  }
}

export default class Post extends React.Component {

  constructor (props) {
    super(props);
    // Set the table list to empty array
    this.state = {
      editorState: EditorState.createEmpty(),
      open: false,
      data: {},
      pctChange: "",
      coin: {},
      render: true

    };
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
  }
  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  componentDidMount () {
    const req = new XMLHttpRequest();
    req.open('GET', `/api/coin/${this.props.routeParams.name}`, true);
    req.responseType = 'json';
    req.setRequestHeader('Content-type', 'application/json');
    req.addEventListener('load', () => {
      console.log(req.response)
      let coin = req.response[0]
      let jsonData = ''
      if(req.response[0].htmlcode === null){
         jsonData = '{"entityMap":{},"blocks":[{"key":"ftlv9","text":"No Information Available","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}'
      } else {
         jsonData = req.response[0].htmlcode;
         this.state.render = true;
      }
      const data = req.response[1];
      data.market_cap_usd = numberWithCommas(data.market_cap_usd);
      let pctChange = data.percent_change_24h
      let raw = null;
      try {
        raw = JSON.parse(jsonData);
      } catch (e) {
        // You can read e for more info
        // Let's assume the error is that we already have parsed the payload
        // So just return that
        raw = jsonData;
      }
      const contentState = convertFromRaw(raw);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({editorState, data, pctChange, coin});
    });
    req.send();
  };

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

  render () {
    let myColor = 'green'
    let way = '↑'
    let pctChange = this.state.pctChange
    if(pctChange.charAt(0) === '-'){
      myColor = 'red';
      way = '↓';
    }
    let componentClasses = 'coinText';
    if (this.state.data === {}) {
      return (null);
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

      return (
        <main>
          <div>
            <div>
              {Auth.isUserAuthenticated() ? (<div className="editBar">
                <RaisedButton label="Edit Post" onClick={this.handleOpen} className="editButton" />
                <RaisedButton label="Save Post" onClick={this.processForm.bind(this)} className="saveBut" />
              </div>) : (<div />)}
              {this.state.render ? (
                <div className="coinInfo">
                  <h2 className="coinHead">{data.name}</h2>
                  <img src={coin.image} className="coinImage"></img>
                  <p className={componentClasses}>Ticker: {data.symbol}</p>
                  <p className={componentClasses}>Rank: {data.rank}</p>
                  <p className={componentClasses}>Price: ${data.price_usd}</p>
                  <p className={componentClasses} style={{color:myColor}}>Market Cap: ${data.market_cap_usd} ({pctChange}%) {way}</p>
                </div>
                ) : (
                  <div>
                  <p className="pageDesc">Coin Does Not Exist <br></br> <Link to={`/register`}>
                    Register Your Coin!
                  </Link></p>
                  </div>

              )}
              <Dialog
               title={'Edit'}
               actions={actions}
               modal={false}
               open={this.state.open}
               onRequestClose={this.handleClose}
               autoScrollBodyContent={true}
              >
                <Editor
                editorState={this.state.editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={this.onEditorStateChange.bind(this)}
                blockStyleFn={myBlockStyleFn}
                />
              </Dialog>
            </div>
            <div  className="postHtml" dangerouslySetInnerHTML={this.createMarkup()} />
          </div>
        </main>
      );
  }
}
}
