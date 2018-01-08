import React, { PropTypes } from 'react';
import { Table, TableList, Footer } from 'components';
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
    this.logState = () => {
            const content = this.state.editorState.getCurrentContent();
            console.log(convertToRaw(content));
            console.log(this.state.editorState)
          };
    this.createMarkup = this.createMarkup.bind(this);
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
      console.log(req.response)
    })
    req.send();

  };

  processForm (event) {
    event.preventDefault();
    console.log(this.state.editorState)
    const content = this.state.editorState.getCurrentContent();
    console.log(content)
    const raw = convertToRaw(content)
    const post = new XMLHttpRequest();
    console.log(raw)
    post.open('POST', `/admin/coin/${this.props.routeParams.name}`, true);
    post.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    post.responseType = 'json';
    post.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    post.addEventListener('load', () => {
      if (req.status === 200) {
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
    })
    post.send(raw)
  }

  createMarkup() {
    return {__html: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))};
  }
  consoleIt(){
    console.log(this.state.editorState)
  }


  onEditorStateChange(editorState){
    editorState = convertFromRaw(editorState)
    this.setState({
      editorState,
    });
  };

  render () {

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
        <div>

          <div>
           <RaisedButton label="Edit Post" onClick={this.handleOpen} className='editButton'/>
           <RaisedButton label="Save Post" onClick={this.onEditorStateChange} className='editButton'/>
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
            onEditorStateChange={this.onEditorStateChange}
            />
           </Dialog>
        </div>
          <div className='postHtml' dangerouslySetInnerHTML={this.createMarkup()}>
          </div>
        </div>
        </main>

      );
    }
  }
