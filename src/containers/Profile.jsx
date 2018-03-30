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

function getValues(obj) {
  const tifs = obj.text;
  return Object.keys(tifs).map(key =>
    <div>
      <h1 style={{fontSize:14}} value={key}>{key.toLocaleUpperCase()}</h1>
      <option value={key}>{tifs[key]}</option>
    </div>
    );
}

const ranks = ['Novice','Astronaut','Crypto King','Roman Ruler','Einstein','Human-Level-AI'];

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
      contributions: [],
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
        const user = {username: req.response[0].username || '',email: req.response[0].email,about: req.response[0].about || '',rank: req.response[0].rank, id: req.response[0].id};
        const contributions = req.response[0].contributions;

        document.title = 'Profile';
        this.setState({user,submission,contributions});
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
    this.setState({
      value,
    });
  };



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

  deleteForm (id,userId) {

    const dataGrid = `userId=${userId}`;
    const xhr = new XMLHttpRequest ();
    xhr.open('POST', `/user/delete/${id}` , true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {},
          success: 'Succesfuly deleted your contribution'
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
    xhr.send(dataGrid);
  }



  render () {
    if (this.state.user === '') {
      return null;
    } else {
      const user = this.state.user;
      const submission = this.state.submission;
      const contributions = this.state.contributions;
      const text = contributions.text;
      console.log(user);
      const image = {width:200, height:200, borderRadius:40, marginRight:40};
      const tifOptions = 'hey'
      return (
        <main>
          {Auth.isUserAuthenticated() ? (
            <div style={{display:'inline-block',width:'90%',marginLeft:'5%'}}>
              <div className="ProfileMenu">

                <img src={`https://storage.googleapis.com/coinmarketpedia/rank${user.rank}.png`} style={image} />
                <div className="userInfoBox">
                  <h2 className="coinHead" style={{fontSize:20, color:'black', textAlign:'center'}}>Greetings {user.username}</h2>

                  <p className="userInfo">Email: {user.email}</p>
                  <p className="userInfo">CMP Rank: {ranks[user.rank]}</p>
                </div>

              </div>
              <div className="profilePost">
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  tabItemContainerStyle={{backgroundColor:'white'}}
                >
                  <Tab label="My Contributions" value="a" style={{color:'grey'}}>
                    <div>
                      <div>
                        {contributions.length === 0 ? (
                          <p className="pageDesc">You do not have any information submitted <br /> <Link to={'/register'}>
                            An Organization!</Link>
                          </p>
                        ) : (
                          <div>
                            {contributions.map(cont => (
                              <Card style={{marginTop:10}}>
                                <CardHeader
                                  title={cont.coinname.toLocaleUpperCase()}
                                  subtitle={cont.validated ? ('Accepted!') : ('Pending')}
                                  avatar={<img src={`https://storage.googleapis.com/coinmarketpedia/${cont.coinname}Home.png`} style={{borderRadius:20, width:28,height:28}} />}
                                  actAsExpander
                                  showExpandableButton
                                />
                                <CardActions>
                                  <FlatButton label="Delete"
                                  backgroundColor="#C03221"
                                  labelStyle={{color:'white'}}
                                  hoverColor="#6B0504"
                                  icon={<i style={{color:'white'}} className="material-icons">&#xE872;</i>}
                                  onClick={() => this.deleteForm(cont.id, user.id)}
                                  />

                                </CardActions>
                                <CardText expandable>
                                  {getValues(cont)}
                                </CardText>
                              </Card>
                            ))}
                          </div>

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
