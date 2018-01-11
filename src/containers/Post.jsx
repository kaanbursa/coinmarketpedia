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


export default class Post extends React.Component {

  constructor (props) {
    super(props);
    // Set the table list to empty array
    this.state = {
      editorState: EditorState.createEmpty(),
      open: false,
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
    req.addEventListener('load', () => {
      const raw = JSON.parse(req.response.htmlcode);
      const contentState = convertFromRaw(raw);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({editorState});
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
    const styles = {
      root: {
        fontFamily: '\'Georgia\', sans-serif',
      },
      editor: {
        border: '1px solid #ccc',
        cursor: 'text',
        minHeight: 380,
        width: 600,
        padding: 10,
      },
      button: {
        marginTop: 10,
        textAlign: 'center',
      },
    };

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.logState}
      />,
    ];
    return (
      <main>
        <div style={{minHeight:800}}>
          <div>
            {Auth.isUserAuthenticated() ? (<div className="editBar">
              <RaisedButton label="Edit Post" onClick={this.handleOpen} className="editButton" />
              <RaisedButton label="Save Post" onClick={this.processForm.bind(this)} className="saveBut" />
            </div>) : (<div />)}
            <Dialog
             title={'Edit'}
             actions={actions}
             modal={false}
             open={this.state.open}
             onRequestClose={this.handleClose}
            >
              <Editor
              editorState={this.state.editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={this.onEditorStateChange.bind(this)}
              style={styles.editor}
              />
            </Dialog>
          </div>
          <div style={styles.root} className="postHtml" dangerouslySetInnerHTML={this.createMarkup()} />
        </div>
      </main>
    );
  }
}
