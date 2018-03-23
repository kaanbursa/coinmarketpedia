import React from 'react';
import Auth from '../modules/auth.js';
import PropTypes from 'prop-types';
import { MyPosts, EditUser } from 'components';
import { Link, browserHistory } from 'react-router';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

class Profile extends React.Component {

  constructor (props, context) {
    super(props, context);


    // set the initial component state
    this.state = {
      user: {},
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
      value: 'a',
      picture: ['https://storage.googleapis.com/coinmarketpedia/profile.png'],
      file: {},
      errors: '',
    };
    this.changeUser = this.changeUser.bind(this);
    this.editInfo = this.editInfo.bind(this);
    this.processForm = this.processForm.bind(this);
    this.saveEditForm = this.saveEditForm.bind(this);
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
        const submission = req.response[1];
        const user = {username: req.response[0].username || '',email: req.response[0].email,about: req.response[0].about || ''};
        const coin = req.response[2];

        document.title = 'Profile';
        this.setState({user,submission,coin});
      }
    });
    req.send();
  }

  saveEditForm (event) {
    event.preventDefault();
    // create a string for an HTTP body message
    const username = encodeURIComponent(this.state.user.username);
    const email = encodeURIComponent(this.state.user.email);
    const about = encodeURIComponent(this.state.user.about);

    const formData = `username=${username}&email=${email}&about=${about}`;
    // create an AJAX request
    const xhr = new XMLHttpRequest ();
    xhr.open('POST', '/user/edit/user' , true);
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
        window.location.reload();
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
        window.location.reload();
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

  onSubmit (event) {
    const target = this.state.coin.coinname;
    browserHistory.push(`/coin/${target}`);
    this.setState({value:''});
    return window.location.reload();
  }

  handleChange = (value) => {
    console.log(this.state.user)
    this.setState({
      value: value,
    });
  };

  onDrop (event) {
    const file = this.refs.file.files[0];

    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      const reader = new FileReader();
      const url = reader.readAsDataURL(file);
      const data = new FormData();
      data.append('file', file);

      data.set('name', this.state.coin.name);


      reader.onloadend = function (e) {
        this.setState({
          picture: [reader.result],
          file: data,
          errors: '',
        })
      }.bind(this);
    } else {
      this.setState({
          errors: 'Please Upload an .jpeg or .png file',
          disabled: true
        })
    }

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

  editInfo (event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user,
    });
  }



  render () {
    if (this.state.user === '') {
      return null;
    } else {
      const user = this.state.user;

      const submission = this.state.submission;
      const coin = this.state.coin;
      const image = {width:200, height:200, borderRadius:40};
      return (
        <main>
          {Auth.isUserAuthenticated() ? (
            <div style={{display:'inline-flex',width:'100%'}}>
              <div className="ProfileMenu">

                <img src={this.state.picture} style={image} />

                <p className="userInfo">Email: {user.email}</p>
                <p className="userInfo">Username: {user.username}</p>

                {coin === null ? (<div />) : (
                  <div>
                    <h2 className="noteHeader">My Coin</h2>
                    <Card style={{marginTop:30}}>
                      <CardHeader
                        title={coin.name}
                        avatar={coin.image}
                      />
                      <CardActions>
                        <FlatButton label="See Page" onClick={this.onSubmit} />
                      </CardActions>
                    </Card>
                  </div>
                )}
              </div>
              <div className="profilePost">
              <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                tabItemContainerStyle={{backgroundColor:'white'}}
              >
                <Tab label="Submissions" value="a" style={{color:'grey'}}>
                  <div>


                      <div>
                      {submission === null ? (
                        <p className="pageDesc">You do not have any organization submitted <br /> <Link to={'/register'}>
                          Register Your Organization!</Link>
                        </p>
                      ) : (
                        <MyPosts
                        onSubmit={this.processForm}
                        onChange={this.changeUser}
                        coin={submission}
                        />
                      )}
                      </div>

                  </div>
                </Tab>
                <Tab label="User Information" value="b" style={{color:'grey'}}>
                  <div>
                  <EditUser
                  onSubmit={this.saveEditForm}
                  onChange={this.editInfo}
                  user={user}
                  />
                  </div>
                </Tab>
              </Tabs>
              </div>

            </div>
          ) : (
            this.context.router.replace('/LoginPage')
          )}
        </main>
      );
    }
  }
}

Profile.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default Profile;
