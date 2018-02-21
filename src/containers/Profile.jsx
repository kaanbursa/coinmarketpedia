import React from 'react';
import Auth from '../modules/auth.js';
import PropTypes from 'prop-types';
import { MyPosts } from 'components';
import { Link, browserHistory } from 'react-router';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


class Profile extends React.Component {

  constructor (props, context) {
    super(props, context);


    // set the initial component state
    this.state = {
      user: '',
      submission: {
        name: '',
        ticker: '',
        history: '',
        summary: '',
        technology: '',
        vp: '',
        upcoming: '',
        keyPeople: '',
        ico: '',
      },
      coin: {},
      render: false,
    };
    this.changeUser = this.changeUser.bind(this);
    this.processForm = this.processForm.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
}

componentDidMount () {
  const req = new XMLHttpRequest();
  req.open('GET', '/user/profile', true);
  req.responseType = 'json';
  req.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
  req.setRequestHeader('Content-type', 'application/json');
  req.addEventListener('load', () => {
    if (req.status === 400) {
      this.setState({render:true});
    } else {
      console.log(req.response)
      const submission = req.response[1];
      const user = req.response[0];
      const coin = req.response[2];
      console.log(coin)
      document.title = 'Profile';
      this.setState({user,submission,coin})
    }
  });
  req.send();
}

processForm (event) {
  // prevent default action. in this case, action is the form submission event
  event.preventDefault();
  // create a string for an HTTP body message
  const name = encodeURIComponent(this.state.submission.name);
  const ticker = encodeURIComponent(this.state.submission.ticker);
  const history = encodeURIComponent(this.state.submission.history);
  const technology = encodeURIComponent(this.state.submission.technology);
  const summary = encodeURIComponent(this.state.submission.summary);
  const vp = encodeURIComponent(this.state.submission.vp);
  const upcoming = encodeURIComponent(this.state.submission.upcoming);
  const keyPeople = encodeURIComponent(this.state.submission.keyPeople);
  const ico = encodeURIComponent(this.state.submission.ico);
  const formData = `&name=${name}&ticker=${ticker}&history=${history}&technology=${technology}&summary=${summary}&vp=${vp}&upcoming=${upcoming}&keyPeople=${keyPeople}&ico=${ico}`;
  // create an AJAX request
  const xhr = new XMLHttpRequest ();
  xhr.open('POST', '/user/edit/post' , true);
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


      // refresh page
      window.location.reload()
    } else {
      // failure

      const errors = xhr.response.errors ? xhr.response.errors : {};
      errors.summary = xhr.response.message;

      this.setState({
        errors,
      });
    }
  });
  xhr.send(formData);
}

onSubmit(event) {

    const target = this.state.coin.coinname;
    browserHistory.push(`/coin/${target}`);
    this.setState({value:''})
    return window.location.reload();


}

/**
 * Change the user object.
 *
 * @param {object} event - the JavaScript event object
 */
changeUser (event) {
  const field = event.target.name;
  const submission = this.state.submission;
  submission[field] = event.target.value;

  this.setState({
    submission,
  });
}

render () {
  if(this.state.user === ''){
    return null
  } else {
  const user = this.state.user;
  const submission = this.state.submission;
  const coin = this.state.coin;
  const image = {width:200, height:200, borderRadius:40}
  return(
    <main>
      {Auth.isUserAuthenticated() ? (
        <div style={{display:'inline-flex',width:'100%'}}>
          <div className='ProfileMenu'>
            <img src='https://s3.eu-west-2.amazonaws.com/coinmarketpedia/profile.png' style={image} />
            <p className='userInfo'>Email: {user}</p>

            {coin == null ? (<div />):(
              <div>
              <h2 className="noteHeader">My Coin</h2>
              <Card style={{marginTop:30}}>
                <CardHeader
                  title={coin.name}
                  avatar={coin.image}
                />
                <CardActions>
                  <FlatButton label="See Page" onClick={this.onSubmit}/>

                </CardActions>
              </Card>
              </div>
            )}
          </div>
          <div className='profilePost'>
            {submission === null ? (
              <p className="pageDesc">You do not have any organization submitted <br /> <Link to={'/register'}>
                Register Your Organization!</Link>
              </p>
            ):(

                <MyPosts
                onSubmit={this.processForm}
                onChange={this.changeUser}
                coin={submission}
                />
            )}
          </div>
        </div>
      ):(
        this.context.router.replace('/LoginPage')
      )}
    </main>
  )
  }
  }
}

Profile.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default Profile;
