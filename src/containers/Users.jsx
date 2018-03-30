import React from 'react';
import Auth from '../modules/auth.js';
import PropTypes from 'prop-types';
import { EditUser } from 'components';
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

class User extends React.Component {

  constructor (props, context) {
    super(props, context);


    // set the initial component state
    this.state = {
      user: {},
      contributions: [],
      render: false,
      value: 'a',
      file: {},
      errors: '',
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount () {
    window.scrollTo(0,0);
    const req = new XMLHttpRequest();
    req.open('GET', `/api/users/${this.props.routeParams.id}`, true);
    req.responseType = 'json';
    req.setRequestHeader('Content-type', 'application/json');
    req.addEventListener('load', () => {
      if (req.status === 400) {
        this.setState({render:true});
      } else {
        console.log(req.response)
        const user = {username: req.response.username || 'A Blockchain Supporter',email: req.response.email,about: req.response.about || 'No Information',rank: req.response.rank, id: req.response.id};
        const contributions = req.response.contributions

        document.title = 'Coinmarketpedia | User';
        this.setState({user,contributions});
      }
    });
    req.send();
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





  render () {
    if (this.state.user === '') {
      return null;
    } else {
      const user = this.state.user;
      const contributions = this.state.contributions;
      const image = {width:200, height:200, borderRadius:40, marginRight:40};
      const tifOptions = 'hey'
      return (
        <main>
          {Auth.isUserAuthenticated() ? (
            <div style={{display:'inline-block',width:'90%',marginLeft:'5%'}}>
              <div className="ProfileMenu">

                <img src={`https://storage.googleapis.com/coinmarketpedia/rank${user.rank}.png`} style={image} />
                <div className="userInfoBox">
                  <h2 className="coinHead" style={{fontSize:20, color:'black', textAlign:'center'}}>{user.username}</h2>
                  <p className="userInfo" style={{marginTop:0,fontStyle:'italic'}}>"{user.about}"</p>
                  <p className="userInfo">CMP Rank: {ranks[user.rank]}</p>
                </div>

              </div>
              <div className="profilePost">
              <div>
                {contributions.length === 0 ? (
                  <p className="pageDesc">The user does not have any posts yet...
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

                        <CardText expandable>
                          {getValues(cont)}
                        </CardText>
                      </Card>
                    ))}
                  </div>

                )}
              </div>
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

User.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default User;
