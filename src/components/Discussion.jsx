import React, {  Component } from 'react';
import PropTypes from 'prop-types';
import Auth from '../modules/auth.js';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';
import FontIcon from 'material-ui/FontIcon';


class Discussion extends Component {

  constructor (props, context) {


    super(props, context);

      this.state = {
        comment: {}
    };

  }

  componentDidMount () {

  }

onSubmit () {
  return null
}


  render () {
    const comment = this.state.comment;
    return (
      <div>
        <div>
          <RaisedButton type="submit" label="Creat a Post" primary />
        </div>
      </div>
    )

  }
}

Discussion.propTypes = {
  coinId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
};
export default Discussion;
