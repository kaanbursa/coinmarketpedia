import React from 'react';
import Auth from '../modules/auth.js';
import PropTypes from 'prop-types';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router';
import { SyncLoader } from 'react-spinners';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ReactTooltip from 'react-tooltip';
import DocumentMeta from 'react-document-meta';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
} from 'react-share';
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  EmailIcon,
} from 'react-share';


function checkIfLiked (arr, id) {
  let ans = false
  arr.map(obj => {
    if (parseInt(obj.userId) === parseInt(id)) {

      ans = true;
    }
  })
  return ans


}

class Comment extends React.Component {

  /**
   * Class constructor.
   */
  constructor (props, context) {
    super(props, context);


    // set the initial component state
    this.state = {
      editorState: EditorState.createEmpty(),
      errors: {},
      comment: {},
      reply: '',
      replies: [],
      user: [],
      liked: false,
    };

    this.processForm = this.processForm.bind(this);
    this.onReplyChange = this.onReplyChange.bind(this);
    this.onLike = this.onLike.bind(this);
    this.onDislike = this.onDislike.bind(this);
  }


  componentDidMount () {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/userinfo', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log(xhr.response)
        const user = xhr.response
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
          create: false
        })
        console.log('error happened sorry');
      }
    });
    xhr.send();

    const req = new XMLHttpRequest();
    req.open('GET', `/api/comment/${this.props.routeParams.id}`, true);
    req.setRequestHeader('Content-type', 'application/json');
    req.responseType = 'json';
    req.addEventListener('load', () => {
      if (req.status === 200) {

        const comment = req.response;
        const jsonData = req.response.text;
        const replies = req.response.replies;
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
        // success
        // change the component-container state
        this.setState({
          editorState,
          comment,
          errors: {},
          replies,
        });


      } else {
        // failure
        // change the component state
        this.setState({

        })
        console.log('error happened sorry');
      }
    });
    req.send();
  }

  onLike (commentId,userId) {
    if(userId === undefined) {
      NotificationManager.create({
        id: 1,
        type: "warning",
        message: "You need to login to like!",
        title: "Login!",
        timeOut: 3000,
      });
    } else {
      const dataGrid = `userId=${userId}&commentId=${commentId}`;
      const xhr = new XMLHttpRequest ();
      xhr.open('POST', `/user/comment/like` , true);
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
            message: "Thanks!",
            title: "Success!",
            timeOut: 3000,
          });
          this.setState({liked: true})

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

  }

  onDislike (commentId,userId) {

      const dataGrid = `userId=${userId}&commentId=${commentId}`;
      const xhr = new XMLHttpRequest ();
      xhr.open('POST', `/user/comment/dislike` , true);
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
            message: "Thanks!",
            title: "Success!",
            timeOut: 3000,
          });
          this.setState({liked: false})

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

  onReplyChange (element) {
    const reply = element.target.value
    this.setState({reply})
  }
  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm (event) {

    const text = this.state.reply;
    const dataGrid = `text=${text}`;
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    const post = new XMLHttpRequest();
    post.open('POST', `/user/${this.props.routeParams.id}/reply`, true);
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
        const newReply = {text: text, createdAt:new Date(), user:this.state.user};
        let replies = this.state.replies;
        replies.unshift(newReply);
        console.log(replies)
        console.log(newReply)
        this.setState({replies})
        console.log('great')
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

  createMarkup () {
    return {__html: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))};
  }

  /**
   * Render the component.
   */
  render () {
    if(!this.state.comment.title && this.state.editorState.getCurrentContent().hasText()) {
      return (

      <div className='sweet-loading' style={{width:60,paddingTop:'50px',margin:'auto'}}>
        <SyncLoader
          color={'#7D8A98'}
          loading={true}
        />
      </div>
    )
    } else {
      const { comment } = this.state
      let liked = checkIfLiked(comment.likes,this.state.user.id);
      let isEnabled = this.state.reply.length > 0;
      const path = window.location.href;
      const meta = {
        title: `${comment.coin.name} | ${comment.title}`,
        description: `${comment.title}`,
        canonical: path,
        meta: {
          charset: 'utf-8',
          name: {
            keywords: `${comment.coin.name},Financial,cryptocurrency,blockchain,cryptoasset,analysis, team reviews `,
          },
        },
      };
      return (
        <main>
          <DocumentMeta {...meta} />
          <div className='commentDiv'>
            <h1 className='commentHeader'>{comment.coin.name}</h1>
            <p className='commentDivSum'> {comment.coin.summary} </p>
          </div>
          <div style={{ width:'60%',marginLeft:'5%', minWidth:290}}>

            <div className='commentMain'>

            <div className='titleComment'>

                <h1 className="commentTitle" >{comment.title}</h1>
                {liked || this.state.liked ? (
                  <div>
                  <ReactTooltip style={{textAlign:'center'}} id="verify" effect="solid">
                    <span >Post Already Liked! <br /> Click to Dislike</span>
                </ReactTooltip>
                  <IconButton
                style={{color:'#242F40',width:20, marginRight:'2%', float:'right'}}
                hoveredStyle={{color:'#62A87C'}}
                onClick={() => this.onDislike(comment.id,this.state.user.id)}

                >
                  <i data-tip data-for="verify" style={{color:'black',fontSize:10}} className="material-icons">&#xE5CA;</i>
                </IconButton>

                </div>
              ) : (
                  <IconButton
                  style={{color:'#242F40', float:'right'}}
                  hoveredStyle={{color:'#62A87C'}}
                  onClick={() => this.onLike(comment.id,this.state.user.id)}
                  >
                  <i style={{color:'black',fontSize:10}} className="material-icons">&#xE8DC;</i>
                  </IconButton>)}

                <div style={{display:'inline-block',width:'95%',marginLeft:'2.5%'}}>
                  <p style={{float:'left',fontSize:10,fontWeight:'bold',paddingTop:15}} > by <Link to={`/users/${comment.user.id}`}>{comment.user.username}</Link> </p>
                  <p style={{float:'left',fontSize:10,fontWeight:'bold',paddingTop:15, paddingLeft:5}} > Total Likes ({comment.likes.length}) </p>
                  <TimeAgo style={{float:'right',fontSize:10,fontWeight:'bold',paddingTop:15}} date={comment.createdAt} />
                </div>
            </div>
              <div className='commentHTML'  dangerouslySetInnerHTML={this.createMarkup()} />


            </div>
            <div style={{display:'inline-flex',width:'250px', margin:10, justifyContent:'space-around'}}>
              <p style={{float:'left',fontSize:18,fontWeight:'lighter',paddingTop:5}} > Share: </p>
              <TwitterShareButton style={{marginLeft:20}} url={window.location.href}><TwitterIcon size={32} round={true} /></TwitterShareButton>
              <FacebookShareButton url={window.location.href}><FacebookIcon size={32} round={true} /></FacebookShareButton>
              <RedditShareButton url={window.location.href}><RedditIcon size={32} round={true} /></RedditShareButton>
              <TelegramShareButton url={window.location.href}><TelegramIcon size={32} round={true} /></TelegramShareButton>
              <LinkedinShareButton url={window.location.href}><LinkedinIcon size={32} round={true} /></LinkedinShareButton>
              <EmailShareButton url={window.location.href}><EmailIcon size={32} round={true} /></EmailShareButton>
            </div>
            <label style={{marginTop:50,width:'100%',display:'inline-block'}}>
              <textarea onChange={(e) => {this.onReplyChange(e)}} value={this.state.reply}  className='titleInput' id='commentInput'  autoComplete="off" placeholder="Comment" type="text" name="title"  />
              <FlatButton label="Submit"
                style={{marginLeft:10,height:35,marginBottom:10}}
                backgroundColor="#242F40"
                labelStyle={{color:'white'}}
                hoverColor="#62A87C"
                icon={<i style={{color:'white'}} className="material-icons">&#xE876;</i>}
                onClick={this.processForm}
                disabled={!isEnabled}
              />
            </label>
            {this.state.replies.map(reply => (
              <Card style={{boxShadow:'none', borderBottom:'1px solid', borderColor:'#F4F4EF',marginTop:5, marginBottom:5}}>
                 <CardHeader
                   title={<Link to={`/users/${reply.user.id}`}>{reply.user.username}</Link>}
                   subtitle={<TimeAgo style={{fontSize:10,fontWeight:'bold'}} date={reply.createdAt} />}
                   titleStyle={{fontSize:26, color:'black', fontWeight:'bold' }}
                   avatar={<img src={`https://storage.googleapis.com/coinmarketpedia/rank${reply.user.rank}.png`} style={{width:30, borderRadius:15,marginTop:5}} />}
                 />
                 <CardText>
                  {reply.text}
                </CardText>
               </Card>
            ))}
          </div>
        </main>
      );
    }
  }

}

Comment.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default Comment;
