import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Auth from '../modules/auth.js';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';
import FontIcon from 'material-ui/FontIcon';
import { Collapse } from 'react-collapse';
import { browserHistory, Router } from 'react-router';
import { EditorState, RichUtils, convertToRaw} from 'draft-js';
import Pagination from 'react-pagination-status';
import { SyncLoader } from 'react-spinners';
import TimeAgo from 'react-timeago';
import { Editor } from 'react-draft-wysiwyg';

class Discussion extends Component {

  constructor (props, context) {


    super(props, context);

      this.state = {
        comment: {},
        title:  '',
        createPost: false,
        editorState: EditorState.createEmpty(),
        page: 1,
        comments: [],
        user: [],
        pagination: {},
        create: true,
        render: true,
    };
    this.onChange = (editorState) => this.setState({editorState});
    this.onTitleChange =  this.onTitleChange.bind(this);
    this.expand = this.expand.bind(this);
    this.processDraft = this.processDraft.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.xmlreq = this.xmlreq.bind(this);
  }

  xmlreq (coinid,page) {

    console.log(page)
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/comments/${coinid}/${page}`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log(xhr.response)
        const pagination = {count: xhr.response.count, pages: xhr.response.pages}
        const comments = xhr.response.result

        // success
        // change the component-container state
        this.setState({
          comments,
          errors: {},
          pagination,
          render:false,
        });
        // Refresh the page /

      } else {
        // failure
        this.setState({render:false})
        // change the component state
        console.log('error happened sorry');
      }
    });
    xhr.send();
  }
  componentDidMount () {
    const req = new XMLHttpRequest();
    req.open('GET', '/api/userinfo', true);
    req.setRequestHeader('Content-type', 'application/json');
    req.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    req.responseType = 'json';
    req.addEventListener('load', () => {
      if (req.status === 200) {
        const user = req.response
        // success
        // change the component-container state
        this.setState({
          user,
          errors: {},
        });
        // Refresh the page /

      } else {
        // failure
        // change the component state
        this.setState({
          create: false,
        })
        console.log('error happened sorry');
      }
    });
    req.send();

    return this.xmlreq(this.props.coinId,1)

  }

  componentWillReceiveProps () {

    return this.xmlreq(this.props.coinId,1);
  }



  handleChangePage(page) {
        this.setState({
            page: page + 1
      })
      this.xmlreq(this.props.coinId,page + 1)
    }


  onTitleChange (element) {
    const title = element.target.value
    this.setState({title})
  }

  expand() {
    this.setState({
      createPost: !this.state.createPost,
    })
  }

  goTo() {
    event.preventDefault();
    browserHistory.push('/signup');
    return window.location.reload();
  }

  viewPage(id) {
    event.preventDefault();
    browserHistory.push(`/comment/${id}`);
    return window.location.reload();
  }

  processDraft (event) {
    event.preventDefault();

    const content = this.state.editorState.getCurrentContent();
    console.log(this.props.coinId);
    const coinId = this.props.coinId;
    const raw = JSON.stringify(convertToRaw(content));
    const title = this.state.title;
    const dataGrid = `title=${title}&comment=${raw}&coinid=${coinId}`;
    const post = new XMLHttpRequest();
    post.open('POST', '/user/comment', true);
    post.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;
        // failure
        // change the component state
        NotificationManager.create({
          id: 1,
          type: "error",
          message: errors.summary,
          title: "Error!",
          timeOut: 3000,
        });
        console.log('error happened sorry');
      }
    });
    post.send(dataGrid);
  }



  render () {

    if(this.state.render) {
      return (
      <div className='sweet-loading' style={{width:60,paddingTop:'50px',margin:'auto'}}>
        <SyncLoader
          color={'#7D8A98'}
          loading={true}
        />
      </div>
    )
    } else {
    const editorClass = {height: '100%',minHeight: '200px',overflow:'auto','box-sizing':'border-box',border:'1px solid', borderRadius:'3px',padding:'5px', borderColor:'#E8EEF2'}
    const pStyle = { float:'left',fontSize:10,fontWeight:'bold' };
    const comment = this.state.comment;
    const user = this.state.user;
    console.log(comment)
    let isEnabled = this.state.title.length > 0 && this.state.editorState.getCurrentContent().hasText();
    return (
      <div style={{width:'90%',margin:'auto'}}>
        {this.state.create ? (
          <div style={{marginBottom:20,marginTop:20}}>
          <FlatButton
            label="Create a Post"
            disabled={this.state.createPost}
            icon={<i  className="material-icons">&#xE147;</i>}
            onClick={this.expand}
          />
            <Collapse isOpened={this.state.createPost}>
              <div>
                <Card style={{width:'100%',boxShadow:'none'}}>
                  <form action="/" style={{minHeight:100,height:'auto'}}>
                    <h2 className="createPost">Create a post, start a discussion, share your opinion</h2>
                    <div style={{display:'inline-block',width:'100%'}}>
                      <img src={`https://storage.googleapis.com/coinmarketpedia/rank${user.rank}.png`} style={{width:35, borderRadius:10}} />
                      <label style={{width:'70%', fontWeight:'bold',marginLeft:5}}>
                        Title:
                        <input onChange={(e) => {this.onTitleChange(e)}} value={this.state.title} className='titleInput' autoComplete="off" placeholder="Max 30 characters" type="text" name="title" maxLength={30} />
                      </label>
                    </div>
                    <div className="field-line">
                    <div>
                    <Editor
                    editorState={this.state.editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorStyle={editorClass}
                    onEditorStateChange={this.onChange}

                    />

                    </div>

                    </div>
                    <CardActions>
                    <FlatButton label="Submit"
                      backgroundColor="#242F40"
                      labelStyle={{color:'white'}}
                      hoverColor="#62A87C"
                      icon={<i style={{color:'white'}} className="material-icons">&#xE876;</i>}
                      onClick={this.processDraft}
                      disabled={!isEnabled}
                    />
                    <FlatButton label="Cancel"
                      backgroundColor="#D3D5D7"
                      labelStyle={{color:'white'}}
                      hoverColor="#F6F4F3"
                      icon={<i style={{color:'white'}} className="material-icons">&#xE5C9;</i>}
                      onClick={this.expand}
                    />
                    </CardActions>
                    </form>
                  </Card>
                </div>
            </Collapse>

          </div>) : (
            <div style={{marginBottom:20}}>
            <FlatButton
              label="Sign in to Create a Post"
              disabled={this.state.createPost}
              icon={<i  className="material-icons">&#xE147;</i>}
              onClick={this.goTo}
            />
            </div>
          )}
        <div>
        {this.state.pagination.count === 0 ? (<p className="categorySum">No post available be the first!</p>) : (
          <div >
          {this.state.comments.map(comment => (
            <Card style={{boxShadow:'none', borderBottom:'1px solid', borderColor:'#F4F4EF',marginTop:5}}>
               <CardHeader
                 title={comment.title}
                 titleStyle={{fontSize:26, color:'black', fontWeight:'bold' }}
                 avatar={<img src={`https://storage.googleapis.com/coinmarketpedia/rank${comment.user.rank}.png`} style={{width:30, borderRadius:15,marginTop:5}} />}
               />

               <CardActions style={{marginBottom:15}}>

                  <p style={{float:'left',fontSize:10,fontWeight:'bold'}} > by <Link to={`/users/${comment.user.id}`}>{comment.user.username}</Link> </p>
                  <Link style={{float:'left',fontSize:10,fontWeight:'bold', paddingLeft:5}} to={`${comment.coin.coinname}/comment/${comment.id}`}>View Post</Link>
                 <TimeAgo style={{float:'right',fontSize:10,fontWeight:'bold'}} date={comment.createdAt} />
               </CardActions>
             </Card>
          ))}
          <Pagination
            handleChangePage = { this.handleChangePage }
            activePage = { this.state.page - 1}
            totalCount = { parseInt(this.state.pagination.count) }
            perPageItemCount = { parseInt(this.state.pagination.count) }
            nextPageText="next"
            prePageText="prev"
          />
            </div>

        )}

          </div>
      </div>
    )
  }
  }
}

Discussion.propTypes = {
  coinId: PropTypes.number,

};
export default Discussion;
