import React from 'react';
import Auth from '../modules/auth.js';
import EditCoin from '../components/EditCoin.jsx';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import RaisedButton from 'material-ui/RaisedButton';

function myBlockStyleFn (contentBlock) {
  const type = contentBlock.getType();
  if (type === 'Blockquote') {
    return 'superFancyBlockquote';
  }
}

class EditPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor (props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    // set the initial component state
    this.state = {
      editorState: EditorState.createEmpty(),
      errors: {},
      successMessage,
      coin: {},
    };
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  componentDidMount () {
    const req = new XMLHttpRequest();
    req.open('GET', `/admin/edit/${this.props.routeParams.name}`, true);
    req.responseType = 'json';
    req.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    req.setRequestHeader('Content-type', 'application/json');
    req.addEventListener('load', () => {
      if (req.status === 200) {
        const coin = req.response;
        let jsonData = '';
        if (req.response.htmlcode === null) {
          jsonData = '{"entityMap":{},"blocks":[{"key":"ftlv9","text":"No Information Available","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}';
        } else {
          jsonData = req.response[0].htmlcode;
          this.state.render = true;
        }
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
        this.setState({coin, editorState });
      } else {
        this.context.router.replace('/');
      }
    });
    req.send();
  };

  onEditorStateChange (editorState)  {
    this.setState({
      editorState,
    });
  };

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm (event) {

    // prevent default action. in this case, action is the form submission event
    event.preventDefault();


    // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.coin.coinname);
    const ticker = encodeURIComponent(this.state.coin.ticker);
    const image = encodeURIComponent(this.state.coin.image);
    const videoId = encodeURIComponent(this.state.coin.videoId);
    const website = encodeURIComponent(this.state.coin.website);
    const tweeter = encodeURIComponent(this.state.coin.tweeter);
    const formData = `name=${name}&ticker=${ticker}&image=${image}&videoId=${videoId}&website=${website}&tweeter=${tweeter}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/admin/edit/${this.props.routeParams.name}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {},
        });

        // change the current URL to /
        window.location.reload();
      } else {
        // failure
        // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors,
        });
      }
    });
    xhr.send(formData);
  }

  processDraft (event) {
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

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser (event) {
    const field = event.target.name;
    const coin = this.state.coin;
    coin[field] = event.target.value;

    this.setState({
      coin,
    });
  }

  /**
   * Render the component.
   */
  render () {
    if (this.state.coin === undefined) {
      return true;
    } else {
      return (
        <div style={{width:'90%',margin:'auto'}}>
          <EditCoin
            onSubmit={this.processForm}
            onChange={this.changeUser}
            errors={this.state.errors}
            successMessage={this.state.successMessage}
            coin={this.state.coin}
          />
          <div style={{marginTop:'20px'}}>
            <RaisedButton label="Save Post" onClick={this.processDraft.bind(this)} style={{position:'relative',marginTop:'20px'}} />
            <Editor
            editorState={this.state.editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={this.onEditorStateChange.bind(this)}
            blockStyleFn={myBlockStyleFn}
            />
          </div>
        </div>
      );
    }
  }
}

EditPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default EditPage;
