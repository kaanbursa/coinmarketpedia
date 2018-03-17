import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { GridListView } from 'components';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import DocumentMeta from 'react-document-meta';
import ActionInfo from 'material-ui/svg-icons/action/info';
import { browserHistory, Router, Link } from 'react-router';
import {List, ListItem} from 'material-ui/List';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';


export default class Category extends React.Component {

  constructor (props) {

    super(props);
    // Set the table list to empty array
    this.state = {
      error: '',
      coins: []
    };
    this.xmlReq = this.xmlReq.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  xmlReq (params) {
    window.scrollTo(0,0);

    const req = new XMLHttpRequest();
    req.open('GET', `/api/category/${params}`, true);
    req.responseType = 'json';
    req.setRequestHeader('Content-type', 'application/json');
    req.addEventListener('load', () => {
      if (req.status === 200) {

        const coins = req.response
        console.log(coins)
        this.setState({coins})
      } else {
        this.setState({error:'An error occured loading.'});
      }
    });
    req.send();
  }

  componentDidMount () {


    return this.xmlReq(this.props.routeParams.name);


  };

  componentWillReceiveProps (nextProps) {
    return this.xmlReq(nextProps.routeParams.name);
  }


  onSubmit( value) {
    const target = value;
    browserHistory.push(`/coin/${target}`);
    return window.location.reload();
  }




  render () {
    if(this.state.coins.length === 0){
      return null
    } else {
      let cardClass = "cards";
      if (window.innerWidth < 500) {
        cardClass = "phoneCards";
      }
      const tilesData = this.state.coins;

      return(
        <div className="dataTable">
        <h1 className="homeMainHead" style={{marginTop:30}}>{this.props.routeParams.name.toUpperCase()}</h1>
        {tilesData.map(coin => (
          <Card key={coin.id} className="categoryCard">
            <CardHeader
              title={coin.name}
              subtitle={coin.ticker}
              avatar={<Avatar src={coin.homeImage} backgroundColor='white' />}
            />

            <CardActions>
              <FlatButton label="See Page" onClick={() => this.onSubmit(coin.coinname)}/>
            </CardActions>
          </Card>
        ))}
        </div>
      )
    }



  }
}
