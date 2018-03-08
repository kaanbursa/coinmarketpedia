import React, { PropTypes } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
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
import DocumentMeta from 'react-document-meta';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import { browserHistory, Router } from 'react-router';
import {List, ListItem} from 'material-ui/List';


export default class Glossary extends React.Component {

  constructor (props) {

    super(props);
    // Set the table list to empty array
    this.state = {
      error: '',
      term: '',
      description: {},
      terms:[],
    };
    this.xmlReq = this.xmlReq.bind(this);
    this.onChange = this.onChange.bind(this);
    this.processForm = this.processForm.bind(this);
    this.onDocumentLoad = this.onDocumentLoad.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }

  xmlReq (params) {
    window.scrollTo(0,0);

    const req = new XMLHttpRequest();
    req.open('GET', `/api/term/${params}`, true);
    req.responseType = 'json';
    req.setRequestHeader('Content-type', 'application/json');
    req.addEventListener('load', () => {
      if (req.status === 200) {

        const term = req.response.term;
        const description = JSON.parse(req.response.description);

        this.setState({term, description});
      } else {
        this.setState({error:'An error occured loading.'});
      }
    });
    req.send();
  }

  componentDidMount () {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/term', true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const terms = xhr.response;
        this.setState({terms});
      } else {
        this.setState({error:'An error occured loading.'});
      }

    });
    xhr.send();
    return this.xmlReq(this.props.routeParams.name);


  };

  componentWillReceiveProps (nextProps) {
    return this.xmlReq(nextProps.routeParams.name);
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
        const success = post.response.success;
        // change the component-container state
        this.setState({
          errors: '',
          success,
          suggestion: {
            from: '',
            to: '',
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

  handleClick (value) {

    const target = value.toLowerCase().replace(/\s/g, '');
    browserHistory.push(`/glossary/${target}`);
    return window.location.reload();
  }

  _onReady (event) {
    // access to player in all event handlers via event.target
    event.target.stopVideo();
  }

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  }

  render () {

    if (this.state.terms === undefined || this.state.term === undefined) {
      return null;
    } else {
      const term = this.state.term;
      const description = this.state.description;
      const terms = this.state.terms;
      return (
        <main>
          <div style={{display:'inline'}}>
            <div className="glossaryList">
              <List>
                {terms.map((list,i) => (
                  <ListItem key={i} primaryText={list.term.toLocaleUpperCase()} onClick={this.handleClick.bind(this, list.term)}
                  rightIcon={<ActionInfo />}
                  />
                ))}
              </List>
            </div>
            <div className="postHtml" style={{paddingTop:0}}>
              <h1 className="glossaryHead">{term.toLocaleUpperCase()}</h1>
              <p style={{lineHeight:2}}> {description.info} </p>
            </div>
          </div>
        </main>
      );
    }

  }
}
