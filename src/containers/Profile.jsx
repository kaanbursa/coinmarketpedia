import React from 'react';
import Auth from '../modules/auth.js';
import PropTypes from 'prop-types';
import MyPosts from 'components';
import { Link } from 'react-router';

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
        technology: '',
        vp: '',
        upcoming: '',
        keyPeople: '',
        ico: '',
      },
      render: false,
    };
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
      const submission = req.response[1];
      const user = req.response[0]

      this.setState({user,submission})
    }
  });
  req.send();
}

processForm (event) {

  // prevent default action. in this case, action is the form submission event
  event.preventDefault();

  // create a string for an HTTP body message
  const email = encodeURIComponent(this.state.user.email);
  const password = encodeURIComponent(this.state.user.password);
  const formData = `email=${email}&password=${password}`;

  // create an AJAX request
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/auth/login');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.responseType = 'json';
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      // success

      // change the component-container state
      this.setState({
        errors: {},
      });
      // save the token
      Auth.authenticateUser(xhr.response.token);
      // change the current URL to /
      setTimeout( function() {
       return this.context.router.replace('/');
        }.bind(this),3000);

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

/**
 * Change the user object.
 *
 * @param {object} event - the JavaScript event object
 */
changeUser (event) {
  const field = event.target.name;
  const user = this.state.user;
  user[field] = event.target.value;

  this.setState({
    user,
  });
}

render () {
  const user = this.state.user;
  const submission = this.state.submission;
  console.log(user)
  const image = {width:200, height:200, borderRadius:40}
  return(
    <main>
      {Auth.isUserAuthenticated() ? (
        <div style={{display:'inline-flex',width:'100%'}}>
          <div className='ProfileMenu'>
            <img src='https://s3.eu-west-2.amazonaws.com/coinmarketpedia/profile.png' style={image} />
            <p className='userInfo'>Email: {user}</p>
          </div>
          <div className='profilePost'>
            {submission === null ? (
              <p className="pageDesc">You do not have any coin <br /> <Link to={'/register'}>
                Register Your Coin!</Link>
              </p>
            ):(
              <div>
                <MyPosts
                onSubmit={this.processForm}
                onChange={this.changeUser}
                coin={submission}
                />
              </div>
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

Profile.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default Profile;
